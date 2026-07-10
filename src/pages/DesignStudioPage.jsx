import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const ImageWithRetry = ({ src, alt, className, style, delayMs = 0 }) => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [retries, setRetries] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setCurrentSrc(src), delayMs);
    return () => clearTimeout(timer);
  }, [src, delayMs]);

  return (
    <>
      {!loaded && (
        <div className={`${className} animate-pulse bg-white/5 flex items-center justify-center`} style={style}>
          <span className="text-white/30 text-sm font-medium tracking-widest uppercase">Rendering...</span>
        </div>
      )}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${loaded ? 'block' : 'hidden'}`}
          style={style}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (retries < 10) {
              setTimeout(() => {
                setCurrentSrc(`${src}&retry=${retries}`);
                setRetries(r => r + 1);
              }, 2000 + (Math.random() * 2000));
            }
          }}
        />
      )}
    </>
  );
};

const DesignStudioPage = () => {
  const location = useLocation();
  const preloadedProject = location.state?.projectData;

  const [step, setStep] = useState(1);
  const [plotSize, setPlotSize] = useState('');
  const [budget, setBudget] = useState('');
  const [style, setStyle] = useState('Minimalist Scandinavian');
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (preloadedProject) {
      setResults({
        exterior_image: preloadedProject.exterior_image,
        interior_image: preloadedProject.interior_image,
        floorplan_image: preloadedProject.floorplan_image,
        pdf_report: preloadedProject.pdf_report,
        analysis: {
          total_estimated_cost: "Stored in PDF Blueprint",
          cost_breakdown: preloadedProject.description || "Project parameters stored in database.",
          recommended_materials: ["Concrete", "Glass", "Natural Wood", "Steel"],
          sustainability_score: 92,
          sustainability_tips: ["Highly optimized energy layouts", "Natural ventilation oriented"]
        }
      });
      setStep(4);
    }
  }, [preloadedProject]);

  const handleGenerate = async () => {
    setError('');
    if (!customPrompt.trim()) {
      setError('Please enter your custom requirements/design prompt.');
      return;
    }
    setStep(3);
    try {
      const response = await api.post('/engine/generate', {
        plot_size: parseInt(plotSize),
        budget: parseInt(budget),
        style: style,
        prompt: customPrompt.trim()
      });
      setResults(response.data);
      setStep(4);
    } catch (err) {
      let errorMsg = 'An error occurred during generation.';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join(', ');
        } else {
          errorMsg = JSON.stringify(err.response.data.detail);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setStep(2);
    }
  };

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto min-h-screen mb-20">
      <h1 className="text-4xl font-display font-bold mb-8 text-center">AI Design Studio</h1>

      <div className="glass-panel p-8 rounded-3xl border border-white/10">
        {step < 4 && (
          <div className="flex items-center justify-between max-w-xl mx-auto mb-12 relative px-4">
            {/* Connector Line Background */}
            <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
            {/* Active/Completed Connector Line */}
            <div 
              className="absolute left-6 top-5 -translate-y-1/2 h-0.5 bg-gold transition-all duration-500 z-0" 
              style={{ width: `${step === 1 ? '0%' : step === 2 ? '46%' : '92%'}` }}
            />

            {[
              { id: 1, name: "Specs" },
              { id: 2, name: "Aesthetics" },
              { id: 3, name: "AI Engine" }
            ].map((s) => {
              const isCompleted = step > s.id;
              const isActive = step === s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2
                      ${isCompleted ? 'bg-gold border-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 
                        isActive ? 'bg-[#121212] border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 
                        'bg-[#121212] border-white/10 text-gray-soft'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-semibold tracking-wider uppercase transition-colors duration-300 ${isActive || isCompleted ? 'text-gold' : 'text-gray-soft'}`}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-400 p-4 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Property Details */}
        {step === 1 && (
          <div className="flex flex-col gap-8 py-4">
            <h2 className="text-3xl font-display font-bold mb-2 text-gold">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-medium text-gray-soft mb-2">Plot Size (sq ft)</label>
                <input
                  type="number"
                  value={plotSize}
                  onChange={(e) => setPlotSize(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4.5 text-lg focus:border-gold focus:outline-none text-white placeholder-white/20 transition-all focus:bg-white/10"
                  placeholder="e.g. 2500"
                  style={{ fontSize: '1.125rem', padding: '1.125rem 1.5rem' }}
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-soft mb-2">Budget ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4.5 text-lg focus:border-gold focus:outline-none text-white placeholder-white/20 transition-all focus:bg-white/10"
                  placeholder="e.g. 150000"
                  style={{ fontSize: '1.125rem', padding: '1.125rem 1.5rem' }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setError('');
                if (!plotSize || parseInt(plotSize) <= 0) {
                  setError('Plot Size must be a valid number greater than 0.');
                  return;
                }
                if (!budget || parseInt(budget) <= 0) {
                  setError('Budget must be a valid number greater than 0.');
                  return;
                }
                setStep(2);
              }}
              className="bg-gold text-black font-bold py-4 px-10 rounded-2xl mt-6 self-end hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] text-lg"
            >
              Next Step →
            </button>
          </div>
        )}

        {/* Step 2: Style & Prompt */}
        {step === 2 && (
          <div className="flex flex-col gap-8 py-4">
            <h2 className="text-3xl font-display font-bold mb-2 text-gold">Style & Aesthetics</h2>
            <div className="relative">
              <label className="block text-base font-medium text-gray-soft mb-2">Select Style</label>
              <button
                onClick={() => setIsStyleOpen(!isStyleOpen)}
                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4.5 text-lg text-left focus:border-gold focus:outline-none text-white flex justify-between items-center transition-all focus:bg-white/10"
                style={{ fontSize: '1.125rem', padding: '1.125rem 1.5rem' }}
              >
                {style}
                <span className="text-gray-soft text-sm">{isStyleOpen ? '▲' : '▼'}</span>
              </button>
              {isStyleOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/20 rounded-2xl overflow-hidden z-50 shadow-2xl">
                  {["Minimalist Scandinavian", "Modern Industrial", "Classic Luxury", "Cyberpunk Futuristic"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => { setStyle(opt); setIsStyleOpen(false); }}
                      className="px-6 py-4 hover:bg-gold hover:text-black cursor-pointer text-white transition-colors text-lg"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-base font-medium text-gray-soft mb-2">Custom Requirements (Prompt)</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows="4"
                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-lg focus:border-gold focus:outline-none resize-none text-white placeholder-white/20 transition-all focus:bg-white/10"
                placeholder="Describe your vision (e.g., 'A 3BHK modern home with open kitchen, large windows, garden and parking for 2 cars.')"
                style={{ fontSize: '1.125rem', padding: '1.125rem 1.5rem' }}
              />
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="border border-white/20 py-4 rounded-2xl px-10 hover:bg-white/5 transition-colors text-lg text-white font-medium">
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                className="bg-gold text-black font-bold py-4 px-10 rounded-2xl hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] text-lg"
              >
                ✨ Generate Designs
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === 3 && (
          <div className="flex flex-col items-center py-16">
            <div className="w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-bold mb-3">Generating Your Masterpiece...</h2>
            <p className="text-gray-soft text-center max-w-md">Our AI is processing your requirements, estimating construction costs, and rendering photorealistic previews.</p>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && results && (
          <div className="flex flex-col gap-8">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-display font-bold text-gold mb-3">Your AI Masterpiece</h2>
              <p className="text-gray-soft text-lg max-w-2xl mx-auto">Your dream home has been architected. Here are your bespoke designs and cost analysis.</p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/50">
                <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
                  <h3 className="text-white font-bold tracking-widest uppercase text-sm">🏠 Exterior Concept</h3>
                </div>
                <ImageWithRetry src={results.exterior_image} alt="Exterior" className="w-full h-72 object-cover" delayMs={0} />
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/50">
                <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
                  <h3 className="text-white font-bold tracking-widest uppercase text-sm">🛋️ Interior Concept</h3>
                </div>
                <ImageWithRetry src={results.interior_image} alt="Interior" className="w-full h-72 object-cover" delayMs={400} />
              </div>

              <div className="rounded-2xl border border-white/10 shadow-2xl bg-black/50 md:col-span-2">
                <div className="p-4">
                  <h3 className="text-white font-bold tracking-widest uppercase text-sm">📐 Photorealistic 3D Layout</h3>
                </div>
                <ImageWithRetry
                  src={results.floorplan_image}
                  alt="Floorplan"
                  className="rounded-b-2xl"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  delayMs={800}
                />
              </div>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                <h4 className="text-gray-soft text-sm uppercase tracking-wider mb-2">Sustainability Score</h4>
                <div className="text-6xl font-display font-bold text-emerald-400 mb-1">{results.analysis?.sustainability_score || 85}</div>
                <p className="text-xs text-gray-soft">Out of 100</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2">
                <h4 className="text-gold text-lg font-bold mb-4">Financial & Material Analysis</h4>
                <p className="text-sm text-gray-soft mb-1">Estimated Construction Cost</p>
                <p className="text-2xl font-bold text-white mb-4">{results.analysis?.total_estimated_cost}</p>
                <p className="text-sm text-gray-soft mb-1">Cost Breakdown</p>
                <p className="text-sm text-white/80 leading-relaxed">{results.analysis?.cost_breakdown}</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-blue-400 font-bold mb-3 uppercase tracking-wider text-sm">Recommended Materials</h4>
                  <ul className="space-y-2">
                    {results.analysis?.recommended_materials?.map((mat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                        {mat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-purple-400 font-bold mb-3 uppercase tracking-wider text-sm">Eco & Space Optimization Tips</h4>
                  <ul className="space-y-2">
                    {results.analysis?.sustainability_tips?.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => { setStep(1); setResults(null); }}
                className="border border-white/20 py-3 rounded-xl px-8 hover:bg-white/5 transition-colors font-medium"
              >
                Design Another
              </button>
              <button
                onClick={() => window.open(`http://localhost:8000/download/${results.pdf_report}`, '_blank')}
                className="bg-gold text-black font-bold py-3 rounded-xl px-8 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Download PDF Blueprint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignStudioPage;
