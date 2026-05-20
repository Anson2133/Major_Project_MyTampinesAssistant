import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const SUGGESTED_SCENARIOS = [
  { emoji: "👶", textKey: "wizard.chips.texts.newBaby", labelKey: "wizard.chips.newBaby" },
  { emoji: "💼", textKey: "wizard.chips.texts.lostJob", labelKey: "wizard.chips.lostJob" },
  { emoji: "🧓", textKey: "wizard.chips.texts.eldercare", labelKey: "wizard.chips.eldercare" },
  { emoji: "🎂", textKey: "wizard.chips.texts.turning65", labelKey: "wizard.chips.turning65" },
  { emoji: "💸", textKey: "wizard.chips.texts.financialHelp", labelKey: "wizard.chips.financialHelp" },
  { emoji: "💍", textKey: "wizard.chips.texts.justMarried", labelKey: "wizard.chips.justMarried" },
  { emoji: "🎒", textKey: "wizard.chips.texts.school", labelKey: "wizard.chips.school" },
  { emoji: "♿", textKey: "wizard.chips.texts.disability", labelKey: "wizard.chips.disability" },
  { emoji: "🤰", textKey: "wizard.chips.texts.pregnancy", labelKey: "wizard.chips.pregnancy" },
  { emoji: "🔪", textKey: "wizard.chips.texts.retrenchment", labelKey: "wizard.chips.retrenchment" },
];

const LANG_TO_STT = { en: "en-SG", ms: "ms-MY", zh: "zh-CN", ta: "ta-IN" };

function StepProgress({ activeStep }) {
  const { t } = useTranslation();
  return (
    <div className="wi-progress">
      <div className={`wi-progress-step ${activeStep > 1 ? "done" : ""} ${activeStep === 1 ? "active" : ""}`}>
        <div className="wi-progress-circle">{activeStep > 1 ? "✓" : "1"}</div>
        <div className="wi-progress-label">{t("wizard.steps.yourSituation")}</div>
      </div>
      <div className={`wi-progress-line ${activeStep > 1 ? "done" : ""}`} />
      <div className={`wi-progress-step ${activeStep > 2 ? "done" : ""} ${activeStep === 2 ? "active" : ""}`}>
        <div className="wi-progress-circle">{activeStep > 2 ? "✓" : "2"}</div>
        <div className="wi-progress-label">{t("wizard.steps.matching")}</div>
      </div>
      <div className={`wi-progress-line ${activeStep > 2 ? "done" : ""}`} />
      <div className={`wi-progress-step ${activeStep === 3 ? "active" : ""}`}>
        <div className="wi-progress-circle">3</div>
        <div className="wi-progress-label">{t("wizard.steps.yourPlan")}</div>
      </div>
    </div>
  );
}

export { StepProgress };

export default function WizardIntro({ onSubmit, isLoading }) {
  const { t, i18n } = useTranslation();
  const [scenario, setScenario] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleSuggestion = (textKey) => setScenario(t(textKey));
  const handleSubmit = () => { if (scenario.trim()) onSubmit(scenario.trim()); };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported. Try Chrome."); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    const lang = i18n.language?.slice(0, 2) || "en";
    recognition.lang = LANG_TO_STT[lang] || "en-SG";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setScenario((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="wi-page">
      <StepProgress activeStep={1} />

      <div className="wi-hero-center">
        <h1 className="wi-heading">{t("wizard.title")}</h1>
        <p className="wi-subheading">{t("wizard.shortSubtitle")}</p>
      </div>

      <div className="wi-input-card">
        <div className="wi-input-header">
          <div>
            <p className="wi-input-kicker">{t("wizard.inputLabel")}</p>
            <h2>{t("wizard.inputQuestion")}</h2>
          </div>
        </div>

        <div className="wi-textarea-wrap">
          <textarea
            id="scenario-input"
            className="wi-search-input"
            placeholder={t("wizard.placeholder")}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="button"
            onClick={handleMic}
            disabled={isLoading}
            className={`wi-mic-btn wi-textarea-mic ${isListening ? "listening" : ""}`}
            aria-label={
              isListening
                ? t("wizard.voice.stopListening")
                : t("wizard.voice.startVoiceInput")
            }
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        <p className="wi-privacy-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          {t("wizard.privacy")}
        </p>
      </div>

      <button
        className="wi-main-generate-btn"
        onClick={handleSubmit}
        disabled={!scenario.trim() || isLoading}
      >
        {isLoading ? (
          <span className="wi-spinner" />
        ) : (
          <>{t("wizard.generateBtn")} →</>
        )}
      </button>

      <div className="wi-chips-section">
        <p className="wi-chips-label">{t("wizard.orPick")}</p>
        <div className="wi-chips">
          {SUGGESTED_SCENARIOS.map((s) => (
            <button
              key={s.labelKey}
              className={`wi-chip ${scenario === t(s.textKey) ? "active" : ""}`}
              onClick={() => handleSuggestion(s.textKey)}
              disabled={isLoading}
            >
              <span>{s.emoji}</span>
              <span>{t(s.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}