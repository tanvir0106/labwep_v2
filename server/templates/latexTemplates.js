/**
 * Generates the full lab report LaTeX document.
 * @param {Object} data - Form data from the client
 * @returns {string} - Complete LaTeX document string
 */
function generateFullReportLaTeX(data) {
  const {
    // Course info
    courseCode = '',
    courseName = '',
    experimentNo = '',
    experimentTitle = '',
    // Student info
    studentName = '',
    studentId = '',
    department = '',
    semester = '',
    section = '',
    instructorName = '',
    submissionDate = '',
    universityName = '',
    universityLogo = '', // base64 or empty
    // Report sections
    objectives = [],     // array of strings
    introduction = '',
    codeBlocks = [],     // [{title, language, code}]
    outputImages = [],   // [{caption, base64}] - not used in LaTeX (optional)
    conclusion = '',
    // Options
    showTOC = true,
    programmingLanguage = 'Python',
  } = data;

  // Escape helper (inline for template use)
  const e = (s) => {
    if (!s) return '';
    return String(s)
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
  };

  // Objectives list
  const objectiveItems = objectives.length > 0
    ? objectives.map(obj => `    \\item ${e(obj)}`).join('\n')
    : '    \\item (No objectives provided)';

  // Code blocks
  const codeBlocksLaTeX = codeBlocks.map((block, idx) => {
    const lang = (block.language || programmingLanguage || 'Python').toLowerCase();
    const langMap = {
      python: 'Python',
      java: 'Java',
      c: 'C',
      cpp: 'C++',
      javascript: 'JavaScript',
      js: 'JavaScript',
      sql: 'SQL',
      bash: 'bash',
      pseudocode: 'Python', // Use Python style for pseudocode
    };
    const lstLang = langMap[lang] || 'Python';

    const title = e(block.title || `Code Example ${idx + 1}`);
    const code = block.code || '';

    return `\\subsection{${title}}

\\begin{codebox}{${title}}
${code}
\\end{codebox}
`;
  }).join('\n');

  // Format date
  const dateStr = submissionDate
    ? new Date(submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `\\documentclass{article}

%% ─── Packages ────────────────────────────────────────────────────────────────
\\usepackage{array}
\\usepackage{listings}
\\usepackage{xcolor}
\\usepackage{tcolorbox}
\\tcbuselibrary{listings, skins, breakable}
\\usepackage[a4paper, 
    left=3cm,
    right=2cm,
    top=2.5cm,
    bottom=2.5cm
]{geometry}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage{titlesec}
\\usepackage{parskip}
\\usepackage{setspace}
\\usepackage{booktabs}
\\usepackage{enumitem}

%% ─── Colors ──────────────────────────────────────────────────────────────────
\\definecolor{codegreen}{rgb}{0,0.6,0}
\\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\\definecolor{codepurple}{rgb}{0.58,0,0.82}
\\definecolor{backcolour}{rgb}{1.0, 0.94, 0.96}
\\definecolor{primaryblue}{RGB}{30, 90, 160}
\\definecolor{accentblue}{RGB}{50, 120, 200}

%% ─── Code Style ──────────────────────────────────────────────────────────────
\\lstdefinestyle{mystyle}{
    backgroundcolor=\\color{backcolour},   
    commentstyle=\\color{codegreen},
    keywordstyle=\\color{magenta},
    numberstyle=\\tiny\\color{codegray},
    stringstyle=\\color{codepurple},
    basicstyle=\\ttfamily\\footnotesize,
    breakatwhitespace=false,         
    breaklines=true,                 
    captionpos=b,                    
    keepspaces=true,                 
    numbers=left,                    
    numbersep=5pt,                  
    showspaces=false,                
    showstringspaces=false,
    showtabs=false,                  
    tabsize=2,
    language=${programmingLanguage}
}

\\newtcblisting{codebox}[2][]{
    width=0.85\\linewidth,
    center,
    enhanced,
    breakable,
    frame style={line width=1.5pt, blue!50!black},
    colback=backcolour,
    colframe=blue!50!black,
    fonttitle=\\bfseries,
    title=#2,
    listing only,
    listing options={style=mystyle},
    #1
}

%% ─── Header / Footer ─────────────────────────────────────────────────────────
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\small\\textcolor{primaryblue}{${e(courseCode)} -- ${e(courseName)}}}
\\fancyhead[R]{\\small\\textcolor{primaryblue}{Exp \\#${e(experimentNo)}}}
\\fancyfoot[C]{\\thepage}
\\renewcommand{\\headrulewidth}{0.4pt}
\\renewcommand{\\footrulewidth}{0.4pt}

%% ─── Section Formatting ──────────────────────────────────────────────────────
\\titleformat{\\section}
  {\\large\\bfseries\\color{primaryblue}}
  {\\thesection}{1em}{}[\\titlerule]

\\titleformat{\\subsection}
  {\\normalsize\\bfseries\\color{accentblue}}
  {\\thesubsection}{1em}{}

%% ─── Hyperref Setup ──────────────────────────────────────────────────────────
\\hypersetup{
    colorlinks=true,
    linkcolor=primaryblue,
    urlcolor=accentblue,
}

%% ═══════════════════════════════════════════════════════════════════════════
\\begin{document}

%% ─── Cover Page ──────────────────────────────────────────────────────────────
\\begin{titlepage}
\\centering
\\vspace*{1cm}

{\\Large\\bfseries\\color{primaryblue} ${e(universityName || 'University Name')}\\par}
\\vspace{0.5cm}
{\\large Department of ${e(department || 'Computer Science \\& Engineering')}\\par}

\\vspace{0.8cm}
\\noindent\\rule{\\linewidth}{2pt}
\\vspace{0.3cm}

{\\LARGE\\bfseries Lab Report\\par}
\\vspace{0.4cm}
{\\Large ${e(courseCode)} -- ${e(courseName)}\\par}

\\vspace{0.3cm}
\\noindent\\rule{\\linewidth}{2pt}
\\vspace{1cm}

\\begin{tabular}{ll}
  \\toprule
  \\textbf{Experiment No.}  & ${e(experimentNo)} \\\\[4pt]
  \\textbf{Experiment Title} & \\parbox{8cm}{${e(experimentTitle)}} \\\\[4pt]
  \\midrule
  \\textbf{Student Name}    & ${e(studentName)} \\\\[4pt]
  \\textbf{Student ID}      & ${e(studentId)} \\\\[4pt]
  \\textbf{Department}      & ${e(department)} \\\\[4pt]
  \\textbf{Semester / Year} & ${e(semester)} \\\\[4pt]
  \\textbf{Section}         & ${e(section)} \\\\[4pt]
  \\midrule
  \\textbf{Instructor}      & ${e(instructorName)} \\\\[4pt]
  \\textbf{Submission Date} & ${e(dateStr)} \\\\[4pt]
  \\bottomrule
\\end{tabular}

\\vfill
{\\small Generated by Lab Report Generator\\par}
\\end{titlepage}

%% ─── Table of Contents ───────────────────────────────────────────────────────
${showTOC ? `\\tableofcontents
\\newpage` : ''}

%% ─── Objectives ──────────────────────────────────────────────────────────────
\\section{Objectives}
\\begin{itemize}[leftmargin=1.5em]
${objectiveItems}
\\end{itemize}

%% ─── Introduction ────────────────────────────────────────────────────────────
\\section{Introduction}
${e(introduction) || 'No introduction provided.'}

%% ─── Code Experiments ────────────────────────────────────────────────────────
\\section{Python Code Examples}

${codeBlocksLaTeX || '\\textit{No code blocks provided.}'}

%% ─── Conclusion ──────────────────────────────────────────────────────────────
\\section{Conclusion}
${e(conclusion) || 'No conclusion provided.'}

\\end{document}
`;
}

/**
 * Generates a cover page only LaTeX document.
 */
function generateCoverPageLaTeX(data) {
  const {
    courseCode = '',
    courseName = '',
    experimentNo = '',
    experimentTitle = '',
    studentName = '',
    studentId = '',
    department = '',
    semester = '',
    section = '',
    instructorName = '',
    submissionDate = '',
    universityName = '',
    groupMembers = [],
  } = data;

  const e = (s) => {
    if (!s) return '';
    return String(s)
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
  };

  const dateStr = submissionDate
    ? new Date(submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const groupTable = groupMembers.length > 0
    ? `\\vspace{0.5cm}
{\\large\\bfseries Group Members\\par}
\\vspace{0.3cm}
\\begin{tabular}{clc}
  \\toprule
  \\textbf{\\#} & \\textbf{Name} & \\textbf{ID} \\\\
  \\midrule
  ${groupMembers.map((m, i) => `${i + 1} & ${e(m.name)} & ${e(m.id)} \\\\`).join('\n  ')}
  \\bottomrule
\\end{tabular}`
    : '';

  return `\\documentclass{article}

\\usepackage{geometry}
\\geometry{a4paper, margin=2.5cm}
\\usepackage{xcolor}
\\usepackage{booktabs}
\\usepackage{hyperref}
\\usepackage{parskip}
\\usepackage{setspace}

\\definecolor{primaryblue}{RGB}{30, 90, 160}

\\hypersetup{colorlinks=true, linkcolor=primaryblue}

\\begin{document}
\\begin{titlepage}
\\centering

\\vspace*{1.5cm}
{\\Large\\bfseries\\color{primaryblue} ${e(universityName || 'University Name')}\\par}
\\vspace{0.4cm}
{\\large Department of ${e(department || 'Computer Science \\& Engineering')}\\par}

\\vspace{1cm}
\\noindent\\rule{\\linewidth}{2.5pt}
\\vspace{0.4cm}

{\\LARGE\\bfseries Lab Report\\par}
\\vspace{0.5cm}
{\\Large\\bfseries ${e(courseCode)} -- ${e(courseName)}\\par}

\\vspace{0.4cm}
\\noindent\\rule{\\linewidth}{2.5pt}
\\vspace{1.5cm}

\\begin{tabular}{ll}
  \\toprule
  \\textbf{Experiment No.}   & ${e(experimentNo)} \\\\[5pt]
  \\textbf{Experiment Title} & \\parbox{8cm}{${e(experimentTitle)}} \\\\[5pt]
  \\midrule
  \\textbf{Student Name}     & ${e(studentName)} \\\\[5pt]
  \\textbf{Student ID}       & ${e(studentId)} \\\\[5pt]
  \\textbf{Department}       & ${e(department)} \\\\[5pt]
  \\textbf{Semester / Year}  & ${e(semester)} \\\\[5pt]
  \\textbf{Section}          & ${e(section)} \\\\[5pt]
  \\midrule
  \\textbf{Instructor}       & ${e(instructorName)} \\\\[5pt]
  \\textbf{Submission Date}  & ${e(dateStr)} \\\\[5pt]
  \\bottomrule
\\end{tabular}

${groupTable}

\\vfill
{\\small Generated by Lab Report Generator \\textbullet{} ${new Date().getFullYear()}\\par}
\\end{titlepage}
\\end{document}
`;
}

module.exports = { generateFullReportLaTeX, generateCoverPageLaTeX };
