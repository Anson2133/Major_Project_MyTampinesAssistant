function normalise(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

async function pageContains(page, texts) {
  const bodyText = normalise(await page.locator("body").innerText());

  return texts.some((text) =>
    bodyText.includes(normalise(text))
  );
}

async function hasVisibleButton(page, names) {
  for (const name of names) {
    const button = page.getByRole("button", {
      name,
      exact: false,
    });

    if (await button.first().isVisible().catch(() => false)) {
      return true;
    }

    const link = page.getByRole("link", {
      name,
      exact: false,
    });

    if (await link.first().isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

function cleanVenueName(facility) {
  if (facility.cleanVenueName) {
    return facility.cleanVenueName;
  }

  if (facility.name?.includes("@")) {
    return facility.name.split("@").pop().trim();
  }

  return facility.name || "";
}

async function clickVenue(page, facility, addLog) {
  const venueName = cleanVenueName(facility);

  const candidates = [
    venueName,
    "Our Tampines Hub - Community Auditorium",
    "Our Tampines Hub",
    facility.name,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const textLocator = page.getByText(candidate, {
      exact: false,
    });

    if (await textLocator.first().isVisible().catch(() => false)) {
      await textLocator.first().click();
      addLog(`Selected venue: ${candidate}`);
      await page.waitForTimeout(1500);
      return true;
    }
  }

  return false;
}

async function loginRequired(page) {
  const url = normalise(page.url());

  if (url.includes("login") || url.includes("singpass")) {
    return true;
  }

  return await pageContains(page, [
    "continue with singpass",
    "login with singpass",
    "scan qr code with singpass",
    "one-time password",
    "enter otp",
  ]);
}

async function dangerousFinalActionVisible(page) {
  return await hasVisibleButton(page, [
    "Pay now",
    "Make payment",
    "Confirm booking",
    "Complete booking",
    "Submit booking",
    "Checkout",
  ]);
}

export async function runActiveSgAgent({
  page,
  task,
  continuation,
  helpers,
}) {
  const { addLog, pause, complete, update } = helpers;

  update({
    stage: "Analysing ActiveSG",
    message: "Checking the current ActiveSG booking step.",
  });

  if (await dangerousFinalActionVisible(page)) {
    pause(
      "Final confirmation detected",
      "The booking is ready for review. Please complete payment or confirmation manually."
    );
    return;
  }

  const isVenuePage = await pageContains(page, [
    "select venue",
    "find badminton venues",
    "find basketball venues",
    "find table tennis venues",
  ]);

  if (isVenuePage) {
    addLog("ActiveSG venue-selection page detected.");

    const selected = await clickVenue(
      page,
      task.facility,
      addLog
    );

    if (!selected) {
      pause(
        "Venue selection required",
        "The agent could not safely locate the requested venue. Select it manually, then press Continue Agent."
      );
      return;
    }

    const slotsOpenLater = await pageContains(page, [
      "ballot slots open",
      "slots open on",
      "booking opens on",
    ]);

    if (slotsOpenLater) {
      pause(
        "Slots not open yet",
        "ActiveSG indicates that the booking or ballot slots open later. Try another venue or return when booking opens."
      );
      return;
    }

    if (await loginRequired(page)) {
      pause(
        "Manual login required",
        "Please complete ActiveSG or Singpass login manually, then press Continue Agent."
      );
      return;
    }

    complete(
      "Venue selected",
      "The venue was selected. Review the next ActiveSG step, then continue the agent."
    );
    return;
  }

  if (await loginRequired(page)) {
    pause(
      "Manual login required",
      "Please complete ActiveSG or Singpass login manually, then press Continue Agent."
    );
    return;
  }

  const slotsOpenLater = await pageContains(page, [
    "ballot slots open",
    "slots open on",
    "booking opens on",
  ]);

  if (slotsOpenLater) {
    pause(
      "Slots not open yet",
      "The requested facility is not currently open for booking."
    );
    return;
  }

  const unavailable = await pageContains(page, [
    "fully booked",
    "no available slots",
    "no slots available",
    "unavailable",
  ]);

  if (unavailable) {
    pause(
      "Preferred slot unavailable",
      task.preferences.backupText ||
        "The requested slot is unavailable. Choose an alternative before continuing."
    );
    return;
  }

  complete(
    "ActiveSG page ready",
    "The agent reached the next booking stage. Review the available options manually before final confirmation."
  );
}