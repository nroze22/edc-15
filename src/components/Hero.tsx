'use client'

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onAuth?: () => void;
}

export default function Hero({ onAuth }: HeroProps) {
  const benefits = [
    "21 CFR Part 11 Compliant",
    "HIPAA Certified",
    "GDPR Ready",
    "ISO 27001 Certified"
  ];

  const stats = [
    {
      value: "99.9%",
      label: "Uptime SLA",
      gradient: "from-talosix-blue to-talosix-purple"
    },
    {
      value: "500K+",
      label: "Data Points",
      gradient: "from-talosix-purple to-talosix-blue"
    },
    {
      value: "2.5x",
      label: "Faster Studies",
      gradient: "from-emerald-400 to-cyan-400"
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-talosix-blue/10 to-talosix-purple/10" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#020817] to-transparent" />
      </div>
      
      {/* Animated Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-[800px] h-[800px]">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-talosix-blue/30 to-talosix-purple/30 blur-3xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-talosix-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-talosix-blue"></span>
                </span>
                <span className="text-sm text-white/80">Now with AI-Powered Insights</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-white">Modern Clinical</span>
                <span className="block mt-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-talosix-blue via-talosix-purple to-talosix-blue bg-300% animate-gradient">
                    Data Management
                  </span>
                </span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-xl">
                Transform your clinical research with our next-generation EDC platform. 
                Built for modern trials, designed for efficiency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onAuth}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 transition-all shadow-lg shadow-talosix-blue/20 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-32 group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative">Start Free Trial</span>
                  <ArrowRight className="relative ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onAuth}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <span>View Demo</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </button>
              </div>

              <div className="pt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-talosix-blue to-talosix-purple rounded-full blur-sm opacity-40" />
                      <CheckCircle2 className="relative h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Preview Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-12"
          >
            <div className="relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-talosix-blue/10 to-talosix-purple/10" />
              
              {/* Browser Chrome */}
              <div className="relative">
                <div className="px-4 py-3 border-b border-white/10 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                    <div className="w-3 h-3 rounded-full bg-green-400/20" />
                  </div>
                </div>
                
                {/* App Preview */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-talosix-blue/5 to-talosix-purple/5" />
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="h-24 rounded-lg bg-white/[0.03] border border-white/10 p-4 hover:border-white/20 transition-colors group"
                        >
                          <div className="w-12 h-2 bg-white/20 rounded mb-2 group-hover:bg-white/30 transition-colors" />
                          <div className="w-20 h-2 bg-white/10 rounded group-hover:bg-white/20 transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, index % 2 === 0 ? -10 : 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
                className={`absolute ${getStatPosition(index)} w-32 h-32 rounded-xl bg-gradient-to-r ${stat.gradient} p-[1px]`}
              >
                <div className="w-full h-full rounded-xl bg-[#020817]/95 backdrop-blur-sm flex flex-col items-center justify-center p-2">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-white/60 text-center">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getStatPosition(index: number): string {
  const positions = [
    "-top-8 -right-8",
    "-bottom-8 -left-8",
    "top-1/2 -right-8 -translate-y-1/2"
  ];
  return positions[index] || "";
}