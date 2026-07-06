const TASK_MESSAGE_TYPE = "MTA_START_AGENTIC_BOOKING";
const STORAGE_KEY = "mta_active_agentic_booking_task";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isMyTampinesApp() {
    const host = window.location.hostname;
    return (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.includes("amplifyapp.com")
    );
}

function isExternalBookingSite() {
    const host = window.location.hostname;
    return host.includes("activesg.gov.sg") || host.includes("onepa.gov.sg");
}

function normalise(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function containsAny(text, keywords) {
    const value = normalise(text);
    return keywords.some((keyword) => value.includes(normalise(keyword)));
}

function getVisibleText() {
    const clone = document.body.cloneNode(true);

    const agentPanel = clone.querySelector("#mta-agent-panel");
    if (agentPanel) {
        agentPanel.remove();
    }

    const backupNotice = clone.querySelector("#mta-agent-backup-notice");
    if (backupNotice) {
        backupNotice.remove();
    }

    return normalise(clone.innerText || "");
}

function isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        style.opacity !== "0"
    );
}

function getClickableElements() {
    return Array.from(
        document.querySelectorAll(
            [
                "button",
                "a",
                "[role='button']",
                "[tabindex]",
                "input[type='button']",
                "input[type='submit']",
                "div",
                "span",
            ].join(",")
        )
    ).filter(isElementVisible);
}

function findClickableByText(text) {
    if (!text) return null;

    const target = normalise(text);
    const candidates = getClickableElements();

    const exact = candidates.find(
        (el) => normalise(el.innerText || el.value) === target
    );

    if (exact) return exact;

    const includes = candidates.find((el) =>
        normalise(el.innerText || el.value).includes(target)
    );

    if (includes) return includes;

    const words = target.split(" ").filter((word) => word.length > 2);

    if (words.length > 0) {
        return candidates.find((el) => {
            const candidateText = normalise(el.innerText || el.value);
            return words.every((word) => candidateText.includes(word));
        });
    }

    return null;
}

function findInputByKeywords(keywords) {
    const inputs = Array.from(document.querySelectorAll("input, textarea")).filter(
        isElementVisible
    );

    return inputs.find((input) => {
        const combined = [
            input.name,
            input.id,
            input.placeholder,
            input.getAttribute("aria-label"),
            input.closest("label")?.innerText,
        ]
            .join(" ")
            .toLowerCase();

        return keywords.some((keyword) => combined.includes(keyword.toLowerCase()));
    });
}

function safeClick(el) {
    if (!el) return false;

    el.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });

    el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    el.click();
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    return true;
}

function safeFill(input, value) {
    if (!input || !value) return false;

    input.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });

    input.focus();
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    return true;
}

function looksLikeLoginPage() {
    const text = getVisibleText();

    return containsAny(text, [
        "singpass",
        "log in",
        "login",
        "sign in",
        "otp",
        "password",
        "continue with singpass",
        "active sg account",
    ]);
}

function looksLikePaymentOrFinalConfirmation() {
    const text = getVisibleText();

    return containsAny(text, [
        "payment",
        "pay now",
        "confirm booking",
        "place booking",
        "complete booking",
        "submit booking",
        "make payment",
        "checkout",
        "review and pay",
    ]);
}

function looksLikeSlotUnavailable() {
    const text = getVisibleText();

    return containsAny(text, [
        "unavailable",
        "fully booked",
        "no slots available",
        "no available slots",
        "not available",
        "sold out",
        "0 slots",
        "slot taken",
        "try another date",
        "try another time",
        "currently unavailable",
    ]);
}

function createAgentPanel(task) {
    if (document.getElementById("mta-agent-panel")) return;

    const panel = document.createElement("div");
    panel.id = "mta-agent-panel";

    panel.innerHTML = `
    <div class="mta-agent-header">
      <div>
        <p>MyTampines Agent</p>
        <h3>Agentic Booking Assistant</h3>
      </div>
      <button id="mta-agent-close" type="button">×</button>
    </div>

    <div class="mta-agent-body">
      <div class="mta-agent-card">
        <span class="mta-agent-label">Goal</span>
        <strong>${escapeHtml(
        task.preferences?.goal || task.plan?.summary || "Prepare booking"
    )}</strong>
      </div>

      <div class="mta-agent-grid">
        <div>
          <span>Site</span>
          <strong>${escapeHtml(task.facility?.websiteName || "External")}</strong>
        </div>
        <div>
          <span>Activity</span>
          <strong>${escapeHtml(task.facility?.sport || "Service")}</strong>
        </div>
        <div>
          <span>Date</span>
          <strong>${escapeHtml(task.preferences?.date || "Not set")}</strong>
        </div>
        <div>
          <span>Time</span>
          <strong>${escapeHtml(task.preferences?.time || "Not set")}</strong>
        </div>
      </div>

      <div class="mta-agent-safety">
        The agent will not handle Singpass, OTP, payment, or final confirmation.
      </div>

      <div class="mta-agent-backup">
        <span>If slot is taken</span>
        <strong>${escapeHtml(task.preferences?.backupLabel || "Ask first")}</strong>
        <p>${escapeHtml(task.preferences?.backupText || "Pause and ask the user before continuing.")}</p>
      </div>

      <div id="mta-agent-status" class="mta-agent-status">
        Ready to start.
      </div>

      <div class="mta-agent-actions">
        <button id="mta-agent-run" type="button">Run safe actions</button>
        <button id="mta-agent-resume" type="button">Resume after login</button>
        <button id="mta-agent-check-slot" type="button">Check slot status</button>
        <button id="mta-agent-clear" type="button">Clear task</button>
      </div>

      <div class="mta-agent-log" id="mta-agent-log"></div>
    </div>
  `;

    document.body.appendChild(panel);

    document.getElementById("mta-agent-close")?.addEventListener("click", () => {
        panel.remove();
    });

    document.getElementById("mta-agent-run")?.addEventListener("click", async () => {
        await runAgent(task);
    });

    document
        .getElementById("mta-agent-resume")
        ?.addEventListener("click", async () => {
            logAgent("Resuming after manual login...");
            await runAgent(task, { resumed: true });
        });

    document
        .getElementById("mta-agent-check-slot")
        ?.addEventListener("click", async () => {
            await checkSlotStatus(task);
        });

    document.getElementById("mta-agent-clear")?.addEventListener("click", async () => {
        await chrome.storage.local.remove(STORAGE_KEY);
        logAgent("Task cleared.");
        setStatus("Task cleared. You can close this panel.");
    });
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setStatus(message, type = "normal") {
    const status = document.getElementById("mta-agent-status");
    if (!status) return;

    status.textContent = message;
    status.className = `mta-agent-status ${type}`;
}

function logAgent(message) {
    const log = document.getElementById("mta-agent-log");
    if (!log) return;

    const item = document.createElement("div");
    item.textContent = `${new Date().toLocaleTimeString()} — ${message}`;
    log.prepend(item);
}

async function checkSlotStatus(task) {
    if (looksLikePaymentOrFinalConfirmation()) {
        setStatus(
            "Final confirmation or payment stage detected. The agent has stopped. Please review manually.",
            "warning"
        );
        logAgent("Stopped before final confirmation/payment.");
        return;
    }

    if (looksLikeSlotUnavailable()) {
        handleUnavailableSlot(task);
        return;
    }

    setStatus(
        "No clear unavailable message detected. Please review the slot availability on the page.",
        "success"
    );
    logAgent("No clear unavailable slot message detected.");
}

function handleUnavailableSlot(task) {
    const backupLabel = task.preferences?.backupLabel || "Ask first";
    const backupText =
        task.preferences?.backupText ||
        "Pause and ask the user before choosing an alternative.";

    setStatus(
        `Preferred slot may be unavailable. Backup rule: ${backupLabel}. User should approve before continuing.`,
        "warning"
    );

    logAgent("Preferred slot appears unavailable.");
    logAgent(`Backup instruction: ${backupText}`);

    showBackupNotice(task);
}

function showBackupNotice(task) {
    let existing = document.getElementById("mta-agent-backup-notice");

    if (!existing) {
        existing = document.createElement("div");
        existing.id = "mta-agent-backup-notice";
        document.getElementById("mta-agent-panel")?.appendChild(existing);
    }

    existing.innerHTML = `
    <strong>Preferred slot may be taken</strong>
    <p>${escapeHtml(task.preferences?.backupText || "Please choose another slot before continuing.")}</p>
    <span>The agent will not choose an alternative without your approval.</span>
  `;
}

async function runAgent(task, options = {}) {
    setStatus("Checking page state...");
    logAgent("Checking page state.");

    if (looksLikePaymentOrFinalConfirmation()) {
        setStatus(
            "Stopped at review/payment/confirmation stage. User must continue manually.",
            "warning"
        );
        logAgent("Stopped before final confirmation.");
        return;
    }

    if (looksLikeLoginPage() && !options.resumed) {
        setStatus(
            "Login detected. Please log in manually, then click Resume after login.",
            "warning"
        );
        logAgent("Paused for manual login.");
        return;
    }

    if (looksLikeSlotUnavailable()) {
        handleUnavailableSlot(task);
        return;
    }

    const facility = task.facility || {};
    const prefs = task.preferences || {};

    setStatus("Running safe booking actions...");
    logAgent("Started safe action execution.");

    await trySelectText(facility.sport, "activity / sport");
    await trySelectText(facility.name, "facility / venue");

    if (facility.name?.includes("@")) {
        const venuePart = facility.name.split("@").pop().trim();
        await trySelectText(venuePart, "venue short name");
    }

    await tryFillDate(prefs.date);
    await trySelectText(prefs.time, "preferred time");

    const searchClicked = await tryClickAny([
        "search",
        "find slots",
        "check availability",
        "view slots",
        "next",
        "continue",
    ]);

    if (searchClicked) {
        await sleep(1400);
        logAgent("Clicked a safe search/next button.");
    }

    if (looksLikeSlotUnavailable()) {
        handleUnavailableSlot(task);
        return;
    }

    if (looksLikePaymentOrFinalConfirmation()) {
        setStatus(
            "Stopped at review/payment/confirmation stage. Please review manually.",
            "warning"
        );
        logAgent("Reached final stage and stopped.");
        return;
    }

    setStatus("Safe actions completed. Review the page before continuing.", "success");
    logAgent("Safe actions completed.");
}

async function trySelectText(text, label) {
    if (!text) return false;

    await sleep(500);

    const element = findClickableByText(text);

    if (!element) {
        logAgent(`Could not find ${label}: ${text}`);
        return false;
    }

    safeClick(element);
    logAgent(`Selected ${label}: ${text}`);
    await sleep(900);
    return true;
}

async function tryClickAny(labels) {
    for (const label of labels) {
        const element = findClickableByText(label);

        if (
            element &&
            !containsAny(element.innerText || element.value, [
                "confirm booking",
                "make payment",
                "pay now",
                "submit booking",
            ])
        ) {
            safeClick(element);
            logAgent(`Clicked: ${label}`);
            return true;
        }
    }

    logAgent("No safe search/next button found.");
    return false;
}

async function tryFillDate(dateValue) {
    if (!dateValue) {
        logAgent("No preferred date provided.");
        return false;
    }

    const input = findInputByKeywords(["date", "booking date", "select date"]);

    if (!input) {
        logAgent("No date input found. User may need to choose date manually.");
        return false;
    }

    safeFill(input, dateValue);
    logAgent(`Filled date: ${dateValue}`);
    await sleep(700);
    return true;
}

function listenForAppTask() {
    window.addEventListener("message", async (event) => {
        if (event.source !== window) return;
        if (event.data?.type !== TASK_MESSAGE_TYPE) return;

        const task = event.data.task;

        if (!task?.facility?.bookingLink) {
            console.warn("Invalid agentic booking task", task);
            return;
        }

        await chrome.storage.local.set({
            [STORAGE_KEY]: task,
        });

        window.open(task.facility.bookingLink, "_blank", "noopener,noreferrer");
    });
}

async function loadExternalTask() {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const task = result[STORAGE_KEY];

    if (!task) return;

    createAgentPanel(task);
    setStatus("Agent task loaded. Click Run safe actions.");
    logAgent("Loaded task from MyTampines Assistant.");
}

if (isMyTampinesApp()) {
    listenForAppTask();
}

if (isExternalBookingSite()) {
    loadExternalTask();
}