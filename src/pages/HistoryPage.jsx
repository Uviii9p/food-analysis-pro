import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { useApp } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend);

export default function HistoryPage({ setAnalysisResult }) {
    const { scanHistory, removeScan, clearHistory, todayTotals, getWeeklyData } = useApp();
    const [activeView, setActiveView] = useState('history');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const navigate = useNavigate();

    const jelly = {
        hidden: { opacity: 0, scale: 0.5, rotate: -10, filter: 'blur(10px)' },
        visible: (i) => ({
            opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)',
            transition: {
                delay: i * 0.1,
                type: 'spring',
                stiffness: 600,
                damping: 15
            }
        })
    };

    const jellyHover = {
        scale: 1.05,
        rotate: [0, -1, 1, -1, 0],
        transition: {
            type: 'spring',
            stiffness: 800,
            damping: 10
        }
    };

    const weeklyData = getWeeklyData();

    const weeklyChartData = {
        labels: weeklyData.map(d => d.label),
        datasets: [
            {
                label: 'Calories',
                data: weeklyData.map(d => d.calories),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                borderRadius: 8,
            }
        ]
    };

    const macroChartData = {
        labels: weeklyData.map(d => d.label),
        datasets: [
            {
                label: 'Protein',
                data: weeklyData.map(d => d.protein),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Carbs',
                data: weeklyData.map(d => d.carbs),
                borderColor: 'rgba(168, 85, 247, 1)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Fat',
                data: weeklyData.map(d => d.fat),
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 16,
                    usePointStyle: true,
                    font: { family: 'Inter', size: 12 },
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                cornerRadius: 12,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
            },
            x: {
                grid: { display: false },
            }
        }
    };

    const handleViewResult = (scan) => {
        setAnalysisResult(scan);
        navigate('/result');
    };

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        variants={jelly}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        <h1 className="section-title text-white">
                            <span className="gradient-text">Nutrition</span> Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">Track your daily intake and scan history</p>
                    </motion.div>
                    <motion.div
                        className="flex gap-2"
                        variants={jelly}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        <button
                            onClick={() => setActiveView('history')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'history'
                                ? 'gradient-primary shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)]'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            📜 History
                        </button>
                        <button
                            onClick={() => setActiveView('analytics')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'analytics'
                                ? 'gradient-primary shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)]'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            📊 Analytics
                        </button>
                    </motion.div>
                </motion.div>

                {/* Today's Summary */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {[
                        { label: 'Calories', value: Math.round(todayTotals.calories), unit: 'kcal', icon: '🔥', gradient: 'from-red-500 to-orange-500' },
                        { label: 'Protein', value: todayTotals.protein.toFixed(1), unit: 'g', icon: '💪', gradient: 'from-blue-500 to-cyan-500' },
                        { label: 'Carbs', value: todayTotals.carbs.toFixed(1), unit: 'g', icon: '🥑', gradient: 'from-purple-500 to-pink-500' },
                        { label: 'Fat', value: todayTotals.fat.toFixed(1), unit: 'g', icon: '🧈', gradient: 'from-yellow-500 to-orange-500' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            className="glass rounded-3xl p-5 border border-white/5"
                            variants={jelly}
                            initial="hidden"
                            animate="visible"
                            custom={2 + i}
                            whileHover={jellyHover}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-lg mb-3 shadow-lg`}>
                                {item.icon}
                            </div>
                            <p className="text-2xl font-black text-white">{item.value}<span className="text-sm font-normal text-slate-400 ml-1">{item.unit}</span></p>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1">{item.label} Today</p>
                        </motion.div>
                    ))}
                </motion.div>

                <AnimatePresence mode="wait">
                    {activeView === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Weekly Calories Chart */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>📊</span> Weekly Calorie Intake
                                </h3>
                                <div className="h-64">
                                    <Bar data={weeklyChartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Weekly Macros Trend */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>📈</span> Macro Trends (7 Days)
                                </h3>
                                <div className="h-64">
                                    <Line data={macroChartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Weekly Stats */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                                    <span>📅</span> Weekly Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(() => {
                                        const totalCal = weeklyData.reduce((s, d) => s + d.calories, 0);
                                        const avgCal = Math.round(totalCal / 7);
                                        const totalProtein = weeklyData.reduce((s, d) => s + d.protein, 0);
                                        const totalScans = scanHistory.filter(s => {
                                            const d = new Date(s.timestamp);
                                            const week = new Date();
                                            week.setDate(week.getDate() - 7);
                                            return d >= week;
                                        }).length;
                                        return [
                                            { label: 'Total Calories', value: totalCal, icon: '🔥' },
                                            { label: 'Avg Daily Cal', value: avgCal, icon: '📊' },
                                            { label: 'Total Protein', value: `${totalProtein.toFixed(0)}g`, icon: '💪' },
                                            { label: 'Scans This Week', value: totalScans, icon: '📸' },
                                        ];
                                    })().map((stat, i) => (
                                        <div key={i} className="bg-dark-50 dark:bg-dark-800/50 rounded-2xl p-4 text-center">
                                            <span className="text-2xl">{stat.icon}</span>
                                            <p className="text-xl font-bold mt-2">{stat.value}</p>
                                            <p className="text-xs text-dark-500 mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {scanHistory.length === 0 ? (
                                <div className="glass rounded-3xl p-12 text-center border border-white/10 shadow-2xl">
                                    <span className="text-6xl block mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">📷</span>
                                    <h3 className="text-xl font-bold font-display mb-2 text-white">No Scans Yet</h3>
                                    <p className="text-slate-400 mb-8">Start scanning food to see your history here</p>
                                    <button
                                        onClick={() => navigate('/upload')}
                                        className="btn-primary"
                                    >
                                        📸 Scan Your First Food
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Clear all button */}
                                    <div className="flex justify-end mb-4">
                                        {!showClearConfirm ? (
                                            <button
                                                onClick={() => setShowClearConfirm(true)}
                                                className="text-sm text-dark-400 hover:text-red-500 transition-colors"
                                            >
                                                🗑️ Clear All
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-dark-500">Are you sure?</span>
                                                <button
                                                    onClick={() => { clearHistory(); setShowClearConfirm(false); }}
                                                    className="text-sm text-red-500 font-semibold hover:text-red-600"
                                                >
                                                    Yes, Clear
                                                </button>
                                                <button
                                                    onClick={() => setShowClearConfirm(false)}
                                                    className="text-sm text-dark-400 hover:text-dark-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* History list */}
                                    <div className="space-y-4">
                                        {scanHistory.map((scan, i) => (
                                            <motion.div
                                                key={scan.id}
                                                className="glass rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                                                variants={jelly}
                                                initial="hidden"
                                                animate="visible"
                                                custom={i}
                                                whileHover={jellyHover}
                                                onClick={() => handleViewResult(scan)}
                                            >
                                                <div className="flex items-center gap-4 p-4">
                                                    {/* Thumbnail */}
                                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                        {scan.imagePreview ? (
                                                            <img src={scan.imagePreview} alt={scan.primaryFood} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
                                                                🍽️
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold capitalize truncate">{scan.primaryFood}</h4>
                                                        <p className="text-sm text-dark-500 dark:text-dark-400">
                                                            {new Date(scan.timestamp).toLocaleDateString('en', {
                                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs font-mono font-bold text-red-500">🔥 {scan.nutrition?.calories} kcal</span>
                                                            <span className="text-xs text-blue-500">💪 {scan.nutrition?.protein}g</span>
                                                            <span className="text-xs text-purple-500">🥑 {scan.nutrition?.carbs}g</span>
                                                        </div>
                                                    </div>

                                                    {/* Health badge */}
                                                    <div className="hidden sm:block">
                                                        <span className={`badge text-xs ${scan.healthRating?.color === 'green' ? 'badge-green' :
                                                            scan.healthRating?.color === 'yellow' ? 'badge-yellow' : 'badge-red'
                                                            }`}>
                                                            {scan.healthRating?.emoji} {scan.healthRating?.level}
                                                        </span>
                                                    </div>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeScan(scan.id); }}
                                                        className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm flex-shrink-0"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
