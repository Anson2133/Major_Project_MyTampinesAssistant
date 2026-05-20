import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

/* ── Crisis Alert ─────────────────────────────────────────── */
function CrisisAlert({ crisis, t }) {
  const usefulHotlines = crisis?.hotlines?.filter(
    (h) => h?.name || h?.number || h?.note
  ) || [];

  if (!crisis?.detected && usefulHotlines.length === 0) return null;
  return (
    <div className="crisis-alert">
      <div className="crisis-alert-header">
        <span className="crisis-icon">🆘</span>
        <h3>{t("wizard.plan.immediateSupport")}</h3>
      </div>
      <p className="crisis-message">
        {crisis.message ||
          t("wizard.plan.crisisFallback")}
      </p>
      <div className="crisis-hotlines">
        {usefulHotlines.map((h, i) => (
          <a key={i} href={h.number ? `tel:${h.number}` : "#"} className="crisis-hotline-card">
            <div className="hotline-name">
              {h.name || t("wizard.plan.supportHotline")}
            </div>
            <div className="hotline-number">
              {h.number || t("wizard.plan.contactAvailable")}
            </div>
            {h.note && <div className="hotline-note">{h.note}</div>}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Timeline Section ─────────────────────────────────────── */
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
            {item.details && (
              <div className="timeline-item-details">{item.details}</div>
            )}
            <div className="timeline-item-meta">
              {item.where && (
                <span className="timeline-meta-tag">📍 {item.where}</span>
              )}
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

/* ── Scheme Card ──────────────────────────────────────────── */
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
            {scheme.agency && (
              <span className="scheme-agency">🏛 {scheme.agency}</span>
            )}
            {scheme.apply_at && (
              scheme.apply_at.startsWith("http") ? (
                <a href={scheme.apply_at} target="_blank" rel="noreferrer" className="scheme-apply-link">
                  {t("wizard.plan.applyOnline")}
                </a>
              ) : (
                <span className="scheme-agency">📍 {scheme.apply_at}</span>
              )
            )}
          </div>
        </div>
      )}
      <div className="scheme-expand-hint">{expanded
        ? t("wizard.plan.less")
        : t("wizard.plan.moreDetails")}</div>
    </div>
  );
}

/* ── Documents Tab ────────────────────────────────────────── */
function DocumentsTab({ documents, t }) {
  if (!documents?.length) {
    return (
      <p className="empty-state">
        {t("wizard.plan.noDocuments")}
      </p>
    );
  }

  const isNewFormat = typeof documents[0] === "object" && documents[0] !== null;

  if (!isNewFormat) {
    return (
      <div className="documents-list">
        <p className="documents-intro">
          {t("wizard.plan.documentsIntro")}
        </p>
        {documents.map((doc, i) => (
          <div key={i} className="document-item">
            <span className="doc-icon">📋</span>
            <span>{doc}</span>
          </div>
        ))}
      </div>
    );
  }

  const haveList = documents.filter((d) => d.status === "likely_have");
  const getList = documents.filter((d) => d.status === "need_to_get");

  return (
    <div className="documents-smart">
      <p className="documents-intro">
        {t("wizard.plan.documentsSmartIntro")}
      </p>

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

/* ── Main ActionPlan export ───────────────────────────────── */
export default function ActionPlan({ plan, scenario, onReset, onSave, isSaving }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("timeline");
  const urgencyStyle = URGENCY_COLORS[plan.urgency] || URGENCY_COLORS.low;

  /* ── PDF export (unchanged logic, same print output) ── */
  const handleExport = () => {
    const date = new Date().toLocaleDateString("en-SG", {
      day: "numeric", month: "long", year: "numeric",
    });

    const renderTimeline = (items) =>
      items?.map(
        (item) => `
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
      if (!docs.length) return "<p style='color:#aaa'>None listed.</p>";
      const isNew = typeof docs[0] === "object";
      if (!isNew)
        return docs
          .map((d) => `<div style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">📋 ${d}</div>`)
          .join("");
      const have = docs.filter((d) => d.status === "likely_have");
      const get = docs.filter((d) => d.status === "need_to_get");
      return `
        ${have.length ? `<div style="font-weight:700;color:#166534;margin-bottom:8px;">✅ You likely already have these</div>
          ${have.map((d) => `<div style="padding:6px 0;font-size:13px;color:#374151;">✓ ${d.document}</div>`).join("")}` : ""}
        ${get.length ? `<div style="font-weight:700;color:#92400E;margin:14px 0 8px;">📥 You'll need to obtain these</div>
          ${get.map((d) => `<div style="padding:6px 0;font-size:13px;">
            <div style="font-weight:600;">${d.document}</div>
            ${d.how_to_get ? `<div style="font-size:12px;color:#6B7280;padding:4px 8px;border-left:2px solid #D97706;margin-top:3px;">→ ${d.how_to_get}</div>` : ""}
          </div>`).join("")}` : ""}`;
    };

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>MyTampines Action Plan</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:0;color:#1a1a1a}
  .header{background:#DC2626;color:white;padding:28px 40px}
  .header h1{margin:0 0 6px;font-size:22px}
  .header p{margin:0;font-size:13px;opacity:.85}
  .body{padding:32px 40px}
  .section{margin-bottom:32px}
  .section-title{font-size:11px;font-weight:700;color:#888;letter-spacing:.08em;text-transform:uppercase;background:#f0f0f0;padding:6px 10px;border-radius:4px;margin-bottom:14px}
  .tl-label{font-weight:700;font-size:13px;margin:16px 0 8px}
  .tl-label.week{color:#DC2626}.tl-label.month{color:#D97706}.tl-label.q{color:#2563EB}
  .scheme{border:1px solid #e8e8e8;border-radius:8px;padding:14px;margin-bottom:10px}
  .scheme-name{font-weight:700;font-size:14px;margin-bottom:4px}
  .scheme-amount{color:#DC2626;font-weight:600;font-size:13px;margin-bottom:6px}
  .scheme-why{font-size:12px;color:#555}
  .place{padding:10px 0;border-bottom:1px solid #f0f0f0}
  .place-name{font-weight:700;font-size:13px}
  .place-detail{font-size:12px;color:#777;margin-top:2px}
  .gems ul{padding-left:18px;margin:0}
  .gems li{font-size:13px;color:#78350F;margin-bottom:6px}
  .summary-box{background:#f9f9f9;border-radius:8px;padding:14px;margin-bottom:20px;font-size:14px;color:#444;line-height:1.6}
  .crisis-box{background:#FEF2F2;border:1.5px solid #FECACA;border-radius:8px;padding:16px;margin-bottom:20px}
  .crisis-box h3{margin:0 0 8px;color:#991B1B;font-size:15px}
  .crisis-box p{margin:0 0 10px;font-size:13px;color:#7F1D1D}
  .hotline{display:inline-block;background:white;border:1px solid #FECACA;border-radius:6px;padding:8px 12px;margin:4px 4px 0 0}
  .hotline-name{font-size:11px;color:#888}
  .hotline-number{font-size:16px;font-weight:700;color:#DC2626}
  .footer{background:#DC2626;color:white;padding:12px 40px;font-size:11px;margin-top:40px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header">
  <h1>${t("wizard.planTitle")}</h1>
  <p>Generated ${date} &nbsp;|&nbsp; ${scenario}</p>
</div>
<div class="body">
  ${plan.crisis?.detected ? `<div class="crisis-box">
    <h3>🆘 Immediate Support Available</h3>
    <p>${plan.crisis.message || ""}</p>
    ${plan.crisis.hotlines?.map((h) => `<div class="hotline"><div class="hotline-name">${h.name}</div><div class="hotline-number">${h.number}</div>${h.note ? `<div style="font-size:11px;color:#aaa">${h.note}</div>` : ""}</div>`).join("") || ""}
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
    ${plan.schemes.map((s) => `<div class="scheme">
      <div class="scheme-name">${s.name}</div>
      ${s.amount ? `<div class="scheme-amount">${s.amount}</div>` : ""}
      ${s.eligibility_match ? `<div class="scheme-why">Why you likely qualify: ${s.eligibility_match}</div>` : ""}
      ${s.agency ? `<div style="font-size:12px;color:#aaa;margin-top:6px;">🏛 ${s.agency}${s.apply_at ? " &nbsp;|&nbsp; " + s.apply_at : ""}</div>` : ""}
    </div>`).join("")}
  </div>` : ""}
  <div class="section">
    <div class="section-title">${t("wizard.tabs.documents")}</div>
    ${renderDocs()}
  </div>
  ${plan.tampines_touchpoints?.length ? `<div class="section">
    <div class="section-title">${t("wizard.tabs.places")}</div>
    ${plan.tampines_touchpoints.map((p) => `<div class="place">
      <div class="place-name">📍 ${p.name}</div>
      <div class="place-detail">${[p.address, p.phone].filter(Boolean).join(" | ")}</div>
      ${p.note ? `<div class="place-detail">${p.note}</div>` : ""}
    </div>`).join("")}
  </div>` : ""}
  ${plan.hidden_gems?.length ? `<div class="section gems">
    <div class="section-title">${t("wizard.hiddenGems")}</div>
    <ul>${plan.hidden_gems.map((g) => `<li>${g}</li>`).join("")}</ul>
  </div>` : ""}
</div>
<div class="footer">MyTampines Assistant — Life Situations Wizard</div>
</body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  return (
    <div className="action-plan">
      {/* Crisis always first */}
      <CrisisAlert crisis={plan.crisis} t={t} />

      {/* Red hero header — mirrors intro hero */}
      <div className="plan-header">
        <div
          className="urgency-badge"
          style={{
            background: urgencyStyle.bg,
            borderColor: urgencyStyle.border,
            color: urgencyStyle.text,
          }}
        >
          {t(urgencyStyle.labelKey)}
        </div>
        <h2 className="plan-title">{t("wizard.planTitle")}</h2>
        {plan.situation_summary && (
          <p className="plan-summary">{plan.situation_summary}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="plan-tabs">
        {[
          { id: "timeline", label: `📅 ${t("wizard.tabs.timeline")}`, count: null },
          { id: "schemes", label: `🎯 ${t("wizard.tabs.schemes")}`, count: plan.schemes?.length },
          { id: "documents", label: `📄 ${t("wizard.tabs.documents")}`, count: plan.documents_needed?.length },
          { id: "places", label: `📍 ${t("wizard.tabs.places")}`, count: plan.tampines_touchpoints?.length },
        ].map((tab) => (
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
            <TimelineSection
              title={t("wizard.timeline.thisWeek")}
              icon="⚡"
              items={plan.timeline?.this_week}
              color="#DC2626"
            />
            <TimelineSection
              title={t("wizard.timeline.thisMonth")}
              icon="📆"
              items={plan.timeline?.this_month}
              color="#D97706"
            />
            <TimelineSection
              title={t("wizard.timeline.next3Months")}
              icon="🗓"
              items={plan.timeline?.next_3_months}
              color="#2563EB"
            />

            {plan.hidden_gems?.length > 0 && (
              <div className="hidden-gems">
                <div className="hidden-gems-header">
                  <span>💎</span>
                  <h3>{t("wizard.plan.hiddenGemsTitle")}</h3>
                </div>
                <ul>
                  {plan.hidden_gems.map((gem, i) => (
                    <li key={i}>{gem}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "schemes" && (
          <div className="schemes-grid">
            {plan.schemes?.length > 0 ? (
              plan.schemes.map((scheme, i) => (
                <SchemeCard key={i} scheme={scheme} t={t} />
              ))
            ) : (
              <p className="empty-state">
                {t("wizard.plan.noSchemes")}
              </p>
            )}
          </div>
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
                  <a href={`tel:${place.phone}`} className="place-phone">
                    📞 {place.phone}
                  </a>
                )}
                {place.note && <div className="place-note">{place.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="plan-actions">
        <button className="plan-action-btn secondary" onClick={onReset}>
          {t("wizard.buttons.tryAnother")}
        </button>
        <button className="plan-action-btn secondary" onClick={handleExport}>
          {t("wizard.buttons.export")}
        </button>
        {onSave && (
          <button
            className="plan-action-btn primary"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? t("wizard.buttons.saving") : t("wizard.buttons.save")}
          </button>
        )}
      </div>
    </div>
  );
}