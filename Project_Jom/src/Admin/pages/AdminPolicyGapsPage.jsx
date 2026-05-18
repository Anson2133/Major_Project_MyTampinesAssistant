import PolicyGapSummary from "../components/PolicyGaps/PolicyGapSummary";
import PolicyGapCards from "../components/PolicyGaps/PolicyGapCards";
import PolicyGapCategoryTable from "../components/PolicyGaps/PolicyGapCategoryTable";
import usePolicyGaps from "../hooks/usePolicyGaps";
import "../admin.css";
import "../PolicyGaps.css";

export default function AdminPolicyGapsPage() {
  const { policyGaps, loading, error, refreshPolicyGaps } = usePolicyGaps();

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <section className="admin-state-card">
          Loading policy gap analysis...
        </section>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-hero admin-hero-compact">
        <span className="admin-eyebrow">Policy Gap Detection</span>
        <h1>Find support areas that may need better guidance</h1>
        <p>
          A confidential government admin view that converts anonymised demand,
          difficulty, completion, and document-linked signals into policy gap
          indicators.
        </p>

        <button type="button" className="admin-refresh-btn" onClick={refreshPolicyGaps}>
          Refresh gap analysis
        </button>
      </section>

      {error && <section className="admin-state-card error">{error}</section>}

      <section className="admin-ai-summary policy-gap-summary-box">
        <div>
          <strong>Executive interpretation</strong>
          <p>{policyGaps.executiveSummary}</p>
        </div>
      </section>

      <PolicyGapSummary policyGaps={policyGaps} />

      <PolicyGapCards gaps={policyGaps.gaps || []} />

      <PolicyGapCategoryTable gaps={policyGaps.gaps || []} />
    </main>
  );
}