function normalise(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function parseTaskDate(dateValue) {
    if (!dateValue) return null;

    const date = new Date(
        `${dateValue}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

function getRequestedDateDetails(
    dateValue
) {
    const date = parseTaskDate(dateValue);

    if (!date) return null;

    return {
        day: String(date.getDate()),

        weekday: date
            .toLocaleDateString("en-GB", {
                weekday: "short",
            })
            .toUpperCase(),
    };
}

function parseRequestedTime(timeValue) {
    const value = normalise(timeValue);

    if (
        !value ||
        value.includes("any slot") ||
        value.includes("any available")
    ) {
        return null;
    }

    const match = value.match(
        /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/
    );

    if (!match) return null;

    let hour = Number(match[1]);
    const minutes = match[2] || "00";
    const meridiem =
        match[3].toUpperCase();

    if (hour === 0) hour = 12;

    return {
        hour,
        minutes,
        meridiem,
        label: `${hour}:${minutes} ${meridiem}`,
    };
}

function requestedMinutes(timeValue) {
    const parsed =
        parseRequestedTime(timeValue);

    if (!parsed) return null;

    let hour = parsed.hour;

    if (
        parsed.meridiem === "PM" &&
        hour !== 12
    ) {
        hour += 12;
    }

    if (
        parsed.meridiem === "AM" &&
        hour === 12
    ) {
        hour = 0;
    }

    return (
        hour * 60 +
        Number(parsed.minutes)
    );
}

function getDurationSlots(task) {
    const requested = Number(
        task.preferences?.durationSlots
    );

    if (requested === 2) {
        return 2;
    }

    return 1;
}

async function pageContains(page, values) {
    const text = normalise(
        await page.locator("body").innerText()
    );

    return values.some((value) =>
        text.includes(normalise(value))
    );
}

async function dangerousFinalActionVisible(
    page
) {
    const labels = [
        "Pay now",
        "Make payment",
        "Checkout",
        "Confirm booking",
        "Submit booking",
        "Proceed to payment",
        "Complete payment",
    ];

    for (const label of labels) {
        const button = page.getByRole(
            "button",
            {
                name: label,
                exact: false,
            }
        );

        if (
            await button
                .first()
                .isVisible()
                .catch(() => false)
        ) {
            return true;
        }

        const link = page.getByRole("link", {
            name: label,
            exact: false,
        });

        if (
            await link
                .first()
                .isVisible()
                .catch(() => false)
        ) {
            return true;
        }
    }

    return false;
}

async function waitForBookingPage(page) {
    await page.waitForLoadState(
        "domcontentloaded"
    );

    await page
        .getByText("BADMINTON COURTS", {
            exact: false,
        })
        .first()
        .waitFor({
            state: "visible",
            timeout: 15000,
        })
        .catch(() => null);

    return await pageContains(page, [
        "badminton courts",
        "location",
        "date",
        "time",
        "filter",
    ]);
}

async function isOnePaLoggedIn(page) {
    const visibleLogout = page.getByText(
        /log out|logout|my profile/i
    );

    if (
        await visibleLogout
            .first()
            .isVisible()
            .catch(() => false)
    ) {
        return true;
    }

    return false;
}

async function visibleSingpassButton(page) {
    const login = page.getByText(
        "Log in with Singpass",
        {
            exact: false,
        }
    );

    return await login
        .first()
        .isVisible()
        .catch(() => false);
}

async function loginPromptVisible(page) {
    if (await visibleSingpassButton(page)) {
        return true;
    }

    const url = normalise(page.url());

    return (
        url.includes("singpass") ||
        url.includes("login")
    );
}

async function safeLocatorClick(
    locator,
    addLog,
    description
) {
    try {
        const target = locator.first();

        if (
            !(await target
                .isVisible()
                .catch(() => false))
        ) {
            return false;
        }

        await target.scrollIntoViewIfNeeded();

        await target.click({
            timeout: 3000,
        });

        addLog(description);
        return true;
    } catch (error) {
        addLog(
            `${description} failed: ${error.message}`
        );

        return false;
    }
}

async function openOnePaAccountMenu(
    page,
    addLog
) {
    if (await visibleSingpassButton(page)) {
        return true;
    }

    /*
     * Only search inside the page header/navigation.
     * Do not use [class*="profile"] on the whole page,
     * because OnePA has unrelated profile/content links.
     */
    const header = page.locator(
        "header, nav, .header, .navbar, .site-header"
    );

    const labelledCandidates = [
        header.locator(
            "[aria-label*='account' i]"
        ),
        header.locator(
            "[title*='account' i]"
        ),
        header.locator(
            "[aria-label*='profile' i]"
        ),
        header.locator(
            "[title*='profile' i]"
        ),
        header.locator(
            "[aria-label*='login' i]"
        ),
        header.locator(
            "[title*='login' i]"
        ),
        header.locator(
            "[data-testid*='account' i]"
        ),
    ];

    for (const candidate of labelledCandidates) {
        const clicked = await safeLocatorClick(
            candidate,
            addLog,
            "Opened OnePA account menu."
        );

        if (!clicked) {
            continue;
        }

        await page.waitForTimeout(500);

        if (await visibleSingpassButton(page)) {
            return true;
        }
    }

    /*
     * Fallback: inspect only small clickable controls in
     * the top-right header area.
     */
    const accountControl =
        await page.evaluate(() => {
            const isVisible = (element) => {
                if (!element) return false;

                const rect =
                    element.getBoundingClientRect();

                const style =
                    window.getComputedStyle(element);

                return (
                    rect.width > 0 &&
                    rect.height > 0 &&
                    style.display !== "none" &&
                    style.visibility !== "hidden" &&
                    style.opacity !== "0"
                );
            };

            const candidates = Array.from(
                document.querySelectorAll(
                    [
                        "header button",
                        "header a",
                        "nav button",
                        "nav a",
                        ".header button",
                        ".header a",
                        ".navbar button",
                        ".navbar a",
                    ].join(",")
                )
            )
                .filter(isVisible)
                .map((element, index) => {
                    const rect =
                        element.getBoundingClientRect();

                    const text = [
                        element.innerText,
                        element.getAttribute(
                            "aria-label"
                        ),
                        element.getAttribute("title"),
                        element.className,
                    ]
                        .join(" ")
                        .toLowerCase();

                    return {
                        index,
                        text,
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                    };
                })
                .filter((item) => {
                    const inHeader =
                        item.top >= 0 &&
                        item.top < 220;

                    const smallControl =
                        item.width >= 18 &&
                        item.width <= 90 &&
                        item.height >= 18 &&
                        item.height <= 90;

                    const accountText =
                        item.text.includes("account") ||
                        item.text.includes("profile") ||
                        item.text.includes("login") ||
                        item.text.includes("user");

                    return (
                        inHeader &&
                        smallControl &&
                        accountText
                    );
                })
                .sort(
                    (a, b) => b.left - a.left
                );

            return candidates[0] || null;
        });

    if (accountControl) {
        const controls = page.locator(
            [
                "header button",
                "header a",
                "nav button",
                "nav a",
                ".header button",
                ".header a",
                ".navbar button",
                ".navbar a",
            ].join(",")
        );

        const target = controls.nth(
            accountControl.index
        );

        const clicked = await safeLocatorClick(
            target,
            addLog,
            "Opened OnePA account menu using the header control."
        );

        if (clicked) {
            await page.waitForTimeout(600);

            if (await visibleSingpassButton(page)) {
                return true;
            }
        }
    }

    /*
     * Last fallback: click the known small account icon
     * area near the top-right, but only when the booking
     * page is visible.
     */
    const bookingPageVisible =
        await pageContains(page, [
            "badminton courts",
            "location",
            "date",
            "time",
        ]);

    if (bookingPageVisible) {
        const clickedByPosition =
            await page.evaluate(() => {
                const controls = Array.from(
                    document.querySelectorAll(
                        "header button, header a, nav button, nav a"
                    )
                ).filter((element) => {
                    const rect =
                        element.getBoundingClientRect();

                    const style =
                        window.getComputedStyle(
                            element
                        );

                    return (
                        rect.width >= 18 &&
                        rect.width <= 80 &&
                        rect.height >= 18 &&
                        rect.height <= 80 &&
                        rect.top >= 0 &&
                        rect.top < 220 &&
                        style.display !== "none" &&
                        style.visibility !== "hidden"
                    );
                });

                /*
                 * Sort from right to left. The account control
                 * is usually before the cart and search icons.
                 */
                controls.sort((a, b) => {
                    return (
                        b.getBoundingClientRect().left -
                        a.getBoundingClientRect().left
                    );
                });

                const likelyAccount =
                    controls.find((element) => {
                        const text = [
                            element.innerText,
                            element.getAttribute(
                                "aria-label"
                            ),
                            element.getAttribute(
                                "title"
                            ),
                            element.className,
                        ]
                            .join(" ")
                            .toLowerCase();

                        return (
                            text.includes("account") ||
                            text.includes("user") ||
                            text.includes("profile")
                        );
                    });

                if (!likelyAccount) {
                    return false;
                }

                likelyAccount.click();
                return true;
            });

        if (clickedByPosition) {
            addLog(
                "Opened OnePA account menu using the page header."
            );

            await page.waitForTimeout(600);

            if (await visibleSingpassButton(page)) {
                return true;
            }
        }
    }

    addLog(
        "Could not safely identify the OnePA account icon. Continuing without login-first."
    );

    return false;
}

async function startOnePaSingpassLogin(
    page,
    addLog
) {
    try {
        const menuOpened =
            await openOnePaAccountMenu(
                page,
                addLog
            );

        if (!menuOpened) {
            return false;
        }

        const loginButton = page.getByText(
            "Log in with Singpass",
            {
                exact: false,
            }
        );

        const clicked =
            await safeLocatorClick(
                loginButton,
                addLog,
                "Opened OnePA Singpass login."
            );

        if (!clicked) {
            addLog(
                "The Log in with Singpass button could not be clicked."
            );

            return false;
        }

        await page.waitForTimeout(1200);

        return true;
    } catch (error) {
        addLog(
            `Could not open Singpass login: ${error.message}`
        );

        return false;
    }
}

async function clickFilter(page, addLog) {
    const button = page.getByRole(
        "button",
        {
            name: "Filter",
            exact: true,
        }
    );

    if (
        !(await button
            .first()
            .isVisible()
            .catch(() => false))
    ) {
        addLog(
            "Could not find OnePA Filter button."
        );

        return false;
    }

    await button.first().click();

    addLog("Clicked OnePA Filter.");

    await page.waitForTimeout(1200);

    return true;
}

async function findRequestedDateTab(
    page,
    dateValue
) {
    const details =
        getRequestedDateDetails(dateValue);

    if (!details) return null;

    return await page.evaluate(
        ({ day, weekday }) => {
            const clean = (value) =>
                String(value || "")
                    .toUpperCase()
                    .replace(/\s+/g, " ")
                    .trim();

            const visible = (element) => {
                if (!element) return false;

                const rect =
                    element.getBoundingClientRect();

                const style =
                    window.getComputedStyle(
                        element
                    );

                return (
                    rect.width > 0 &&
                    rect.height > 0 &&
                    style.display !== "none" &&
                    style.visibility !== "hidden"
                );
            };

            const candidates = Array.from(
                document.querySelectorAll(
                    [
                        "button",
                        "div",
                        "span",
                        "td",
                        "th",
                        "[role='button']",
                    ].join(",")
                )
            ).filter((element) => {
                if (!visible(element)) {
                    return false;
                }

                const text = clean(
                    element.innerText ||
                    element.textContent
                );

                return (
                    text.includes(weekday) &&
                    (
                        text === `${weekday} ${day}` ||
                        text.endsWith(` ${day}`) ||
                        text.includes(
                            `${weekday} ${day}`
                        )
                    )
                );
            });

            candidates.sort((a, b) => {
                const aRect =
                    a.getBoundingClientRect();

                const bRect =
                    b.getBoundingClientRect();

                return (
                    aRect.width * aRect.height -
                    bRect.width * bRect.height
                );
            });

            const match = candidates[0];

            if (!match) return null;

            const clickable =
                match.closest(
                    [
                        "button",
                        "[role='button']",
                        "td",
                        "th",
                    ].join(",")
                ) ||
                match.parentElement ||
                match;

            const rect =
                clickable.getBoundingClientRect();

            return {
                x:
                    rect.left +
                    rect.width / 2,

                y:
                    rect.top +
                    rect.height / 2,

                text: clean(
                    clickable.innerText ||
                    clickable.textContent
                ),
            };
        },
        details
    );
}

async function clickNextThreeDays(
    page,
    addLog
) {
    const next = page.getByText(
        "Next 3 Days",
        {
            exact: false,
        }
    );

    if (
        !(await next
            .first()
            .isVisible()
            .catch(() => false))
    ) {
        return false;
    }

    await next.first().click();

    addLog(
        "Moved to the next three-day range."
    );

    await page.waitForTimeout(850);

    return true;
}

async function activateRequestedDate(
    page,
    dateValue,
    addLog
) {
    for (
        let attempt = 0;
        attempt < 12;
        attempt += 1
    ) {
        const tab =
            await findRequestedDateTab(
                page,
                dateValue
            );

        if (tab) {
            await page.mouse.click(
                tab.x,
                tab.y
            );

            addLog(
                `Activated requested date: ${tab.text}`
            );

            await page.waitForTimeout(1200);

            return true;
        }

        const moved =
            await clickNextThreeDays(
                page,
                addLog
            );

        if (!moved) break;
    }

    return false;
}

async function getAllVisibleTimeRows(
    page
) {
    return await page.evaluate(() => {
        const clean = (value) =>
            String(value || "")
                .toUpperCase()
                .replace(/\s+/g, " ")
                .trim();

        const visible = (element) => {
            if (!element) return false;

            const rect =
                element.getBoundingClientRect();

            const style =
                window.getComputedStyle(element);

            return (
                rect.width > 0 &&
                rect.height > 0 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
            );
        };

        const pattern =
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/;

        const rows = Array.from(
            document.querySelectorAll(
                "div, span, td, th, p"
            )
        )
            .filter(visible)
            .map((element) => {
                const text = clean(
                    element.innerText ||
                    element.textContent
                );

                const match =
                    text.match(pattern);

                if (!match) return null;

                const rect =
                    element.getBoundingClientRect();

                let hour = Number(match[1]);
                const minutes =
                    Number(match[2]);

                const meridiem = match[3];

                if (
                    meridiem === "PM" &&
                    hour !== 12
                ) {
                    hour += 12;
                }

                if (
                    meridiem === "AM" &&
                    hour === 12
                ) {
                    hour = 0;
                }

                return {
                    label: text,

                    minutesFromMidnight:
                        hour * 60 + minutes,

                    centerY:
                        rect.top +
                        rect.height / 2,

                    right: rect.right,

                    area:
                        rect.width *
                        rect.height,
                };
            })
            .filter(Boolean);

        const unique = new Map();

        rows
            .sort(
                (a, b) =>
                    a.area - b.area
            )
            .forEach((row) => {
                if (!unique.has(row.label)) {
                    unique.set(
                        row.label,
                        row
                    );
                }
            });

        return Array.from(
            unique.values()
        ).sort(
            (a, b) =>
                a.minutesFromMidnight -
                b.minutesFromMidnight
        );
    });
}

async function inspectSlotForRow(
    page,
    row
) {
    return await page.evaluate(
        ({ centerY, right }) => {
            const visible = (element) => {
                if (!element) return false;

                const rect =
                    element.getBoundingClientRect();

                const style =
                    window.getComputedStyle(
                        element
                    );

                return (
                    rect.width > 0 &&
                    rect.height > 0 &&
                    style.display !== "none" &&
                    style.visibility !== "hidden"
                );
            };

            const rgbIsGreen = (value) => {
                const match = String(
                    value || ""
                ).match(
                    /rgba?\((\d+),\s*(\d+),\s*(\d+)/
                );

                if (!match) return false;

                const red = Number(match[1]);
                const green = Number(match[2]);
                const blue = Number(match[3]);

                return (
                    green >= 100 &&
                    green > red + 25 &&
                    green > blue + 15
                );
            };

            const candidates = Array.from(
                document.querySelectorAll(
                    [
                        "button",
                        "a",
                        "input",
                        "div",
                        "span",
                        "td",
                        "svg",
                        "[role='button']",
                        "[tabindex]",
                    ].join(",")
                )
            )
                .filter((element) => {
                    if (!visible(element)) {
                        return false;
                    }

                    const rect =
                        element.getBoundingClientRect();

                    const sameRow =
                        centerY >=
                        rect.top - 14 &&
                        centerY <=
                        rect.bottom + 14;

                    const rightOfLabel =
                        rect.left >
                        right + 15;

                    const sensibleSize =
                        rect.width >= 8 &&
                        rect.width <= 90 &&
                        rect.height >= 8 &&
                        rect.height <= 90;

                    return (
                        sameRow &&
                        rightOfLabel &&
                        sensibleSize
                    );
                })
                .map((element) => {
                    const rect =
                        element.getBoundingClientRect();

                    const style =
                        window.getComputedStyle(
                            element
                        );

                    const text = String(
                        element.innerText ||
                        element.textContent ||
                        ""
                    )
                        .toLowerCase()
                        .replace(/\s+/g, " ")
                        .trim();

                    const className = String(
                        element.className?.baseVal ||
                        element.className ||
                        ""
                    ).toLowerCase();

                    const ariaLabel = String(
                        element.getAttribute(
                            "aria-label"
                        ) || ""
                    ).toLowerCase();

                    const title = String(
                        element.getAttribute(
                            "title"
                        ) || ""
                    ).toLowerCase();

                    const combined = [
                        text,
                        className,
                        ariaLabel,
                        title,
                    ].join(" ");

                    const selected =
                        combined.includes("selected") ||
                        combined.includes("checked") ||
                        element.getAttribute(
                            "aria-checked"
                        ) === "true" ||
                        element.checked === true;

                    const unavailable =
                        combined.includes(
                            "not available"
                        ) ||
                        combined.includes(
                            "unavailable"
                        ) ||
                        combined.includes(
                            "disabled"
                        ) ||
                        combined.includes("cross") ||
                        combined.includes("close") ||
                        combined.includes("times") ||
                        text === "x" ||
                        text === "×" ||
                        element.getAttribute(
                            "aria-disabled"
                        ) === "true" ||
                        element.hasAttribute(
                            "disabled"
                        );

                    const green =
                        rgbIsGreen(
                            style.borderColor
                        ) ||
                        rgbIsGreen(
                            style.borderTopColor
                        ) ||
                        rgbIsGreen(
                            style.borderRightColor
                        ) ||
                        rgbIsGreen(
                            style.borderBottomColor
                        ) ||
                        rgbIsGreen(
                            style.borderLeftColor
                        ) ||
                        rgbIsGreen(
                            style.backgroundColor
                        ) ||
                        rgbIsGreen(
                            style.outlineColor
                        ) ||
                        className.includes(
                            "available"
                        ) ||
                        className.includes(
                            "vacant"
                        );

                    const clickable =
                        element.matches(
                            [
                                "button",
                                "a",
                                "input",
                                "[role='button']",
                                "[tabindex]",
                            ].join(",")
                        ) ||
                        Boolean(
                            element.onclick ||
                            element.closest(
                                [
                                    "button",
                                    "a",
                                    "input",
                                    "[role='button']",
                                    "[tabindex]",
                                ].join(",")
                            )
                        );

                    return {
                        state: selected
                            ? "selected"
                            : unavailable
                                ? "unavailable"
                                : green
                                    ? "available"
                                    : "unknown",

                        selected,
                        green,
                        unavailable,
                        clickable,

                        x:
                            rect.left +
                            rect.width / 2,

                        y:
                            rect.top +
                            rect.height / 2,

                        width: rect.width,
                        height: rect.height,

                        area:
                            rect.width *
                            rect.height,

                        text,
                        className,
                        tagName:
                            element.tagName,
                    };
                });

            const selected =
                candidates
                    .filter(
                        (item) =>
                            item.state ===
                            "selected"
                    )
                    .sort(
                        (a, b) =>
                            a.area - b.area
                    )[0];

            if (selected) {
                return selected;
            }

            const available =
                candidates
                    .filter(
                        (item) =>
                            item.state ===
                            "available"
                    )
                    .sort((a, b) => {
                        if (
                            a.clickable !==
                            b.clickable
                        ) {
                            return a.clickable
                                ? -1
                                : 1;
                        }

                        return (
                            a.area - b.area
                        );
                    })[0];

            if (available) {
                return available;
            }

            const unavailable =
                candidates
                    .filter(
                        (item) =>
                            item.state ===
                            "unavailable"
                    )
                    .sort(
                        (a, b) =>
                            a.area - b.area
                    )[0];

            if (unavailable) {
                return unavailable;
            }

            return {
                state: "not_found",
            };
        },
        row
    );
}

async function clickSlot(
    page,
    slot,
    addLog
) {
    await page.mouse.move(
        slot.x,
        slot.y
    );

    await page.waitForTimeout(250);

    await page.mouse.click(
        slot.x,
        slot.y
    );

    addLog(
        `Clicked available OnePA slot at coordinates ${Math.round(
            slot.x
        )}, ${Math.round(slot.y)}.`
    );

    await page.waitForTimeout(900);

    return true;
}

async function verifySelectedSlot(
    page,
    row
) {
    const result =
        await inspectSlotForRow(
            page,
            row
        );

    return (
        result.state === "selected" ||
        result.state === "available"
    );
}

function buildCandidateStartIndexes(
    rows,
    requestedIndex,
    durationSlots,
    backupId
) {
    const validStartIndexes = [];

    for (
        let index = 0;
        index <=
        rows.length - durationSlots;
        index += 1
    ) {
        validStartIndexes.push(index);
    }

    const later =
        validStartIndexes.filter(
            (index) =>
                index > requestedIndex
        );

    const earlier =
        validStartIndexes
            .filter(
                (index) =>
                    index < requestedIndex
            )
            .reverse();

    switch (backupId) {
        case "sameVenueLater":
            return [
                requestedIndex,
                ...later,
            ];

        case "sameVenueEarlier":
            return [
                requestedIndex,
                ...earlier,
            ];

        case "sameVenueAny":
            return [
                requestedIndex,
                ...later,
                ...earlier,
            ];

        case "askFirst":
            return [requestedIndex];

        default:
            return [
                requestedIndex,
                ...later,
            ];
    }
}

async function inspectConsecutiveBlock(
    page,
    rows,
    startIndex,
    durationSlots,
    addLog
) {
    const block = [];

    for (
        let offset = 0;
        offset < durationSlots;
        offset += 1
    ) {
        const row =
            rows[startIndex + offset];

        if (!row) {
            return {
                available: false,
                reason:
                    "Not enough consecutive rows.",
                rows: [],
            };
        }

        const slot =
            await inspectSlotForRow(
                page,
                row
            );

        addLog(
            `Checked ${row.label}: ${slot.state}`
        );

        if (
            slot.state !== "available" &&
            slot.state !== "selected"
        ) {
            return {
                available: false,
                reason:
                    `${row.label} is ${slot.state}.`,
                rows: [],
            };
        }

        block.push({
            row,
            slot,
        });
    }

    return {
        available: true,
        rows: block,
    };
}

async function clickConsecutiveBlock(
    page,
    block,
    addLog
) {
    for (const item of block) {
        if (
            item.slot.state === "selected"
        ) {
            addLog(
                `${item.row.label} is already selected.`
            );

            continue;
        }

        await clickSlot(
            page,
            item.slot,
            addLog
        );
    }

    return true;
}

async function selectRequestedOrFallbackBlock(
    page,
    task,
    addLog,
    pause
) {
    const rows =
        await getAllVisibleTimeRows(page);

    if (!rows.length) {
        pause(
            "No time rows found",
            "The agent could not identify the OnePA time rows."
        );

        return null;
    }

    const requested =
        requestedMinutes(
            task.preferences.time
        );

    if (requested === null) {
        pause(
            "Flexible time requires review",
            "The agent could not determine an exact requested start time."
        );

        return null;
    }

    const requestedIndex =
        rows.findIndex(
            (row) =>
                row.minutesFromMidnight ===
                requested
        );

    if (requestedIndex < 0) {
        pause(
            "Requested time not found",
            `The agent could not find the ${task.preferences.time} row.`
        );

        return null;
    }

    const durationSlots =
        getDurationSlots(task);

    const backupId =
        task.preferences.backupId ||
        "askFirst";

    const candidateIndexes =
        buildCandidateStartIndexes(
            rows,
            requestedIndex,
            durationSlots,
            backupId
        );

    for (
        let candidatePosition = 0;
        candidatePosition <
        candidateIndexes.length;
        candidatePosition += 1
    ) {
        const startIndex =
            candidateIndexes[
            candidatePosition
            ];

        const isRequestedStart =
            startIndex === requestedIndex;

        const block =
            await inspectConsecutiveBlock(
                page,
                rows,
                startIndex,
                durationSlots,
                addLog
            );

        if (!block.available) {
            if (
                isRequestedStart &&
                backupId === "askFirst"
            ) {
                pause(
                    "Preferred slot unavailable",
                    "The requested slot block is unavailable. The agent paused because Ask me first was selected."
                );

                return null;
            }

            continue;
        }

        if (!isRequestedStart) {
            addLog(
                `Applying fallback rule: ${task.preferences
                    .backupLabel ||
                backupId
                }`
            );
        }

        await clickConsecutiveBlock(
            page,
            block.rows,
            addLog
        );

        const startLabel =
            block.rows[0].row.label;

        const endLabel =
            block.rows[
                block.rows.length - 1
            ].row.label;

        return {
            usedFallback:
                !isRequestedStart,

            startLabel,
            endLabel,

            rows: block.rows.map(
                (item) => item.row
            ),
        };
    }

    pause(
        "No suitable slot block found",
        `No ${durationSlots === 2
            ? "two-hour"
            : "one-hour"
        } green slot block matched the fallback rule “${task.preferences.backupLabel
        }”.`
    );

    return null;
}

async function selectOnePaProfile(
    page,
    bookingFor,
    addLog
) {
    const profileHeading =
        page.getByText("Profile", {
            exact: true,
        });

    if (
        !(await profileHeading
            .first()
            .isVisible()
            .catch(() => false))
    ) {
        addLog(
            "OnePA Profile section is not visible yet."
        );

        return false;
    }

    await profileHeading
        .first()
        .scrollIntoViewIfNeeded();

    const label =
        bookingFor === "someoneElse"
            ? "Booking on behalf of someone"
            : "Booking for Myself";

    const radio = page.getByLabel(label, {
        exact: false,
    });

    if (
        await radio
            .first()
            .isVisible()
            .catch(() => false)
    ) {
        await radio.first().check();

        addLog(
            `Selected profile: ${label}`
        );

        return true;
    }

    const textOption =
        page.getByText(label, {
            exact: false,
        });

    if (
        await textOption
            .first()
            .isVisible()
            .catch(() => false)
    ) {
        await textOption.first().click();

        addLog(
            `Selected profile: ${label}`
        );

        return true;
    }

    addLog(
        `Could not select profile: ${label}`
    );

    return false;
}

export async function runOnePaAgent({
    page,
    task,
    continuation,
    helpers,
}) {
    const {
        addLog,
        pause,
        complete,
        update,
    } = helpers;

    update({
        stage:
            "Preparing OnePA booking",

        message:
            "Checking login, date, duration and available slots.",
    });

    if (
        await dangerousFinalActionVisible(
            page
        )
    ) {
        pause(
            "Review required",
            "The agent has reached checkout or payment."
        );

        return;
    }

    let bookingPageReady =
        await waitForBookingPage(page);

    /*
     * On continuation, the user may still be on
     * the Singpass/login completion page. After
     * login, return to the original booking URL.
     */
    if (
        continuation &&
        !bookingPageReady &&
        !(await loginPromptVisible(page))
    ) {
        await page.goto(
            task.facility.bookingLink,
            {
                waitUntil:
                    "domcontentloaded",
                timeout: 30000,
            }
        );

        addLog(
            "Returned to the OnePA booking page after login."
        );

        bookingPageReady =
            await waitForBookingPage(page);
    }

    if (!bookingPageReady) {
        if (
            await loginPromptVisible(page)
        ) {
            pause(
                "Manual Singpass login required",
                "Complete Singpass login in the Playwright browser, then press Continue Agent."
            );

            return;
        }

        pause(
            "OnePA booking page not detected",
            "Open the OnePA facility availability page, then press Continue Agent."
        );

        return;
    }

    addLog(
        "OnePA facility availability page detected."
    );

    /*
     * Login-first is only triggered on the first
     * run. Continue Agent resumes after the user
     * manually completes Singpass.
     */
    if (
        task.preferences.loginFirst &&
        !continuation &&
        !(await isOnePaLoggedIn(page))
    ) {
        const opened =
            await startOnePaSingpassLogin(
                page,
                addLog
            );

        if (opened) {
            pause(
                "Manual Singpass login required",
                "Complete Singpass login in the Playwright browser, then press Continue Agent."
            );

            return;
        }

        
        addLog(
            "Login-first could not be started automatically. Continuing with slot selection."
        );
    }

    await clickFilter(page, addLog);

    const dateActivated =
        await activateRequestedDate(
            page,
            task.preferences.date,
            addLog
        );

    if (!dateActivated) {
        pause(
            "Requested date not found",
            `The agent could not activate ${task.preferences.date}.`
        );

        return;
    }

    const flexible =
        normalise(
            task.preferences.time
        ).includes("any slot") ||
        normalise(
            task.preferences.time
        ).includes("any available");

    if (flexible) {
        pause(
            "Flexible time selection",
            "Choose an exact start time for one-hour or two-hour consecutive booking."
        );

        return;
    }

    const selectedBlock =
        await selectRequestedOrFallbackBlock(
            page,
            task,
            addLog,
            pause
        );

    if (!selectedBlock) {
        return;
    }

    /*
     * Selecting a slot can expose the login menu
     * on OnePA even when login-first was not used.
     */
    if (
        await loginPromptVisible(page)
    ) {
        pause(
            "Manual Singpass login required",
            "The slot was selected. Complete Singpass login manually, then press Continue Agent."
        );

        return;
    }

    await selectOnePaProfile(
        page,
        task.preferences.bookingFor,
        addLog
    );

    if (
        await dangerousFinalActionVisible(
            page
        )
    ) {
        pause(
            "Review required",
            "The slots and booking profile are prepared. Review them manually before checkout or payment."
        );

        return;
    }

    const slotSummary =
        selectedBlock.rows
            .map((row) => row.label)
            .join(" and ");

    complete(
        selectedBlock.usedFallback
            ? "Fallback slots selected"
            : "Requested slots selected",

        selectedBlock.usedFallback
            ? `The requested slot was unavailable. Following “${task.preferences.backupLabel}”, the agent selected ${slotSummary} and prepared the booking profile.`
            : `The agent selected ${slotSummary} and prepared the booking profile. Review the OnePA page before continuing.`
    );
}