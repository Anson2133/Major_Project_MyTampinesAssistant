import { Sparkles } from "lucide-react";

export default function AdminInsightPanel({ headlineInsight, findings }) {
  return (
    <section className="admin-insight-panel">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Executive Insight</span>
        <h2>What the data suggests</h2>
        <p>
          A high-level summary of demand, friction, and policy improvement
          opportunities from anonymised resident journeys.
        </p>
      </div>

      <div className="admin-insight-main">
        <div className="admin-ai-summary">
          <div className="admin-ai-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <strong>Policy intelligence summary</strong>
            <p>{headlineInsight}</p>
          </div>
        </div>

        <div className="admin-finding-list">
          {findings.map((finding) => (
            <article className="admin-finding-card" key={finding.title}>
              <h3>{finding.title}</h3>
              <p>{finding.detail}</p>

              <div className="admin-recommendation-box">
                <span>Recommended action</span>
                <strong>{finding.recommendation}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}