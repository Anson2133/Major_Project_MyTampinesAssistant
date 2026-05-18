import { AlertTriangle, BarChart3, FileSearch, Users } from "lucide-react";

export default function PolicyGapSummary({ policyGaps }) {
  const cards = [
    {
      label: "Profiles Analysed",
      value: policyGaps.totalProfiles?.toLocaleString("en-SG") || "0",
      detail: "Anonymised resident profile segments",
      icon: Users,
      tone: "blue",
    },
    {
      label: "Interactions Analysed",
      value: policyGaps.totalInteractions?.toLocaleString("en-SG") || "0",
      detail: "Service, chatbot, scanner, and journey events",
      icon: BarChart3,
      tone: "red",
    },
    {
      label: "Categories Analysed",
      value: policyGaps.totalCategoriesAnalysed || 0,
      detail: "Support areas grouped from interaction data",
      icon: FileSearch,
      tone: "green",
    },
    {
      label: "High-Priority Gap Signals",
      value: policyGaps.highPriorityGaps || 0,
      detail: "Areas with stronger gap scores",
      icon: AlertTriangle,
      tone: "orange",
    },
  ];

  return (
    <section className="policy-gap-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className={`policy-gap-summary-card tone-${card.tone}`} key={card.label}>
            <div className="policy-gap-summary-icon">
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