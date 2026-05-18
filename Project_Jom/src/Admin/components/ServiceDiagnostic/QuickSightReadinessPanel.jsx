import { BarChart3, Database, FileSpreadsheet } from "lucide-react";

export default function QuickSightReadinessPanel() {
  return (
    <section className="admin-quicksight-panel">
      <div className="admin-section-header">
        <span className="admin-section-kicker">Amazon QuickSight Ready</span>
        <h2>BI dashboard expansion path</h2>
        <p>
          The same diagnostics can be exported into Amazon S3 as CSV and
          connected to Amazon QuickSight for agency-level dashboards.
        </p>
      </div>

      <div className="admin-quicksight-grid">
        <article>
          <Database size={24} />
          <strong>DynamoDB source</strong>
          <p>
            AdminInteractions stores anonymised journey events such as service
            views, chatbot follow-ups, outcomes, and session duration.
          </p>
        </article>

        <article>
          <FileSpreadsheet size={24} />
          <strong>S3 analytics export</strong>
          <p>
            Lambda or CloudShell can export service diagnostics into a CSV file
            for QuickSight ingestion.
          </p>
        </article>

        <article>
          <BarChart3 size={24} />
          <strong>QuickSight visuals</strong>
          <p>
            Suggested visuals: diagnostics score by service, category score,
            success rate versus difficulty rate, and top entry point by service.
          </p>
        </article>
      </div>
    </section>
  );
}