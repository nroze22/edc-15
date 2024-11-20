'use client'

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BarChart2, Check, FileSpreadsheet, Lock, ShieldCheck, Users2, Zap } from 'lucide-react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import AuthModal from '../components/auth/AuthModal';
import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onAuth?: () => void;
}

export default function LandingPage({ onAuth }: LandingPageProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleAuth = () => {
    if (onAuth) {
      // Call the auth callback from App.tsx
      onAuth();
      
      // Force navigation to dashboard
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 100);
    }
  };

  const handleSignUpClick = () => {
    setAuthType('signup');
    setShowAuth(true);
  };

  const handleSignInClick = () => {
    setAuthType('signin');
    setShowAuth(true);
  };

  return (
    <div ref={containerRef} className="relative bg-[#020817] overflow-hidden">
      <Navbar 
        onSignIn={handleSignInClick}
        onSignUp={handleSignUpClick}
      />
      
      <Hero onAuth={handleSignUpClick} />

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817] via-transparent to-[#020817]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-talosix-blue to-talosix-purple">
                Enterprise-Grade Features
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-white/70 max-w-2xl mx-auto"
            >
              Everything you need to manage complex clinical trials with confidence
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Data Validation",
                description: "Automated checks and validations ensure data integrity across all study sites.",
                icon: Zap,
                delay: 0
              },
              {
                title: "Multi-site Management",
                description: "Seamlessly coordinate multiple research sites with centralized control.",
                icon: Users2,
                delay: 0.1
              },
              {
                title: "Regulatory Compliance",
                description: "Built-in compliance with 21 CFR Part 11 and GDPR requirements.",
                icon: ShieldCheck,
                delay: 0.2
              },
              {
                title: "Smart Query Management",
                description: "AI-powered query resolution system reduces data clarification time.",
                icon: BarChart2,
                delay: 0.3
              },
              {
                title: "CDISC Standards",
                description: "Native support for CDISC SDTM and ADaM data standards.",
                icon: FileSpreadsheet,
                delay: 0.4
              },
              {
                title: "Enterprise Security",
                description: "Bank-grade encryption and comprehensive audit trails.",
                icon: Lock,
                delay: 0.5
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-talosix-blue/20 to-talosix-purple/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-talosix-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-talosix-blue/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Studies", value: "500+", suffix: "", color: "from-blue-400 to-blue-600" },
              { label: "Research Sites", value: "2,500", suffix: "+", color: "from-purple-400 to-purple-600" },
              { label: "Data Points", value: "10", suffix: "M+", color: "from-indigo-400 to-indigo-600" },
              { label: "Compliance Rate", value: "99.9", suffix: "%", color: "from-sky-400 to-sky-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-xl bg-white/[0.03] border border-white/10"
              >
                <div className="text-4xl font-bold mb-2">
                  <span className={`bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                    {stat.value}{stat.suffix}
                  </span>
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-talosix-purple/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Trusted by Leading Research Organizations
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Talosix EDC has transformed how we manage our clinical trials. The platform's intuitive design and powerful features have significantly improved our efficiency.",
                author: "Dr. Sarah Chen",
                title: "Clinical Research Director",
                company: "Pacific Research Institute",
                delay: 0
              },
              {
                quote: "The real-time validation and smart query system have reduced our data cleaning time by 60%. It's an incredible platform that keeps getting better.",
                author: "Michael Rodriguez",
                title: "Head of Data Management",
                company: "BioTech Solutions",
                delay: 0.1
              },
              {
                quote: "Finally, an EDC system that understands the needs of mid-sized research organizations. The compliance features alone have saved us countless hours.",
                author: "Dr. Emily Thompson",
                title: "VP of Clinical Operations",
                company: "Nova Research Group",
                delay: 0.2
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-talosix-blue/10 to-talosix-purple/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                  <p className="text-lg text-white/80 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-talosix-blue to-talosix-purple mr-4" />
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-white/60">{testimonial.title}</div>
                      <div className="text-sm text-white/60">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-talosix-blue/10 via-talosix-purple/10 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
                Ready to Transform Your Clinical Research?
              </span>
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join leading research organizations who trust Talosix EDC to manage their clinical trials.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onAuth}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 transition-all shadow-lg shadow-talosix-blue/20 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#0B1629] text-white/80 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Products Column */}
            <div>
              <h3 className="text-white font-semibold mb-6">Products</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">AI-Powered Platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Patient Screening</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Decentralized platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Electronic Data Capture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Patient Engagement</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DICOM Viewer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Integration</a></li>
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="text-white font-semibold mb-6">Services</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Study planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Account management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tailored solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data analysis & reporting</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance support</a></li>
              </ul>
            </div>

            {/* News & Insights Column */}
            <div>
              <h3 className="text-white font-semibold mb-6">News & Insights</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Clinical trials news</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Healthcare news</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-white font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <img 
                  src="https://framerusercontent.com/images/021L73kQYq9ZIfe4FnXRxtsHM.svg" 
                  alt="Talosix" 
                  className="h-8 w-8"
                />
                <span className="text-sm">2023 Talosix. All rights reserved.</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-sm hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-sm hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={handleAuth}
        initialView={authType}
      />
    </div>
  );
}