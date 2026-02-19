import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
    const { darkMode, toggleDarkMode, user } = useApp();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/upload', label: 'Scan', icon: '📸' },
        { path: '/history', label: 'History', icon: '📊' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const jellyHover = {
        scale: 1.1,
        rotate: [0, -2, 2, -2, 0],
        transition: {
            type: 'spring',
            stiffness: 800,
            damping: 15
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            whileHover={{ ...jellyHover, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {/* SVG Logo - Custom crafted to look like the user's logo */}
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" className="text-blue-400" />
                                <line x1="20" y1="20" x2="28" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-blue-400" />
                                <path d="M11 14C11 12.5 12.5 11 14 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="14" cy="14" r="4" fill="url(#strawberry)" />
                                <defs>
                                    <linearGradient id="strawberry" x1="14" y1="10" x2="14" y2="18" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#ef4444" />
                                        <stop offset="1" stopColor="#991b1b" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Circuit glow effect */}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                        </motion.div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Food Analysis Pro</h1>
                            <span className="text-[10px] text-blue-400 font-bold tracking-[0.3em] uppercase mt-0.5">Advanced AI Intelligence</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-110 active:scale-95 ${location.pathname === link.path
                                    ? 'text-blue-400'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Dark mode toggle */}
                        <motion.button
                            onClick={toggleDarkMode}
                            className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Toggle dark mode"
                        >
                            <motion.span
                                key={darkMode ? 'dark' : 'light'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                className="text-lg"
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </motion.span>
                        </motion.button>

                        {/* Scan button */}
                        <Link to="/upload">
                            <motion.button
                                className="hidden md:block bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10"
                                whileHover={jellyHover}
                                whileTap={{ scale: 0.85 }}
                            >
                                Get Started
                            </motion.button>
                        </Link>

                        {/* Mobile menu button */}
                        <motion.button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center"
                            whileTap={{ scale: 0.9 }}
                        >
                            <span className="text-lg">{mobileOpen ? '✕' : '☰'}</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-strong border-t border-dark-200/50 dark:border-dark-700/50"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {links.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === link.path
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                        : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                                        }`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
