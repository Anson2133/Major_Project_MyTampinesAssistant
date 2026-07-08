import { AlertTriangle, ExternalLink, Phone } from "lucide-react";

export default function HelpEmergencySection({ items, activeAudioId, onSpeak, isReadMode }) {
  const formatPhoneForSpeech = (phoneText) => {
    if (!phoneText) return "";
    if (/[a-zA-Z]/.test(phoneText.toString())) {
      return phoneText;
    }
    return phoneText.toString().split('').join(' ');
  };

  return (
    <section className="help-alert-section">
      <div className="help-section-header">
        <div>
          <span className="help-section-kicker">Fast access</span>
          <h2>Urgent & Important Help</h2>
        </div>
      </div>

      <div className="help-alert-grid">
        {items.map((item, index) => {
          const currentId = item.id || `emergency-item-${index}`;
          const isPlaying = activeAudioId === `emergency-${currentId}`;

          return (
            <article
              key={currentId}
              className="help-alert-card"
              onClick={(e) => {
                if (isReadMode) {
                  e.preventDefault();
                  const readablePhone = formatPhoneForSpeech(item.phone);

                  // Passes pure English to the audio engine
                  onSpeak(
                    `emergency-${currentId}`,
                    `${item.name}. ${item.description}. The phone number is ${readablePhone}.`
                  );
                }
              }}
              style={{
                border: isPlaying ? "2px solid #ef4444" : (isReadMode ? "2px dashed #ef4444" : ""),
                backgroundColor: isPlaying ? "#fee2e2" : "",
                cursor: isReadMode ? "pointer" : "auto",
                transition: "all 0.2s ease"
              }}
            >
              <div className="help-alert-icon">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="help-contact-row">
                  <Phone size={16} />
                  <strong>{item.phone}</strong>
                </div>

                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="help-inline-link"
                    style={{ pointerEvents: isReadMode ? "none" : "auto" }}
                  >
                    Open official website <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}