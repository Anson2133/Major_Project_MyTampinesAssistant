import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Inbox,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";

import "../opportunity-connect.css";
import useOpportunityConnect from "../hooks/useOpportunityConnect";

function formatTime(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getRoleLabel(role) {
  if (role === "provider") return "Provider view";
  if (role === "admin") return "Admin view";
  return "Resident view";
}

function getReplyChips(role) {
  if (role === "provider") {
    return [
      {
        label: "Acknowledge interest",
        instruction:
          "Reply as the provider. Thank the resident for their interest and keep the reply warm and professional.",
      },
      {
        label: "Ask screening question",
        instruction:
          "Reply as the provider. Ask one useful screening question about availability, experience, or comfort with the role.",
      },
      {
        label: "Suggest timing",
        instruction:
          "Reply as the provider. Suggest a suitable next timing or ask the resident to confirm availability.",
      },
      {
        label: "Close politely",
        instruction:
          "Reply as the provider. Politely explain that the opportunity may no longer be available and thank the resident.",
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        label: "Clarify issue",
        instruction:
          "Reply as platform admin. Ask for the key details needed to understand the issue safely.",
      },
      {
        label: "Safety reminder",
        instruction:
          "Reply as platform admin. Give a short safety reminder without blaming either party.",
      },
      {
        label: "Next safe step",
        instruction:
          "Reply as platform admin. Suggest the next safe step and avoid making promises.",
      },
    ];
  }

  return [
    {
      label: "Ask availability",
      instruction:
        "Reply as the resident. Ask whether the opportunity is still available and keep it polite.",
    },
    {
      label: "Ask timing/location",
      instruction:
        "Reply as the resident. Ask about the exact timing and location, especially where to report.",
    },
    {
      label: "Ask pay/requirements",
      instruction:
        "Reply as the resident. Ask about pay or allowance, requirements, and whether experience is needed.",
    },
    {
      label: "Follow up politely",
      instruction:
        "Reply as the resident. Politely follow up because there has not been enough confirmation yet.",
    },
  ];
}

export default function OpportunityInboxPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    userId,
    userRole,
    conversations,
    selectedConversation,
    messages,
    conversationsLoading,
    messagesLoading,
    sending,
    aiLoading,
    selectConversation,
    sendMessage,
    draftReplySuggestion,
  } = useOpportunityConnect();

  const [draft, setDraft] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");
  const [aiNextSteps, setAiNextSteps] = useState([]);
  const [aiQuestions, setAiQuestions] = useState([]);

  const messagesEndRef = useRef(null);

  const selectedConversationId = searchParams.get("conversationId");

  const activeConversationId =
    selectedConversation?.conversationId || selectedConversationId;

  const inboxTitle = selectedConversation
    ? selectedConversation.postTitle || selectedConversation.title
    : "Opportunity inbox";

  const replyChips = useMemo(() => getReplyChips(userRole), [userRole]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.lastMessageAt || a.createdAt || 0);
      const bTime = new Date(b.updatedAt || b.lastMessageAt || b.createdAt || 0);
      return bTime - aTime;
    });
  }, [conversations]);

  useEffect(() => {
    if (!selectedConversationId || conversations.length === 0) return;
    if (selectedConversation?.conversationId === selectedConversationId) return;

    const found = conversations.find(
      (conversation) => conversation.conversationId === selectedConversationId
    );

    if (found) {
      selectConversation(found);
    }
  }, [
    selectedConversationId,
    conversations,
    selectedConversation?.conversationId,
    selectConversation,
  ]);

  useEffect(() => {
    if (!selectedConversation && sortedConversations.length > 0) {
      selectConversation(sortedConversations[0]);
    }
  }, [selectedConversation, sortedConversations, selectConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, selectedConversation?.conversationId]);

  useEffect(() => {
    setDraft("");
    setAiNextSteps([]);
    setAiQuestions([]);
    setCustomOpen(false);
    setCustomInstruction("");
  }, [selectedConversation?.conversationId]);

  const handleSelectConversation = async (conversation) => {
    await selectConversation(conversation);

    navigate(
      `/opportunity-connect/inbox?conversationId=${encodeURIComponent(
        conversation.conversationId
      )}`,
      { replace: true }
    );
  };

  const handleSuggestReply = async (instruction) => {
    if (!selectedConversation?.conversationId) return;

    const result = await draftReplySuggestion(
      selectedConversation,
      messages,
      instruction
    );

    if (!result) return;

    if (result.suggestedReply) {
      setDraft(result.suggestedReply);
    }

    setAiNextSteps(Array.isArray(result.nextSteps) ? result.nextSteps : []);
    setAiQuestions(
      Array.isArray(result.unansweredQuestions)
        ? result.unansweredQuestions
        : []
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedConversation?.conversationId || !draft.trim()) return;

    const text = draft.trim();
    setDraft("");

    await sendMessage(selectedConversation.conversationId, text);
  };

  return (
    <div className="opp-inbox-layout">
      <aside className="opp-inbox-sidebar">
        <div className="opp-inbox-sidebar-header">
          <div className="opp-inbox-sidebar-heading">
            <div>
              <span>Opportunity</span>
              <h2>Inbox</h2>
            </div>

            <button
              type="button"
              className="opp-icon-text-btn"
              onClick={() => navigate("/opportunity-connect")}
              aria-label="Back to opportunities"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          <button
            type="button"
            className="opp-new-chat-btn"
            onClick={() => navigate("/opportunity-connect")}
          >
            <Plus size={18} />
            New message
          </button>
        </div>

        <div className="opp-inbox-list">
          {conversationsLoading ? (
            <div className="opp-mini-state">
              <Loader2 size={18} className="spin-icon" />
              Loading...
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="opp-empty-mini">
              <Inbox size={24} />
              <strong>No conversations</strong>
              <p>Start one from an opportunity card.</p>
            </div>
          ) : (
            sortedConversations.map((conversation) => {
              const isActive =
                activeConversationId === conversation.conversationId;

              return (
                <button
                  type="button"
                  key={conversation.conversationId}
                  className={`opp-inbox-item ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <strong>
                    {conversation.postTitle ||
                      conversation.title ||
                      "Opportunity chat"}
                  </strong>

                  <span>
                    {conversation.businessName || "Opportunity poster"}
                  </span>

                  <p>{conversation.lastMessage || "Conversation started"}</p>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <main className="opp-inbox-main">
        <header className="opp-inbox-header">
          <div>
            <span className="opp-section-kicker">Messages</span>
            <h1>{inboxTitle}</h1>
            <p>
              {selectedConversation
                ? selectedConversation.businessName || "Opportunity poster"
                : "Select a conversation to start messaging."}
            </p>

            {selectedConversation?.verificationStatus === "verified" && (
              <div className="opp-badge-row">
                <span className="opp-status-badge verified-business">
                  Verified Business
                </span>
              </div>
            )}
          </div>
        </header>

        <section className="opp-inbox-messages">
          {!selectedConversation ? (
            <div className="opp-empty-chat large">
              <MessageSquare size={42} />
              <h3>Select a conversation</h3>
              <p>Your messages will appear here.</p>
            </div>
          ) : messagesLoading ? (
            <div className="opp-state-card">
              <Loader2 size={20} className="spin-icon" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="opp-empty-chat large">
              <MessageSquare size={42} />
              <h3>No messages yet</h3>
              <p>Send the first message below.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn =
                message.senderId === userId || message.senderUserId === userId;

              return (
                <div
                  key={
                    message.messageId ||
                    `${message.conversationId}-${message.createdAt}`
                  }
                  className={`opp-chat-row ${isOwn ? "own" : ""}`}
                >
                  <div className="opp-chat-bubble">
                    <div className="opp-chat-meta">
                      <strong>{message.senderName || "User"}</strong>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>

                    <p>{message.message}</p>

                    {message.pending && (
                      <small className="opp-message-status">Sending...</small>
                    )}

                    {message.failed && (
                      <small className="opp-message-status failed">
                        Failed to send
                      </small>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </section>

        <footer className="opp-inbox-input-footer">
          {selectedConversation && (
            <div className="opp-ai-chip-panel">
              <div className="opp-ai-chip-header">
                <div>
                  <span>AI reply assistant</span>
                  <strong>
                    {userRole === "provider"
                      ? "Choose a provider reply"
                      : userRole === "admin"
                        ? "Choose an admin reply"
                        : "Choose a resident reply"}
                  </strong>
                </div>

                <Sparkles size={18} />
              </div>

              <div className="opp-ai-chip-row">
                {replyChips.map((chip) => (
                  <button
                    type="button"
                    key={chip.label}
                    disabled={aiLoading}
                    onClick={() => handleSuggestReply(chip.instruction)}
                  >
                    {aiLoading ? "Writing..." : chip.label}
                  </button>
                ))}

                <button
                  type="button"
                  className="secondary"
                  onClick={() => setCustomOpen((prev) => !prev)}
                >
                  Custom
                </button>
              </div>

              {customOpen && (
                <div className="opp-ai-custom-box">
                  <textarea
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    rows={2}
                    placeholder="Example: Ask if Saturday morning is available and whether I need to bring anything."
                  />

                  <button
                    type="button"
                    className="opp-ai-button"
                    disabled={aiLoading || !customInstruction.trim()}
                    onClick={() => handleSuggestReply(customInstruction)}
                  >
                    {aiLoading ? "Writing..." : "Use custom instruction"}
                  </button>
                </div>
              )}

              {(aiNextSteps.length > 0 || aiQuestions.length > 0) && (
                <div className="opp-ai-mini-insights">
                  {aiNextSteps.length > 0 && (
                    <span>Next: {aiNextSteps.slice(0, 2).join(" · ")}</span>
                  )}

                  {aiQuestions.length > 0 && (
                    <span>
                      Missing: {aiQuestions.slice(0, 2).join(" · ")}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <form className="opp-inbox-input-box" onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                selectedConversation
                  ? "Type a message..."
                  : "Select a conversation first"
              }
              disabled={!selectedConversation}
            />

            <button
              type="submit"
              disabled={sending || !draft.trim() || !selectedConversation}
            >
              {sending ? (
                <Loader2 size={18} className="spin-icon" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>

          <p>
            AI suggestions are drafts only. Please check details before sending.
          </p>
        </footer>
      </main>
    </div>
  );
}