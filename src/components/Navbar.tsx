import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function Navbar({ onSignIn, onSignUp }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://framerusercontent.com/images/021L73kQYq9ZIfe4FnXRxtsHM.svg" 
              alt="Talosix" 
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#2DD4BF]">
              Talosix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-sm text-white/70 hover:text-white transition-colors">About</a>
            <button 
              onClick={onSignIn}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onSignUp}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#0EA5E9] to-[#2DD4BF] hover:opacity-90 transition-all shadow-lg shadow-[#0EA5E9]/20"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-[#020817]/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base text-white/70 hover:text-white hover:bg-white/5"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base text-white/70 hover:text-white hover:bg-white/5"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block px-3 py-2 rounded-md text-base text-white/70 hover:text-white hover:bg-white/5"
            >
              About
            </a>
            <button
              onClick={onSignIn}
              className="block w-full text-left px-3 py-2 rounded-md text-base text-white/70 hover:text-white hover:bg-white/5"
            >
              Sign in
            </button>
            <button
              onClick={onSignUp}
              className="block w-full px-3 py-2 rounded-md text-base text-white bg-gradient-to-r from-[#0EA5E9] to-[#2DD4BF] hover:opacity-90"
            >
              Start Free Trial
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}