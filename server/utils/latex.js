const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

/**
 * Escapes special LaTeX characters in a string.
 */
function escapeLaTeX(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Compiles a LaTeX string to PDF and saves it to outputPath.
 * Returns { success, pdfPath, error }
 */
async function compileLaTeX(latexContent, outputName) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'labreport-'));
  const texFile = path.join(workDir, 'report.tex');
  const outputsDir = path.join(__dirname, '..', 'outputs');

  try {
    fs.writeFileSync(texFile, latexContent, 'utf8');

    // Try pdflatex (MiKTeX/TeX Live)
    const pdflatexCmd = `pdflatex -interaction=nonstopmode -output-directory="${workDir}" "${texFile}"`;
    
    try {
      execSync(pdflatexCmd, { timeout: 60000, stdio: 'pipe' });
      // Run twice for TOC
      execSync(pdflatexCmd, { timeout: 60000, stdio: 'pipe' });
    } catch (latexErr) {
      // Check if PDF was still created despite errors
      const pdfInWork = path.join(workDir, 'report.pdf');
      if (!fs.existsSync(pdfInWork)) {
        // Try to find log for error info
        const logFile = path.join(workDir, 'report.log');
        const logContent = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').slice(-2000) : 'No log';
        throw new Error(`LaTeX compilation failed:\n${logContent}`);
      }
    }

    const pdfSrc = path.join(workDir, 'report.pdf');
    const pdfDest = path.join(outputsDir, `${outputName}.pdf`);
    fs.copySync(pdfSrc, pdfDest);

    // Cleanup temp dir
    fs.removeSync(workDir);

    return { success: true, pdfPath: pdfDest, fileName: `${outputName}.pdf` };
  } catch (err) {
    fs.removeSync(workDir);
    return { success: false, error: err.message };
  }
}

/**
 * Clean old output files (older than 1 hour)
 */
function cleanOldOutputs() {
  const outputsDir = path.join(__dirname, '..', 'outputs');
  const files = fs.readdirSync(outputsDir);
  const now = Date.now();
  files.forEach(file => {
    const filePath = path.join(outputsDir, file);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > 3600000) {
      fs.removeSync(filePath);
    }
  });
}

module.exports = { escapeLaTeX, compileLaTeX, cleanOldOutputs };
