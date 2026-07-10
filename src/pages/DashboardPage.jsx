import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Image as ImageIcon, MessageSquare, Plus, X, Download } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="glass-panel p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
    <div>
      <p className="text-gray-soft text-sm font-medium mb-1">{title}</p>
      <h3 className="text-4xl font-sans font-extrabold text-pearl tracking-tight">{value}</h3>
    </div>
    <div className="bg-primary p-3 rounded-xl border border-white/10">
      <Icon className="w-6 h-6 text-gold" />
    </div>
  </div>
);

// Full-screen project viewer modal
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0B0B] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-display font-bold text-gold mb-1">{project.name}</h2>
          <p className="text-gray-soft text-sm">{new Date(project.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          {project.description && (
            <p className="text-white/70 text-sm mt-2 leading-relaxed">{project.description}</p>
          )}
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {project.exterior_image && (
            <div className="rounded-2xl overflow-hidden border border-white/10 relative group bg-black/50">
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-3 z-10">
                <p className="text-white text-xs font-bold tracking-widest uppercase">🏠 Exterior Concept</p>
              </div>
              <img src={project.exterior_image} alt="Exterior" className="w-full h-64 object-cover" />
            </div>
          )}
          {project.interior_image && (
            <div className="rounded-2xl overflow-hidden border border-white/10 relative group bg-black/50">
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-3 z-10">
                <p className="text-white text-xs font-bold tracking-widest uppercase">🛋️ Interior Concept</p>
              </div>
              <img src={project.interior_image} alt="Interior" className="w-full h-64 object-cover" />
            </div>
          )}
          {project.floorplan_image && (
            <div className="rounded-2xl border border-white/10 bg-black/50 md:col-span-2">
              <div className="p-3">
                <p className="text-white text-xs font-bold tracking-widest uppercase">📐 Photorealistic 3D Layout</p>
              </div>
              <img src={project.floorplan_image} alt="Floorplan" className="rounded-b-2xl" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
          {!project.exterior_image && !project.interior_image && !project.floorplan_image && (
            <div className="md:col-span-2 text-center py-12 text-gray-soft">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Images from older projects may have expired. Generate a new design to see full previews.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end flex-wrap">
          {project.pdf_report && (
            <a
              href={`http://localhost:8000/download/${project.pdf_report}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gold text-black font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download PDF Blueprint
            </a>
          )}
          <Link
            to="/studio"
            className="flex items-center gap-2 border border-white/20 py-3 px-6 rounded-xl hover:bg-white/5 transition-colors font-medium"
            onClick={onClose}
          >
            <Plus className="w-4 h-4" />
            Design Another
          </Link>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen pb-20">
      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Welcome Back, {user?.name || 'Designer'}</h1>
          <p className="text-gray-soft">Here's what's happening with your projects today.</p>
        </div>
        <Link to="/studio" className="bg-gold text-primary px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard title="Total Generations" value={loading ? "..." : projects.length} icon={ImageIcon} />
        <StatCard title="Active Projects" value={loading ? "..." : projects.length} icon={Activity} />
      </div>

      {/* Large & Long Premium Chatbot Callout Banner */}
      <Link to="/chat" className="block hover:scale-[1.01] transition-all duration-300 mb-12">
        <div className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gradient-to-r from-gold/10 via-transparent to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="z-10 flex-1">
            <span className="bg-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">AI Copilot</span>
            <h3 className="text-2xl font-display font-bold text-pearl mt-3 mb-2">AI Architect Chatbot</h3>
            <p className="text-sm text-gray-soft max-w-2xl leading-relaxed">
              Have questions about interior design, material selection, structural layouts, or budgets? Brainstorm concepts and get instant, detailed guidance from your personal AI companion.
            </p>
          </div>
          <div className="flex items-center gap-4 z-10">
            <span className="text-gold font-semibold text-sm hidden sm:inline group-hover:translate-x-1 transition-transform">Start Chatting →</span>
            <div className="bg-gold text-black p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <MessageSquare className="w-8 h-8" />
            </div>
          </div>
          {/* Subtle gold glow effect */}
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </Link>

      {/* Recent Projects Section */}
      <h2 className="text-2xl font-display font-bold mb-6">Recent Designs</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-primary-light/30 rounded-3xl border border-white/5">
          <ImageIcon className="w-16 h-16 mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">No projects yet</h3>
          <p className="text-gray-soft mb-6">Generate your first dream home design to see it here.</p>
          <Link to="/studio" className="bg-gold text-primary px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition-all">Start Designing</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="h-64 rounded-2xl bg-primary-light border border-white/10 overflow-hidden relative group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            >
              {project.exterior_image ? (
                <img src={project.exterior_image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              {/* Click hint */}
              <div className="absolute top-3 left-3 z-20 bg-gold/90 text-black text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                View Details
              </div>

              {/* Delete Button */}
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this design?')) {
                    try {
                      await api.delete(`/projects/${project.id}`);
                      setProjects(projects.filter(p => p.id !== project.id));
                    } catch (err) {
                      console.error("Failed to delete project", err);
                    }
                  }
                }}
                className="absolute top-3 right-3 z-30 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Design"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 z-20 w-full pr-8">
                <h4 className="font-bold text-lg mb-1 truncate text-white">{project.name}</h4>
                <p className="text-sm text-gold mb-1">{new Date(project.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-white/70 truncate">{project.description || "Click to view full design"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
