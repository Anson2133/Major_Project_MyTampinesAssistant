import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Circle } from "lucide-react";

const CATEGORY_COLORS = {
  financial: { bg: "#FEF3C7", text: "#92400E", icon: "💰" },
  healthcare: { bg: "#DCFCE7", text: "#166534", icon: "🏥" },
  housing: { bg: "#DBEAFE", text: "#1E40AF", icon: "🏠" },
  employment: { bg: "#EDE9FE", text: "#6B21A8", icon: "💼" },
  education: { bg: "#FCE7F3", text: "#9D174D", icon: "📚" },
  caregiving: { bg: "#FEF9C3", text: "#713F12", icon: "🤝" },
  social: { bg: "#F0FDF4", text: "#15803D", icon: "🌱" },
};

const URGENCY_COLORS = {
  high: { bg: "#fff5f5", border: "#fca5a5", text: "#991b1b", labelKey: "wizard.urgency.high" },
  medium: { bg: "#fffbeb", border: "#fde68a", text: "#92400e", labelKey: "wizard.urgency.medium" },
  low: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", labelKey: "wizard.urgency.low" },
};

const OPP_TYPE_META = {
  career_conversion: { icon: "🔄", labelKey: "wizard.opportunityTypes.careerConversion", color: "#EDE9FE", text: "#6B21A8" },
  upskilling: { icon: "📈", labelKey: "wizard.opportunityTypes.upskilling", color: "#DBEAFE", text: "#1E40AF" },
  community_role: { icon: "🤝", labelKey: "wizard.opportunityTypes.communityRole", color: "#DCFCE7", text: "#166534" },
  hidden_gem: { icon: "💎", labelKey: "wizard.opportunityTypes.hiddenGem", color: "#FEF9C3", text: "#713F12" },
  job_fair: { icon: "🎪", labelKey: "wizard.opportunityTypes.jobFair", color: "#FEF3C7", text: "#92400E" },
};

function fmtSGD(n) {
  if (!n && n !== 0) return "—";
  return "$" + Number(n).toLocaleString("en-SG");
}

const openExternal = (url) => {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const getOpportunityCta = (opp) => {
  const type = opp?.type || "";
  if (type.includes("career_conversion")) return "View CCP openings →";
  if (type.includes("upskilling")) return "Start course pathway →";
  if (type.includes("job_fair")) return "Register for workshop →";
  if (type.includes("community_role")) return "Explore role →";
  return opp?.cta || "Apply now →";
};

const openGoogleMaps = (place) => {
  const query = encodeURIComponent(`${place?.name || ""} ${place?.address || ""}`.trim());
  if (!query) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
};

const callPlace = (phone) => {
  if (!phone) return;
  window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
};

/* Crisis Alert */
function CrisisAlert({ crisis, t }) {
  const isRealCrisis = crisis?.detected === true;
  const usefulHotlines = crisis?.hotlines?.filter(h => h?.name || h?.number) || [];

  if (!isRealCrisis && usefulHotlines.length === 0) {
    return (
      <div className="support-banner">
        <div className="support-banner-title">
          <span className="support-icon">🤝</span>
          <strong>{t("wizard.plan.supportOptionsTitle")}</strong>
        </div>
        <p>{t("wizard.plan.supportOptionsMessage")}</p>
      </div>
    );
  }

  return (
    <div className={isRealCrisis ? "crisis-alert" : "support-banner"}>
      <div className={isRealCrisis ? "crisis-alert-header" : "support-banner-title"}>
        <span className={isRealCrisis ? "crisis-icon" : "support-icon"}>
          {isRealCrisis ? "🆘" : "🤝"}
        </span>
        <h3>
          {isRealCrisis
            ? t("wizard.plan.immediateSupport")
            : t("wizard.plan.financialEmploymentSupport")}
        </h3>
      </div>

      <p className={isRealCrisis ? "crisis-message" : "support-message"}>
        {isRealCrisis
          ? crisis.message || t("wizard.plan.crisisFallback")
          : crisis?.message || t("wizard.plan.supportOptionsMessage")}
      </p>

      {usefulHotlines.length > 0 && (
        <div className="crisis-hotlines">
          {usefulHotlines.map((h, i) => (
            <a key={i} href={h.number ? `tel:${h.number}` : "#"} className="crisis-hotline-card">
              <div className="hotline-name">{h.name || t("wizard.plan.supportHotline")}</div>
              <div className="hotline-number">{h.number || t("wizard.plan.contactAvailable")}</div>
              {h.note && <div className="hotline-note">{h.note}</div>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ImpactCards({ impact, t }) {
  if (!impact) return null;
  const cards = [
    {
      label: t("wizard.impact.monthlySupport"),
      value: fmtSGD(impact.monthly_claimable),
      sub: impact.label_monthly || "",
      accent: "#C0392B",
    },
    {
      label: t("wizard.impact.yearlyValue"),
      value: fmtSGD(impact.total_yearly_value),
      sub: impact.label_yearly || "",
      accent: "#185FA5",
    },
    ...(impact.courses_away > 0 ? [{
      label: t("wizard.impact.pathwayDistance"),
      value: t("wizard.impact.coursesCount", { count: impact.courses_away }), sub: t("wizard.impact.coursesAwaySub"),
      accent: "#3B6D11",
    }] : []),
  ];

  return (
    <div className="impact-cards">
      {cards.map((c, i) => (
        <div key={i} className="impact-card" style={{ borderTopColor: c.accent }}>
          <div className="impact-label">{c.label}</div>
          <div className="impact-value" style={{ color: c.accent }}>{c.value}</div>
          {c.sub && <div className="impact-sub">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/* Timeline Section */
function TimelineSection({ title, icon, items, color }) {
  if (!items?.length) return null;
  return (
    <div className="timeline-section" style={{ borderLeftColor: color, color }}>
      <div className="timeline-section-header">
        <span className="timeline-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="timeline-items">
        {items.map((item, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-item-action">{item.action}</div>
            {item.details && <div className="timeline-item-details">{item.details}</div>}
            <div className="timeline-item-meta">
              {item.where && <span className="timeline-meta-tag">📍 {item.where}</span>}
              {item.phone && (
                <a href={`tel:${item.phone}`} className="timeline-meta-tag phone">
                  📞 {item.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Scheme Card */
function SchemeCard({ scheme, t }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_COLORS[scheme.category] || CATEGORY_COLORS.financial;
  const confidenceDot = { high: "🟢", medium: "🟡", low: "🔴" }[scheme.eligibility_confidence] || "🟡";
  return (
    <div className="scheme-card" onClick={() => setExpanded(!expanded)}>
      <div className="scheme-card-header">
        <div className="scheme-category-badge" style={{ background: cat.bg, color: cat.text }}>
          {cat.icon} {scheme.category}
        </div>
        <div className="scheme-confidence">
          {confidenceDot} {scheme.eligibility_confidence} {t("wizard.plan.match")}
        </div>
      </div>
      <div className="scheme-name">{scheme.name}</div>
      {scheme.amount && <div className="scheme-amount">{scheme.amount}</div>}
      {expanded && (
        <div className="scheme-expanded">
          {scheme.eligibility_match && (
            <p className="scheme-eligibility">
              <strong>{t("wizard.plan.whyQualify")}</strong> {scheme.eligibility_match}
            </p>
          )}
          <div className="scheme-links">
            {scheme.agency && <span className="scheme-agency">🏛 {scheme.agency}</span>}
            {scheme.apply_url ? (
              <a href={scheme.apply_url} target="_blank" rel="noreferrer" className="scheme-apply-link">
                {t("wizard.plan.applyOnline")} ↗
              </a>
            ) : scheme.apply_at?.startsWith("http") ? (
              <a href={scheme.apply_at} target="_blank" rel="noreferrer" className="scheme-apply-link">
                {t("wizard.plan.applyOnline")} ↗
              </a>
            ) : (
              <span className="scheme-agency">📍 {scheme.apply_at}</span>
            )}
          </div>
        </div>
      )}
      <div className="scheme-expand-hint">{expanded ? t("wizard.plan.less") : t("wizard.plan.moreDetails")}</div>
    </div>
  );
}

/* Opportunities Tab */
function OpportunitiesTab({ opportunities, t, scenario, summary }) {
  if (!opportunities?.length) {
    return <p className="empty-state">{t("wizard.plan.noOpportunities")}</p>;
  }

  const gems = opportunities.filter(o => o.is_hidden_gem);
  const regular = opportunities.filter(o => !o.is_hidden_gem);
  const personalSummary = summary || scenario || "";

  const handleOppOpen = (opp) => {
    const target = opp?.link || (opp?.where?.startsWith("http") ? opp.where : "");
    if (target) openExternal(target);
  };

  const handleOppKeyDown = (e, opp) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOppOpen(opp);
    }
  };

  return (
    <div className="opportunities-list">
      <p className="opp-intro">{t("wizard.plan.oppIntro")}</p>

      {personalSummary && (
        <div className="opp-personal-box">
          <strong>{t("wizard.plan.oppProfileLabel")}</strong>
          <span>{personalSummary}</span>
        </div>
      )}

      {regular.map((opp, i) => {
        const meta = OPP_TYPE_META[opp.type] || OPP_TYPE_META.upskilling;
        const isClickable = Boolean(opp.link || opp.where?.startsWith("http"));

        return (
          <div
            key={i}
            className={`opp-card ${isClickable ? "opp-card--clickable" : ""}`}
            onClick={() => handleOppOpen(opp)}
            onKeyDown={(e) => handleOppKeyDown(e, opp)}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
          >
            <div className="opp-card-header">
              <div className="opp-type-badge" style={{ background: meta.color, color: meta.text }}>
                {meta.icon} {t(meta.labelKey)}
              </div>
              {opp.time_to_qualify && (
                <div className="opp-time-badge">{opp.time_to_qualify}</div>
              )}
            </div>

            <div className="opp-title">{opp.title}</div>

            {opp.salary_range && (
              <div className="opp-salary">{opp.salary_range}</div>
            )}

            <div className="opp-description">{opp.description}</div>

            <div className="opp-reasons">
              <p>{t("wizard.plan.oppRecommendedBecause")}</p>
              <div>
                <span>✓ {t("wizard.plan.oppMatchesSituation")}</span>
                <span>✓ {t("wizard.plan.oppPracticalNextStep")}</span>
                <span>✓ {t("wizard.plan.oppAvailableNearby")}</span>
              </div>
            </div>

            {opp.link && (
              <div className="opp-card-footer">
                <span className="opp-click-hint">{t("wizard.plan.oppClickToExplore")}</span>
              </div>
            )}
          </div>
        );
      })}

      {gems.length > 0 && (
        <div className="opp-gems-section">
          <div className="opp-gems-header">
            <span>💎</span>
            <h3>{t("wizard.plan.hiddenGemsSectionTitle")}</h3>
          </div>

          {gems.map((opp, i) => {
            const url = opp.link || (opp.where?.startsWith("http") ? opp.where : "");
            const isClickable = Boolean(url);

            return (
              <div
                key={i}
                className={`opp-gem-card ${isClickable ? "clickable" : ""}`}
                onClick={() => {
                  if (url) window.open(url, "_blank", "noopener,noreferrer");
                }}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
              >
                <div className="opp-title">{opp.title}</div>
                <div className="opp-description">{opp.description}</div>

                <div className="opp-reasons">
                  <p>{t("wizard.plan.oppRecommendedBecause")}</p>
                  <div>
                    <span>✓ {t("wizard.plan.oppOftenMissed")}</span>
                    <span>✓ {t("wizard.plan.oppUsefulForSituation")}</span>
                    <span>✓ {t("wizard.plan.oppWorthCheckingEarly")}</span>
                  </div>
                </div>

                {opp.where && !opp.where.startsWith("http") && (
                  <div className="opp-location">📍 {opp.where}</div>
                )}

                {isClickable && (
                  <div className="opp-card-footer">
                    <span className="opp-click-hint">{t("wizard.plan.oppClickToExplore")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Trajectory Tab (12-month view) */
function TrajectoryTab({ trajectory, financial_impact, t }) {
  if (!trajectory?.headline && !trajectory?.milestones?.length) {
    return <p className="empty-state">{t("wizard.plan.noTrajectory")}</p>;
  }

  return (
    <div className="trajectory">
      {trajectory.headline && (
        <div className="trajectory-headline">{trajectory.headline}</div>
      )}

      {(trajectory.financial_before || trajectory.financial_after) && (
        <div className="trajectory-financial">
          <div className="traj-fin-row">
            <div className="traj-fin-card traj-fin-before">
              <div className="traj-fin-label">{t("wizard.trajectory.now")}</div>
              <div className="traj-fin-value">{trajectory.financial_before || "—"}</div>
            </div>
            <div className="traj-fin-arrow">→</div>
            <div className="traj-fin-card traj-fin-after">
              <div className="traj-fin-label">{t("wizard.trajectory.in12months")}</div>
              <div className="traj-fin-value">{trajectory.financial_after || "—"}</div>
            </div>
          </div>
        </div>
      )}

      {trajectory.milestones?.length > 0 && (
        <div className="trajectory-milestones">
          <div className="traj-milestones-label">
            {t("wizard.trajectory.milestonesLabel")}
          </div>
          {trajectory.milestones.map((m, i) => (
            <div key={i} className="traj-milestone">
              <div className="traj-milestone-period">{m.period}</div>
              <div className="traj-milestone-text">{m.milestone}</div>
            </div>
          ))}
        </div>
      )}

      {trajectory.total_value_unlocked && (
        <div className="trajectory-total">
          <span className="traj-total-icon">📊</span>
          <div>
            <div className="traj-total-label">
              {t("wizard.trajectory.totalUnlocked")}
            </div>
            <div className="traj-total-value">{trajectory.total_value_unlocked}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Documents Tab */
function DocumentsTab({ documents, t }) {
  if (!documents?.length) {
    return <p className="empty-state">{t("wizard.plan.noDocuments")}</p>;
  }

  const isNewFormat = typeof documents[0] === "object" && documents[0] !== null;

  if (!isNewFormat) {
    return (
      <div className="documents-list">
        <p className="documents-intro">{t("wizard.plan.documentsIntro")}</p>
        {documents.map((doc, i) => (
          <div key={i} className="document-item">
            <span className="doc-icon">📋</span>
            <span>{doc}</span>
          </div>
        ))}
      </div>
    );
  }

  const haveList = documents.filter(d => d.status === "likely_have");
  const getList = documents.filter(d => d.status === "need_to_get");

  return (
    <div className="documents-smart">
      <p className="documents-intro">{t("wizard.plan.documentsSmartIntro")}</p>

      {haveList.length > 0 && (
        <div className="doc-group">
          <div className="doc-group-header have">
            <span className="doc-group-icon">✅</span>
            <div>
              <div className="doc-group-title">{t("wizard.plan.likelyHave")}</div>
              <div className="doc-group-subtitle">{t("wizard.plan.locateBeforeAppointment")}</div>
            </div>
          </div>
          <div className="doc-items">
            {haveList.map((doc, i) => (
              <div key={i} className="doc-item doc-item--have">
                <span className="doc-check">✓</span>
                <span className="doc-name">{doc.document}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {getList.length > 0 && (
        <div className="doc-group">
          <div className="doc-group-header get">
            <span className="doc-group-icon">📥</span>
            <div>
              <div className="doc-group-title">{t("wizard.plan.needToGet")}</div>
              <div className="doc-group-subtitle">{t("wizard.plan.paperworkReminder")}</div>
            </div>
          </div>
          <div className="doc-items">
            {getList.map((doc, i) => (
              <div key={i} className="doc-item doc-item--get">
                <span className="doc-badge">{t("wizard.plan.get")}</span>
                <div className="doc-item-content">
                  <div className="doc-name">{doc.document}</div>
                  {doc.how_to_get && (
                    <div className="doc-how-to-get">→ {doc.how_to_get}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Main ActionPlan export */
export default function ActionPlan({ plan, scenario, onReset, onSave, isSaving }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("timeline");
  const urgencyStyle = URGENCY_COLORS[plan.urgency] || URGENCY_COLORS.low;

  const tabs = [
    { id: "timeline", label: `📅 ${t("wizard.tabs.timeline")}`, count: null },
    { id: "schemes", label: `🎯 ${t("wizard.tabs.schemes")}`, count: plan.schemes?.length },
    { id: "opportunities", label: `🚀 ${t("wizard.tabs.opportunities")}`, count: plan.opportunities?.length },
    { id: "trajectory", label: `📈 ${t("wizard.tabs.trajectory")}`, count: null },
    { id: "documents", label: `📄 ${t("wizard.tabs.documents")}`, count: plan.documents_needed?.length },
    { id: "places", label: `📍 ${t("wizard.tabs.places")}`, count: plan.tampines_touchpoints?.length },
  ];

  /* PDF export */
  const handleExport = () => {
    const date = new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });

    const renderTimeline = (items) =>
      items?.map(item => `
        <div style="background:#f9f9f9;border-radius:8px;padding:12px 14px;margin-bottom:10px;">
          <div style="font-weight:700;font-size:14px;color:#1a1a1a;margin-bottom:4px;">${item.action || ""}</div>
          ${item.details ? `<div style="font-size:13px;color:#555;margin-bottom:6px;">${item.details}</div>` : ""}
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${item.where ? `<span style="font-size:12px;background:#efefef;padding:3px 8px;border-radius:4px;">📍 ${item.where}</span>` : ""}
            ${item.phone ? `<span style="font-size:12px;background:#fff5f5;color:#DC2626;padding:3px 8px;border-radius:4px;">📞 ${item.phone}</span>` : ""}
          </div>
        </div>`
      ).join("") || "";

    const renderDocs = () => {
      const docs = plan.documents_needed || [];
      if (!docs.length) return `<p style='color:#aaa'>${t("wizard.plan.noneListed")}</p>`;

      const isNew = typeof docs[0] === "object";
      if (!isNew) {
        return docs
          .map(d => `<div style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">📋 ${d}</div>`)
          .join("");
      }

      const have = docs.filter(d => d.status === "likely_have");
      const get = docs.filter(d => d.status === "need_to_get");

      return `
    ${have.length ? `<div style="font-weight:700;color:#166534;margin-bottom:8px;">✅ ${t("wizard.plan.likelyHave")}</div>
      ${have.map(d => `<div style="padding:6px 0;font-size:13px;">✓ ${d.document}</div>`).join("")}` : ""}
    ${get.length ? `<div style="font-weight:700;color:#92400E;margin:14px 0 8px;">📥 ${t("wizard.plan.needToGet")}</div>
      ${get.map(d => `<div style="padding:6px 0;font-size:13px;"><div style="font-weight:600;">${d.document}</div>
        ${d.how_to_get ? `<div style="font-size:12px;color:#6B7280;padding:4px 8px;border-left:2px solid #D97706;margin-top:3px;">→ ${d.how_to_get}</div>` : ""}</div>`).join("")}` : ""}`;
    };

    const renderOpportunities = () => {
      const opps = plan.opportunities || [];
      if (!opps.length) return `<p style='color:#aaa'>${t("wizard.plan.noneListed")}</p>`;
      return opps.map(o => `
        <div style="border:1px solid #e8e8e8;border-radius:8px;padding:14px;margin-bottom:10px;">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${o.title}</div>
          ${o.salary_range ? `<div style="color:#C0392B;font-weight:600;font-size:13px;margin-bottom:6px;">${o.salary_range}</div>` : ""}
          <div style="font-size:13px;color:#555;">${o.description}</div>
          ${o.where ? `<div style="font-size:12px;color:#888;margin-top:6px;">📍 ${o.where}</div>` : ""}
        </div>`
      ).join("");
    };

    const renderTrajectory = () => {
      const traj = plan.trajectory;
      if (!traj?.headline) return `<p style='color:#aaa'>${t("wizard.plan.notAvailable")}</p>`;
      return `
        ${traj.headline ? `<div style="font-weight:700;font-size:15px;margin-bottom:14px;color:#1a1a1a;">${traj.headline}</div>` : ""}
        ${traj.milestones?.map(m => `
          <div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <div style="font-weight:600;font-size:12px;color:#C0392B;min-width:70px;">${m.period}</div>
            <div style="font-size:13px;color:#444;">${m.milestone}</div>
          </div>`).join("") || ""}
        ${traj.total_value_unlocked ? `<div style="margin-top:14px;padding:12px;background:#f0fdf4;border-radius:8px;font-size:13px;color:#166534;font-weight:600;">📊 ${traj.total_value_unlocked}</div>` : ""}`;
    };

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>MyTampines Action Plan</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:0;color:#1a1a1a}
  .header{background:#C0392B;color:white;padding:28px 40px}
  .header h1{margin:0 0 6px;font-size:22px}
  .header p{margin:0;font-size:13px;opacity:.85}
  .body{padding:32px 40px}
  .section{margin-bottom:32px}
  .section-title{font-size:11px;font-weight:700;color:#888;letter-spacing:.08em;text-transform:uppercase;background:#f0f0f0;padding:6px 10px;border-radius:4px;margin-bottom:14px}
  .tl-label{font-weight:700;font-size:13px;margin:16px 0 8px}
  .tl-label.week{color:#C0392B}.tl-label.month{color:#D97706}.tl-label.q{color:#2563EB}
  .scheme{border:1px solid #e8e8e8;border-radius:8px;padding:14px;margin-bottom:10px}
  .scheme-name{font-weight:700;font-size:14px;margin-bottom:4px}
  .scheme-amount{color:#C0392B;font-weight:600;font-size:13px;margin-bottom:6px}
  .place{padding:10px 0;border-bottom:1px solid #f0f0f0}
  .place-name{font-weight:700;font-size:13px}
  .place-detail{font-size:12px;color:#777;margin-top:2px}
  .summary-box{background:#f9f9f9;border-radius:8px;padding:14px;margin-bottom:20px;font-size:14px;color:#444;line-height:1.6}
  .impact-row{display:flex;gap:10px;margin-bottom:20px}
  .impact-box{flex:1;border-top:3px solid #C0392B;border-radius:8px;padding:12px;background:#f9f9f9}
  .impact-box:nth-child(2){border-top-color:#185FA5}
  .impact-box .lbl{font-size:11px;color:#888;margin-bottom:4px}
  .impact-box .val{font-size:18px;font-weight:700;color:#C0392B}
  .impact-box:nth-child(2) .val{color:#185FA5}
  .crisis-box{background:#FEF2F2;border:1.5px solid #FECACA;border-radius:8px;padding:16px;margin-bottom:20px}
  .footer{background:#C0392B;color:white;padding:12px 40px;font-size:11px;margin-top:40px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header">
  <h1>${t("wizard.planTitle")}</h1>
  <p>${t("wizard.plan.generated")} ${date} &nbsp;|&nbsp; ${scenario}</p>
</div>
<div class="body">
  ${plan.crisis?.detected ? `<div class="crisis-box">
    <h3>🆘 ${t("wizard.plan.immediateSupport")}</h3><p>${plan.crisis.message || ""}</p>
    ${plan.crisis.hotlines?.map(h => `<div style="display:inline-block;background:#fff;border:1px solid #FECACA;border-radius:6px;padding:8px 12px;margin:4px 4px 0 0">
      <div style="font-size:11px;color:#aaa">${h.name}</div><div style="font-size:16px;font-weight:700;color:#C0392B">${h.number}</div></div>`).join("") || ""}
  </div>` : ""}
  ${plan.financial_impact ? `<div class="impact-row">
    <div class="impact-box"><div class="lbl">${t("wizard.impact.monthlySupport")}</div><div class="val">${fmtSGD(plan.financial_impact.monthly_claimable)}</div><div style="font-size:11px;color:#888">${plan.financial_impact.label_monthly || ""}</div></div>
    <div class="impact-box"><div class="lbl">${t("wizard.impact.yearlyValue")}</div><div class="val">${fmtSGD(plan.financial_impact.total_yearly_value)}</div><div style="font-size:11px;color:#888">${plan.financial_impact.label_yearly || ""}</div></div>
  </div>` : ""}
  ${plan.situation_summary ? `<div class="summary-box">${plan.situation_summary}</div>` : ""}
  <div class="section">
    <div class="section-title">${t("wizard.tabs.timeline")}</div>
    ${plan.timeline?.this_week?.length ? `<div class="tl-label week">⚡ ${t("wizard.timeline.thisWeek")}</div>${renderTimeline(plan.timeline.this_week)}` : ""}
    ${plan.timeline?.this_month?.length ? `<div class="tl-label month">📆 ${t("wizard.timeline.thisMonth")}</div>${renderTimeline(plan.timeline.this_month)}` : ""}
    ${plan.timeline?.next_3_months?.length ? `<div class="tl-label q">🗓 ${t("wizard.timeline.next3Months")}</div>${renderTimeline(plan.timeline.next_3_months)}` : ""}
  </div>
  ${plan.schemes?.length ? `<div class="section">
    <div class="section-title">${t("wizard.tabs.schemes")}</div>
    ${plan.schemes.map(s => `<div class="scheme"><div class="scheme-name">${s.name}</div>
      ${s.amount ? `<div class="scheme-amount">${s.amount}</div>` : ""}
      ${s.eligibility_match ? `<div style="font-size:12px;color:#555">${t("wizard.plan.whyQualify")} ${s.eligibility_match}</div>` : ""}
      ${s.agency ? `<div style="font-size:12px;color:#aaa;margin-top:6px">🏛 ${s.agency}</div>` : ""}</div>`).join("")}
  </div>` : ""}
  ${plan.opportunities?.length ? `<div class="section">
    <div class="section-title">${t("wizard.tabs.opportunities")}</div>
    ${renderOpportunities()}
  </div>` : ""}
  ${plan.trajectory?.headline ? `<div class="section">
    <div class="section-title">${t("wizard.tabs.trajectory")}</div>
    ${renderTrajectory()}
  </div>` : ""}
  <div class="section">
    <div class="section-title">${t("wizard.tabs.documents")}</div>
    ${renderDocs()}
  </div>
  ${plan.tampines_touchpoints?.length ? `<div class="section">
    <div class="section-title">${t("wizard.tabs.places")}</div>
    ${plan.tampines_touchpoints.map(p => `<div class="place">
      <div class="place-name">📍 ${p.name}</div>
      <div class="place-detail">${[p.address, p.phone].filter(Boolean).join(" | ")}</div>
      ${p.note ? `<div class="place-detail">${p.note}</div>` : ""}</div>`).join("")}
  </div>` : ""}
</div>
<div class="footer">${t("wizard.plan.footer")}</div>
</body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  return (
    <div className="action-plan">
      <CrisisAlert crisis={plan.crisis} t={t} />

      {/* Red hero header */}
      <div className="plan-header">
        <div className="urgency-badge" style={{
          background: urgencyStyle.bg,
          borderColor: urgencyStyle.border,
          color: urgencyStyle.text,
        }}>
          {t(urgencyStyle.labelKey)}
        </div>
        <h2 className="plan-title">{t("wizard.planTitle")}</h2>
        {plan.situation_summary && (
          <p className="plan-summary">{plan.situation_summary}</p>
        )}
      </div>

      {/* Impact cards */}
      <ImpactCards impact={plan.financial_impact} t={t} />

      {/* Journey Progress */}
      {/*}
      {plan?.progress_score && (() => {
        const stages = [
          { id: "crisis", label: "Crisis", color: "#dc2626", circleClass: "current-crisis" },
          { id: "stabilising", label: "Stabilising", color: "#f59e0b", circleClass: "current-stab" },
          { id: "rebuilding", label: "Rebuilding", color: "#2563eb", circleClass: "current-rebuild" },
          { id: "growing", label: "Growing", color: "#16a34a", circleClass: "current-grow" },
        ];

        const currentIndex = stages.findIndex(
          s => s.id === plan.progress_score.current_stage
        );

        return (
          <div className="progress-card">
            <p className="progress-label">Your Current Journey</p>
            <div className="journey-track">
              {stages.map((stage, i) => {
                const completed = i < currentIndex;
                const current = i === currentIndex;
                return (
                  <React.Fragment key={stage.id}>
                    <div className="journey-stage">
                      <div className={`journey-circle ${completed ? "completed" : current ? stage.circleClass : ""}`}>
                        {completed ? <Check size={15} /> : current ? <Circle size={13} strokeWidth={3} /> : <Circle size={13} />}
                      </div>
                      <div className="journey-name">{stage.label}</div>
                    </div>
                    {i < stages.length - 1 && (
                      <div className={`journey-line ${i < currentIndex ? "filled" : ""}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="journey-current">Current: <strong> {plan.progress_score.current_stage}</strong></div>
            <p className="progress-next">Next suggested step: {plan.progress_score.next_step_to_improve}</p>
          </div>
        );
      })()}
*/}

      {/* Tabs */}
      <div className="plan-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`plan-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count != null && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="plan-content">
        {activeTab === "timeline" && (
          <div className="timeline">
            <TimelineSection title={t("wizard.timeline.thisWeek")} icon="⚡" items={plan.timeline?.this_week} color="#C0392B" />
            <TimelineSection title={t("wizard.timeline.thisMonth")} icon="📆" items={plan.timeline?.this_month} color="#D97706" />
            <TimelineSection title={t("wizard.timeline.next3Months")} icon="🗓" items={plan.timeline?.next_3_months} color="#2563EB" />
            {plan.hidden_gems?.length > 0 && (
              <div className="hidden-gems">
                <div className="hidden-gems-header">
                  <span>💎</span>
                  <h3>{t("wizard.plan.hiddenGemsTitle")}</h3>
                </div>
                <ul>{plan.hidden_gems.map((gem, i) => <li key={i}>{gem}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "schemes" && (
          <div className="schemes-grid">
            {plan.schemes?.length > 0
              ? plan.schemes.map((scheme, i) => <SchemeCard key={i} scheme={scheme} t={t} />)
              : <p className="empty-state">{t("wizard.plan.noSchemes")}</p>}
          </div>
        )}

        {activeTab === "opportunities" && (
          <OpportunitiesTab
            opportunities={plan.opportunities}
            t={t}
            scenario={scenario}
            summary={plan.situation_summary}
          />
        )}

        {activeTab === "trajectory" && (
          <TrajectoryTab trajectory={plan.trajectory} financial_impact={plan.financial_impact} t={t} />
        )}

        {activeTab === "documents" && (
          <DocumentsTab documents={plan.documents_needed} t={t} />
        )}

        {activeTab === "places" && (
          <div className="places-list">
            {plan.tampines_touchpoints?.map((place, i) => (
              <div key={i} className="place-card">
                <div className="place-name">📍 {place.name}</div>
                {place.address && <div className="place-address">{place.address}</div>}
                {place.phone && (
                  <a href={`tel:${place.phone}`} className="place-phone">📞 {place.phone}</a>
                )}
                {place.note && <div className="place-note">{place.note}</div>}

                <div className="place-actions">
                  <button type="button" onClick={() => openGoogleMaps(place)}>
                    📍 {t("wizard.plan.openMaps")}
                  </button>

                  {place.website && (
                    <button type="button" onClick={() => openExternal(place.website)}>
                      🌐 {t("wizard.plan.visitWebsite")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="plan-actions">
        <button className="plan-action-btn secondary" onClick={onReset}>
          {t("wizard.plan.newSituation")}
        </button>
        <button className="plan-action-btn secondary" onClick={handleExport}>
          {t("wizard.plan.exportPdf")}
        </button>
        {onSave && (
          <button className="plan-action-btn primary" onClick={onSave} disabled={isSaving}>
            {isSaving ? t("wizard.buttons.saving") : t("wizard.buttons.save")}
          </button>
        )}
      </div>
    </div>
  );
}