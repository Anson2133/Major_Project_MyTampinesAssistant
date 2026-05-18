export default function ScamRiskPanel({ documentInsights }) {
  const riskLevels = documentInsights.scamRiskLevels || [];
  const maxCount = Math.max(...riskLevels.map((item) => item.count), 1);

  return (
    <section className="scam-risk-section">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Scam Risk</span>
        <h2>Scam-risk signals from scanned content</h2>
        <p>
          Risk levels are shown only as aggregated counts. This supports public
          safety planning without exposing private documents.
        </p>
      </div>

      <div className="scam-risk-grid">
        {riskLevels.map((item) => {
          const width = Math.round((item.count / maxCount) * 100);

          return (
            <article className="scam-risk-card" key={item.riskLevel}>
              <div className="scam-risk-top">
                <strong>{item.riskLevel}</strong>
                <span>{item.count.toLocaleString("en-SG")}</span>
              </div>

              <div className="scam-risk-track">
                <div style={{ width: `${width}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}