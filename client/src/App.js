import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FullReportForm from './components/FullReportForm';
import CoverPageForm from './components/CoverPageForm';
import Footer from './components/Footer';

export default function App() {
  const [activeService, setActiveService] = useState(null); // 'report' | 'cover' | null

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Hero activeService={activeService} onSelectService={setActiveService} />
        {activeService === 'report' && (
          <FullReportForm onBack={() => setActiveService(null)} />
        )}
        {activeService === 'cover' && (
          <CoverPageForm onBack={() => setActiveService(null)} />
        )}
      </main>
      <Footer />
    </div>
  );
}
