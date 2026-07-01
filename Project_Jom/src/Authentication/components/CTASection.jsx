// components/CTASection.jsx
import React from 'react';

export default function CTASection() {
  return (
    <section className="cta-section" id="demo">
      <h2 className="cta-section__title">
        Ready to simplify<br />government services?
      </h2>
      <p className="cta-section__sub">
        Join thousands of Tampines residents — free, fast, and always available.
      </p>
      <div className="cta-section__actions">
        <a href="/auth?mode=register" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          Login with Singpass
        </a>
        <a href="/select-profile" className="btn btn-secondary">
          Continue as Demo Resident
        </a>
      </div>
    </section>
  );
}
