import { ChevronDown } from "lucide-react";

export default function HelpFaq({ faqs, openFaqIndex, toggleFaq }) {
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

          return (
            <article
              key={faq.question}
              className={`help-faq-item ${isOpen ? "open" : ""}`}
            >
              <button
                type="button"
                className="help-faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>

                <ChevronDown
                  size={22}
                  className={`help-chevron ${isOpen ? "open" : ""}`}
                />
              </button>

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