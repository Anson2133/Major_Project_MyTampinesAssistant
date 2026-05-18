export default function DocumentCategoryTable({ documentInsights }) {
  const rows = documentInsights.scannerToServiceCategories?.length
    ? documentInsights.scannerToServiceCategories
    : documentInsights.categoryBreakdown || [];

  return (
    <section className="document-category-section">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Service Linkage</span>
        <h2>Support areas reached after document activity</h2>
        <p>
          This shows which service categories residents move toward after using
          document or scanner-related features.
        </p>
      </div>

      <div className="document-category-table-wrap">
        <table className="document-category-table">
          <thead>
            <tr>
              <th>Support Area</th>
              <th>Linked Events</th>
              <th>Share</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const total = rows.reduce((sum, item) => sum + item.count, 0) || 1;
              const share = Math.round((row.count / total) * 100);

              return (
                <tr key={row.category}>
                  <td>
                    <strong>{row.category}</strong>
                  </td>
                  <td>{row.count.toLocaleString("en-SG")}</td>
                  <td>
                    <div className="document-share-pill">{share}%</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}