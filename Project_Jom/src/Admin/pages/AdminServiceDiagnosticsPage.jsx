import ServiceDiagnosticsSummary from "../components/ServiceDiagnostic/ServiceDiagnosticsSummary";
import ServiceDiagnosticsTable from "../components/ServiceDiagnostic/ServiceDiagnosticsTable";
import ServiceDiagnosticsCategories from "../components/ServiceDiagnostic/ServiceDiagnosticsCategories";
import QuickSightReadinessPanel from "../components/ServiceDiagnostic/QuickSightReadinessPanel";
import useServiceDiagnostics from "../hooks/useServiceDiagnostics";
import AdminLoadingState from "../components/AdminLoadingState";
import "../ServiceDiagnostics.css";

export default function AdminServiceDiagnosticsPage() {
  const { diagnostics, loading, error, refreshDiagnostics } =
    useServiceDiagnostics();

  if (loading) {
    return (
      <AdminLoadingState
        title="Preparing service diagnostics"
        message="We are analysing anonymised journey signals, session duration, difficulty rates, and completion patterns."
      />
    );
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-hero admin-hero-compact">
        <span className="admin-eyebrow">Service Journey Diagnostics</span>
        <h1>Find where residents need clearer guidance</h1>
        <p>
          A confidential government admin view that ranks services using
          anonymised journey signals, not personal records.
        </p>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={refreshDiagnostics}
        >
          Refresh diagnostics
        </button>
      </section>

      {error && (
        <section className="admin-state-card error">
          {error}
        </section>
      )}

      <section className="admin-ai-summary admin-diagnostics-summary-box">
        <div>
          <strong>Executive interpretation</strong>
          <p>{diagnostics.executiveSummary}</p>
        </div>
      </section>

      <ServiceDiagnosticsSummary diagnostics={diagnostics} />

      <ServiceDiagnosticsTable services={diagnostics.topServices || []} />

      <ServiceDiagnosticsCategories
        categories={diagnostics.categorySummary || []}
      />

      <QuickSightReadinessPanel />
    </main>
  );
}