import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/">
        <div className="navbar-logo">L</div>
        <div>
          <div className="navbar-title">LabReport.io</div>
          <div className="navbar-subtitle">Professional Lab Reports in Minutes</div>
        </div>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a
          href="https://www.latex-project.org/"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          Powered by LaTeX
        </a>
      </div>
    </nav>
  );
}
