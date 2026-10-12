import React, { useState } from 'react';
import axios from 'axios';

const initialData = {
  universityName: '',
  courseCode: '',
  courseName: '',
  experimentNo: '',
  experimentTitle: '',
  studentName: '',
  studentId: '',
  department: '',
  semester: '',
  section: '',
  instructorName: '',
  submissionDate: '',
  groupMembers: [],
};

export default function CoverPageForm({ onBack }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showLatex, setShowLatex] = useState(false);
  const [hasGroupMembers, setHasGroupMembers] = useState(false);

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));

  // Group member helpers
  const addMember = () =>
    setData((d) => ({ ...d, groupMembers: [...d.groupMembers, { name: '', id: '' }] }));
  const updateMember = (i, field, val) =>
    setData((d) => {
      const arr = [...d.groupMembers];
      arr[i] = { ...arr[i], [field]: val };
      return { ...d, groupMembers: arr };
    });
  const removeMember = (i) =>
    setData((d) => ({ ...d, groupMembers: d.groupMembers.filter((_, idx) => idx !== i) }));

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = { ...data, groupMembers: hasGroupMembers ? data.groupMembers : [] };
      const resp = await axios.post('/api/cover/generate', payload);
      setResult({ success: true, ...resp.data });
    } catch (err) {
      const errData = err.response?.data || {};
      setResult({ success: false, error: errData.error || 'Server error', latex: errData.latex });
    } finally {
      setLoading(false);
    }
  };

  const downloadLatex = () => {
    if (!result?.latex) return;
    const blob = new Blob([result.latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_page_${data.experimentNo || 'exp'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setData(initialData);
    setResult(null);
    setShowLatex(false);
    setHasGroupMembers(false);
  };

  return (
    <div className="form-container">
      <div className="form-header" style={{ background: 'linear-gradient(135deg, #c2185b, #e84393)' }}>
        <span style={{ fontSize: '1.5rem' }}>🎓</span>
        <div>
          <h2>Cover Page Generator</h2>
          <p>Generate a professional cover page for your lab report</p>
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
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" style={{ borderTopColor: '#e84393' }} />
            <p className="loading-text">Generating your cover page…</p>
          </div>
        )}

        {!loading && result && (
          <CoverResult
            result={result}
            showLatex={showLatex}
            onToggleLatex={() => setShowLatex((v) => !v)}
            onDownloadLatex={downloadLatex}
            onReset={handleReset}
          />
        )}

        {!loading && !result && (
          <>
            {/* Course Info */}
            <div className="form-section">
              <div className="form-section-title" style={{ color: '#c2185b' }}>🏫 Course & Experiment</div>
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
                  <label>Course Code</label>
                  <input
                    type="text"
                    placeholder="CSE 2101"
                    value={data.courseCode}
                    onChange={(e) => update('courseCode', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    placeholder="Data Structures Lab"
                    value={data.courseName}
                    onChange={(e) => update('courseName', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Experiment No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 3"
                    value={data.experimentNo}
                    onChange={(e) => update('experimentNo', e.target.value)}
                  />
                </div>
                <div className="field-group full-width">
                  <label>Experiment Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Implementation of Stack and Queue"
                    value={data.experimentTitle}
                    onChange={(e) => update('experimentTitle', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="form-section">
              <div className="form-section-title" style={{ color: '#c2185b' }}>🎓 Student Information</div>
              <div className="form-grid">
                <div className="field-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={data.studentName}
                    onChange={(e) => update('studentName', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    placeholder="ID number"
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
                    placeholder="Instructor / supervisor"
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

            {/* Group Members */}
            <div className="form-section">
              <div className="toggle-row">
                <span className="form-section-title" style={{ color: '#c2185b', margin: 0, border: 'none', padding: 0 }}>
                  👥 Group Members Table
                </span>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={hasGroupMembers}
                    onChange={(e) => {
                      setHasGroupMembers(e.target.checked);
                      if (e.target.checked && data.groupMembers.length === 0) addMember();
                    }}
                  />
                  <span className="toggle-slider" style={{ '--toggle-on': '#c2185b' }} />
                </label>
              </div>

              {hasGroupMembers && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="info-box" style={{ background: '#fce7f3', borderColor: '#fbcfe8', color: '#9d174d' }}>
                    ℹ️ These members will appear in a table on the cover page.
                  </div>
                  {data.groupMembers.map((m, i) => (
                    <div className="group-member-item" key={i} style={{ marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder={`Member ${i + 1} Name`}
                        value={m.name}
                        onChange={(e) => updateMember(i, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="ID"
                        value={m.id}
                        onChange={(e) => updateMember(i, 'id', e.target.value)}
                      />
                      <button className="btn-remove" onClick={() => removeMember(i)}>✕</button>
                    </div>
                  ))}
                  <button
                    className="btn-add"
                    style={{ borderColor: '#c2185b', color: '#c2185b' }}
                    onClick={addMember}
                  >
                    + Add Member
                  </button>
                </div>
              )}
            </div>

            <div className="form-nav">
              <button className="btn btn-secondary" onClick={onBack}>← Home</button>
              <button className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #c2185b, #e84393)', color: 'white' }} onClick={handleGenerate}>
                ✨ Generate Cover PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CoverResult({ result, showLatex, onToggleLatex, onDownloadLatex, onReset }) {
  if (result.success) {
    return (
      <div className="result-card">
        <div className="result-icon" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', color: '#c2185b' }}>
          🎓
        </div>
        <h3>Cover Page Ready!</h3>
        <p>Your cover page has been generated. Download the PDF or get the LaTeX source.</p>
        <div className="result-actions">
          <a href={result.downloadUrl} download={result.fileName} className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #c2185b, #e84393)', color: 'white' }}>
            ⬇ Download PDF
          </a>
          <button className="btn btn-secondary" onClick={onDownloadLatex}>📄 Download .tex</button>
          <button className="btn btn-secondary" onClick={onToggleLatex}>
            {showLatex ? 'Hide' : 'View'} LaTeX
          </button>
          <button className="btn btn-secondary" onClick={onReset}>🔄 New Cover</button>
        </div>
        {showLatex && result.latex && <pre className="latex-preview">{result.latex}</pre>}
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
            <button className="btn btn-secondary" onClick={onDownloadLatex}>📄 Download .tex</button>
            <button className="btn btn-secondary" onClick={onToggleLatex}>
              {showLatex ? 'Hide' : 'View'} LaTeX
            </button>
          </>
        )}
        <button className="btn btn-primary" onClick={onReset}>← Try Again</button>
      </div>
      {showLatex && result.latex && <pre className="latex-preview">{result.latex}</pre>}
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <strong>Tip:</strong> Even if PDF fails, you can download the .tex and compile on{' '}
        <a href="https://overleaf.com" target="_blank" rel="noreferrer">Overleaf</a>.
      </div>
    </div>
  );
}
