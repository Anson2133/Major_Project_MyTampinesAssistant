import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Inbox,
  Loader2,
  MessageSquare,
  Plus,
  Send,
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

export default function OpportunityInboxPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    userId,
    conversations,
    selectedConversation,
    messages,
    conversationsLoading,
    messagesLoading,
    sending,
    socketStatus,
    selectConversation,
    sendMessage,
  } = useOpportunityConnect();

  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  const selectedConversationId = searchParams.get("conversationId");

  const inboxTitle = selectedConversation
    ? selectedConversation.postTitle || selectedConversation.title
    : "Opportunity inbox";

  const statusText = socketStatus === "polling" ? "Auto-refresh" : "Inbox";

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
  }, [selectedConversation?.conversationId]);

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
          <button
            type="button"
            className="opp-icon-text-btn"
            onClick={() => navigate("/opportunity-connect")}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            type="button"
            className="opp-new-chat-btn"
            onClick={() => navigate("/opportunity-connect")}
          >
            <Plus size={18} />
            New message
          </button>
        </div>

        <div className="opp-inbox-sidebar-title">
          <span className="opp-section-kicker">Messages</span>
          <h2>Conversations</h2>
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
                selectedConversation?.conversationId ===
                conversation.conversationId;

              return (
                <button
                  type="button"
                  key={conversation.conversationId}
                  className={`opp-inbox-item ${isActive ? "active" : ""}`}
                  onClick={() => selectConversation(conversation)}
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
            <span className="opp-section-kicker">{statusText}</span>
            <h1>{inboxTitle}</h1>
            <p>
              {selectedConversation
                ? selectedConversation.businessName || "Opportunity poster"
                : "Select a conversation to start messaging."}
            </p>
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

          <p>Messages refresh automatically every few seconds.</p>
        </footer>
      </main>
    </div>
  );
}