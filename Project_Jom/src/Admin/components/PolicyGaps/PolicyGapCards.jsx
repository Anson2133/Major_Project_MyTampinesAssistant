function getPriorityLabel(score) {
  if (score >= 80) return "Very High";
  if (score >= 70) return "High";
  if (score >= 50) return "Moderate";
  return "Low";
}

export default function PolicyGapCards({ gaps = [] }) {
  return (
    <section className="policy-gap-card-section">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Policy Gap Detection</span>
        <h2>Support areas that may need better service design</h2>
        <p>
          Ranked using anonymised demand, difficulty, document-linked journeys,
          and successful next-step completion.
        </p>
      </div>

      <div className="policy-gap-card-grid">
        {gaps.slice(0, 3).map((gap) => (
          <article className="policy-gap-card" key={gap.category}>
            <div className="policy-gap-card-top">
              <div>
                <span>Potential gap area</span>
                <h3>{gap.category}</h3>
              </div>

              <div className="policy-gap-score">
                {gap.gapScore}/100
                <small>{getPriorityLabel(gap.gapScore)}</small>
              </div>
            </div>

            <p className="policy-gap-reason">{gap.reason}</p>

            <div className="policy-gap-stat-row">
              <div>
                <strong>{gap.totalInteractions.toLocaleString("en-SG")}</strong>
                <span>interactions</span>
              </div>

              <div>
                <strong>{gap.difficultyRate}%</strong>
                <span>difficulty rate</span>
              </div>

              <div>
                <strong>{gap.successRate}%</strong>
                <span>success rate</span>
              </div>
            </div>

            <div className="policy-gap-interpretation">
              <strong>Interpretation</strong>
              <p>{gap.policyInterpretation}</p>
            </div>

            <div className="policy-gap-chip-block">
              <strong>Affected segments</strong>
              <div>
                {gap.affectedSegments?.map((segment) => (
                  <span key={segment.name}>
                    {segment.name} · {segment.count}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}