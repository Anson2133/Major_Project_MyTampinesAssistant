import DocumentInsightSummary from "../components/DocumentInsights/DocumentInsightSummary";
import DocumentTypeBreakdown from "../components/DocumentInsights/DocumentTypeBreakdown";
import ScamRiskPanel from "../components/DocumentInsights/ScamRiskPanel";
import DocumentCategoryTable from "../components/DocumentInsights/DocumentCategoryTable";
import useDocumentInsights from "../hooks/useDocumentInsights";
import AdminLoadingState from "../components/AdminLoadingState";
import "../admin.css";
import "../DocumentInsights.css";

export default function AdminDocumentInsightsPage() {
    const {
        documentInsights,
        loading,
        error,
        refreshDocumentInsights,
    } = useDocumentInsights();

    if (loading) {
        return (
            <AdminLoadingState
                title="Detecting Document & Scam Intelligence"
                message="We are comparing document activity and scam risk indicators."
            />
        );
    }

    return (
        <main className="admin-dashboard-page">
            <section className="admin-hero admin-hero-compact">
                <span className="admin-eyebrow">Document & Scam Intelligence</span>
                <h1>Understand document-driven support needs</h1>
                <p>
                    A confidential government admin view of aggregated document categories,
                    scam-risk levels, and support pathways reached after document activity.
                </p>

                <button
                    type="button"
                    className="admin-refresh-btn"
                    onClick={refreshDocumentInsights}
                >
                    Refresh document insights
                </button>
            </section>

            {error && <section className="admin-state-card error">{error}</section>}

            <section className="admin-ai-summary document-summary-box">
                <div>
                    <strong>Executive interpretation</strong>
                    <p>{documentInsights.executiveSummary}</p>
                </div>
            </section>

            <DocumentInsightSummary documentInsights={documentInsights} />

            <DocumentTypeBreakdown documentInsights={documentInsights} />

            <ScamRiskPanel documentInsights={documentInsights} />

            <DocumentCategoryTable documentInsights={documentInsights} />
        </main>
    );
}