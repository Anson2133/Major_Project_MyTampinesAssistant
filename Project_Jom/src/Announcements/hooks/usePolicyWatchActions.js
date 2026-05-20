const WATCH_API =
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/policy-watch";

function getUserId() {
  return localStorage.getItem("userId") || "demo-user-001";
}

function makeSourceKey(update) {
  return (
    update.sourceKey ||
    update.sourceId ||
    update.sourceName ||
    update.sourceAgency ||
    "unknown-source"
  )
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function postWatchAction(body) {
  const res = await fetch(WATCH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: getUserId(),
      ...body,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Policy Watch action failed:", {
      status: res.status,
      body: data,
      request: body,
    });

    throw new Error(data.message || "Policy Watch action failed");
  }

  return data;
}

export async function toggleWatchCategory(update) {
  return postWatchAction({
    action: "toggleCategory",
    targetId: update.categoryId,
    targetName: update.categoryLabel || update.categoryId,
  });
}

export async function toggleWatchSource(update) {
  const sourceKey = makeSourceKey(update);

  return postWatchAction({
    action: "toggleSource",
    targetId: sourceKey,
    targetName: update.sourceName || update.sourceAgency || "Official source",
  });
}

export async function togglePinNotice(update) {
  return postWatchAction({
    action: "togglePin",
    targetId: update.updateId,
    targetName: update.title,
  });
}

export async function markPolicyWatchSeen() {
  return postWatchAction({
    action: "markSeen",
  });
}