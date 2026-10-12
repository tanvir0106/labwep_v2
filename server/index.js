const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const reportRoutes = require('./routes/report');
const coverRoutes = require('./routes/cover');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for outputs
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Routes
app.use('/api/report', reportRoutes);
app.use('/api/cover', coverRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lab Report Generator API is running' });
});

// Serve React build in production (Docker uses ./public, dev uses ../client/build)
const clientBuildPath = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '../client/build');

if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Ensure output and upload dirs exist
fs.ensureDirSync(path.join(__dirname, 'outputs'));
fs.ensureDirSync(path.join(__dirname, 'uploads'));

app.listen(PORT, () => {
  console.log(`\n🚀 Lab Report Server running at http://localhost:${PORT}`);
  console.log(`📄 API endpoints:`);
  console.log(`   POST /api/report/generate  - Generate full lab report`);
  console.log(`   POST /api/cover/generate   - Generate cover page`);
});
