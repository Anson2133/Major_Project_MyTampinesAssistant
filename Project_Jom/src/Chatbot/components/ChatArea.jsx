import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

function cleanBotText(text) {
  if (!text) return "";
  return text
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatMessageWithLinks(text) {
  if (!text) return null;

  const urlRegex =
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(sg|com|org|net)[^\s]*)/g;

  return text.split("\n").map((line, lineIndex) => (
    <span key={lineIndex}>
      {line.split(urlRegex).map((part, index) => {
        if (!part) return null;
        const isUrl = part.match(urlRegex);
        if (!isUrl) return part;
        const href =
          part.startsWith("http://") || part.startsWith("https://")
            ? part
            : `https://${part}`;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {part}
          </a>
        );
      })}
      {lineIndex < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

function FileCard({ attachment }) {
  if (!attachment) return null;
  const isPdf = attachment.type === "application/pdf";
  return (
    <div className="sent-file-card">
      <div className={`sent-file-icon ${isPdf ? "pdf-file" : "image-file"}`}>
        {isPdf ? "PDF" : "IMG"}
      </div>
      <div className="sent-file-info">
        <p>{attachment.name}</p>
        <span>{attachment.type}</span>
      </div>
    </div>
  );
}

const TTS_API_URL = "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/tts";

function SpeakButton({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef(null);
  const { i18n } = useTranslation();

  const getCurrentLanguage = () => {
    const lang = i18n.language || "en";
    if (lang.startsWith("zh")) return "zh";
    if (lang.startsWith("ms")) return "ms";
    if (lang.startsWith("ta")) return "ta";
    return "en";
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteChars = atob(base64);
    const byteArr = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteArr[i] = byteChars.charCodeAt(i);
    }
    return new Blob([byteArr], { type: mimeType });
  };

  const handleSpeak = async () => {
    // If already speaking, stop
    if (isSpeaking) {
      audioRef.current?.pause();
      setIsSpeaking(false);
      return;
    }

    // If loading, ignore extra clicks
    if (isLoadingAudio) return;

    try {
      setIsLoadingAudio(true);

      const languageKey = getCurrentLanguage();

      const response = await fetch(TTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: languageKey }),
      });

      if (!response.ok) throw new Error("Google TTS failed");

      const data = await response.json();
      const audioBlob = base64ToBlob(data.audioBase64, "audio/mpeg");
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoadingAudio(false);
        setIsSpeaking(true);
      };
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
      };

      await audio.play();
    } catch (err) {
      console.error("Google TTS error:", err);
      setIsSpeaking(false);
      setIsLoadingAudio(false);
    }
  };

  const isActive = isSpeaking || isLoadingAudio;

  return (
    <button
      className={`speak-btn ${isSpeaking ? "speaking" : ""} ${isLoadingAudio ? "loading" : ""}`}
      type="button"
      onClick={handleSpeak}
      title={isLoadingAudio ? "Loading..." : isSpeaking ? "Stop" : "Listen"}
      aria-label={isLoadingAudio ? "Loading audio" : isSpeaking ? "Stop reading message" : "Read message aloud"}
    >
      {isLoadingAudio ? (
        // Spinner while fetching from Lambda
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"
          style={{ animation: "spin 1s linear infinite" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
        </svg>
      ) : isSpeaking ? (
        // Stop icon while playing
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 10h6v4H9z" />
        </svg>
      ) : (
        // Speaker icon at rest
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15.536 8.464a5 5 0 010 7.072" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M11 5L6 9H2v6h4l5 4V5z" />
        </svg>
      )}
    </button>
  );
}

export default function ChatArea({
  messages,
  chatTitle,
  userInitials,
  aiInitials,
  isLoading,
}) {
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      <div className="chat-header">
        <div>
          <p className="chat-eyebrow">{t("chat.currentConversation")}</p>
          <h2 className="chat-title">{chatTitle}</h2>
        </div>
        <div className="chat-header-pill">{t("chat.personalisedSupport")}</div>
      </div>

      <main className="chat-history">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const cleanedContent = cleanBotText(msg.content);

          return (
            <div
              key={index}
              className={`message-wrapper ${isUser ? "user-message" : "ai-message"}`}
            >
              {!isUser && <div className="avatar ai-avatar">{aiInitials}</div>}

              <div className={`bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
                {msg.attachment && <FileCard attachment={msg.attachment} />}

                {msg.content && (
                  <div className="message-text">
                    {isUser
                      ? formatMessageWithLinks(msg.content)
                      : formatMessageWithLinks(cleanedContent)}
                  </div>
                )}

                {!isUser && msg.relatedServices?.length > 0 && (
                  <div className="chat-service-actions">
                    {msg.relatedServices.map((service) => (
                      <button
                        key={service.serviceId || service.id || service.title}
                        className="chat-service-button"
                        type="button"
                        onClick={() => {
                          if (service.linkType === "external") {
                            window.open(service.url, "_blank", "noopener,noreferrer");
                          } else {
                            navigate(service.url);
                          }
                        }}
                      >
                        View {service.title}
                      </button>
                    ))}
                  </div>
                )}

                {!isUser && msg.content && (
                  <div className="speak-btn-wrapper">
                    <SpeakButton text={cleanBotText(msg.content)} />
                  </div>
                )}
              </div>

              {isUser && (
                <div className="avatar user-avatar">{userInitials}</div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="message-wrapper ai-message">
            <div className="avatar ai-avatar">{aiInitials}</div>
            <div className="bubble ai-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>
    </>
  );
}