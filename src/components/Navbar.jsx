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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <motion.div
                            className="flex flex-col"
                            whileHover={jellyHover}
                            whileTap={{ scale: 0.9 }}
                        >
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">NutriScan</h1>
                            <span className="text-[10px] text-slate-400 font-black tracking-[0.4em] uppercase mt-1">Professional</span>
                        </motion.div>
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
