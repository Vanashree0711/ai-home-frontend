import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, features, isPopular }) => (
  <div className={`glass-panel p-8 rounded-3xl border ${isPopular ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] relative' : 'border-white/10'} flex flex-col h-full`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black font-bold px-4 py-1 rounded-full text-sm">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="mb-6 flex items-baseline gap-2">
      <span className="text-5xl font-display font-bold">${price}</span>
      <span className="text-gray-soft">/month</span>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-gray-soft">
          <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link 
      to="/signup" 
      className={`w-full py-4 rounded-xl font-bold text-center transition-all ${isPopular ? 'bg-gold text-black hover:bg-gold-light' : 'bg-white/10 hover:bg-white/20'}`}
    >
      Get Started
    </Link>
  </div>
);

const PricingPage = () => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-soft max-w-2xl mx-auto">
          Choose the plan that fits your architectural vision. Upgrade or cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-20">
        <PricingCard 
          title="Hobbyist" 
          price="0" 
          features={[
            "5 AI Generations per month",
            "Standard Resolution Images",
            "Basic Floorplans",
            "Community Support"
          ]}
        />
        <PricingCard 
          title="Professional" 
          price="29" 
          isPopular={true}
          features={[
            "Unlimited AI Generations",
            "4K Ultra-High Resolution",
            "Detailed Architectural Blueprints",
            "PDF Export & Cost Estimation",
            "Priority Support"
          ]}
        />
        <PricingCard 
          title="Enterprise" 
          price="99" 
          features={[
            "Everything in Professional",
            "API Access",
            "Custom Style Models",
            "Team Collaboration",
            "Dedicated Account Manager"
          ]}
        />
      </div>
    </div>
  );
};

export default PricingPage;
