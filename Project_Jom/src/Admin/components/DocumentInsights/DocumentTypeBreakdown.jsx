export default function DocumentTypeBreakdown({ documentInsights }) {
    const documentTypes = documentInsights.documentTypes || [];
    const maxCount = Math.max(...documentTypes.map((item) => item.count), 1);

    return (
        <section className="document-breakdown-section">
            <div className="admin-section-header">
                <span className="admin-section-kicker">Document Types</span>
                <h2>What residents are scanning</h2>
                <p>
                    Aggregated document categories only. The dashboard does not show the
                    uploaded file, image, or full extracted text.
                </p>
            </div>

            <div className="document-breakdown-list">
                {documentTypes.slice(0, 8).map((item) => {
                    const width = Math.round((item.count / maxCount) * 100);

                    return (
                        <article className="document-breakdown-row" key={item.documentType}>
                            <div className="document-breakdown-top">
                                <strong>{item.documentType}</strong>
                                <span>{item.count.toLocaleString("en-SG")} events</span>
                            </div>

                            <div className="document-breakdown-track">
                                <div style={{ width: `${width}%` }} />
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}