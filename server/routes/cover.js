const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { compileLaTeX, cleanOldOutputs } = require('../utils/latex');
const { generateCoverPageLaTeX } = require('../templates/latexTemplates');

/**
 * POST /api/cover/generate
 * Body: JSON with cover page data
 * Returns: { success, downloadUrl, fileName } or { error }
 */
router.post('/generate', async (req, res) => {
  try {
    const data = req.body;

    const latexContent = generateCoverPageLaTeX(data);
    const outputName = `cover_${uuidv4().slice(0, 8)}`;
    const result = await compileLaTeX(latexContent, outputName);

    if (!result.success) {
      console.error('LaTeX error:', result.error);
      return res.status(500).json({
        error: 'PDF generation failed.',
        details: result.error,
        latex: latexContent,
      });
    }

    cleanOldOutputs();

    return res.json({
      success: true,
      downloadUrl: `/outputs/${result.fileName}`,
      fileName: result.fileName,
      latex: latexContent,
    });
  } catch (err) {
    console.error('Cover generation error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/cover/latex
 * Returns just the LaTeX source
 */
router.post('/latex', (req, res) => {
  try {
    const latexContent = generateCoverPageLaTeX(req.body);
    res.setHeader('Content-Type', 'text/plain');
    res.send(latexContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
