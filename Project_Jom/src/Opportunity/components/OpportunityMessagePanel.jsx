import { useEffect, useRef, useState } from "react";
import {
  Inbox,
  Loader2,
  MessageSquare,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function OpportunityMessagePanel({
  userId,
  conversations,
  selectedConversation,
  messages,
  conversationsLoading,
  messagesLoading,
  sending,
  socketStatus,
  typingText,
  onTyping,
  onSelectConversation,
  onSendMessage,
}) {
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setDraft("");
  }, [selectedConversation?.conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typingText]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedConversation?.conversationId || !draft.trim()) return;

    const text = draft;
    setDraft("");

    await onSendMessage(selectedConversation.conversationId, text);
  };

  const handleDraftChange = (event) => {
    setDraft(event.target.value);

    if (selectedConversation?.conversationId) {
      onTyping?.(selectedConversation.conversationId);
    }
  };

  const isLive = socketStatus === "connected";

  return (
    <aside className="opp-message-panel">
      <div className="opp-message-header">
        <div>
          <span className="opp-section-kicker">Messages</span>
          <h2>Opportunity inbox</h2>
        </div>

        <span className={`opp-live-pill ${isLive ? "live" : "offline"}`}>
          {isLive ? <Wifi size={15} /> : <WifiOff size={15} />}
          {isLive ? "Live" : "Offline"}
        </span>
      </div>

      <div className="opp-conversation-list">
        {conversationsLoading ? (
          <div className="opp-mini-state">
            <Loader2 size={18} className="spin-icon" />
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="opp-empty-mini">
            <Inbox size={22} />
            <strong>No conversations yet</strong>
            <p>Start by messaging an opportunity poster.</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              type="button"
              key={conversation.conversationId}
              className={`opp-conversation-item ${
                selectedConversation?.conversationId ===
                conversation.conversationId
                  ? "active"
                  : ""
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <strong>{conversation.postTitle || conversation.title}</strong>
              <span>{conversation.businessName || "Opportunity poster"}</span>
              <p>{conversation.lastMessage || "Conversation started"}</p>
            </button>
          ))
        )}
      </div>

      <div className="opp-chat-box">
        {selectedConversation ? (
          <>
            <div className="opp-chat-title">
              <strong>
                {selectedConversation.postTitle || selectedConversation.title}
              </strong>
              <span>
                {selectedConversation.businessName || "Opportunity poster"}
              </span>
            </div>

            <div className="opp-chat-messages">
              {messagesLoading ? (
                <div className="opp-mini-state">
                  <Loader2 size={18} className="spin-icon" />
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="opp-empty-mini">
                  <MessageSquare size={22} />
                  <strong>No messages yet</strong>
                  <p>Send the first message below.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.senderId === userId;

                  return (
                    <div
                      key={
                        message.messageId ||
                        `${message.conversationId}-${message.createdAt}`
                      }
                      className={`opp-message-bubble ${
                        isOwn ? "own" : ""
                      } ${message.pending ? "pending" : ""} ${
                        message.failed ? "failed" : ""
                      }`}
                    >
                      <span>
                        {message.senderName || "User"}
                        {message.pending ? " · sending" : ""}
                        {message.failed ? " · failed" : ""}
                      </span>
                      <p>{message.message}</p>
                    </div>
                  );
                })
              )}

              {typingText && (
                <div className="opp-typing-indicator">{typingText}</div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="opp-chat-input" onSubmit={handleSubmit}>
              <input
                value={draft}
                onChange={handleDraftChange}
                placeholder="Type a message..."
              />

              <button type="submit" disabled={sending || !draft.trim()}>
                {sending ? (
                  <Loader2 size={17} className="spin-icon" />
                ) : (
                  <Send size={17} />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="opp-empty-chat">
            <MessageSquare size={34} />
            <h3>Select a conversation</h3>
            <p>
              Messages help residents and opportunity posters clarify next steps
              safely within the platform.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}