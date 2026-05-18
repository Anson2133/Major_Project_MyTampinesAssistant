import { Activity, AlertTriangle, BarChart3, ShieldCheck } from "lucide-react";

export default function ServiceDiagnosticsSummary({ diagnostics }) {
  const cards = [
    {
      label: "Interactions Analysed",
      value: diagnostics.totalInteractions?.toLocaleString("en-SG") || "0",
      detail: "Anonymised resident journey events",
      icon: Activity,
      tone: "red",
    },
    {
      label: "Services Analysed",
      value: diagnostics.totalServicesAnalysed || 0,
      detail: "Services with enough activity to score",
      icon: BarChart3,
      tone: "blue",
    },
    {
      label: "High-Attention Services",
      value: diagnostics.highAttentionServices || 0,
      detail: "Diagnostics score of 70 or above",
      icon: AlertTriangle,
      tone: "orange",
    },
    {
      label: "QuickSight Status",
      value: "Ready",
      detail: "Can be exported to BI dashboard",
      icon: ShieldCheck,
      tone: "green",
    },
  ];

  return (
    <section className="admin-diagnostics-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            className={`admin-diagnostics-summary-card tone-${card.tone}`}
            key={card.label}
          >
            <div className="admin-diagnostics-summary-icon">
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