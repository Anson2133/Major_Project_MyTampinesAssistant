import { chromium } from "playwright";
import { runActiveSgAgent } from "./adapters/activeSgAdapter.js";
import { runOnePaAgent } from "./adapters/onePaAdapter.js";

const sessions = new Map();

let browserContext = null;

async function getBrowserContext() {
  if (browserContext) {
    return browserContext;
  }

  browserContext = await chromium.launchPersistentContext(
    "./.playwright-profile",
    {
      headless: false,
      channel: "chrome",
      viewport: {
        width: 1440,
        height: 900,
      },
      args: [
        "--start-maximized",
      ],
    }
  );

  browserContext.setDefaultTimeout(12000);

  return browserContext;
}

function createSession(task) {
  const taskId = `agent-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const session = {
    taskId,
    task,
    status: "starting",
    stage: "Preparing browser",
    message: "Preparing the browser agent.",
    logs: [],
    alternatives: [],
    requiresUserAction: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    page: null,
    stopped: false,
  };

  sessions.set(taskId, session);

  return session;
}

function addLog(session, message) {
  session.logs.unshift({
    time: new Date().toISOString(),
    message,
  });

  session.logs = session.logs.slice(0, 30);
  session.updatedAt = new Date().toISOString();

  console.log(`[${session.taskId}] ${message}`);
}

function updateSession(session, updates) {
  Object.assign(session, updates, {
    updatedAt: new Date().toISOString(),
  });
}

function publicSession(session) {
  if (!session) return null;

  return {
    taskId: session.taskId,
    status: session.status,
    stage: session.stage,
    message: session.message,
    logs: session.logs,
    alternatives: session.alternatives,
    requiresUserAction: session.requiresUserAction,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

async function executeTask(session, continuation = false) {
  try {
    const context = await getBrowserContext();

    let page = session.page;

    if (!page || page.isClosed()) {
      page = await context.newPage();
      session.page = page;

      await page.goto(session.task.facility.bookingLink, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      addLog(session, `Opened ${session.task.facility.websiteName}.`);
    }

    updateSession(session, {
      status: "running",
      stage: continuation ? "Continuing booking" : "Starting booking",
      message: "The browser agent is working.",
      requiresUserAction: false,
    });

    const websiteName = String(
      session.task.facility.websiteName || ""
    ).toLowerCase();

    const helpers = {
      addLog: (message) => addLog(session, message),

      update: (updates) => updateSession(session, updates),

      pause: (stage, message) => {
        updateSession(session, {
          status: "paused",
          stage,
          message,
          requiresUserAction: true,
        });
      },

      complete: (stage, message) => {
        updateSession(session, {
          status: "ready_for_review",
          stage,
          message,
          requiresUserAction: true,
        });
      },
    };

    if (websiteName.includes("activesg")) {
      await runActiveSgAgent({
        page,
        task: session.task,
        continuation,
        helpers,
      });
      return;
    }

    if (websiteName.includes("onepa")) {
      await runOnePaAgent({
        page,
        task: session.task,
        continuation,
        helpers,
      });
      return;
    }

    helpers.pause(
      "Unsupported website",
      "This website does not have a Playwright adapter yet."
    );
  } catch (error) {
    console.error(error);

    addLog(session, `Error: ${error.message}`);

    updateSession(session, {
      status: "error",
      stage: "Automation error",
      message:
        error.message ||
        "The browser agent encountered an unexpected problem.",
      requiresUserAction: true,
    });
  }
}

export async function startAgentTask(task) {
  const session = createSession(task);

  executeTask(session).catch((error) => {
    console.error("Agent task failed:", error);
  });

  return publicSession(session);
}

export async function continueAgentTask(taskId) {
  const session = sessions.get(taskId);

  if (!session) {
    throw new Error("Agent task not found.");
  }

  if (session.stopped) {
    throw new Error("Agent task has already been stopped.");
  }

  executeTask(session, true).catch((error) => {
    console.error("Agent continuation failed:", error);
  });

  return publicSession(session);
}

export async function stopAgentTask(taskId) {
  const session = sessions.get(taskId);

  if (!session) {
    throw new Error("Agent task not found.");
  }

  session.stopped = true;

  if (session.page && !session.page.isClosed()) {
    await session.page.close();
  }

  updateSession(session, {
    status: "stopped",
    stage: "Stopped",
    message: "The browser agent has been stopped.",
    requiresUserAction: false,
  });

  return publicSession(session);
}

export function getAgentTask(taskId) {
  return publicSession(sessions.get(taskId));
}