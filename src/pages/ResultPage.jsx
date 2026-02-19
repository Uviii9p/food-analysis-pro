import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { getNutritionData, getHealthRating, getHealthSuggestion } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const jelly = {
    hidden: { opacity: 0, scale: 0.5, rotate: -5, filter: 'blur(10px)' },
    visible: (i = 1) => ({
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
    transition: {
        type: 'spring',
        stiffness: 800,
        damping: 20
    }
};

export default function ResultPage({ analysisResult }) {
    const navigate = useNavigate();
    const { dietMode, addScan } = useApp();
    const [glassCount, setGlassCount] = useState(0);
    const [peachCount, setPeachCount] = useState(1);
    const servingSize = glassCount + peachCount;
    const [adjustedNutrition, setAdjustedNutrition] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedFood, setSelectedFood] = useState(0);

    useEffect(() => {
        if (!analysisResult) {
            navigate('/upload');
        }
    }, [analysisResult, navigate]);

    useEffect(() => {
        if (analysisResult) {
            const original = analysisResult.nutrition;
            if (servingSize === 1) {
                setAdjustedNutrition(original);
            } else {
                setAdjustedNutrition({
                    ...original,
                    calories: Math.round((original.calories || 0) * servingSize),
                    protein: Math.round((original.protein || 0) * servingSize * 10) / 10,
                    carbs: Math.round((original.carbs || 0) * servingSize * 10) / 10,
                    fat: Math.round((original.fat || 0) * servingSize * 10) / 10,
                    fiber: Math.round((original.fiber || 0) * servingSize * 10) / 10,
                    sugar: Math.round((original.sugar || 0) * servingSize * 10) / 10,
                    sodium: Math.round((original.sodium || 0) * servingSize),
                    cholesterol: Math.round((original.cholesterol || 0) * servingSize),
                    servingSize: Math.round((original.servingSize || 0) * servingSize),
                });
            }
        }
    }, [servingSize, analysisResult]);

    if (!analysisResult || !adjustedNutrition) return null;

    const { primaryFood, confidence, healthRating, suggestions, allResults, imagePreview } = analysisResult;
    const nutrition = adjustedNutrition;
    const currentHealthRating = getHealthRating(nutrition);

    // Macro totals for chart
    const totalMacros = nutrition.protein + nutrition.carbs + nutrition.fat;
    const proteinPct = totalMacros > 0 ? Math.round((nutrition.protein / totalMacros) * 100) : 0;
    const carbsPct = totalMacros > 0 ? Math.round((nutrition.carbs / totalMacros) * 100) : 0;
    const fatPct = totalMacros > 0 ? 100 - proteinPct - carbsPct : 0;

    // Doughnut chart data
    const doughnutData = {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [{
            data: [nutrition.protein, nutrition.carbs, nutrition.fat],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 2,
            hoverBorderWidth: 3,
            cutout: '65%',
        }]
    };

    // Bar chart data
    const barData = {
        labels: ['Calories', 'Protein(g)', 'Carbs(g)', 'Fat(g)', 'Fiber(g)', 'Sugar(g)'],
        datasets: [{
            label: 'Nutritional Values',
            data: [
                nutrition.calories,
                nutrition.protein,
                nutrition.carbs,
                nutrition.fat,
                nutrition.fiber,
                nutrition.sugar,
            ],
            backgroundColor: [
                'rgba(239, 68, 68, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(34, 197, 94, 0.7)',
                'rgba(236, 72, 153, 0.7)',
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(236, 72, 153, 1)',
            ],
            borderWidth: 2,
            borderRadius: 8,
        }]
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
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569',
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { family: 'Inter', weight: '600' },
                bodyFont: { family: 'Inter' },
                padding: 12,
                cornerRadius: 12,
            }
        },
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569',
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569',
                }
            }
        }
    };

    return (
        <div className="min-h-screen px-4 py-12 md:py-20 bg-[#050505]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={jelly}
                >
                    <Link to="/upload">
                        <motion.button
                            className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
                            whileHover={jellyHover}
                            whileTap={{ scale: 0.9 }}
                        >
                            ←
                        </motion.button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-display">Analysis Results</h1>
                        <p className="text-dark-500 dark:text-dark-400 text-sm">AI-powered nutritional breakdown</p>
                    </div>
                </motion.div>

                {/* Main Result Card */}
                <motion.div
                    className="glass overflow-hidden mb-12 rounded-[3rem] border border-white/5"
                    initial="hidden"
                    animate="visible"
                    variants={jelly}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Preview */}
                        <div className="relative h-[300px] lg:h-auto min-h-[450px]">
                            {imagePreview && (
                                <img src={imagePreview} alt="Analysis Result" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/5" />
                        </div>

                        {/* Analysis Breakdown */}
                        <div className="p-10 lg:p-16 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex-1"
                            >
                                <div className="space-y-12">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">Energy Content</p>
                                        <div className="flex items-baseline gap-3">
                                            <h2 className="text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none">{nutrition.calories}</h2>
                                            <span className="text-2xl font-bold text-slate-500 uppercase tracking-widest">kcal</span>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {[
                                            { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'bg-slate-900', text: 'text-white' },
                                            { label: 'Carbs', value: nutrition.carbs, unit: 'g', color: 'bg-slate-100 dark:bg-white/10', text: 'text-slate-900 dark:text-white' },
                                            { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'bg-slate-100 dark:bg-white/10', text: 'text-slate-900 dark:text-white' },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xl font-black">{item.value}{item.unit}</span>
                                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${item.label === 'Protein' ? 'bg-blue-600' : 'bg-slate-300 dark:bg-white/20'}`}
                                                            style={{ width: `${Math.min(100, (item.value / 100) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${currentHealthRating.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                                            currentHealthRating.color === 'yellow' ? 'bg-amber-50 text-amber-600' :
                                                'bg-rose-50 text-rose-600'
                                            }`}>
                                            {currentHealthRating.emoji} {currentHealthRating.level} Grade
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Serving Size Slider */}
                <motion.div
                    className="glass rounded-3xl p-6 md:p-8 mb-8 border border-white/5 shadow-2xl"
                    variants={jelly}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold font-display flex items-center gap-2">
                            <span>📐</span> Portion Calculator
                        </h3>
                        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                                Total: {servingSize.toFixed(1)}x
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Glass Counter */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/10">
                                    🥛
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Glass</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">Liquid Units</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    onClick={() => setGlassCount(Math.max(0, glassCount - 1))}
                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white"
                                    whileHover={jellyHover}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    -
                                </motion.button>
                                <span className="text-xl font-black w-6 text-center text-white">{glassCount}</span>
                                <motion.button
                                    onClick={() => setGlassCount(glassCount + 1)}
                                    className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20"
                                    whileHover={jellyHover}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>

                        {/* Peach Counter */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/10">
                                    🍑
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Peach</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">Food Units</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    onClick={() => setPeachCount(Math.max(0, peachCount - 1))}
                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white"
                                    whileHover={jellyHover}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    -
                                </motion.button>
                                <span className="text-xl font-black w-6 text-center text-white">{peachCount}</span>
                                <motion.button
                                    onClick={() => setPeachCount(peachCount + 1)}
                                    className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/20"
                                    whileHover={jellyHover}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    className="flex gap-2 mb-6 overflow-x-auto pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {[
                        { id: 'overview', label: '📊 Overview', },
                        { id: 'details', label: '📋 Details', },
                        { id: 'suggestions', label: '💡 AI Tips', },
                        { id: 'compare', label: '🔄 Compare', },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                                : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Doughnut Chart */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>🥧</span> Macro Distribution
                                </h3>
                                <div className="h-64 flex items-center justify-center relative">
                                    <Doughnut data={doughnutData} options={chartOptions} />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <p className="text-3xl font-black">{nutrition.calories}</p>
                                            <p className="text-xs text-dark-500">kcal</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {[
                                        { label: 'Protein', pct: proteinPct, color: 'bg-blue-500' },
                                        { label: 'Carbs', pct: carbsPct, color: 'bg-purple-500' },
                                        { label: 'Fat', pct: fatPct, color: 'bg-amber-500' },
                                    ].map(item => (
                                        <div key={item.label} className="text-center">
                                            <div className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-1`} />
                                            <p className="text-xs text-dark-500 dark:text-dark-400">{item.label}</p>
                                            <p className="text-sm font-bold">{item.pct}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>📊</span> Nutritional Breakdown
                                </h3>
                                <div className="h-72">
                                    <Bar data={barData} options={barOptions} />
                                </div>
                            </div>

                            {/* Progress rings */}
                            <div className="glass rounded-3xl p-6 md:p-8 md:col-span-2">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>🎯</span> Daily Goal Progress
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Calories', current: nutrition.calories, goal: 2000, unit: 'kcal', color: '#ef4444', icon: '🔥' },
                                        { label: 'Protein', current: nutrition.protein, goal: 50, unit: 'g', color: '#3b82f6', icon: '💪' },
                                        { label: 'Carbs', current: nutrition.carbs, goal: 250, unit: 'g', color: '#a855f7', icon: '🥑' },
                                        { label: 'Fat', current: nutrition.fat, goal: 65, unit: 'g', color: '#f59e0b', icon: '🧈' },
                                    ].map((item) => {
                                        const pct = Math.min(100, Math.round((item.current / item.goal) * 100));
                                        const circumference = 2 * Math.PI * 40;
                                        const offset = circumference - (pct / 100) * circumference;
                                        return (
                                            <div key={item.label} className="text-center">
                                                <div className="relative inline-block">
                                                    <svg width="100" height="100" className="transform -rotate-90">
                                                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                                                            className="text-dark-200 dark:text-dark-700" />
                                                        <motion.circle
                                                            cx="50" cy="50" r="40"
                                                            stroke={item.color}
                                                            strokeWidth="8"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeDasharray={circumference}
                                                            initial={{ strokeDashoffset: circumference }}
                                                            animate={{ strokeDashoffset: offset }}
                                                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-xl">{item.icon}</span>
                                                    </div>
                                                </div>
                                                <p className="font-bold mt-2">{pct}%</p>
                                                <p className="text-xs text-dark-500">{item.current}/{item.goal}{item.unit}</p>
                                                <p className="text-xs text-dark-400">{item.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white dark:bg-dark-900 rounded-[2.5rem] p-8 md:p-12 border border-dark-900 dark:border-white shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-dark-900 dark:bg-white" />
                            <div className="mb-8 border-b-8 border-dark-900 dark:border-white pb-2">
                                <h2 className="text-5xl font-black font-display uppercase tracking-tighter">Nutrition Facts</h2>
                            </div>

                            <div className="space-y-0.5 font-sans">
                                {[
                                    { label: 'Amount Per Serving', value: '', header: true },
                                    { divider: true, thick: true },
                                    { label: 'Calories', value: nutrition.calories, bold: true, extraLarge: true },
                                    { divider: true, thick: true },
                                    { label: '% Daily Value*', value: '', alignRight: true, italic: true },
                                    { divider: true },
                                    { label: 'Total Fat', value: `${nutrition.fat}g`, bold: true, dv: `${Math.round(nutrition.fat / 65 * 100)}%` },
                                    { label: 'Saturated Fat', value: `${nutrition.saturatedFat}g`, indent: true, dv: `${Math.round(nutrition.saturatedFat / 20 * 100)}%` },
                                    { divider: true },
                                    { label: 'Cholesterol', value: `${nutrition.cholesterol}mg`, bold: true, dv: `${Math.round(nutrition.cholesterol / 300 * 100)}%` },
                                    { label: 'Sodium', value: `${nutrition.sodium}mg`, bold: true, dv: `${Math.round(nutrition.sodium / 2300 * 100)}%` },
                                    { divider: true },
                                    { label: 'Total Carbohydrate', value: `${nutrition.carbs}g`, bold: true, dv: `${Math.round(nutrition.carbs / 275 * 100)}%` },
                                    { label: 'Dietary Fiber', value: `${nutrition.fiber}g`, indent: true, dv: `${Math.round(nutrition.fiber / 28 * 100)}%` },
                                    { label: 'Total Sugars', value: `${nutrition.sugar}g`, indent: true },
                                    { divider: true },
                                    { label: 'Protein', value: `${nutrition.protein}g`, bold: true },
                                    { divider: true, thick: true },
                                    { label: 'Potassium', value: `${nutrition.potassium}mg`, dv: `${Math.round(nutrition.potassium / 4700 * 100)}%` },
                                ].map((row, i) => {
                                    if (row.divider) return <div key={i} className={`border-dark-900 dark:border-white ${row.thick ? 'border-t-4' : 'border-t'}`} />;
                                    if (row.header) return <p key={i} className="text-xs font-black uppercase mt-1">{row.label}</p>;
                                    return (
                                        <div key={i} className={`flex items-baseline justify-between py-1.5 ${row.indent ? 'pl-4' : ''}`}>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`${row.bold ? 'font-black' : 'font-medium'} ${row.extraLarge ? 'text-4xl' : 'text-sm'}`}>
                                                    {row.label}
                                                </span>
                                                {row.value !== '' && <span className="text-sm font-medium">{row.value}</span>}
                                            </div>
                                            {row.dv && <span className="font-black text-sm">{row.dv}</span>}
                                            {row.alignRight && <span className="text-[10px] font-bold">{row.label}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-8 pt-4 border-t-8 border-dark-900 dark:border-white">
                                <p className="text-[10px] leading-tight text-dark-500 font-medium">
                                    * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'suggestions' && (
                        <motion.div
                            key="suggestions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Health Indicator */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                                    <span>🏥</span> Is this healthy?
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${currentHealthRating.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                                        currentHealthRating.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                            'bg-red-100 dark:bg-red-900/20'
                                        }`}>
                                        {currentHealthRating.emoji}
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{currentHealthRating.level}</p>
                                        <p className="text-dark-500 dark:text-dark-400 text-sm">Health score: {currentHealthRating.score}/100</p>
                                    </div>
                                </div>

                                {/* Health bar */}
                                <div className="mt-4">
                                    <div className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full relative">
                                        <motion.div
                                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-dark-800 rounded-full border-2 border-dark-900 dark:border-white shadow-lg"
                                            initial={{ left: '0%' }}
                                            animate={{ left: `${100 - currentHealthRating.score}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-dark-400">
                                        <span>Healthy</span>
                                        <span>Moderate</span>
                                        <span>Indulgent</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Suggestions */}
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                                    <span>🧠</span> AI Health Suggestions
                                    <span className="badge-green text-xs ml-2">{dietMode.replace('_', ' ')}</span>
                                </h3>
                                <div className="space-y-3">
                                    {suggestions.map((suggestion, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-3 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 + 0.5 }}
                                        >
                                            <span className="text-lg mt-0.5">💡</span>
                                            <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">{suggestion}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'compare' && (
                        <motion.div
                            key="compare"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass rounded-3xl p-6 md:p-8"
                        >
                            <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                <span>🔄</span> Detected Foods Comparison
                            </h3>
                            {allResults && allResults.length > 1 ? (
                                <div className="space-y-4">
                                    {allResults.map((result, i) => (
                                        <motion.div
                                            key={i}
                                            className={`rounded-2xl p-4 border-2 transition-all cursor-pointer ${selectedFood === i
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                                                : 'border-transparent bg-dark-50 dark:bg-dark-800/50 hover:border-dark-300 dark:hover:border-dark-600'
                                                }`}
                                            onClick={() => setSelectedFood(i)}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                                                    <div>
                                                        <h4 className="font-bold capitalize">{result.food}</h4>
                                                        <p className="text-xs text-dark-500">Confidence: {result.confidence}%</p>
                                                    </div>
                                                </div>
                                                <span className="text-xl font-bold gradient-text">{result.nutrition.calories} kcal</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div className="bg-white dark:bg-dark-700 rounded-xl p-2">
                                                    <p className="text-xs text-dark-500">Protein</p>
                                                    <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{result.nutrition.protein}g</p>
                                                </div>
                                                <div className="bg-white dark:bg-dark-700 rounded-xl p-2">
                                                    <p className="text-xs text-dark-500">Carbs</p>
                                                    <p className="font-bold text-sm text-purple-600 dark:text-purple-400">{result.nutrition.carbs}g</p>
                                                </div>
                                                <div className="bg-white dark:bg-dark-700 rounded-xl p-2">
                                                    <p className="text-xs text-dark-500">Fat</p>
                                                    <p className="font-bold text-sm text-amber-600 dark:text-amber-400">{result.nutrition.fat}g</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-dark-500 dark:text-dark-400">
                                    <span className="text-4xl mb-4 block">🎯</span>
                                    <p>Only one food item was detected with high confidence.</p>
                                    <p className="text-sm mt-2">Try uploading a plate with multiple food items!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link to="/upload" className="flex-1">
                        <button className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                            <span>📸</span>
                            <span>Scan Another Food</span>
                        </button>
                    </Link>
                    <Link to="/history" className="flex-1">
                        <button className="btn-secondary w-full flex items-center justify-center gap-2 py-4">
                            <span>📊</span>
                            <span>View History</span>
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
