import { ChevronDown } from "lucide-react"; // Removed volume icons

export default function HelpFaq({ faqs, openFaqIndex, toggleFaq, activeAudioId, onSpeak, isReadMode }) {
  return (
    <section className="help-faq-section">
      <div className="help-section-header">
        <div>
          <span className="help-section-kicker">FAQ</span>
          <h2>Frequently asked questions</h2>
          <p>
            These answers explain how the platform works, when to use each
            feature, and how to understand recommendations safely.
          </p>
        </div>
      </div>

      <div className="help-faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          const isPlaying = activeAudioId === `faq-${index}`;

          return (
            <article
              key={faq.question}
              className={`help-faq-item ${isOpen ? "open" : ""}`}
              style={{ 
                backgroundColor: isPlaying ? "#f0f9ff" : "",
                border: isReadMode ? "2px dashed #3b82f6" : "",
                transition: "all 0.2s ease"
              }}
            >
              <div
                className="help-faq-question"
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  cursor: "pointer" 
                }}
                onClick={() => {
                  // If in Read Mode, speak the text. Otherwise, toggle the accordion normally.
                  if (isReadMode) {
                    onSpeak(`Question: ${faq.question}. Answer: ${faq.answer}`, `faq-${index}`);
                  } else {
                    toggleFaq(index);
                  }
                }}
              >
                <span style={{ flex: 1, paddingRight: "16px" }}>{faq.question}</span>
                  
                <ChevronDown
                  size={22}
                  className={`help-chevron ${isOpen ? "open" : ""}`}
                />
              </div>

              {isOpen && (
                <div className="help-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}