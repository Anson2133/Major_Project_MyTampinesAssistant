export default function ServiceDiagnosticsCategories({ categories }) {
  if (!categories.length) return null;

  return (
    <section className="admin-diagnostics-category-section">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Category View</span>
        <h2>Diagnostics by support area</h2>
        <p>
          This groups individual service difficulty into broader support areas,
          helping agencies see where guidance or policy communication may need
          improvement.
        </p>
      </div>

      <div className="admin-diagnostics-category-grid">
        {categories.slice(0, 6).map((category) => (
          <article
            className="admin-diagnostics-category-card"
            key={category.category}
          >
            <div className="admin-category-top">
              <strong>{category.category}</strong>
              <span>{category.averageDiagnosticsScore}/100</span>
            </div>

            <p>
              {category.serviceCount} services ·{" "}
              {category.totalInteractions.toLocaleString("en-SG")} interactions
            </p>

            <div className="admin-category-track">
              <div
                style={{
                  width: `${Math.min(
                    100,
                    category.averageDiagnosticsScore
                  )}%`,
                }}
              />
            </div>

            <small>
              {category.highAttentionServices} high-attention services
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}