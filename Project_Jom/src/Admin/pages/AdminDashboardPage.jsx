import AdminPrivacyBanner from "../components/AdminPrivacyBanner";
import AdminOverviewCard from "../components/AdminOverviewCard";
import AdminInsightPanel from "../components/AdminInsightPanel";
import AdminDemandSnapshot from "../components/AdminDemandSnapshot";
import useAdminOverview from "../hooks/useAdminOverview";
import AdminLoadingState from "../components/AdminLoadingState";
import "../admin.css";

export default function AdminDashboardPage() {
    const { overview, loading, error } = useAdminOverview();

    if (loading) {
        return (
            <AdminLoadingState
                title="Preparing admin overview"
                message="We are loading anonymised profiles, service interactions, demand signals, and policy indicators."
            />
        );
    }

    if (error) {
        return (
            <main className="admin-dashboard-page">
                <section className="admin-state-card error">{error}</section>
            </main>
        );
    }

    return (
        <main className="admin-dashboard-page">
            <section className="admin-hero">
                <span className="admin-eyebrow">Admin Dashboard</span>
                <h1>Policy Intelligence Dashboard</h1>
                <p>
                    A confidential view of anonymised resident interaction patterns,
                    service demand, friction points, and possible policy improvement
                    opportunities.
                </p>

                <div className="admin-hero-stats">
                    <div>
                        <strong>{overview.kpis[0].value}</strong>
                        <span>Anonymised profiles</span>
                    </div>

                    <div>
                        <strong>{overview.kpis[1].value}</strong>
                        <span>Interaction events</span>
                    </div>

                    <div>
                        <strong>{overview.kpis[4].value}</strong>
                        <span>Potential gaps</span>
                    </div>
                </div>
            </section>

            <AdminPrivacyBanner />

            <section className="admin-overview-section">
                <div className="admin-section-header">
                    <span className="admin-section-kicker">Overview</span>
                    <h2>Executive policy overview</h2>
                    <p>
                        These headline indicators show where residents are seeking help,
                        where journeys may be difficult, and where agencies may improve
                        communication or outreach.
                    </p>
                </div>

                <div className="admin-kpi-grid">
                    {overview.kpis.map((item) => (
                        <AdminOverviewCard key={item.id} item={item} />
                    ))}
                </div>
            </section>

            <AdminInsightPanel
                headlineInsight={overview.headlineInsight}
                findings={overview.priorityFindings}
            />

            <AdminDemandSnapshot demandSnapshot={overview.demandSnapshot} />
        </main>
    );
}