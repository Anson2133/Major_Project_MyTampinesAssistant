
    import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

export default function PolicyGapCategoryTable({ gaps = [] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(gaps.length / PAGE_SIZE));

  const visibleGaps = useMemo(() => {
    return gaps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [gaps, page]);

  return (
    <section className="policy-gap-table-section">
      <div className="admin-section-header with-action">
        <div>
          <span className="admin-section-kicker">Evidence Table</span>
          <h2>Category-level gap signals</h2>
          <p>
            This table shows how demand and completion patterns are distributed
            across support areas.
          </p>
        </div>

        <div className="admin-table-count">
          Showing {visibleGaps.length} of {gaps.length} categories
        </div>
      </div>

      <div className="policy-gap-table-wrap">
        <table className="policy-gap-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Gap Score</th>
              <th>Demand</th>
              <th>Difficulty</th>
              <th>Completion</th>
              <th>Top Services</th>
              <th>Top Entry Points</th>
            </tr>
          </thead>

          <tbody>
            {visibleGaps.map((gap) => (
              <tr key={gap.category}>
                <td>
                  <strong>{gap.category}</strong>
                  <span>{gap.avgSessionSeconds}s avg session</span>
                </td>

                <td>
                  <div className="policy-gap-score compact">
                    {gap.gapScore}/100
                  </div>
                </td>

                <td>
                  <strong>{gap.totalInteractions.toLocaleString("en-SG")}</strong>
                  <span>{gap.documentRate}% document-linked</span>
                </td>

                <td>
                  <strong>{gap.difficultyRate}%</strong>
                  <span>{gap.difficultySignals} signals</span>
                </td>

                <td>
                  <strong>{gap.successRate}%</strong>
                  <span>{gap.successSignals} success signals</span>
                </td>

                <td>
                  <div className="policy-gap-mini-list">
                    {gap.topServices?.map((service) => (
                      <span key={service.name}>
                        {service.name} · {service.count}
                      </span>
                    ))}
                  </div>
                </td>

                <td>
                  <div className="policy-gap-mini-list">
                    {gap.entryPoints?.map((entry) => (
                      <span key={entry.name}>
                        {entry.name} · {entry.count}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination-row">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
        >
          Next
        </button>
      </div>
    </section>
  );
}