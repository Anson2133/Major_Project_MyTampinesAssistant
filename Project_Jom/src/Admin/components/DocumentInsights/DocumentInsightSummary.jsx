import { AlertTriangle, FileSearch, Link2, ShieldAlert } from "lucide-react";

export default function DocumentInsightSummary({ documentInsights }) {
  const cards = [
    {
      label: "Document Events",
      value: documentInsights.totalDocumentEvents?.toLocaleString("en-SG") || "0",
      detail: "Scanner or document-linked interactions",
      icon: FileSearch,
      tone: "blue",
    },
    {
      label: "Scam-Related Events",
      value: documentInsights.scamRelatedEvents?.toLocaleString("en-SG") || "0",
      detail: `${documentInsights.scamRate}% of document events`,
      icon: ShieldAlert,
      tone: "red",
    },
    {
      label: "High-Risk Scam Signals",
      value: documentInsights.highRiskEvents?.toLocaleString("en-SG") || "0",
      detail: `${documentInsights.highRiskRate}% high risk`,
      icon: AlertTriangle,
      tone: "orange",
    },
    {
      label: "Linked to Services",
      value: documentInsights.serviceLinkedEvents?.toLocaleString("en-SG") || "0",
      detail: `${documentInsights.serviceLinkRate}% became support journeys`,
      icon: Link2,
      tone: "green",
    },
  ];

  return (
    <section className="document-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className={`document-summary-card tone-${card.tone}`} key={card.label}>
            <div className="document-summary-icon">
              <Icon size={24} />
            </div>

            <div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}