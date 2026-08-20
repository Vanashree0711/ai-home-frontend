import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import GalleryPage from './pages/GalleryPage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import DesignStudioPage from './pages/DesignStudioPage';
import ChatPage from './pages/ChatPage';
import Navbar from './components/layout/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { MessageSquare } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-primary text-pearl relative">
        <Navbar />
        <main className="flex-grow">
          <ErrorBoundary>
            <Routes>
              {/* All routes are open — no login required */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/studio" element={<DesignStudioPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Global Floating AI Chat Widget */}
        <Link
          to="/chat"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
          title="Chat with AI Architect"
        >
          <span className="hidden md:inline bg-[#121212] border border-white/10 text-pearl text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Chat with AI Architect
          </span>
          <div className="bg-gold text-black p-4 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.7)]">
            <MessageSquare className="w-6 h-6" />
          </div>
        </Link>
      </div>
    </Router>
  );
}

export default App;
