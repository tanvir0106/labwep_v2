import React from 'react';

const services = [
  {
    id: 'report',
    icon: '📄',
    iconClass: 'report-icon',
    title: 'Full Lab Report',
    description:
      'Generate a complete lab report with cover page, table of contents, objectives, introduction, code sections with syntax highlighting, and conclusion.',
    badge: 'Full Report',
    badgeClass: 'full',
    features: ['Cover Page', 'TOC', 'Objectives', 'Code Blocks', 'Conclusion'],
  },
  {
    id: 'cover',
    icon: '🎓',
    iconClass: 'cover-icon',
    title: 'Cover Page Only',
    description:
      'Generate a professional cover page for your lab report with student info, course details, and optional group members table.',
    badge: 'Cover Only',
    badgeClass: 'cover',
    features: ['Student Info', 'Course Details', 'Group Members', 'Professional Layout'],
  },
];

export default function Hero({ activeService, onSelectService }) {
  return (
    <>
      {!activeService && (
        <div className="hero">
          <h1>
            Generate <span>Lab Reports</span>
            <br />
            with LaTeX Quality
          </h1>
          <p>
            Fill in your details, add code examples, and download a beautifully formatted PDF — ready to submit.
          </p>
        </div>
      )}

      {!activeService && (
        <div className="service-grid">
          {services.map((s) => (
            <div
              key={s.id}
              className={`service-card ${activeService === s.id ? 'active' : ''}`}
              onClick={() => onSelectService(s.id)}
            >
              <div className={`service-card-icon ${s.iconClass}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
                {s.features.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      background: 'var(--surface-2)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <span className={`service-badge ${s.badgeClass}`}>{s.badge}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
