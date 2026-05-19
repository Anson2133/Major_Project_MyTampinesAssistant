import { Loader2 } from "lucide-react";

export default function AdminLoadingState({
  title = "Loading admin insights",
  message = "We are preparing anonymised analytics from the dashboard dataset.",
}) {
  return (
    <main className="admin-dashboard-page">
      <section className="admin-loader-shell">
        <div className="admin-loader-card">
          <div className="admin-loader-icon">
            <Loader2 size={34} />
          </div>

          <h1>{title}</h1>

          <p>{message}</p>

          <div className="admin-loader-progress">
            <span />
          </div>

          <div className="admin-skeleton-grid">
            <div />
            <div />
            <div />
          </div>
        </div>
      </section>
    </main>
  );
}