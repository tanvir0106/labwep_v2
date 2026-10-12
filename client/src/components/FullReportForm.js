import React, { useState } from 'react';
import axios from 'axios';

const LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'SQL', 'Bash', 'Pseudocode', 'Other'];

const STEPS = [
  { label: 'Course Info' },
  { label: 'Student Info' },
  { label: 'Objectives' },
  { label: 'Content' },
  { label: 'Code' },
  { label: 'Generate' },
];

const initialData = {
  // Step 1 - Course
  universityName: '',
  courseCode: '',
  courseName: '',
  experimentNo: '',
  experimentTitle: '',
  programmingLanguage: 'Python',
  // Step 2 - Student
  studentName: '',
  studentId: '',
  department: '',
  semester: '',
  section: '',
  instructorName: '',
  submissionDate: '',
  // Step 3 - Objectives
  objectives: [''],
  // Step 4 - Content
  introduction: '',
  conclusion: '',
  // Step 5 - Code
  codeBlocks: [{ title: '', language: 'Python', code: '' }],
  // Options
  showTOC: true,
};

export default function FullReportForm({ onBack }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, downloadUrl, fileName, error, latex }
  const [showLatex, setShowLatex] = useState(false);

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));

  // ── Objectives helpers ────────────────────────────────
  const addObjective = () => setData((d) => ({ ...d, objectives: [...d.objectives, ''] }));
  const updateObjective = (i, val) =>
    setData((d) => {
      const arr = [...d.objectives];
      arr[i] = val;
      return { ...d, objectives: arr };
    });
  const removeObjective = (i) =>
    setData((d) => ({ ...d, objectives: d.objectives.filter((_, idx) => idx !== i) }));

  // ── Code block helpers ────────────────────────────────
  const addCodeBlock = () =>
    setData((d) => ({
      ...d,
      codeBlocks: [...d.codeBlocks, { title: '', language: d.programmingLanguage, code: '' }],
    }));
  const updateCodeBlock = (i, field, val) =>
    setData((d) => {
      const arr = [...d.codeBlocks];
      arr[i] = { ...arr[i], [field]: val };
      return { ...d, codeBlocks: arr };
    });
  const removeCodeBlock = (i) =>
    setData((d) => ({ ...d, codeBlocks: d.codeBlocks.filter((_, idx) => idx !== i) }));

  // ── Submit ─────────────────────────────────────────────
  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const resp = await axios.post('/api/report/generate', data);
      setResult({ success: true, ...resp.data });
    } catch (err) {
      const errData = err.response?.data || {};
      setResult({ success: false, error: errData.error || 'Server error', latex: errData.latex });
    } finally {
      setLoading(false);
    }
  };

  // ── Download LaTeX source ──────────────────────────────
  const downloadLatex = () => {
    if (!result?.latex) return;
    const blob = new Blob([result.latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab_report_${data.experimentNo || 'exp'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Reset ──────────────────────────────────────────────
  const handleReset = () => {
    setData(initialData);
    setStep(0);
    setResult(null);
    setShowLatex(false);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <span style={{ fontSize: '1.5rem' }}>📄</span>
        <div>
          <h2>Full Lab Report Generator</h2>
          <p>Fill in each section to generate your complete lab report PDF</p>
        </div>
        <button
          className="btn btn-secondary"
          style={{ marginLeft: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
          onClick={onBack}
        >
          ← Back
        </button>
      </div>

      <div className="form-body">
        {/* Step progress */}
        <StepProgress steps={STEPS} current={step} />

        {/* Loading */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">Compiling LaTeX and generating your PDF…</p>
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <ResultView
            result={result}
            showLatex={showLatex}
            onToggleLatex={() => setShowLatex((v) => !v)}
            onDownloadLatex={downloadLatex}
            onReset={handleReset}
          />
        )}

        {/* Form Steps */}
        {!loading && !result && (
          <>
            {step === 0 && <Step1CourseInfo data={data} update={update} />}
            {step === 1 && <Step2StudentInfo data={data} update={update} />}
            {step === 2 && (
              <Step3Objectives
                objectives={data.objectives}
                onAdd={addObjective}
                onUpdate={updateObjective}
                onRemove={removeObjective}
              />
            )}
            {step === 3 && <Step4Content data={data} update={update} />}
            {step === 4 && (
              <Step5CodeBlocks
                blocks={data.codeBlocks}
                defaultLang={data.programmingLanguage}
                onAdd={addCodeBlock}
                onUpdate={updateCodeBlock}
                onRemove={removeCodeBlock}
              />
            )}
            {step === 5 && (
              <Step6Preview
                data={data}
                update={update}
                onGenerate={handleGenerate}
              />
            )}

            <div className="form-nav">
              <button
                className="btn btn-secondary"
                onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))}
              >
                ← {step === 0 ? 'Home' : 'Back'}
              </button>
              {step < STEPS.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                  Next →
                </button>
              ) : (
                <button className="btn btn-success btn-lg" onClick={handleGenerate}>
                  ✨ Generate PDF
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Step Progress ──────────────────────────────────────────────────────────────
function StepProgress({ steps, current }) {
  return (
    <div className="step-progress">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="step-content">
            <div className={`step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`step-label ${i === current ? 'active' : ''}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-connector ${i < current ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Step 1: Course Info ────────────────────────────────────────────────────────
function Step1CourseInfo({ data, update }) {
  return (
    <div className="form-section">
      <div className="form-section-title">🏫 Course Information</div>
      <div className="form-grid">
        <div className="field-group full-width">
          <label>University / Institution Name</label>
          <input
            type="text"
            placeholder="e.g. Bangladesh University of Engineering & Technology"
            value={data.universityName}
            onChange={(e) => update('universityName', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Course Code <span className="required">*</span></label>
          <input
            type="text"
            placeholder="e.g. CSE 2101"
            value={data.courseCode}
            onChange={(e) => update('courseCode', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Course Name <span className="required">*</span></label>
          <input
            type="text"
            placeholder="e.g. Data Structures & Algorithms Lab"
            value={data.courseName}
            onChange={(e) => update('courseName', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Experiment Number</label>
          <input
            type="text"
            placeholder="e.g. 3"
            value={data.experimentNo}
            onChange={(e) => update('experimentNo', e.target.value)}
          />
        </div>
        <div className="field-group full-width">
          <label>Experiment Title <span className="required">*</span></label>
          <input
            type="text"
            placeholder="e.g. Implementation of Stack and Queue using Python"
            value={data.experimentTitle}
            onChange={(e) => update('experimentTitle', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Programming Language</label>
          <select value={data.programmingLanguage} onChange={(e) => update('programmingLanguage', e.target.value)}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Student Info ───────────────────────────────────────────────────────
function Step2StudentInfo({ data, update }) {
  return (
    <div className="form-section">
      <div className="form-section-title">🎓 Student Information</div>
      <div className="form-grid">
        <div className="field-group">
          <label>Student Name <span className="required">*</span></label>
          <input
            type="text"
            placeholder="e.g. Tanvir Hassan"
            value={data.studentName}
            onChange={(e) => update('studentName', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Student ID</label>
          <input
            type="text"
            placeholder="e.g. 2201012"
            value={data.studentId}
            onChange={(e) => update('studentId', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Department</label>
          <input
            type="text"
            placeholder="e.g. CSE"
            value={data.department}
            onChange={(e) => update('department', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Semester / Year</label>
          <input
            type="text"
            placeholder="e.g. 3rd Semester, 2026"
            value={data.semester}
            onChange={(e) => update('semester', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Section</label>
          <input
            type="text"
            placeholder="e.g. A"
            value={data.section}
            onChange={(e) => update('section', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Instructor Name</label>
          <input
            type="text"
            placeholder="e.g. Dr. Md. Kamal Hossain"
            value={data.instructorName}
            onChange={(e) => update('instructorName', e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Submission Date</label>
          <input
            type="date"
            value={data.submissionDate}
            onChange={(e) => update('submissionDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Objectives ─────────────────────────────────────────────────────────
function Step3Objectives({ objectives, onAdd, onUpdate, onRemove }) {
  return (
    <div className="form-section">
      <div className="form-section-title">🎯 Objectives</div>
      <div className="info-box">
        ℹ️ List each objective on a separate line. These will appear as bullet points in the report.
      </div>
      <div className="objectives-list">
        {objectives.map((obj, i) => (
          <div className="objective-item" key={i}>
            <input
              type="text"
              placeholder={`Objective ${i + 1}…`}
              value={obj}
              onChange={(e) => onUpdate(i, e.target.value)}
            />
            {objectives.length > 1 && (
              <button className="btn-remove" onClick={() => onRemove(i)} title="Remove">✕</button>
            )}
          </div>
        ))}
      </div>
      <button className="btn-add" onClick={onAdd}>
        + Add Objective
      </button>
    </div>
  );
}

// ── Step 4: Introduction & Conclusion ─────────────────────────────────────────
function Step4Content({ data, update }) {
  return (
    <div className="form-section">
      <div className="form-section-title">📝 Report Content</div>
      <div className="field-group" style={{ marginBottom: '1.25rem' }}>
        <label>Introduction</label>
        <textarea
          rows={7}
          placeholder="Write a brief introduction covering the theory and concepts behind this experiment…"
          value={data.introduction}
          onChange={(e) => update('introduction', e.target.value)}
        />
      </div>
      <div className="field-group">
        <label>Conclusion</label>
        <textarea
          rows={6}
          placeholder="Summarize what you learned and achieved in this experiment…"
          value={data.conclusion}
          onChange={(e) => update('conclusion', e.target.value)}
        />
      </div>
    </div>
  );
}

// ── Step 5: Code Blocks ────────────────────────────────────────────────────────
function Step5CodeBlocks({ blocks, defaultLang, onAdd, onUpdate, onRemove }) {
  return (
    <div className="form-section">
      <div className="form-section-title">💻 Code Examples</div>
      <div className="info-box">
        ℹ️ Each code block becomes a subsection in the report with syntax highlighting.
      </div>
      <div className="code-blocks-list">
        {blocks.map((block, i) => (
          <div className="code-block-card" key={i}>
            <div className="code-block-header">
              <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{i + 1}</span>
              <input
                type="text"
                placeholder="Subsection title, e.g. Write pseudocode for Stack and Queue"
                value={block.title}
                onChange={(e) => onUpdate(i, 'title', e.target.value)}
              />
              <select
                className="lang-select"
                value={block.language}
                onChange={(e) => onUpdate(i, 'language', e.target.value)}
              >
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
              {blocks.length > 1 && (
                <button className="btn-remove" onClick={() => onRemove(i)} title="Remove block">✕</button>
              )}
            </div>
            <div className="code-block-body">
              <textarea
                rows={10}
                placeholder="Paste your code here…"
                value={block.code}
                onChange={(e) => onUpdate(i, 'code', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <button className="btn-add" onClick={onAdd}>
          + Add Code Block
        </button>
      </div>
    </div>
  );
}

// ── Step 6: Preview & Options ──────────────────────────────────────────────────
function Step6Preview({ data, update, onGenerate }) {
  return (
    <div className="form-section">
      <div className="form-section-title">⚙️ Options & Review</div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="toggle-row">
          <span className="toggle-label">Include Table of Contents</span>
          <label className="toggle">
            <input type="checkbox" checked={data.showTOC} onChange={(e) => update('showTOC', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', border: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>📋 Report Summary</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <tbody>
            {[
              ['Course', `${data.courseCode} — ${data.courseName}`],
              ['Experiment', `#${data.experimentNo}: ${data.experimentTitle}`],
              ['Student', `${data.studentName} (${data.studentId})`],
              ['Department', `${data.department}, Sem: ${data.semester}`],
              ['Objectives', `${data.objectives.filter(Boolean).length} objectives`],
              ['Code Blocks', `${data.codeBlocks.length} block(s)`],
              ['Language', data.programmingLanguage],
              ['TOC', data.showTOC ? 'Yes' : 'No'],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 500, color: 'var(--text-muted)', width: '35%' }}>{k}</td>
                <td style={{ padding: '0.5rem', color: 'var(--text)' }}>{v || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Result View ────────────────────────────────────────────────────────────────
function ResultView({ result, showLatex, onToggleLatex, onDownloadLatex, onReset }) {
  if (result.success) {
    return (
      <div className="result-card">
        <div className="result-icon success">✅</div>
        <h3>Your PDF is Ready!</h3>
        <p>Your lab report has been compiled successfully. Click below to download.</p>
        <div className="result-actions">
          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="btn btn-success btn-lg"
          >
            ⬇ Download PDF
          </a>
          <button className="btn btn-secondary" onClick={onDownloadLatex}>
            📄 Download .tex
          </button>
          <button className="btn btn-secondary" onClick={onToggleLatex}>
            {showLatex ? 'Hide' : 'View'} LaTeX Source
          </button>
          <button className="btn btn-secondary" onClick={onReset}>
            🔄 New Report
          </button>
        </div>
        {showLatex && result.latex && (
          <pre className="latex-preview">{result.latex}</pre>
        )}
      </div>
    );
  }

  return (
    <div className="result-card">
      <div className="result-icon error">❌</div>
      <h3>Generation Failed</h3>
      <p>{result.error}</p>
      <div className="result-actions">
        {result.latex && (
          <>
            <button className="btn btn-secondary" onClick={onDownloadLatex}>
              📄 Download .tex Source
            </button>
            <button className="btn btn-secondary" onClick={onToggleLatex}>
              {showLatex ? 'Hide' : 'View'} LaTeX
            </button>
          </>
        )}
        <button className="btn btn-primary" onClick={onReset}>
          ← Try Again
        </button>
      </div>
      {showLatex && result.latex && (
        <pre className="latex-preview">{result.latex}</pre>
      )}
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left', maxWidth: '500px', margin: '1rem auto 0' }}>
        <strong>Tip:</strong> If pdflatex is not installed, download the .tex file and compile it with{' '}
        <a href="https://miktex.org/download" target="_blank" rel="noreferrer">MiKTeX</a>{' '}
        or upload to <a href="https://overleaf.com" target="_blank" rel="noreferrer">Overleaf.com</a>.
      </div>
    </div>
  );
}
