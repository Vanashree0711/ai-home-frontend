import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Maximize, FileText, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 rounded-3xl border border-white/10"
  >
    <div className="bg-primary/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
      <Icon className="w-7 h-7 text-gold" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-soft leading-relaxed">{description}</p>
  </motion.div>
);

const FeaturesPage = () => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Powerful Features</h1>
        <p className="text-xl text-gray-soft max-w-2xl mx-auto">
          Everything you need to visualize your dream home before a single brick is laid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <FeatureCard 
          icon={Cpu}
          title="AI-Powered Generation"
          description="Describe your dream home in plain English, and our advanced AI engine translates it into stunning, photorealistic architectural renderings in seconds."
        />
        <FeatureCard 
          icon={Maximize}
          title="Exterior & Interior Concepts"
          description="Get a holistic view of your project. We generate both the breathtaking exterior facade and a beautifully staged interior room concept simultaneously."
        />
        <FeatureCard 
          icon={FileText}
          title="Professional Blueprints"
          description="Go beyond concept art. Our AI generates a top-down 2D architectural floor plan, giving you a technical starting point for real-world construction."
        />
        <FeatureCard 
          icon={CheckCircle}
          title="Cost Estimation & Materials"
          description="Receive an instant, itemized estimated cost breakdown and a list of recommended sustainable materials tailored to your specific design and budget."
        />
      </div>
    </div>
  );
};

export default FeaturesPage;
