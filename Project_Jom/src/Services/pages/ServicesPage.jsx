import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";

import ServicesHero from "../components/ServiceHero";
import ServiceCategoryCard from "../components/CategoryCard";

import { serviceCategories } from "../data/servicesData";
import useServices from "../hooks/useServices";

import "../services.css";

const stopWords = [
  "help",
  "support",
  "service",
  "services",
  "scheme",
  "schemes",
  "assistance",
  "need",
  "want",
  "looking",
  "for",
  "with",
  "and",
  "the",
  "to",
];

const synonymMap = {
  money: ["financial", "cash", "income", "subsidy", "bills", "comcare"],
  cash: ["money", "financial", "income", "subsidy"],
  bills: ["bill", "utilities", "medical", "financial"],

  job: ["employment", "career", "skills", "training", "workforce"],
  work: ["employment", "job", "career", "skills"],
  training: ["skills", "career", "employment"],

  elderly: ["senior", "aged", "ageing", "mobility"],
  senior: ["elderly", "aged", "ageing", "mobility"],

  medical: ["healthcare", "hospital", "clinic", "medisave", "medishield", "chas"],
  health: ["medical", "healthcare", "hospital", "clinic"],
  healthcare: ["medical", "health", "hospital", "clinic"],

  school: ["education", "student", "bursary", "fees", "transport"],
  student: ["school", "education", "bursary", "fees"],
  education: ["school", "student", "bursary"],

  housing: ["rental", "flat", "hdb", "home"],
  hdb: ["housing", "rental", "flat", "home"],

  family: ["parent", "child", "children", "household"],
  child: ["children", "family", "student", "school"],

  disability: ["mobility", "assistive", "accessibility"],
  mobility: ["disability", "assistive", "elderly", "senior"],
};

function expandSearchQuery(query) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3)
    .filter((word) => !stopWords.includes(word));

  const expanded = words.flatMap((word) => [
    word,
    ...(synonymMap[word] || []),
  ]);

  return [...new Set(expanded)];
}

function getSearchableText(service) {
  return [
    service.serviceName,
    service.name,
    service.title,
    service.description,
    service.shortDescription,
    service.categoryId,
    service.category,
    service.serviceCategory,
    service.agency,
    service.websiteName,
    service.targetGroup,
    service.applicationMethod,
    ...(service.tags || []),
    ...(service.requiredDocuments || []),
    ...(service.applicationSteps || []),
    ...(service.eligibilitySummary || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function formatCategoryLabel(value) {
  if (!value) return "Service";

  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSafeCategoryId(service) {
  const possibleCategory =
    service.categoryId ||
    service.category ||
    service.serviceCategory;

  if (!possibleCategory) return "financial-support";

  const normalized = String(possibleCategory).toLowerCase();

  const matchedCategory = serviceCategories.find(
    (category) =>
      category.id === normalized ||
      category.title.toLowerCase() === normalized
  );

  return matchedCategory ? matchedCategory.id : normalized.replaceAll(" ", "-");
}

function ServicesPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [translatedQuery, setTranslatedQuery] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const { services = [], loading, error } = useServices();

  const handleCategoryClick = (category) => {
    navigate(`/services/${category.id}`);
  };

  // --- REAL SEALION API INTEGRATION ---
  useEffect(() => {
    const text = searchTerm.trim();
    const hasChineseChars = /[\u4e00-\u9fa5]/.test(text);

    if (!hasChineseChars) {
      setTranslatedQuery(text);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);

    // Debounce: Wait 800ms after the user STOPS typing before calling the API
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch("https://api.sea-lion.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Accept": "text/plain, application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SEALION_API_KEY}`
          },
          body: JSON.stringify({
            model: "aisingapore/Gemma-SEA-LION-v4-27B-IT",
            max_completion_tokens: 20,
            messages: [
              {
                role: "system",
                content: "You are a professional translator. Translate the user's Chinese text into simple English. Output ONLY the translated English text. Do not include any explanations, greetings, or punctuation."
              },
              {
                role: "user",
                content: text
              }
            ],
            temperature: 0.1
          })
        });

        if (!response.ok) {
          throw new Error(`API Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Extract the raw translated text
        const englishTranslation = data.choices[0].message.content.trim().toLowerCase();

        console.log("SeaLion translated:", text, "->", englishTranslation);
        setTranslatedQuery(englishTranslation);

      } catch (err) {
        console.error("Translation error:", err);
        // FIXED: If the API fails, fallback to the original text so we don't get confusing fake results
        setTranslatedQuery(text);
      } finally {
        setIsTranslating(false);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);


  const filteredServices = useMemo(() => {
    const query = translatedQuery.trim().toLowerCase();

    if (query.length < 2) return [];

    const searchWords = expandSearchQuery(query);

    if (searchWords.length === 0) return [];

    return services
      .map((service) => {
        const serviceName = String(
          service.serviceName || service.name || service.title || ""
        ).toLowerCase();

        const description = String(service.description || "").toLowerCase();
        const categoryId = String(service.categoryId || "").toLowerCase();
        const serviceCategory = String(service.serviceCategory || "").toLowerCase();
        const agency = String(service.agency || service.websiteName || "").toLowerCase();
        const searchableText = getSearchableText(service);

        let score = 0;

        if (serviceName.includes(query)) score += 90;
        if (categoryId.includes(query)) score += 45;
        if (serviceCategory.includes(query)) score += 40;
        if (agency.includes(query)) score += 25;
        if (description.includes(query)) score += 20;

        searchWords.forEach((word) => {
          if (serviceName.includes(word)) score += 35;
          if (categoryId.includes(word)) score += 25;
          if (serviceCategory.includes(word)) score += 25;
          if (agency.includes(word)) score += 12;
          if (description.includes(word)) score += 10;
          if (searchableText.includes(word)) score += 4;
        });

        return {
          ...service,
          searchScore: score,
        };
      })
      .filter((service) => service.searchScore >= 20)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 4);
  }, [translatedQuery, services]);

  const isSearchActive = searchTerm.trim().length >= 2 || /[\u4e00-\u9fa5]/.test(searchTerm);

  return (
    <div className="services-page">
      <ServicesHero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isSearchActive && (
        <section className="services-search-panel">
          <div className="services-search-panel-header">
            <div>
              <h2>Closest Matches</h2>
              <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                Showing up to 4 services related to <strong>"{searchTerm}"</strong>

                {isTranslating && (
                  <span style={{ color: '#d97706', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="loader" style={{ width: '12px', height: '12px', border: '2px solid #d97706', borderBottomColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                    Translating with SeaLion AI...
                  </span>
                )}
                {!isTranslating && translatedQuery !== searchTerm && (
                  <span style={{ color: '#16a34a', fontSize: '13px', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                    Translated as "{translatedQuery}"
                  </span>
                )}
              </p>
            </div>

            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setTranslatedQuery("");
              }}
            >
              Clear
            </button>
          </div>

          {loading && (
            <div className="services-search-state">
              Loading services...
            </div>
          )}

          {error && (
            <div className="services-search-state error">
              Failed to load services. Please try again later.
            </div>
          )}

          {!loading && !error && filteredServices.length === 0 && (
            <div className="services-empty-search">
              <h3>No close match found</h3>

              <p>
                Try simpler words like money, medical, job, elderly, school,
                housing, family, or disability.
              </p>

              <button onClick={() => navigate("/chat")}>
                Ask AI Assistant
              </button>
            </div>
          )}

          {!loading && !error && filteredServices.length > 0 && (
            <div className="services-results-list">
              {filteredServices.map((service) => {
                const categoryId = getSafeCategoryId(service);

                return (
                  <article
                    key={service.serviceId || service.id || service.serviceName}
                    className="service-result-card"
                  >
                    <div className="service-result-main">
                      <div className="service-result-icon">
                        {formatCategoryLabel(categoryId).charAt(0)}
                      </div>

                      <div className="service-result-content">
                        <div className="service-result-title-row">
                          <h3>
                            {service.serviceName || service.name || service.title}
                          </h3>

                          <span className="service-result-category">
                            {formatCategoryLabel(categoryId)}
                          </span>
                        </div>

                        <p>
                          {service.shortDescription ||
                            service.description ||
                            "No description available."}
                        </p>

                        <div className="service-result-details">
                          <span>
                            Agency:{" "}
                            <strong>
                              {service.agency ||
                                service.websiteName ||
                                "Not specified"}
                            </strong>
                          </span>

                          <span>
                            Next step:{" "}
                            <strong>Eligibility check</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="service-result-btn"
                      onClick={() =>
                        navigate(
                          `/services/${categoryId}?serviceId=${service.serviceId}&fromSearch=true`
                        )
                      }
                    >
                      Check Eligibility
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {searchTerm.trim().length === 1 && !/[\u4e00-\u9fa5]/.test(searchTerm) && (
        <p className="search-minimum-hint">
          Type at least 2 characters to search.
        </p>
      )}

      <section className="services-section">
        <div className="services-section-header">
          <h2>Browse by Category</h2>

          <p>
            Choose the type of support you need. We’ll help you check fit,
            prepare documents, and continue to the right next step.
          </p>
        </div>

        <div className="services-grid">
          {serviceCategories.map((category) => (
            <ServiceCategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        <div className="wizard-category-nudge">
          <p>Not sure which category fits your situation?</p>

          <button onClick={() => navigate("/life-situations")}>
            Tell us your situation instead →
          </button>
        </div>

      </section>

      <section className="services-help-section">
        <div className="services-section-header">
          <h2>Need help choosing?</h2>

          <p>
            Start with the AI Assistant or scan a document if you are not sure
            which category applies.
          </p>
        </div>

        <div className="services-help-grid">
          <article className="services-help-card services-help-chat-card">
            <div className="services-help-chat-content">
              <div className="services-help-card-top">
                <span className="services-help-pill">AI Assistant</span>

                <h3>Describe your situation</h3>

                <p>
                  Tell us what happened in your own words and we’ll suggest where
                  to start.
                </p>

                <div className="services-help-tags">
                  <span>Plain Language</span>
                  <span>Service Suggestions</span>
                  <span>Next Step</span>
                </div>
              </div>

              <button onClick={() => navigate("/chat")}>
                Start Chat
              </button>
            </div>

            <div className="services-help-chat-preview">
              <div className="services-mini-chat">
                <div className="services-mini-chat-header">
                  <div className="services-mini-chat-avatar">AI</div>

                  <div>
                    <strong>MyTampines Assistant</strong>
                    <span>Online</span>
                  </div>
                </div>

                <div className="services-mini-chat-body">
                  <div className="services-mini-message user">
                    I need help with a medical bill
                  </div>

                  <div className="services-mini-message bot">
                    I can help check likely support options and what documents to prepare.
                  </div>
                </div>

                <div className="services-mini-chat-input">
                  Ask about money, health, elderly care...
                </div>
              </div>
            </div>
          </article>

          <article className="services-help-card services-help-card-featured services-help-scanner-card">
            <div className="services-help-scanner-content">
              <div className="services-help-card-top">
                <span className="services-help-pill">Document Scanner</span>

                <h3>Upload a bill, letter, or screenshot</h3>

                <p>
                  Understand what the document means, check scam risk, and connect
                  to relevant support if needed.
                </p>

                <div className="services-help-tags">
                  <span>AI Summary</span>
                  <span>Scam Check</span>
                  <span>Service Matching</span>
                </div>
              </div>

              <button onClick={() => navigate("/document-scanner")}>
                Open Scanner
              </button>
            </div>

            <div className="services-help-scanner-visual">
              <div className="mini-scanner-window">
                <div className="scanner-red-line" />

                <div className="mini-scanner-document">
                  <div className="mini-scanner-header" />

                  <div className="mini-scanner-line short" />
                  <div className="mini-scanner-line" />
                  <div className="mini-scanner-line" />
                  <div className="mini-scanner-line medium" />

                  <div className="mini-scanner-alert">
                    Scam Risk Check Complete
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default ServicesPage;