import express from "express";
import cors from "cors";

import {
  startAgentTask,
  continueAgentTask,
  stopAgentTask,
  getAgentTask,
} from "./agentManager.js";

const app = express();
const PORT = 4100;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "MyTampines Playwright Agent",
  });
});

app.post("/api/agent/start", async (req, res) => {
  try {
    const task = req.body;

    if (!task?.facility?.bookingLink) {
      return res.status(400).json({
        message: "Facility booking link is required.",
      });
    }

    if (!task?.preferences?.date) {
      return res.status(400).json({
        message: "Preferred date is required.",
      });
    }

    const session = await startAgentTask(task);

    return res.status(202).json(session);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Could not start browser agent.",
    });
  }
});

app.get("/api/agent/:taskId", (req, res) => {
  const session = getAgentTask(req.params.taskId);

  if (!session) {
    return res.status(404).json({
      message: "Agent task not found.",
    });
  }

  return res.json(session);
});

app.post("/api/agent/:taskId/continue", async (req, res) => {
  try {
    const session = await continueAgentTask(req.params.taskId);
    return res.json(session);
  } catch (error) {
    return res.status(404).json({
      message: error.message || "Could not continue browser agent.",
    });
  }
});

app.post("/api/agent/:taskId/stop", async (req, res) => {
  try {
    const session = await stopAgentTask(req.params.taskId);
    return res.json(session);
  } catch (error) {
    return res.status(404).json({
      message: error.message || "Could not stop browser agent.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Playwright agent running at http://localhost:${PORT}`);
});