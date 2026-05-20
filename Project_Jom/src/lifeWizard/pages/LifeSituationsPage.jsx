import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import WizardIntro, { StepProgress } from "../components/WizardIntro";
import ActionPlan from "../components/ActionPlan";
import "../lifeSituations.css";

const API_BASE = "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com";

export default function LifeSituationsPage() {
  const { t, i18n } = useTranslation();
  const [stage, setStage] = useState("intro");
  const [plan, setPlan] = useState(null);
  const [scenario, setScenario] = useState("");
  const [error, setError] = useState("");
  const [submittedLanguage, setSubmittedLanguage] = useState(null);

  useEffect(() => {
    if (
      stage === "plan" &&
      submittedLanguage &&
      i18n.language !== submittedLanguage &&
      scenario.trim()
    ) {
      handleSubmit(scenario);
    }
  }, [i18n.language]);

  const getProfile = () => {
    try {
      const raw = localStorage.getItem("cachedProfile") || localStorage.getItem("profile");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  const handleSubmit = async (inputScenario) => {
    setScenario(inputScenario);
    setStage("loading");
    setError("");
    setSubmittedLanguage(i18n.language);
    const profile = getProfile();
    const userId = localStorage.getItem("userId") || "anonymous";
    const language = i18n.language || "en";
    try {
      const res = await fetch(`${API_BASE}/life-situations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: inputScenario, profile, userId, language }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.plan?.error) throw new Error(data.plan.error);
      setPlan(data.plan);
      setStage("plan");
    } catch (err) {
      console.error("Wizard error:", err);
      setError(t("wizard.errors.generateFailed"));
      setStage("intro");
    }
  };

  const handleReset = () => {
    setStage("intro"); setPlan(null); setScenario(""); setError(""); setSubmittedLanguage(null);
  };

  return (
    <div className="life-wizard-page">
      <div className="wizard-container">

        {stage === "intro" && (
          <WizardIntro onSubmit={handleSubmit} isLoading={false} />
        )}

        {stage === "loading" && (
          <div className="wizard-loading-outer">
            <StepProgress activeStep={2} />
            <div className="wizard-loading">
              <h2>{t("wizard.loading.title")}</h2>
              <p>{t("wizard.loading.subtitle")}</p>

              <div className="wizard-loading-bar-wrap">
                <div className="wizard-loading-bar" />
              </div>

              <div className="loading-steps">
                <div className="loading-step done">
                  <div className="loading-step-icon">✓</div>
                  <div className="loading-step-text">
                    <div className="loading-step-title">{t("wizard.loading.step1")}</div>
                    <div className="loading-step-sub">{t("wizard.loading.sub1")}</div>
                  </div>
                  <span className="loading-step-badge">{t("wizard.loading.done")}</span>
                </div>
                <div className="loading-step active">
                  <div className="loading-step-icon loading-spinner-icon" />
                  <div className="loading-step-text">
                    <div className="loading-step-title">{t("wizard.loading.step2")}</div>
                    <div className="loading-step-sub">{t("wizard.loading.sub2")}</div>
                  </div>
                  <span className="loading-step-badge">{t("wizard.loading.inProgress")}</span>
                </div>
                <div className="loading-step pending">
                  <div className="loading-step-icon">📍</div>
                  <div className="loading-step-text">
                    <div className="loading-step-title">{t("wizard.loading.step3")}</div>
                    <div className="loading-step-sub">{t("wizard.loading.sub3")}</div>
                  </div>
                  <span className="loading-step-badge">{t("wizard.loading.pending")}</span>
                </div>
                <div className="loading-step pending">
                  <div className="loading-step-icon">⚡</div>
                  <div className="loading-step-text">
                    <div className="loading-step-title">{t("wizard.loading.step4")}</div>
                    <div className="loading-step-sub">{t("wizard.loading.sub4")}</div>
                  </div>
                  <span className="loading-step-badge">{t("wizard.loading.pending")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "plan" && plan && (
          <ActionPlan
            plan={plan}
            scenario={scenario}
            onReset={handleReset}
          />
        )}

        {error && <div className="wizard-error">⚠ {error}</div>}
      </div>
    </div>
  );
}