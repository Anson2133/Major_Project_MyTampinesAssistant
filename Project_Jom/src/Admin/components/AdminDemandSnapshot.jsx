export default function AdminDemandSnapshot({ demandSnapshot }) {
  const maxInteractions = Math.max(
    ...demandSnapshot.map((item) => item.interactions)
  );

  return (
    <section className="admin-demand-section">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Demand Snapshot</span>
        <h2>Support categories with the highest activity</h2>
        <p>
          Interaction volume is based on anonymised service views, chatbot
          activity, scanner referrals, saved services, and guide actions.
        </p>
      </div>

      <div className="admin-demand-list">
        {demandSnapshot.map((item) => {
          const width = Math.round((item.interactions / maxInteractions) * 100);

          return (
            <article className="admin-demand-row" key={item.category}>
              <div className="admin-demand-top">
                <div>
                  <strong>{item.category}</strong>
                  <span>{item.signal}</span>
                </div>

                <p>{item.interactions.toLocaleString()} interactions</p>
              </div>

              <div className="admin-demand-track">
                <div
                  className="admin-demand-fill"
                  style={{ width: `${width}%` }}
                />
              </div>

              <div className="admin-demand-meta">
                <span>{item.percentage}% of dashboard activity</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}