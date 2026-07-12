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
  if (agentPanel) agentPanel.remove();

  const backupNotice = clone.querySelector("#mta-agent-backup-notice");
  if (backupNotice) backupNotice.remove();

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
      ].join(",")
    )
  ).filter((el) => {
    if (!isElementVisible(el)) return false;
    if (el.closest("#mta-agent-panel")) return false;
    if (el.closest("#mta-agent-backup-notice")) return false;
    return true;
  });
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

function findVenueCardByText(text) {
  if (!text) return null;

  const target = normalise(text);
  const targetWords = target
    .replace("@", " ")
    .split(" ")
    .filter((word) => word.length > 2);

  const candidates = Array.from(
    document.querySelectorAll("button, a, [role='button'], [tabindex], div")
  ).filter((el) => {
    if (!isElementVisible(el)) return false;
    if (el.closest("#mta-agent-panel")) return false;
    if (el.closest("#mta-agent-backup-notice")) return false;

    const textValue = normalise(el.innerText || el.textContent || "");
    if (!textValue) return false;

    const hasMostWords =
      targetWords.length > 0 &&
      targetWords.filter((word) => textValue.includes(word)).length >=
        Math.min(3, targetWords.length);

    const looksLikeActiveSgVenue =
      textValue.includes("our tampines hub") ||
      textValue.includes("community auditorium");

    return hasMostWords || looksLikeActiveSgVenue;
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    const aArea = aRect.width * aRect.height;
    const bArea = bRect.width * bRect.height;

    return bArea - aArea;
  });

  return candidates[0];
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

function isVenueSelectionPage() {
  const text = getVisibleText();

  return (
    text.includes("select venue") ||
    text.includes("find badminton venues") ||
    text.includes("find basketball venues") ||
    text.includes("find table tennis venues") ||
    text.includes("venues")
  );
}

function looksLikeLoginPage() {
  const text = getVisibleText();
  const url = normalise(window.location.href);

  if (isVenueSelectionPage()) return false;

  const hasOnlyHeaderLogin =
    text.includes("log in") &&
    !text.includes("password") &&
    !text.includes("otp") &&
    !text.includes("singpass") &&
    !url.includes("login");

  if (hasOnlyHeaderLogin) return false;

  return (
    url.includes("login") ||
    url.includes("singpass") ||
    containsAny(text, [
      "continue with singpass",
      "login with singpass",
      "sign in with singpass",
      "enter your password",
      "enter otp",
      "one-time password",
      "scan qr code with singpass",
    ])
  );
}

function looksLikePaymentOrFinalConfirmation() {
  const dangerousButtons = Array.from(
    document.querySelectorAll("button, a, [role='button'], input[type='submit']")
  ).filter((el) => {
    if (!isElementVisible(el)) return false;
    if (el.closest("#mta-agent-panel")) return false;
    if (el.closest("#mta-agent-backup-notice")) return false;

    const text = normalise(
      el.innerText || el.value || el.getAttribute("aria-label") || ""
    );

    return (
      text === "pay now" ||
      text === "make payment" ||
      text === "checkout" ||
      text === "confirm booking" ||
      text === "complete booking" ||
      text === "submit booking" ||
      text === "place booking" ||
      text === "review and pay"
    );
  });

  return dangerousButtons.length > 0;
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
    "ballot slots open",
    "slots open on",
    "booking opens",
    "opens on",
  ]);
}

function isOnePaPage() {
  return window.location.hostname.includes("onepa.gov.sg");
}

function formatTaskDateForOnePa(dateValue) {
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTaskDateShort(dateValue) {
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function getOnePaTimeKeyword(timeValue) {
  const value = normalise(timeValue);

  if (value.includes("9am")) return "9";
  if (value.includes("10am")) return "10";
  if (value.includes("11am")) return "11";
  if (value.includes("12pm")) return "12";
  if (value.includes("1pm")) return "1";
  if (value.includes("2pm")) return "2";
  if (value.includes("3pm")) return "3";
  if (value.includes("4pm")) return "4";
  if (value.includes("5pm")) return "5";
  if (value.includes("6pm")) return "6";
  if (value.includes("7pm")) return "7";
  if (value.includes("8pm")) return "8";
  if (value.includes("9pm")) return "9";

  if (value.includes("morning")) return "morning";
  if (value.includes("afternoon")) return "afternoon";
  if (value.includes("evening")) return "evening";

  return "";
}

async function clickOnePaDropdownByLabel(labelText) {
  const labels = Array.from(document.querySelectorAll("label, div, span, p"))
    .filter(isElementVisible)
    .filter((el) => normalise(el.innerText).includes(normalise(labelText)));

  for (const label of labels) {
    if (label.closest("#mta-agent-panel")) continue;

    const parent =
      label.closest("div")?.parentElement ||
      label.parentElement ||
      label.closest("section");

    if (!parent) continue;

    const clickable = Array.from(
      parent.querySelectorAll("button, [role='button'], input, div")
    ).find((el) => {
      if (!isElementVisible(el)) return false;
      if (el.closest("#mta-agent-panel")) return false;
      if (el.closest("#mta-agent-backup-notice")) return false;

      const rect = el.getBoundingClientRect();
      return rect.width > 80 && rect.height > 30;
    });

    if (clickable) {
      safeClick(clickable);
      await sleep(700);
      return true;
    }
  }

  return false;
}

async function clickOnePaOption(optionTexts) {
  const options = Array.isArray(optionTexts) ? optionTexts : [optionTexts];

  await sleep(600);

  for (const optionText of options) {
    const option = Array.from(
      document.querySelectorAll(
        "button, [role='option'], [role='button'], li, div, span"
      )
    ).find((el) => {
      if (!isElementVisible(el)) return false;
      if (el.closest("#mta-agent-panel")) return false;
      if (el.closest("#mta-agent-backup-notice")) return false;

      const text = normalise(el.innerText || el.textContent || "");
      if (!text) return false;

      return text.includes(normalise(optionText));
    });

    if (option) {
      safeClick(option);
      await sleep(800);
      logAgent(`Selected OnePA option: ${optionText}`);
      return true;
    }
  }

  return false;
}

async function selectOnePaDate(dateValue) {
  const fullDate = formatTaskDateForOnePa(dateValue);
  const shortDate = formatTaskDateShort(dateValue);

  if (!fullDate) {
    logAgent("No OnePA date value provided.");
    return false;
  }

  const opened = await clickOnePaDropdownByLabel("Date");

  if (!opened) {
    logAgent("Could not open OnePA date dropdown.");
    return false;
  }

  const selected = await clickOnePaOption([
    fullDate,
    shortDate,
    fullDate.replace(/^0/, ""),
    shortDate.replace(/^0/, ""),
  ]);

  if (!selected) {
    logAgent(`Could not select OnePA date: ${fullDate}`);
    return false;
  }

  return true;
}

async function selectOnePaTime(timeValue) {
  const value = normalise(timeValue);

  if (!timeValue || value.includes("any available")) {
    logAgent("Time is flexible. Keeping OnePA time as All.");
    return true;
  }

  const opened = await clickOnePaDropdownByLabel("Time");

  if (!opened) {
    logAgent("Could not open OnePA time dropdown.");
    return false;
  }

  if (value.includes("morning")) {
    return await clickOnePaOption(["Morning", "AM", "All"]);
  }

  if (value.includes("afternoon")) {
    return await clickOnePaOption(["Afternoon", "PM", "All"]);
  }

  if (value.includes("evening")) {
    return await clickOnePaOption(["Evening", "PM", "All"]);
  }

  const keyword = getOnePaTimeKeyword(timeValue);

  const selected = await clickOnePaOption([
    timeValue,
    keyword,
    timeValue.replace(" to ", "-"),
    timeValue.replace("am", "AM").replace("pm", "PM"),
  ]);

  if (!selected) {
    logAgent(`Could not select OnePA time: ${timeValue}. Keeping current value.`);
    return false;
  }

  return true;
}

async function runOnePaBookingFlow(task) {
  const prefs = task.preferences || {};

  setStatus("OnePA page detected. Selecting date and time...");
  logAgent("OnePA booking page detected.");

  await selectOnePaDate(prefs.date);
  await selectOnePaTime(prefs.time);

  const filterClicked = await tryClickAny(["Filter", "Search", "Apply"]);

  if (filterClicked) {
    logAgent("Clicked OnePA Filter button.");
    await sleep(1800);
  } else {
    logAgent("Could not find OnePA Filter button.");
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
    logAgent("Stopped before final confirmation/payment.");
    return;
  }

  setStatus(
    "OnePA filters prepared. Please review available slots manually before adding to cart or confirming.",
    "success"
  );

  logAgent("OnePA date/time filtering completed.");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
      <div class="mta-agent-header-actions">
        <button id="mta-agent-minimise" type="button" title="Minimise">−</button>
        <button id="mta-agent-close" type="button" title="Close">×</button>
      </div>
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
        <p>${escapeHtml(
          task.preferences?.backupText ||
            "Pause and ask the user before choosing an alternative."
        )}</p>
      </div>

      <div id="mta-agent-status" class="mta-agent-status">
        Ready to start.
      </div>

      <div class="mta-agent-actions">
        <button id="mta-agent-run" type="button">Run safe actions</button>
        <button id="mta-agent-resume" type="button">Resume after login / next page</button>
        <button id="mta-agent-check-slot" type="button">Check slot status</button>
        <button id="mta-agent-clear" type="button">Clear task</button>
      </div>

      <div class="mta-agent-log" id="mta-agent-log"></div>
    </div>
  `;

  const miniButton = document.createElement("button");
  miniButton.id = "mta-agent-mini-button";
  miniButton.textContent = "MyTampines Agent";
  miniButton.style.display = "none";
  document.body.appendChild(miniButton);

  document.body.appendChild(panel);

  document.getElementById("mta-agent-close")?.addEventListener("click", () => {
    panel.remove();
    miniButton.remove();
  });

  document.getElementById("mta-agent-minimise")?.addEventListener("click", () => {
    panel.style.display = "none";
    miniButton.style.display = "block";
  });

  miniButton.addEventListener("click", () => {
    panel.style.display = "block";
    miniButton.style.display = "none";
  });

  document.getElementById("mta-agent-run")?.addEventListener("click", async () => {
    await runAgent(task);
  });

  document
    .getElementById("mta-agent-resume")
    ?.addEventListener("click", async () => {
      logAgent("Resuming agent...");
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
  const pageText = getVisibleText();
  const backupLabel = task.preferences?.backupLabel || "Ask first";
  const backupText =
    task.preferences?.backupText ||
    "Pause and ask the user before choosing an alternative.";

  const ballotMatch = pageText.match(
    /(ballot slots open on|slots open on|booking opens on|opens on)\s+([a-z]{3,9},?\s+\d{1,2}\s+[a-z]{3,9}|[a-z]{3,9},?\s+\d{1,2})/i
  );

  if (ballotMatch) {
    setStatus(
      `Slots are not open yet. The page says slots open on ${ballotMatch[2]}. The agent has paused.`,
      "warning"
    );

    logAgent(`Slots not open yet. Message: ${ballotMatch[0]}`);
    logAgent("Suggested pivot: try another venue, check again on opening date, or set a reminder.");
    showBackupNotice(task);
    return;
  }

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
    <p>${escapeHtml(
      task.preferences?.backupText ||
        "Please choose another slot before continuing."
    )}</p>
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

  if (looksLikeSlotUnavailable()) {
    handleUnavailableSlot(task);
    return;
  }

  const facility = task.facility || {};
  const prefs = task.preferences || {};

  if (isOnePaPage()) {
    await runOnePaBookingFlow(task);
    return;
  }

  if (isVenueSelectionPage()) {
    setStatus("Venue page detected. Selecting venue...");
    logAgent("Venue selection page detected.");

    const cleanVenueName =
      facility.cleanVenueName ||
      (facility.name?.includes("@")
        ? facility.name.split("@").pop().trim()
        : facility.name);

    const venueOptions = [
      cleanVenueName,
      "Our Tampines Hub - Community Auditorium",
      "Our Tampines Hub",
      facility.name,
    ].filter(Boolean);

    let clickedVenue = false;

    for (const venueText of venueOptions) {
      const venueCard =
        findVenueCardByText(venueText) || findClickableByText(venueText);

      if (venueCard) {
        safeClick(venueCard);
        logAgent(`Selected venue: ${venueText}`);
        clickedVenue = true;
        await sleep(1800);
        break;
      }
    }

    if (!clickedVenue) {
      setStatus(
        "Could not safely click the venue. Please click the venue manually, then press Resume.",
        "warning"
      );
      logAgent("Could not safely click venue card.");
      return;
    }

    setStatus(
      "Venue selected. Wait for the next page to load, then click Resume after login / next page.",
      "success"
    );
    return;
  }

  if (looksLikeLoginPage() && !options.resumed) {
    setStatus(
      "Login detected. Please log in manually, then click Resume after login / next page.",
      "warning"
    );
    logAgent("Paused for manual login.");
    return;
  }

  setStatus("Running safe booking actions...");
  logAgent("Started safe action execution.");

  await trySelectText(facility.sport, "activity / sport");

  await tryFillDate(prefs.date);

  if (prefs.time && !normalise(prefs.time).includes("any")) {
    await trySelectText(prefs.time, "preferred time");
  } else {
    logAgent(`Preferred time is flexible: ${prefs.time || "Any slot"}`);
  }

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

    if (event.data?.type === "MTA_CLEAR_AGENTIC_BOOKING") {
      await chrome.storage.local.remove(STORAGE_KEY);
      console.log("MyTampines agent task cleared.");
      return;
    }

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