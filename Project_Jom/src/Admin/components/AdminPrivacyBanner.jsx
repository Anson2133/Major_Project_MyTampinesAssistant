import { ShieldCheck } from "lucide-react";

export default function AdminPrivacyBanner() {
  return (
    <section className="admin-privacy-banner">
      <div className="admin-privacy-icon">
        <ShieldCheck size={24} />
      </div>

      <div>
        <strong>Confidential, privacy-first analytics</strong>
        <p>
          This dashboard uses anonymised and aggregated interaction data only.
          It does not display individual names, NRICs, addresses, phone numbers,
          raw chat messages, or uploaded document contents. Insights are used to
          improve service design, not monitor individual residents.
        </p>
      </div>
    </section>
  );
}