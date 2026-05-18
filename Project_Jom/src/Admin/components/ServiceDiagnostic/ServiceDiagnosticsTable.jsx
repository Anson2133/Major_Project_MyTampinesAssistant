import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

function getScoreLabel(score) {
  if (score >= 80) return "Very High";
  if (score >= 70) return "High";
  if (score >= 50) return "Moderate";
  return "Low";
}

function getUniqueCategories(services) {
  const categories = services
    .map((service) => service.category)
    .filter(Boolean);

  return ["All", ...new Set(categories)];
}

export default function ServiceDiagnosticsTable({ services = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => getUniqueCategories(services), [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") return services;

    return services.filter((service) => service.category === selectedCategory);
  }, [services, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));

  const visibleServices = filteredServices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const goPrevious = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goNext = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <section className="admin-diagnostics-table-section">
      <div className="admin-section-header with-action">
        <div>
          <span className="admin-section-kicker">Service Diagnostics</span>
          <h2>Top services requiring journey review</h2>
          <p>
            Ranked using anonymised journey signals such as session duration,
            repeated checking, chatbot follow-ups, abandoned journeys, and
            successful next-step completion.
          </p>
        </div>

        <div className="admin-table-count">
          Showing {visibleServices.length} of {filteredServices.length} services
        </div>
      </div>

      <div className="admin-diagnostics-filter-row">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`admin-diagnostics-filter-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="admin-diagnostics-table-wrap">
        <table className="admin-diagnostics-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Service</th>
              <th>Category</th>
              <th>Diagnostics Score</th>
              <th>Journey Signals</th>
              <th>Completion</th>
              <th>Main Entry Point</th>
            </tr>
          </thead>

          <tbody>
            {visibleServices.map((service) => (
              <tr key={`${service.serviceId}-${service.serviceName}`}>
                <td>#{service.rank}</td>

                <td>
                  <strong>{service.serviceName}</strong>
                  <span>
                    {service.totalInteractions} interactions · Avg{" "}
                    {service.avgTime}s/session
                  </span>
                </td>

                <td>{service.category}</td>

                <td>
                  <div className="admin-score-pill">
                    {service.diagnosticsScore}/100
                    <span>{getScoreLabel(service.diagnosticsScore)}</span>
                  </div>
                </td>

                <td>
                  <div className="admin-signal-stack">
                    <span>
                      Difficulty signals:{" "}
                      <strong>{service.difficultySignals}</strong>
                    </span>
                    <span>
                      Difficulty rate:{" "}
                      <strong>{service.difficultyRate}%</strong>
                    </span>
                    <span>
                      Main signal: <strong>{service.reason}</strong>
                    </span>
                  </div>
                </td>

                <td>
                  <span className="admin-success-rate">
                    {service.successRate}% success
                  </span>
                  <span className="admin-dropoff-rate">
                    {service.dropOffRate}% drop-off
                  </span>
                  <span className="admin-neutral-rate">
                    {service.successSignals} success signals
                  </span>
                </td>

                <td>
                  <span className="admin-entry-point">
                    {service.topEntryPoint || "Unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleServices.length === 0 && (
          <div className="admin-table-empty">
            No services found for this category.
          </div>
        )}
      </div>

      <div className="admin-pagination-row">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}