import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import ServiceStepper from "../components/ServiceJourneyStepper";
import ServiceCard from "../components/RecommendationCard";
import ServiceLocationMap from "../components/ServiceLocationMap";

import { supportNeeds } from "../data/servicesData";
import useServices from "../hooks/useServices";
import useServiceMatch from "../hooks/useServiceMatch";
import useGeneratePdfGuide from "../hooks/useGeneratePdfGuide";
import useSendGuideEmail from "../hooks/useSendGuideEmail";
import useGenerateServiceGuide from "../hooks/useGenerateServiceGuide";

import "../services.css";

function ServiceJourneyPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();

  const serviceIdFromUrl = searchParams.get("serviceId");
  const fromChat = searchParams.get("fromChat") === "true";
  const fromSearch = searchParams.get("fromSearch") === "true";

  const isDirectEntry = Boolean(serviceIdFromUrl || fromChat || fromSearch);

  const { services, loading } = useServices();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [eligibilityAnswers, setEligibilityAnswers] = useState({});
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const [pdfEmail, setPdfEmail] = useState("");
  const [matchProgress, setMatchProgress] = useState(0);

  const [dynamicExtraQuestions, setDynamicExtraQuestions] = useState([]);
  const [questionsLoadedForServiceId, setQuestionsLoadedForServiceId] =
    useState(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [autoCheckedServiceId, setAutoCheckedServiceId] = useState(null);
  const [autoCheckingEligibility, setAutoCheckingEligibility] = useState(false);

  const cachedProfile = JSON.parse(
    localStorage.getItem("cachedProfile") || "{}"
  );

  const needs = supportNeeds[categoryId] || [];

  const {
    matches,
    loading: matchingLoading,
    error: matchingError,
    matchServices,
    checkEligibility,
    generateQuestions,
  } = useServiceMatch();

  const { generatingPdf, pdfError, pdfResult, generatePdfGuide } =
    useGeneratePdfGuide();

  const { sendingEmail, emailError, emailSent, sendGuideEmail } =
    useSendGuideEmail();

  const {
    generatingServiceGuide,
    serviceGuideError,
    serviceGuide,
    generateServiceGuide,
    resetServiceGuide,
  } = useGenerateServiceGuide();

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const goBack = () => {
    if (isDirectEntry) return;
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetEligibilityState = () => {
    setEligibilityAnswers({});
    setEligibilityResult(null);
    setDynamicExtraQuestions([]);
    setQuestionsLoadedForServiceId(null);
    setQuestionsLoading(false);
    setQuestionError("");
    setAutoCheckedServiceId(null);
    setAutoCheckingEligibility(false);
    resetServiceGuide();
  };

  useEffect(() => {
    if (!serviceIdFromUrl || loading || selectedService) return;

    const exactService = services.find(
      (service) => String(service.serviceId) === String(serviceIdFromUrl)
    );

    if (!exactService) return;

    setSelectedService(exactService);

    setEligibilityAnswers({});
    setEligibilityResult(null);
    setDynamicExtraQuestions([]);
    setQuestionsLoadedForServiceId(null);
    setQuestionsLoading(false);
    setQuestionError("");
    setAutoCheckedServiceId(null);
    setAutoCheckingEligibility(false);
    resetServiceGuide();

    setCurrentStep(4);
  }, [serviceIdFromUrl, loading, services, selectedService, resetServiceGuide]);

  useEffect(() => {
    if (currentStep !== 4) return;
    if (!selectedService?.serviceId) return;

    const serviceId = String(selectedService.serviceId);

    if (questionsLoadedForServiceId === serviceId) return;

    let active = true;

    const runQuestionGeneration = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionError("");
        setDynamicExtraQuestions([]);
        setEligibilityAnswers({});

        const questions = await generateQuestions({
          serviceId: selectedService.serviceId,
          selectedNeedId: selectedNeed?.id,
        });

        if (!active) return;

        const safeQuestions = Array.isArray(questions) ? questions : [];

        console.log("[ServiceJourneyPage] questions to render", safeQuestions);

        setDynamicExtraQuestions(safeQuestions);
        setQuestionsLoadedForServiceId(serviceId);
      } catch (error) {
        console.error("Failed to prepare eligibility questions", error);

        if (!active) return;

        setDynamicExtraQuestions([]);
        setQuestionsLoadedForServiceId(serviceId);
        setQuestionError(
          error.message ||
          "Unable to prepare eligibility questions. You can still continue."
        );
      } finally {
        if (active) {
          setQuestionsLoading(false);
        }
      }
    };

    runQuestionGeneration();

    return () => {
      active = false;
    };

  }, [
    currentStep,
    selectedService?.serviceId,
    selectedNeed?.id,
    questionsLoadedForServiceId,
  ]);

  const handleEligibilityAnswer = (questionKey, value) => {
    setEligibilityAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));

    setEligibilityResult(null);
  };

  const getQuestionKey = (question, index) =>
    typeof question === "string"
      ? question
      : question.id || question.label || `question-${index}`;

  const questionsReady =
    selectedService?.serviceId &&
    questionsLoadedForServiceId === String(selectedService.serviceId) &&
    !questionsLoading;

  const extraQuestions = questionsReady ? dynamicExtraQuestions : [];

  const answeredCount = extraQuestions.filter((question, index) => {
    const key = getQuestionKey(question, index);
    return String(eligibilityAnswers[key] || "").trim();
  }).length;

  const allQuestionsAnswered =
    extraQuestions.length === 0 || answeredCount === extraQuestions.length;

  const hasNoExtraQuestions = questionsReady && extraQuestions.length === 0;

  const showRecheckButton = questionsReady && extraQuestions.length > 0;

  const showContinueButton =
    hasNoExtraQuestions || Boolean(eligibilityResult) || Boolean(questionError);
  useEffect(() => {
    if (!isDirectEntry) return;
    if (currentStep !== 4) return;
    if (!selectedService?.serviceId) return;
    if (!questionsReady && !questionError) return;

    const serviceId = String(selectedService.serviceId);

    if (autoCheckedServiceId === serviceId) return;

    const runInitialEligibilityCheck = async () => {
      try {
        setAutoCheckingEligibility(true);

        const result = await checkEligibility({
          serviceId: selectedService.serviceId,
          selectedNeedId: selectedNeed?.id,
          answers: {},
        });

        console.log("[ServiceJourneyPage] initial eligibility result", result);

        setAutoCheckedServiceId(serviceId);

        if (result) {
          setEligibilityResult(result);
          resetServiceGuide();
        }
      } catch (error) {
        console.error("Initial eligibility check failed", error);
        setAutoCheckedServiceId(serviceId);
      } finally {
        setAutoCheckingEligibility(false);
      }
    };

    runInitialEligibilityCheck();
  }, [
    isDirectEntry,
    currentStep,
    selectedService?.serviceId,
    selectedNeed?.id,
    questionsReady,
    questionError,
    autoCheckedServiceId,
  ]);

  useEffect(() => {
    if (currentStep !== 5) return;
    if (!selectedService) return;
    if (serviceGuide) return;
    if (generatingServiceGuide) return;

    generateServiceGuide({
      service: selectedService,
      selectedNeed,
      eligibilityResult,
      profile: cachedProfile,
    });
  }, [
    currentStep,
    selectedService,
    selectedNeed,
    eligibilityResult,
    cachedProfile,
    serviceGuide,
    generatingServiceGuide,
    generateServiceGuide,
  ]);



  const eligibilityStatus = eligibilityResult
    ? eligibilityResult.eligibilityStatus
    : autoCheckingEligibility
      ? "Checking initial eligibility"
      : questionsLoading
        ? "Checking what information is needed"
        : hasNoExtraQuestions
          ? "Ready to continue"
          : extraQuestions.length > 0 && allQuestionsAnswered
            ? "Ready to recheck eligibility"
            : "Needs more information";

  const eligibilitySummaryText = eligibilityResult?.note
    ? eligibilityResult.note
    : autoCheckingEligibility
      ? "Checking your saved profile to estimate your initial eligibility score."
      : questionsLoading
        ? "Checking your saved profile and preparing only the questions still needed."
        : questionError
          ? "We could not prepare extra questions right now, but you can continue to view the service guide."
          : hasNoExtraQuestions
            ? "No additional questions are required based on your saved profile. You may continue to the service guide."
            : selectedService?.aiReason ||
            "This service may be suitable based on your profile and selected need.";

  const currentMissingInfo =
    questionsLoading || hasNoExtraQuestions
      ? []
      : eligibilityResult?.missingInfo ||
      (extraQuestions.length > 0 ? selectedService?.missingInfo || [] : []);

  const usefulEligibilityReasons = (
    eligibilityResult?.reasons ||
    selectedService?.reasons ||
    []
  ).filter((reason) => {
    const text = String(reason || "").toLowerCase();

    return reason && !text.includes("this service is in your selected category");
  });

  const startMatchProgress = () => {
    setMatchProgress(10);

    const interval = setInterval(() => {
      setMatchProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 350);

    return interval;
  };

  return (
    <div className="service-journey-page">
      <ServiceStepper currentStep={currentStep} />

      {currentStep === 1 && (
        <section className="journey-card">
          <h1>What type of support do you need?</h1>

          <div className="journey-options-grid">
            {needs.map((need) => (
              <button
                key={need.id}
                className={`journey-option-card ${selectedNeed?.id === need.id ? "selected" : ""
                  }`}
                onClick={() => setSelectedNeed(need)}
              >
                <h3>{need.title}</h3>
                <p>{need.description}</p>
              </button>
            ))}
          </div>

          <button
            className="journey-primary-btn"
            onClick={goNext}
            disabled={!selectedNeed}
          >
            Continue
          </button>
        </section>
      )}

      {currentStep === 2 && (
        <section className="journey-card">
          <h1>Check Profile Match</h1>

          <p className="journey-subtitle">
            We use your saved service-matching profile to estimate relevant
            services.
          </p>

          <div className="profile-match-box">
            <div>
              <span>Age</span>
              <strong>{cachedProfile.age || "-"}</strong>
            </div>

            <div>
              <span>Residential Status</span>
              <strong>{cachedProfile.residentialStatus || "-"}</strong>
            </div>

            <div>
              <span>Housing Type</span>
              <strong>{cachedProfile.housingType || "-"}</strong>
            </div>

            <div>
              <span>Employment Status</span>
              <strong>{cachedProfile.employmentStatus || "-"}</strong>
            </div>

            <div>
              <span>Income Band</span>
              <strong>{cachedProfile.incomeBand || "-"}</strong>
            </div>

            <div>
              <span>Selected Need</span>
              <strong>{selectedNeed?.title || "-"}</strong>
            </div>
          </div>

          <div className="journey-actions">
            {!isDirectEntry && (
              <button className="journey-secondary-btn" onClick={goBack}>
                Back
              </button>
            )}

            <button
              className="journey-primary-btn"
              disabled={matchingLoading}
              onClick={async () => {
                const progressInterval = startMatchProgress();

                const result = await matchServices({
                  categoryId,
                  selectedNeedId: selectedNeed?.id,
                });

                clearInterval(progressInterval);
                setMatchProgress(100);

                setTimeout(() => {
                  setMatchProgress(0);

                  if (result) {
                    setCurrentStep(3);
                  }
                }, 400);
              }}
            >
              {matchingLoading
                ? "Finding Services..."
                : "Find Recommended Services"}
            </button>
          </div>

          {matchingLoading && (
            <div className="match-loading-box">
              <div className="match-loading-top">
                <span>Finding recommended services...</span>
                <strong>{matchProgress}%</strong>
              </div>

              <div className="match-progress-track">
                <div
                  className="match-progress-fill"
                  style={{ width: `${matchProgress}%` }}
                />
              </div>

              <p>
                Checking your profile, selected need, service eligibility rules,
                and AI review.
              </p>
            </div>
          )}
        </section>
      )}

      {currentStep === 3 && (
        <section className="journey-card">
          <h1>Recommended Services</h1>

          <p className="journey-subtitle">
            Based on your selected need and saved profile information.
          </p>

          {matchingLoading ? (
            <p>Matching services...</p>
          ) : matchingError ? (
            <p>{matchingError}</p>
          ) : matches.length === 0 ? (
            <p>No recommended services found.</p>
          ) : (
            <div className="recommended-services-list">
              {matches.map((service) => (
                <ServiceCard
                  key={service.serviceId}
                  service={service}
                  onViewGuidance={() => {
                    setSelectedService(service);
                    resetEligibilityState();
                    setCurrentStep(4);
                  }}
                />
              ))}
            </div>
          )}

          <div className="journey-actions">
            {!isDirectEntry && (
              <button className="journey-secondary-btn" onClick={goBack}>
                Back
              </button>
            )}
          </div>
        </section>
      )}

      {currentStep === 4 && selectedService && (
        <section className="journey-card">
          <h1>Check If You May Be Eligible</h1>

          <p className="journey-subtitle">
            We check your saved profile first. Extra questions are only shown
            when this service needs missing information.
          </p>

          {(questionsLoading || autoCheckingEligibility) && (
            <div className="eligibility-auto-check-box">
              Checking your saved profile, estimating eligibility, and preparing any
              extra questions needed...
            </div>
          )}

          <div className="eligibility-summary-box">
            <h2>{eligibilityStatus}</h2>
            <p>{eligibilitySummaryText}</p>

            {eligibilityResult && (
              <p>
                <strong>Initial eligibility score:</strong>{" "}
                {eligibilityResult.eligibilityScore ?? eligibilityResult.matchScore ?? 0}%
              </p>
            )}
          </div>

          {questionError && (
            <div className="eligibility-note-panel warning">
              <h2>Eligibility check note</h2>
              <ul>
                <li>{questionError}</li>
              </ul>
            </div>
          )}

          {currentMissingInfo.length > 0 && (
            <div className="eligibility-note-panel warning">
              <h2>Things to Confirm</h2>

              <ul>
                {currentMissingInfo.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </div>
          )}



          {questionsLoading ? (
            <div className="eligibility-note-panel">
              <h2>Preparing eligibility check</h2>
              <ul>
                <li>Checking your saved profile first.</li>
                <li>Only missing follow-up questions will be shown.</li>
              </ul>
            </div>
          ) : extraQuestions.length > 0 ? (
            <>
              <h2>Extra Questions</h2>

              <div className="eligibility-questions">
                {extraQuestions.map((question, index) => {
                  const questionText =
                    typeof question === "string"
                      ? question
                      : question.label ||
                      question.reason ||
                      question.id ||
                      `Question ${index + 1}`;

                  const questionKey = getQuestionKey(question, index);

                  return (
                    <div key={questionKey} className="eligibility-question-card">
                      <label>{questionText}</label>

                      {typeof question !== "string" && question.reason && (
                        <p className="journey-subtitle">{question.reason}</p>
                      )}

                      {typeof question !== "string" &&
                        question.type === "select" &&
                        Array.isArray(question.options) ? (
                        <select
                          className="eligibility-input"
                          value={eligibilityAnswers[questionKey] || ""}
                          onChange={(e) =>
                            handleEligibilityAnswer(questionKey, e.target.value)
                          }
                        >
                          <option value="">Select an answer</option>

                          {question.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={
                            typeof question !== "string" &&
                              question.type === "number"
                              ? "number"
                              : "text"
                          }
                          placeholder="Enter your answer"
                          className="eligibility-input"
                          value={eligibilityAnswers[questionKey] || ""}
                          onChange={(e) =>
                            handleEligibilityAnswer(questionKey, e.target.value)
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : questionsReady || questionError ? (
            <div className="eligibility-note-panel">
              <h2>No extra questions needed</h2>
              <ul>
                <li>
                  Your saved profile already has enough information to continue
                  to the service guide.
                </li>
                <li>
                  You can still review official eligibility requirements on the
                  agency website before applying.
                </li>
              </ul>
            </div>
          ) : null}

          {eligibilityResult && usefulEligibilityReasons.length > 0 && (
            <div className="eligibility-note-panel">
              <h2>Why this estimate?</h2>

              <ul>
                {usefulEligibilityReasons.slice(0, 4).map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="journey-actions">
            {!isDirectEntry && (
              <button className="journey-secondary-btn" onClick={goBack}>
                Back
              </button>
            )}

            {showRecheckButton && (
              <button
                className="journey-primary-btn"
                disabled={!allQuestionsAnswered || matchingLoading}
                onClick={async () => {
                  const result = await checkEligibility({
                    serviceId: selectedService.serviceId,
                    selectedNeedId: selectedNeed?.id,
                    answers: eligibilityAnswers,
                  });

                  if (result) {
                    setEligibilityResult(result);
                    resetServiceGuide();
                  }
                }}
              >
                {matchingLoading ? "Rechecking..." : "Recheck Eligibility"}
              </button>
            )}

            {showContinueButton && (
              <button className="journey-primary-btn" onClick={goNext}>
                Continue
              </button>
            )}
          </div>
        </section>
      )}

      {currentStep === 5 && selectedService && (
        <section className="journey-card service-guide-card">
          <div className="service-guide-header">
            <div>
              <span className="service-guide-pill">AI Service Guide</span>

              <h1>{selectedService.serviceName}</h1>

              <p className="journey-subtitle">
                This guide explains the service in simple terms before you
                prepare your documents.
              </p>
            </div>
          </div>

          {generatingServiceGuide && (
            <div className="service-guide-loading">
              <strong>Generating service guide...</strong>

              <p>
                Organising the service description, eligibility result,
                documents, and application steps.
              </p>
            </div>
          )}

          {serviceGuideError && (
            <div className="service-guide-error">
              <strong>Unable to generate AI guide</strong>

              <p>{serviceGuideError}</p>

              <p>You can still continue to the documents step.</p>
            </div>
          )}

          {!generatingServiceGuide && serviceGuide && (
            <div className="service-guide-layout">
              <div className="service-guide-section full">
                <h2>What this service is about</h2>
                <p>{serviceGuide.overview}</p>
              </div>

              <div className="service-guide-section">
                <h2>Who this may help</h2>

                <ul>
                  {(serviceGuide.whoThisHelps || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="service-guide-section">
                <h2>What support it may provide</h2>

                <ul>
                  {(serviceGuide.possibleBenefits || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="service-guide-section full">
                <h2>Why this may fit your situation</h2>
                <p>{serviceGuide.whyThisMayFitYou}</p>
              </div>

              <div className="service-guide-section">
                <h2>Before you apply</h2>

                <ul>
                  {(serviceGuide.beforeYouApply || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="service-guide-section">
                <h2>Important note</h2>
                <p>{serviceGuide.importantNote}</p>
              </div>
            </div>
          )}

          {!generatingServiceGuide && !serviceGuide && (
            <div className="service-guide-fallback">
              <h2>{selectedService.serviceName}</h2>

              <p>
                {selectedService.description ||
                  "No detailed service description is available."}
              </p>
            </div>
          )}

          <ServiceLocationMap
            locations={selectedService.applicationLocations || []}
          />

          <div className="journey-actions">
            {!isDirectEntry && (
              <button className="journey-secondary-btn" onClick={goBack}>
                Back
              </button>
            )}

            <button
              className="journey-secondary-btn"
              disabled={generatingServiceGuide}
              onClick={() =>
                generateServiceGuide({
                  service: selectedService,
                  selectedNeed,
                  eligibilityResult,
                  profile: cachedProfile,
                })
              }
            >
              Regenerate Guide
            </button>

            <button className="journey-primary-btn" onClick={goNext}>
              Continue to Documents
            </button>
          </div>
        </section>
      )}

      {currentStep === 6 && selectedService && (
        <section className="journey-card">
          <h1>Required Documents</h1>

          {fromChat && (
            <p className="journey-subtitle">
              This service was opened from your chatbot recommendation.
            </p>
          )}

          {fromSearch && (
            <p className="journey-subtitle">
              This service was opened from your search results.
            </p>
          )}

          <p className="journey-subtitle">{selectedService.serviceName}</p>

          <div className="guidance-list">
            {(selectedService.requiredDocuments || []).length > 0 ? (
              selectedService.requiredDocuments.map((doc) => (
                <div key={doc} className="guidance-list-item">
                  {doc}
                </div>
              ))
            ) : (
              <p>No specific documents listed in the dataset.</p>
            )}
          </div>

          <h2>Application Steps</h2>

          <div className="guidance-list">
            {(selectedService.applicationSteps || []).map((step, index) => (
              <div key={index} className="guidance-list-item">
                {index + 1}. {step}
              </div>
            ))}
          </div>

          <div className="journey-actions">
            {!isDirectEntry && (
              <button className="journey-secondary-btn" onClick={goBack}>
                Back
              </button>
            )}

            <button className="journey-primary-btn" onClick={goNext}>
              Continue
            </button>
          </div>
        </section>
      )}

      {currentStep === 7 && selectedService && (
        <section className="journey-card">
          <h1>Continue to Official Site</h1>

          <p className="journey-subtitle">
            Use the official link below to apply or continue reading more
            details.
          </p>

          <div className="official-site-box">
            <h2>{selectedService.serviceName}</h2>

            <p>{selectedService.description}</p>

            <a
              href={selectedService.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="official-link-btn"
            >
              Open Official Website
            </a>

            <div className="pdf-guide-box">
              <button
                className="pdf-primary-btn"
                type="button"
                disabled={generatingPdf}
                onClick={() =>
                  generatePdfGuide({
                    residentName:
                      cachedProfile.displayName || cachedProfile.name || "",
                    email: "",
                    service: selectedService,
                    selectedNeed,
                    eligibilityResult,
                    serviceGuide,
                  })
                }
              >
                {generatingPdf ? "Generating PDF..." : "Generate PDF Guide"}
              </button>

              {pdfResult && (
                <div className="pdf-result-box">
                  <div>
                    <strong>PDF guide generated</strong>
                    <p>Reference: {pdfResult.referenceNo}</p>
                  </div>

                  <a
                    href={pdfResult.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-download-link"
                  >
                    Open PDF
                  </a>
                </div>
              )}

              {pdfResult && (
                <div className="email-guide-box">
                  <label>Send this guide to your email</label>

                  <div className="email-send-row">
                    <input
                      type="email"
                      className="email-input"
                      placeholder="Enter email address"
                      value={pdfEmail}
                      onChange={(e) => setPdfEmail(e.target.value)}
                    />

                    <button
                      className="email-send-btn"
                      type="button"
                      disabled={
                        sendingEmail || !pdfEmail || !pdfResult?.downloadUrl
                      }
                      onClick={() =>
                        sendGuideEmail({
                          email: pdfEmail,
                          downloadUrl: pdfResult.downloadUrl,
                          referenceNo: pdfResult.referenceNo,
                          serviceName: selectedService.serviceName,
                          residentName:
                            cachedProfile.displayName ||
                            cachedProfile.name ||
                            "",
                        })
                      }
                    >
                      {sendingEmail ? "Sending..." : "Send Email"}
                    </button>

                    {emailSent && (
                      <p className="success-text">Email sent successfully.</p>
                    )}

                    {emailError && <p className="error-text">{emailError}</p>}
                  </div>
                </div>
              )}

              {pdfError && <p className="error-text">{pdfError}</p>}
            </div>
          </div>

          <div className="journey-actions">
            {!isDirectEntry && (
              <button className="journey-secondary-btn" onClick={goBack}>
                Back
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ServiceJourneyPage;