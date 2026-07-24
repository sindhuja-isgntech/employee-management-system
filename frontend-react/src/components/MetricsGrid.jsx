import React from 'react';

export default function MetricsGrid({ total, active, other }) {
  return (
    <section className="metrics-grid" aria-labelledby="metrics-title">
      <h3 id="metrics-title" className="sr-only">Key Statistics</h3>

      <article className="metric-card">
        <h4>Total Workforce</h4>
        <p className="metric-value">{total}</p>
        <span className="metric-trend positive">Live System Count</span>
      </article>

      <article className="metric-card">
        <h4>Active Staff</h4>
        <p className="metric-value">{active}</p>
        <span className="metric-subtext">Currently working</span>
      </article>

      <article className="metric-card">
        <h4>Onboarding / Leave</h4>
        <p className="metric-value">{other}</p>
        <span className="metric-subtext">Pending / Away</span>
      </article>
    </section>
  );
}