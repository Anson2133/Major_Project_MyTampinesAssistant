import { AlertTriangle, ExternalLink, Phone } from "lucide-react"; // Removed Volume icons

export default function HelpEmergencySection({ items, activeAudioId, onSpeak, isReadMode }) {
  // Helper to read letters normally, but space out digits for natural reading
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
              // THE TECHNICAL FLEX: Intercepting the click based on global state
              onClick={(e) => {
                if (isReadMode) {
                  e.preventDefault(); // Prevents accidental navigation if they click the website link while in read mode
                  const readablePhone = formatPhoneForSpeech(item.phone);
                  onSpeak(
                    `${item.name}. ${item.description}. The phone number is ${readablePhone}.`,
                    `emergency-${currentId}`
                  );
                }
              }}
              // Give visual feedback so the user knows the card is ready to be clicked
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
                    // Ensure links don't trigger anything weird during read mode
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