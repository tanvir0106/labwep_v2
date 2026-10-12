const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { compileLaTeX, cleanOldOutputs } = require('../utils/latex');
const { generateFullReportLaTeX } = require('../templates/latexTemplates');

/**
 * POST /api/report/generate
 * Body: JSON with full report data
 * Returns: { success, downloadUrl, fileName } or { error }
 */
router.post('/generate', async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.studentName && !data.experimentTitle) {
      return res.status(400).json({ error: 'Please provide at least student name or experiment title.' });
    }

    // Generate LaTeX
    const latexContent = generateFullReportLaTeX(data);

    // Compile to PDF
    const outputName = `report_${uuidv4().slice(0, 8)}`;
    const result = await compileLaTeX(latexContent, outputName);

    if (!result.success) {
      console.error('LaTeX error:', result.error);
      return res.status(500).json({
        error: 'PDF generation failed. Please check your input.',
        details: result.error,
        latex: latexContent, // Return LaTeX for debugging
      });
    }

    // Clean old files
    cleanOldOutputs();

    return res.json({
      success: true,
      downloadUrl: `/outputs/${result.fileName}`,
      fileName: result.fileName,
      latex: latexContent, // Also return raw LaTeX
    });
  } catch (err) {
    console.error('Report generation error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/report/latex
 * Returns just the LaTeX source (no compilation)
 */
router.post('/latex', (req, res) => {
  try {
    const latexContent = generateFullReportLaTeX(req.body);
    res.setHeader('Content-Type', 'text/plain');
    res.send(latexContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
