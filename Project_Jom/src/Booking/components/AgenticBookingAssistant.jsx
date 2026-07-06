import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
    Bot,
    Sparkles,
    ShieldCheck,
    CalendarDays,
    Clock,
    ExternalLink,
    X,
    PlayCircle,
    AlertTriangle,
    CheckCircle2,
    RefreshCcw,
} from "lucide-react";

const DATE_OPTIONS = [
    "Today",
    "Tomorrow",
    "This Friday",
    "This Saturday",
    "This Sunday",
    "Next Monday",
    "Next Tuesday",
    "Next Wednesday",
    "Next Thursday",
    "Next Friday",
    "Next Saturday",
    "Next Sunday",
    "Any weekday",
    "Any weekend",
];

const TIME_OPTIONS = [
    "7am to 8am",
    "8am to 9am",
    "9am to 10am",
    "10am to 11am",
    "11am to 12pm",
    "12pm to 1pm",
    "1pm to 2pm",
    "2pm to 3pm",
    "3pm to 4pm",
    "4pm to 5pm",
    "5pm to 6pm",
    "6pm to 7pm",
    "7pm to 8pm",
    "8pm to 9pm",
    "9pm to 10pm",
    "Morning, any slot",
    "Afternoon, any slot",
    "Evening, any slot",
    "Any available slot",
];

const BACKUP_OPTIONS = [
    {
        id: "sameVenueLater",
        label: "Same venue, later",
        text: "If the preferred slot is unavailable, try the next later available slot at the same venue.",
    },
    {
        id: "sameVenueEarlier",
        label: "Same venue, earlier",
        text: "If the preferred slot is unavailable, try the nearest earlier available slot at the same venue.",
    },
    {
        id: "nearbyVenueSameTime",
        label: "Nearby venue, same time",
        text: "If the preferred slot is unavailable, try another nearby Tampines venue at the same timing.",
    },
    {
        id: "sameVenueAnyTime",
        label: "Same venue, any time",
        text: "If the preferred slot is unavailable, suggest any available slot at the same venue.",
    },
    {
        id: "anyNearbyAvailable",
        label: "Nearby, any available",
        text: "If the preferred slot is unavailable, suggest any nearby Tampines slot that is available.",
    },
    {
        id: "askFirst",
        label: "Ask me first",
        text: "If the preferred slot is unavailable, pause and ask me before choosing an alternative.",
    },
];

function buildFallbackPlan(facility, preferences) {
    const isActiveSG = facility.websiteName === "ActiveSG";
    const isOnePA = facility.websiteName === "OnePA";

    const steps = [
        {
            id: "open_site",
            label: `Open ${facility.websiteName}`,
            action: "OPEN_URL",
            description: `Open the official ${facility.websiteName} booking page.`,
            target: facility.bookingLink,
            safety: "safe",
        },
        {
            id: "pause_login",
            label: "Pause for manual login",
            action: "WAIT_FOR_USER_LOGIN",
            description:
                "If login, Singpass, OTP or payment appears, the agent pauses and lets the user handle it manually.",
            safety: "user_control",
        },
        {
            id: "confirm_activity",
            label: `Confirm ${facility.sport || "selected service"}`,
            action: "SELECT_TEXT",
            description: `Look for and select ${facility.sport || facility.name}.`,
            targetText: facility.sport || facility.name,
            safety: "safe",
        },
        {
            id: "confirm_venue",
            label: `Select ${facility.name}`,
            action: "SELECT_TEXT",
            description: `Look for the selected venue or facility: ${facility.name}.`,
            targetText: facility.name,
            safety: "safe",
        },
        {
            id: "choose_date",
            label: `Choose ${preferences.date}`,
            action: "FILL_OR_SELECT_DATE",
            description: `Use the selected date: ${preferences.date}.`,
            value: preferences.date,
            safety: "safe",
        },
        {
            id: "choose_time",
            label: `Choose ${preferences.time}`,
            action: "SELECT_TEXT",
            description: `Look for preferred time slot: ${preferences.time}.`,
            targetText: preferences.time,
            safety: "safe",
        },
        {
            id: "handle_unavailable",
            label: "Handle unavailable slot",
            action: "CHECK_SLOT_UNAVAILABLE",
            description: preferences.backupText,
            safety: "user_control",
        },
        {
            id: "stop_review",
            label: "Stop before final confirmation",
            action: "STOP_BEFORE_SUBMIT",
            description:
                "The agent must stop before final booking, payment, confirmation or submission. The user reviews and confirms manually.",
            safety: "required",
        },
    ];

    return {
        goal: preferences.goal,
        websiteName: facility.websiteName,
        mode: isActiveSG
            ? "ACTIVE_SG_BOOKING"
            : isOnePA
                ? "ONEPA_BOOKING"
                : "EXTERNAL_BOOKING",
        summary: `Prepare a ${facility.websiteName} booking for ${facility.name}.`,
        safetyBoundary:
            "The agent can open pages and select non-sensitive options, but it must not handle Singpass, OTP, passwords, payment, or final confirmation.",
        slotUnavailableRule: preferences.backupText,
        steps,
    };
}

export default function AgenticBookingAssistant({ facility }) {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState("This Saturday");
    const [time, setTime] = useState("6pm to 7pm");
    const [backupId, setBackupId] = useState("sameVenueLater");
    const [agentPlan, setAgentPlan] = useState(null);
    const [isPlanning, setIsPlanning] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const canUseAgent = useMemo(() => {
        return Boolean(facility?.bookingLink && facility?.websiteName);
    }, [facility]);

    const defaultGoal = useMemo(() => {
        if (!facility) return "";

        if (facility.sport) {
            const cleanVenueName = facility.name.includes("@")
                ? facility.name.split("@").pop().trim()
                : facility.name;

            return `Help me book ${facility.sport} at ${cleanVenueName}`;
        }

        return `Help me book ${facility.name}`;
    }, [facility]);

    const selectedBackup = useMemo(() => {
        return (
            BACKUP_OPTIONS.find((option) => option.id === backupId) ||
            BACKUP_OPTIONS[0]
        );
    }, [backupId]);

    const openModal = () => {
        setIsOpen(true);
        setAgentPlan(null);
        setStatusMessage("");
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const createAgentPlan = async () => {
        if (!facility) return;

        setIsPlanning(true);
        setStatusMessage("");

        const preferences = {
            goal: defaultGoal,
            date,
            time,
            backupId,
            backupLabel: selectedBackup.label,
            backupText: selectedBackup.text,
        };

        try {
            const fallbackPlan = buildFallbackPlan(facility, preferences);

            setAgentPlan(fallbackPlan);
            setStatusMessage(
                "Agent plan prepared. You can now launch the browser agent."
            );
        } catch (err) {
            console.error(err);
            setStatusMessage("Could not prepare agent plan.");
        } finally {
            setIsPlanning(false);
        }
    };

    const launchAgent = () => {
        if (!facility || !agentPlan) return;

        const task = {
            taskId: `booking-${Date.now()}`,
            createdAt: new Date().toISOString(),
            source: "MyTampines Assistant",
            facility: {
                id: facility.id,
                name: facility.name,
                sport: facility.sport,
                websiteName: facility.websiteName,
                bookingLink: facility.bookingLink,
                address: facility.address,
                requirements: facility.requirements,
                cost: facility.cost,
                openingHours: facility.openingHours,
            },
            preferences: {
                goal: defaultGoal,
                date,
                time,
                backupId,
                backupLabel: selectedBackup.label,
                backupText: selectedBackup.text,
            },
            plan: agentPlan,
            safety: {
                allowLoginAutomation: false,
                allowOtpAutomation: false,
                allowPaymentAutomation: false,
                allowFinalSubmit: false,
                stopBeforeFinalConfirmation: true,
            },
        };

        window.postMessage(
            {
                type: "MTA_START_AGENTIC_BOOKING",
                task,
            },
            window.location.origin
        );

        setStatusMessage(
            "Agent task sent. If the Chrome extension is installed, it will open the official booking site."
        );
    };

    if (!canUseAgent) return null;

    const modal = (
        <div className="booking-agent-overlay">
            <div className="booking-agent-modal wide">
                <div className="booking-agent-modal-header">
                    <div>
                        <p className="booking-agent-eyebrow">Agentic Service Navigator</p>
                        <h2>Prepare booking with AI agent</h2>
                        <span>
                            Select your preferred slot and fallback behaviour. The agent will
                            open the official booking site and attempt safe non-sensitive
                            actions.
                        </span>
                    </div>

                    <button
                        type="button"
                        className="booking-agent-close-btn"
                        onClick={closeModal}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="booking-agent-modal-grid">
                    <section className="booking-agent-left-panel">
                        <div className="booking-agent-summary-card large">
                            <div className="booking-agent-summary-icon">
                                <Bot size={24} />
                            </div>

                            <div>
                                <strong>{facility.name}</strong>
                                <span>
                                    {facility.websiteName}
                                    {facility.sport ? ` • ${facility.sport}` : ""}
                                </span>
                            </div>
                        </div>

                        <div className="booking-agent-safety-box">
                            <ShieldCheck size={20} />
                            <p>
                                The agent can open the official site and help select
                                non-sensitive booking options. You must handle login, Singpass,
                                OTP, payment and final confirmation manually.
                            </p>
                        </div>

                        <div className="booking-agent-form">
                            <div className="booking-agent-readonly-goal">
                                <span>Booking goal</span>
                                <strong>{defaultGoal}</strong>
                            </div>

                            <div className="booking-agent-form-grid">
                                <label>
                                    <span>
                                        <CalendarDays size={15} />
                                        Preferred date
                                    </span>
                                    <select value={date} onChange={(e) => setDate(e.target.value)}>
                                        {DATE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span>
                                        <Clock size={15} />
                                        Preferred time
                                    </span>
                                    <select value={time} onChange={(e) => setTime(e.target.value)}>
                                        {TIME_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="booking-agent-backup-section">
                                <div className="booking-agent-backup-title">
                                    <RefreshCcw size={15} />
                                    If selected slot is taken
                                </div>

                                <div className="booking-agent-backup-grid">
                                    {BACKUP_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={
                                                backupId === option.id
                                                    ? "booking-agent-backup-chip active"
                                                    : "booking-agent-backup-chip"
                                            }
                                            onClick={() => setBackupId(option.id)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                <p className="booking-agent-backup-note">
                                    {selectedBackup.text}
                                </p>
                            </div>
                        </div>

                        <div className="booking-agent-actions-row">
                            <button
                                type="button"
                                className="booking-agent-secondary-btn"
                                onClick={createAgentPlan}
                                disabled={isPlanning}
                            >
                                <Sparkles size={17} />
                                {isPlanning ? "Planning..." : "Generate agent plan"}
                            </button>

                            <button
                                type="button"
                                className="booking-agent-primary-btn"
                                onClick={launchAgent}
                                disabled={!agentPlan}
                            >
                                <PlayCircle size={17} />
                                Launch browser agent
                            </button>
                        </div>

                        {statusMessage && (
                            <p className="booking-agent-status">
                                <CheckCircle2 size={16} />
                                {statusMessage}
                            </p>
                        )}

                        <a
                            href={facility.bookingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="booking-agent-manual-link"
                        >
                            Open official site manually
                            <ExternalLink size={15} />
                        </a>
                    </section>

                    <section className="booking-agent-right-panel">
                        {!agentPlan ? (
                            <div className="booking-agent-empty-plan">
                                <Bot size={36} />
                                <h3>No plan generated yet</h3>
                                <p>
                                    Choose a date, time and fallback option. Then generate the
                                    agent plan to show what the browser agent will attempt.
                                </p>
                            </div>
                        ) : (
                            <div className="booking-agent-plan">
                                <div className="booking-agent-plan-header">
                                    <div>
                                        <p>Generated action plan</p>
                                        <strong>{agentPlan.summary}</strong>
                                    </div>
                                    <span>{agentPlan.mode}</span>
                                </div>

                                <div className="booking-agent-warning">
                                    <AlertTriangle size={16} />
                                    {agentPlan.safetyBoundary}
                                </div>

                                <div className="booking-agent-slot-card">
                                    <div>
                                        <span>Preferred slot</span>
                                        <strong>
                                            {date} • {time}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>If unavailable</span>
                                        <strong>{selectedBackup.label}</strong>
                                    </div>
                                </div>

                                <div className="booking-agent-step-list">
                                    {agentPlan.steps.map((step, index) => (
                                        <div key={step.id} className="booking-agent-step">
                                            <span className="booking-agent-step-num">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <strong>{step.label}</strong>
                                                <p>{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                type="button"
                className="booking-agent-launch-btn"
                onClick={openModal}
            >
                <Bot size={16} />
                Start Agentic Booking
                <Sparkles size={15} />
            </button>

            {isOpen && createPortal(modal, document.body)}
        </>
    );
}