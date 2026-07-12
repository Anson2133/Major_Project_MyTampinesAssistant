import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  LoaderCircle,
  PlayCircle,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  UserRound,
  X,
} from "lucide-react";

const AGENT_API =
  import.meta.env.VITE_AGENT_API ||
  "http://localhost:4100";

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
];

const BACKUP_OPTIONS = [
  {
    id: "sameVenueLater",
    label: "Same venue, later",
    text:
      "Try the next later available slot at the same venue.",
  },
  {
    id: "sameVenueEarlier",
    label: "Same venue, earlier",
    text:
      "Try the nearest earlier available slot at the same venue.",
  },
  {
    id: "sameVenueAny",
    label: "Same venue, any time",
    text:
      "Find another available time at the same venue.",
  },
  {
    id: "askFirst",
    label: "Ask me first",
    text:
      "Pause before selecting an alternative.",
  },
];

const QUICK_MESSAGES = [
  "Book tomorrow at 12pm for 1 hour",
  "Use the next later slot if unavailable",
  "Book for myself",
  "Change duration to 2 hours",
];

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function todayString() {
  return getLocalDateString(new Date());
}

function cleanVenueName(facility) {
  if (!facility?.name) return "";

  if (facility.name.includes("@")) {
    return facility.name
      .split("@")
      .pop()
      .trim();
  }

  return facility.name;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not selected";
  }

  return new Date(
    `${dateValue}T00:00:00`
  ).toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDurationLabel(durationSlots) {
  return durationSlots === 2
    ? "2 hours"
    : "1 hour";
}

function getTimeOptionFromHour(
  rawHour,
  meridiem
) {
  let hour = Number(rawHour);

  if (
    Number.isNaN(hour) ||
    hour < 1 ||
    hour > 12
  ) {
    return null;
  }

  const suffix =
    String(meridiem).toLowerCase();

  const startLabel = `${hour}${suffix}`;

  let nextHour = hour + 1;
  let nextSuffix = suffix;

  if (hour === 11) {
    nextHour = 12;
  } else if (hour === 12) {
    nextHour = 1;
  }

  if (
    hour === 11 &&
    suffix === "am"
  ) {
    nextSuffix = "pm";
  }

  if (
    hour === 11 &&
    suffix === "pm"
  ) {
    nextSuffix = "am";
  }

  const option =
    `${startLabel} to ${nextHour}${nextSuffix}`;

  return TIME_OPTIONS.includes(option)
    ? option
    : null;
}

function parseDateFromMessage(message) {
  const value = message.toLowerCase();
  const today = new Date();

  if (value.includes("today")) {
    return todayString();
  }

  if (value.includes("tomorrow")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return getLocalDateString(
      tomorrow
    );
  }

  const isoMatch = value.match(
    /\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/
  );

  if (isoMatch) {
    const year = isoMatch[1];
    const month = String(
      Number(isoMatch[2])
    ).padStart(2, "0");
    const day = String(
      Number(isoMatch[3])
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const slashMatch = value.match(
    /\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/
  );

  if (slashMatch) {
    const day = String(
      Number(slashMatch[1])
    ).padStart(2, "0");
    const month = String(
      Number(slashMatch[2])
    ).padStart(2, "0");
    const year = slashMatch[3];

    return `${year}-${month}-${day}`;
  }

  const monthNames = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const monthPattern =
    Object.keys(monthNames).join("|");

  const writtenMatch = value.match(
    new RegExp(
      `\\b(\\d{1,2})\\s+(${monthPattern})(?:\\s+(20\\d{2}))?\\b`
    )
  );

  if (writtenMatch) {
    const day = Number(
      writtenMatch[1]
    );
    const month =
      monthNames[writtenMatch[2]];
    const year = writtenMatch[3]
      ? Number(writtenMatch[3])
      : today.getFullYear();

    return getLocalDateString(
      new Date(year, month, day)
    );
  }

  return null;
}

function parseTimeFromMessage(message) {
  const value = message.toLowerCase();

  const rangeMatch = value.match(
    /\b(\d{1,2})\s*(am|pm)\s*(?:to|-)\s*(\d{1,2})\s*(am|pm)\b/
  );

  if (rangeMatch) {
    const option =
      `${Number(rangeMatch[1])}${rangeMatch[2]} to ${Number(
        rangeMatch[3]
      )}${rangeMatch[4]}`;

    if (
      TIME_OPTIONS.includes(option)
    ) {
      return option;
    }
  }

  const singleMatch = value.match(
    /\b(\d{1,2})(?::00)?\s*(am|pm)\b/
  );

  if (singleMatch) {
    return getTimeOptionFromHour(
      singleMatch[1],
      singleMatch[2]
    );
  }

  return null;
}

function parseDurationFromMessage(
  message
) {
  const value = message.toLowerCase();

  const match = value.match(
    /\b([12])\s*(?:hour|hours|hr|hrs)\b/
  );

  if (match) {
    return Number(match[1]);
  }

  if (
    value.includes("two hours")
  ) {
    return 2;
  }

  if (
    value.includes("one hour")
  ) {
    return 1;
  }

  return null;
}

function parseBookingForFromMessage(
  message
) {
  const value = message.toLowerCase();

  if (
    value.includes(
      "on behalf of someone"
    ) ||
    value.includes(
      "for someone else"
    ) ||
    value.includes(
      "for another person"
    )
  ) {
    return "someoneElse";
  }

  if (
    value.includes("for myself") ||
    value.includes("for me")
  ) {
    return "myself";
  }

  return null;
}

function parseBackupFromMessage(
  message
) {
  const value = message.toLowerCase();

  if (
    value.includes("ask me first") ||
    value.includes(
      "do not choose automatically"
    )
  ) {
    return "askFirst";
  }

  if (
    value.includes("earlier")
  ) {
    return "sameVenueEarlier";
  }

  if (
    value.includes("any time") ||
    value.includes(
      "any available time"
    )
  ) {
    return "sameVenueAny";
  }

  if (
    value.includes("later") ||
    value.includes("next slot")
  ) {
    return "sameVenueLater";
  }

  return null;
}

function buildAssistantReply({
  changed,
  date,
  time,
  durationSlots,
  bookingFor,
  backupLabel,
}) {
  if (!changed.length) {
    return (
      "I could not identify a booking change. " +
      "Try saying: “Book on 13 July at 12pm for 2 hours.”"
    );
  }

  return [
    "Booking preferences updated:",
    `• Date: ${formatDate(date)}`,
    `• Start time: ${time}`,
    `• Duration: ${getDurationLabel(
      durationSlots
    )}`,
    `• Profile: ${
      bookingFor === "someoneElse"
        ? "Booking on behalf of someone"
        : "Booking for myself"
    }`,
    `• If unavailable: ${backupLabel}`,
  ].join("\n");
}

export default function AgenticBookingAssistant({
  facility,
}) {
  const [open, setOpen] =
    useState(false);

  const [date, setDate] =
    useState(todayString());

  const [time, setTime] =
    useState("6pm to 7pm");

  const [
    durationSlots,
    setDurationSlots,
  ] = useState(1);

  const [
    bookingFor,
    setBookingFor,
  ] = useState("myself");

  const [backupId, setBackupId] =
    useState("sameVenueLater");

  const [taskId, setTaskId] =
    useState("");

  const [
    agentStatus,
    setAgentStatus,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [chatInput, setChatInput] =
    useState("");

  const [
    reminderAdded,
    setReminderAdded,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState([
    {
      id: "welcome",
      sender: "assistant",
      text:
        "Tell me when you want to book. For example:\n\n“Book badminton on 13 July at 12pm for 2 hours. If unavailable, try the next later slot.”",
    },
  ]);

  const chatEndRef = useRef(null);

  const selectedBackup = useMemo(() => {
    return (
      BACKUP_OPTIONS.find(
        (item) =>
          item.id === backupId
      ) || BACKUP_OPTIONS[0]
    );
  }, [backupId]);

  const goal = useMemo(() => {
    if (!facility) return "";

    if (facility.sport) {
      return `Help me book ${
        facility.sport
      } at ${cleanVenueName(
        facility
      )}`;
    }

    return `Help me book ${facility.name}`;
  }, [facility]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!taskId) {
      return undefined;
    }

    const timer = window.setInterval(
      async () => {
        try {
          const response = await fetch(
            `${AGENT_API}/api/agent/${taskId}`
          );

          if (!response.ok) {
            return;
          }

          const data =
            await response.json();

          setAgentStatus(data);

          if (
            [
              "ready_for_review",
              "paused",
            ].includes(data.status) &&
            !reminderAdded
          ) {
            setMessages(
              (current) => [
                ...current,
                {
                  id: `reminder-${Date.now()}`,
                  sender: "assistant",
                  type: "reminder",
                  text:
                    "The automated booking preparation is complete. Please log in to OnePA manually with Singpass before completing the booking. Review the selected date, time and profile before final confirmation or payment.",
                },
              ]
            );

            setReminderAdded(true);
          }

          if (
            [
              "stopped",
              "error",
            ].includes(data.status)
          ) {
            window.clearInterval(
              timer
            );
          }
        } catch (pollError) {
          console.error(pollError);
        }
      },
      1200
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    taskId,
    reminderAdded,
  ]);

  function processMessage(message) {
    const detectedDate =
      parseDateFromMessage(message);

    const detectedTime =
      parseTimeFromMessage(message);

    const detectedDuration =
      parseDurationFromMessage(
        message
      );

    const detectedProfile =
      parseBookingForFromMessage(
        message
      );

    const detectedBackup =
      parseBackupFromMessage(
        message
      );

    let nextDate = date;
    let nextTime = time;
    let nextDuration =
      durationSlots;
    let nextBookingFor =
      bookingFor;
    let nextBackupId =
      backupId;

    const changed = [];

    if (detectedDate) {
      nextDate = detectedDate;
      setDate(detectedDate);
      changed.push("date");
    }

    if (detectedTime) {
      nextTime = detectedTime;
      setTime(detectedTime);
      changed.push("time");
    }

    if (detectedDuration) {
      nextDuration =
        detectedDuration;

      setDurationSlots(
        detectedDuration
      );

      changed.push("duration");
    }

    if (detectedProfile) {
      nextBookingFor =
        detectedProfile;

      setBookingFor(
        detectedProfile
      );

      changed.push("profile");
    }

    if (detectedBackup) {
      nextBackupId =
        detectedBackup;

      setBackupId(
        detectedBackup
      );

      changed.push("fallback");
    }

    const nextBackup =
      BACKUP_OPTIONS.find(
        (item) =>
          item.id ===
          nextBackupId
      ) || BACKUP_OPTIONS[0];

    return buildAssistantReply({
      changed,
      date: nextDate,
      time: nextTime,
      durationSlots:
        nextDuration,
      bookingFor:
        nextBookingFor,
      backupLabel:
        nextBackup.label,
    });
  }

  function sendChatMessage(
    providedMessage
  ) {
    const message = String(
      providedMessage ??
        chatInput
    ).trim();

    if (!message) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: message,
    };

    const reply =
      processMessage(message);

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      sender: "assistant",
      text: reply,
    };

    setMessages(
      (current) => [
        ...current,
        userMessage,
        assistantMessage,
      ]
    );

    setChatInput("");
  }

  function handleChatKeyDown(
    event
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendChatMessage();
    }
  }

  const createTaskPayload =
    () => ({
      facility: {
        id: facility.id,
        name: facility.name,
        cleanVenueName:
          cleanVenueName(facility),
        websiteName:
          facility.websiteName,
        bookingLink:
          facility.bookingLink,
        sport: facility.sport,
        address: facility.address,
      },

      preferences: {
        goal,
        date,
        time,
        durationSlots,
        durationLabel:
          getDurationLabel(
            durationSlots
          ),
        bookingFor,
        bookingForLabel:
          bookingFor ===
          "someoneElse"
            ? "Booking on behalf of someone"
            : "Booking for myself",
        loginFirst: false,
        backupId,
        backupLabel:
          selectedBackup.label,
        backupText:
          selectedBackup.text,
      },

      safety: {
        allowLoginAutomation:
          false,
        allowOtpAutomation:
          false,
        allowPaymentAutomation:
          false,
        allowFinalSubmit:
          false,
        stopBeforeFinalConfirmation:
          true,
      },
    });

  const startAgent = async () => {
    setLoading(true);
    setError("");
    setAgentStatus(null);
    setReminderAdded(false);

    setMessages(
      (current) => [
        ...current,
        {
          id: `launch-${Date.now()}`,
          sender: "assistant",
          text:
            "I am opening OnePA and preparing the requested booking. I will stop before login, payment or final confirmation.",
        },
      ]
    );

    try {
      const response = await fetch(
        `${AGENT_API}/api/agent/start`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            createTaskPayload()
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not start agent."
        );
      }

      setTaskId(data.taskId);
      setAgentStatus(data);
    } catch (startError) {
      setError(
        startError.message ||
          "Could not connect to the Playwright backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const continueAgent =
    async () => {
      if (!taskId) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${AGENT_API}/api/agent/${taskId}/continue`,
          {
            method: "POST",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not continue agent."
          );
        }

        setAgentStatus(data);
      } catch (continueError) {
        setError(
          continueError.message ||
            "Could not continue agent."
        );
      } finally {
        setLoading(false);
      }
    };

  const stopAgent = async () => {
    if (!taskId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${AGENT_API}/api/agent/${taskId}/stop`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not stop agent."
        );
      }

      setAgentStatus(data);
    } catch (stopError) {
      setError(
        stopError.message ||
          "Could not stop agent."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTaskId("");
    setAgentStatus(null);
    setError("");
    setReminderAdded(false);

    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: "assistant",
        text:
          "Ready for another booking. Tell me the preferred date, time, duration and fallback option.",
      },
    ]);
  };

  if (!facility?.bookingLink) {
    return null;
  }

  const modal = (
    <div className="booking-agent-overlay">
      <div className="booking-agent-modal booking-agent-chat-modal">
        <header className="booking-agent-modal-header">
          <div>
            <p className="booking-agent-eyebrow">
              Agentic Service Navigator
            </p>

            <h2>
              Book through conversation
            </h2>

            <span>
              Describe your preferred booking and
              the assistant will prepare the details
              for Playwright.
            </span>
          </div>

          <button
            type="button"
            className="booking-agent-close-btn"
            onClick={() =>
              setOpen(false)
            }
            aria-label="Close booking assistant"
          >
            <X size={20} />
          </button>
        </header>

        <div className="booking-agent-chat-layout">
          <section className="booking-agent-chat-column">
            <div className="booking-agent-chat-heading">
              <div className="booking-agent-chat-avatar">
                <Bot size={20} />
              </div>

              <div>
                <strong>
                  Booking Assistant
                </strong>

                <span>
                  {facility.name}
                </span>
              </div>
            </div>

            <div className="booking-agent-chat-messages">
              {messages.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`booking-agent-message-row ${message.sender}`}
                  >
                    {message.sender ===
                      "assistant" && (
                      <div className="booking-agent-message-avatar">
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`booking-agent-message ${
                        message.type ===
                        "reminder"
                          ? "reminder"
                          : ""
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                )
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="booking-agent-quick-prompts">
              {QUICK_MESSAGES.map(
                (message) => (
                  <button
                    type="button"
                    key={message}
                    onClick={() =>
                      sendChatMessage(
                        message
                      )
                    }
                  >
                    {message}
                  </button>
                )
              )}
            </div>

            <div className="booking-agent-chat-composer">
              <textarea
                value={chatInput}
                onChange={(event) =>
                  setChatInput(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleChatKeyDown
                }
                placeholder="Example: Book on 13 July at 12pm for 2 hours. Try a later slot if unavailable."
                rows={2}
              />

              <button
                type="button"
                onClick={() =>
                  sendChatMessage()
                }
                disabled={
                  !chatInput.trim()
                }
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </section>

          <section className="booking-agent-booking-column">
            <div className="booking-agent-conversation-summary">
              <div className="booking-agent-summary-heading">
                <Sparkles size={17} />

                <div>
                  <strong>
                    Current booking request
                  </strong>

                  <span>
                    Updated from the conversation
                  </span>
                </div>
              </div>

              <div className="booking-agent-conversation-grid">
                <div>
                  <CalendarDays size={16} />
                  <span>Date</span>
                  <strong>
                    {formatDate(date)}
                  </strong>
                </div>

                <div>
                  <Clock size={16} />
                  <span>
                    Start time
                  </span>
                  <strong>{time}</strong>
                </div>

                <div>
                  <Clock size={16} />
                  <span>Duration</span>
                  <strong>
                    {getDurationLabel(
                      durationSlots
                    )}
                  </strong>
                </div>

                <div>
                  <UserRound size={16} />
                  <span>Profile</span>
                  <strong>
                    {bookingFor ===
                    "someoneElse"
                      ? "On behalf of someone"
                      : "For myself"}
                  </strong>
                </div>

                <div className="wide">
                  <RefreshCcw size={16} />
                  <span>
                    If unavailable
                  </span>
                  <strong>
                    {
                      selectedBackup.label
                    }
                  </strong>
                </div>
              </div>
            </div>

            <div className="booking-agent-chat-safety">
              <ShieldCheck size={18} />

              <p>
                Playwright can prepare the date,
                time, duration and booking profile.
                You must log in to OnePA manually
                before completing the booking.
              </p>
            </div>

            <div className="booking-agent-conversation-actions">
              <button
                type="button"
                className="booking-agent-primary-btn"
                disabled={loading}
                onClick={startAgent}
              >
                {loading ? (
                  <LoaderCircle
                    className="booking-agent-spin"
                    size={17}
                  />
                ) : (
                  <PlayCircle size={17} />
                )}

                Launch Playwright agent
              </button>

              {taskId && (
                <button
                  type="button"
                  className="booking-agent-secondary-btn"
                  disabled={loading}
                  onClick={
                    continueAgent
                  }
                >
                  <Sparkles size={17} />
                  Continue agent
                </button>
              )}

              {taskId && (
                <button
                  type="button"
                  className="booking-agent-secondary-btn"
                  disabled={loading}
                  onClick={stopAgent}
                >
                  <Square size={15} />
                  Stop agent
                </button>
              )}
            </div>

            {agentStatus && (
              <div className="booking-agent-conversation-status">
                <span>
                  {agentStatus.status}
                </span>

                <h3>
                  {agentStatus.stage}
                </h3>

                <p>
                  {agentStatus.message}
                </p>

                {agentStatus.requiresUserAction && (
                  <div className="booking-agent-login-reminder">
                    <CheckCircle2 size={18} />

                    <div>
                      <strong>
                        Manual login reminder
                      </strong>

                      <p>
                        Log in to OnePA manually
                        with Singpass, review the
                        prepared booking, and then
                        complete confirmation or
                        payment yourself.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {agentStatus?.logs?.length >
              0 && (
              <div className="booking-agent-compact-logs">
                <strong>
                  Recent actions
                </strong>

                {agentStatus.logs
                  .slice(0, 4)
                  .map(
                    (item, index) => (
                      <div
                        key={`${item.time}-${index}`}
                      >
                        <span>
                          {new Date(
                            item.time
                          ).toLocaleTimeString()}
                        </span>

                        <p>
                          {item.message}
                        </p>
                      </div>
                    )
                  )}
              </div>
            )}

            {error && (
              <div className="booking-agent-error">
                {error}
              </div>
            )}

            <div className="booking-agent-conversation-footer">
              {taskId && (
                <button
                  type="button"
                  className="booking-agent-reset-btn"
                  onClick={reset}
                >
                  Start another task
                </button>
              )}

              <button
                type="button"
                className="booking-agent-manual-link clean"
                onClick={() =>
                  window.open(
                    facility.bookingLink,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Open OnePA manually
                <ExternalLink size={15} />
              </button>
            </div>
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
        onClick={() =>
          setOpen(true)
        }
      >
        <Bot size={16} />
        Start Agentic Booking
        <Sparkles size={15} />
      </button>

      {open &&
        createPortal(
          modal,
          document.body
        )}
    </>
  );
}