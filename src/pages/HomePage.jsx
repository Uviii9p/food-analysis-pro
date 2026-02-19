import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const jelly = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10, filter: 'blur(10px)' },
    visible: (i) => ({
        opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)',
        transition: {
            delay: i * 0.1,
            type: 'spring',
            stiffness: 600,
            damping: 12
        }
    })
};

const jellyHover = {
    scale: 1.1,
    rotate: [0, -2, 2, -2, 0],
    z: 50,
    transition: {
        type: 'spring',
        stiffness: 800,
        damping: 20
    }
};

const features = [
    { icon: '📁', title: 'Smart Scan', desc: 'Identify food instantly from any photo', color: 'bg-slate-50' },
    { icon: '📈', title: 'Daily Progress', desc: 'Track your calorie and macro goals', color: 'bg-slate-50' },
    { icon: '🥗', title: 'Macro Stats', desc: 'Detailed breakdown of every meal', color: 'bg-slate-50' },
    { icon: '📅', title: 'History', desc: 'Manage your previous meal logs', color: 'bg-slate-50' },
    { icon: '💡', title: 'Insights', desc: 'Personalized tips for your health', color: 'bg-slate-50' },
    { icon: '🎯', title: 'Accuracy', desc: 'Powered by advanced AI models', color: 'bg-slate-50' },
];

const stats = [
    { value: '50+', label: 'Food Items', icon: '🍔' },
    { value: '99%', label: 'Accuracy', icon: '🎯' },
    { value: '<3s', label: 'Analysis', icon: '⚡' },
    { value: '100%', label: 'Free', icon: '💎' },
];

export default function HomePage() {
    const { todayTotals, scanHistory } = useApp();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-12 pb-24 md:pt-20 md:pb-32">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/20 dark:bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left content */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div custom={0} variants={jelly} initial="hidden" animate="visible">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-6">
                                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                    AI-Powered Food Analysis
                                </span>
                            </motion.div>

                            <motion.h1
                                custom={1} variants={jelly} initial="hidden" animate="visible"
                                className="text-5xl sm:text-6xl md:text-7xl font-black font-display leading-[1.1] mb-8 tracking-tight"
                            >
                                Better Health,<br />
                                One Scan at <span className="text-blue-600">a Time</span>
                            </motion.h1>

                            <motion.p
                                custom={2} variants={jelly} initial="hidden" animate="visible"
                                className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
                            >
                                The minimalist way to track your nutrition. Snap a photo,
                                and let our professional AI handle the rest.
                            </motion.p>

                            <motion.div
                                custom={3} variants={jelly} initial="hidden" animate="visible"
                                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                            >
                                <Link to="/upload">
                                    <motion.button
                                        className="btn-primary text-lg py-4 px-8 flex items-center gap-3 w-full sm:w-auto"
                                        whileHover={jellyHover}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <span className="text-2xl">📷</span>
                                        <span>Scan Food Now</span>
                                    </motion.button>
                                </Link>
                                <Link to="/history">
                                    <motion.button
                                        className="btn-secondary text-lg py-4 px-8 flex items-center gap-3 w-full sm:w-auto"
                                        whileHover={jellyHover}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <span className="text-2xl">📊</span>
                                        <span>View History</span>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right - Hero visual */}
                        <motion.div
                            custom={4} variants={jelly} initial="hidden" animate="visible"
                            className="flex-1 max-w-lg"
                        >
                            <div className="relative">
                                {/* Main card */}
                                <motion.div
                                    className="bg-white dark:bg-dark-900 rounded-[2rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-white/5"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-2xl">
                                            📊
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Analysis</h3>
                                            <p className="text-slate-500 text-xs">Professional Grade</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: 'Energy', value: '450', unit: 'kcal' },
                                            { label: 'Protein', value: '24', unit: 'g' },
                                            { label: 'Fiber', value: '8.5', unit: 'g' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-400">
                                                    <span>{item.label}</span>
                                                    <span>{item.value}{item.unit}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-slate-900 dark:bg-white"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '70%' }}
                                                        transition={{ duration: 1.5, delay: 1 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Floating elements */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-white dark:bg-dark-800 rounded-2xl p-3 shadow-xl"
                                    animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                >
                                    <span className="text-3xl">🧠</span>
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-2 -left-4 bg-white dark:bg-dark-800 rounded-2xl p-3 shadow-xl"
                                    animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                >
                                    <span className="text-3xl">📊</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-4 py-12 -mt-12 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="glass rounded-3xl p-6 md:p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                            >
                                <span className="text-3xl mb-2 block">{stat.icon}</span>
                                <p className="text-2xl md:text-3xl font-black font-display gradient-text">{stat.value}</p>
                                <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Today's Summary (if has data) */}
            {todayTotals.calories > 0 && (
                <section className="px-4 py-12">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            className="glass rounded-3xl p-6 md:p-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                                <span className="text-3xl">📅</span>
                                Today's Intake
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Calories', value: Math.round(todayTotals.calories), unit: 'kcal', icon: '🔥', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
                                    { label: 'Protein', value: todayTotals.protein.toFixed(1), unit: 'g', icon: '💪', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                                    { label: 'Carbs', value: todayTotals.carbs.toFixed(1), unit: 'g', icon: '🥑', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
                                    { label: 'Fat', value: todayTotals.fat.toFixed(1), unit: 'g', icon: '🧈', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' },
                                ].map((item) => (
                                    <div key={item.label} className={`${item.color} rounded-2xl p-4 text-center`}>
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className="text-2xl font-bold mt-2">{item.value}<span className="text-sm ml-1">{item.unit}</span></p>
                                        <p className="text-sm mt-1 opacity-80">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Features Grid */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="badge-green text-sm mb-4">✨ Features</span>
                        <h2 className="section-title mt-4">
                            Everything You Need for{' '}
                            <span className="gradient-text">Smart Nutrition</span>
                        </h2>
                        <p className="text-dark-500 dark:text-dark-400 text-lg mt-4 max-w-2xl mx-auto">
                            Powered by advanced AI to give you the most accurate and comprehensive food analysis
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                className="glass rounded-3xl p-6 md:p-8 card-hover group"
                                variants={jelly}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                whileHover={jellyHover}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
                                <p className="text-dark-500 dark:text-dark-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="px-4 py-16 md:py-24 bg-gradient-to-b from-transparent via-primary-50/50 dark:via-primary-900/5 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            How It{' '}
                            <span className="gradient-text-accent">Works</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: '📷', title: 'Upload Photo', desc: 'Take a photo or upload from gallery. Drag & drop supported.' },
                            { step: '02', icon: '🧠', title: 'AI Analysis', desc: 'Our AI detects the food and identifies nutritional content.' },
                            { step: '03', icon: '📊', title: 'Get Results', desc: 'View detailed nutrition breakdown with health suggestions.' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                className="text-center relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <div className="relative mb-6 inline-block">
                                    <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-4xl shadow-lg">
                                        {item.icon}
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-md">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold font-display mb-2">{item.title}</h3>
                                <p className="text-dark-500 dark:text-dark-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="gradient-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black font-display mb-4">
                                Start Scanning Today
                            </h2>
                            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
                                Join thousands of health-conscious people using AI to make smarter food choices
                            </p>
                            <Link to="/upload">
                                <motion.button
                                    className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transition-shadow"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    📷 Scan Your First Food
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-4 py-8 border-t border-dark-200/50 dark:border-dark-800/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🍎</span>
                        <span className="font-bold font-display gradient-text">NutriScan AI</span>
                    </div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                        © 2026 NutriScan AI. Powered by advanced machine learning.
                    </p>
                    <div className="flex items-center gap-4 text-dark-400">
                        <span className="text-sm hover:text-primary-500 cursor-pointer transition-colors">Privacy</span>
                        <span className="text-sm hover:text-primary-500 cursor-pointer transition-colors">Terms</span>
                        <span className="text-sm hover:text-primary-500 cursor-pointer transition-colors">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
