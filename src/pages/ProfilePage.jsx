import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { calculateBMI, calculateDailyCalories } from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, login, logout, signup, dietMode, setDietMode, scanHistory, darkMode } = useApp();
    const [activeTab, setActiveTab] = useState('profile');
    const [showAuth, setShowAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

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

    // Auth form
    const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

    // BMI form
    const [bmiForm, setBmiForm] = useState({ weight: '', height: '', age: '', gender: 'male', activity: 'moderate' });
    const [bmiResult, setBmiResult] = useState(null);
    const [calorieResult, setCalorieResult] = useState(null);

    const handleAuth = (e) => {
        e.preventDefault();
        if (isLogin) {
            login({ name: authForm.email.split('@')[0], email: authForm.email });
            toast.success('Welcome back! 🎉');
        } else {
            signup({ name: authForm.name, email: authForm.email });
            toast.success('Account created! 🎉');
        }
        setShowAuth(false);
        setAuthForm({ name: '', email: '', password: '' });
    };

    const handleBMI = (e) => {
        e.preventDefault();
        const weight = parseFloat(bmiForm.weight);
        const height = parseFloat(bmiForm.height);
        const age = parseInt(bmiForm.age);

        if (!weight || !height || !age) {
            toast.error('Please fill all fields');
            return;
        }

        const bmi = calculateBMI(weight, height);
        const calories = calculateDailyCalories(weight, height, age, bmiForm.gender, bmiForm.activity);

        setBmiResult(bmi);
        setCalorieResult(calories);
        toast.success('BMI calculated! 📊');
    };

    const dietModes = [
        { id: 'weight_loss', label: 'Weight Loss', icon: '🏃', desc: 'Calorie deficit for healthy weight loss', color: 'from-green-500 to-emerald-500' },
        { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪', desc: 'High protein for building muscle', color: 'from-blue-500 to-cyan-500' },
        { id: 'maintenance', label: 'Maintenance', icon: '⚖️', desc: 'Balanced nutrition to maintain weight', color: 'from-purple-500 to-pink-500' },
    ];

    const totalScans = scanHistory.length;
    const totalCalories = scanHistory.reduce((s, scan) => s + (scan.nutrition?.calories || 0), 0);
    const avgCalories = totalScans > 0 ? Math.round(totalCalories / totalScans) : 0;
    const topFoods = {};
    scanHistory.forEach(s => {
        const name = s.primaryFood;
        topFoods[name] = (topFoods[name] || 0) + 1;
    });
    const sortedFoods = Object.entries(topFoods).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    variants={jelly}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                >
                    <h1 className="section-title text-white">
                        Your <span className="gradient-text">Profile</span>
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your health goals and preferences</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    className="glass rounded-3xl p-6 md:p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center text-4xl shadow-lg shadow-accent-500/25">
                            {user ? user.name?.[0]?.toUpperCase() || '👤' : '👤'}
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            {user ? (
                                <>
                                    <h2 className="text-2xl font-bold font-display">{user.name}</h2>
                                    <p className="text-dark-500 dark:text-dark-400">{user.email}</p>
                                    <p className="text-xs text-dark-400 mt-1">
                                        Member since {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold font-display text-white">Guest User</h2>
                                    <p className="text-slate-400">Sign in to save your progress</p>
                                </>
                            )}
                        </div>
                        <div>
                            {user ? (
                                <button onClick={logout} className="btn-secondary text-sm">
                                    Logout
                                </button>
                            ) : (
                                <button onClick={() => setShowAuth(true)} className="btn-primary text-sm">
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <motion.div
                            className="bg-white/5 rounded-2xl p-4 text-center border border-white/5"
                            whileHover={jellyHover}
                        >
                            <p className="text-2xl font-black gradient-text">{totalScans}</p>
                            <p className="text-[10px] font-black uppercase text-slate-500">Total Scans</p>
                        </motion.div>
                        <motion.div
                            className="bg-white/5 rounded-2xl p-4 text-center border border-white/5"
                            whileHover={jellyHover}
                        >
                            <p className="text-2xl font-black gradient-text">{avgCalories}</p>
                            <p className="text-[10px] font-black uppercase text-slate-500">Avg Calories</p>
                        </motion.div>
                        <motion.div
                            className="bg-white/5 rounded-2xl p-4 text-center border border-white/5"
                            whileHover={jellyHover}
                        >
                            <p className="text-2xl font-black gradient-text">{totalCalories}</p>
                            <p className="text-[10px] font-black uppercase text-slate-500">Total Cal</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'profile', label: '⚙️ Settings' },
                        { id: 'bmi', label: '📏 BMI Calculator' },
                        { id: 'diet', label: '🎯 Diet Mode' },
                        { id: 'stats', label: '📊 Stats' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'gradient-primary shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)]'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Settings */}
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="glass rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🌙</span>
                                    <div>
                                        <p className="font-semibold">Dark Mode</p>
                                        <p className="text-xs text-dark-500">{darkMode ? 'Currently dark' : 'Currently light'}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400' : 'bg-dark-200 text-dark-600'
                                    }`}>
                                    {darkMode ? 'ON' : 'OFF'}
                                </span>
                            </div>

                            <div className="glass rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🎯</span>
                                    <div>
                                        <p className="font-semibold">Diet Mode</p>
                                        <p className="text-xs text-dark-500">{dietMode.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('diet')}
                                    className="text-sm text-primary-500 font-semibold"
                                >
                                    Change →
                                </button>
                            </div>

                            <div className="glass rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📊</span>
                                    <div>
                                        <p className="font-semibold">Scan History</p>
                                        <p className="text-xs text-dark-500">{totalScans} scans recorded</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xl">ℹ️</span>
                                    <p className="font-semibold">About NutriScan AI</p>
                                </div>
                                <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed">
                                    NutriScan AI uses advanced machine learning to detect food items from images
                                    and provide accurate nutritional information. Your data is stored locally on
                                    your device for maximum privacy.
                                </p>
                                <p className="text-xs text-dark-400 mt-3">Version 1.0.0 • Made with ❤️</p>
                            </div>
                        </motion.div>
                    )}

                    {/* BMI Calculator */}
                    {activeTab === 'bmi' && (
                        <motion.div
                            key="bmi"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>📏</span> BMI & Calorie Calculator
                                </h3>
                                <form onSubmit={handleBMI} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 70"
                                                value={bmiForm.weight}
                                                onChange={(e) => setBmiForm(f => ({ ...f, weight: e.target.value }))}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Height (cm)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 175"
                                                value={bmiForm.height}
                                                onChange={(e) => setBmiForm(f => ({ ...f, height: e.target.value }))}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Age</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 25"
                                                value={bmiForm.age}
                                                onChange={(e) => setBmiForm(f => ({ ...f, age: e.target.value }))}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Gender</label>
                                            <select
                                                value={bmiForm.gender}
                                                onChange={(e) => setBmiForm(f => ({ ...f, gender: e.target.value }))}
                                                className="input-field"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Activity Level</label>
                                        <select
                                            value={bmiForm.activity}
                                            onChange={(e) => setBmiForm(f => ({ ...f, activity: e.target.value }))}
                                            className="input-field"
                                        >
                                            <option value="sedentary">Sedentary (little or no exercise)</option>
                                            <option value="light">Lightly active (1-3 days/week)</option>
                                            <option value="moderate">Moderately active (3-5 days/week)</option>
                                            <option value="active">Very active (6-7 days/week)</option>
                                            <option value="very_active">Extra active (athlete level)</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                                        Calculate BMI & Calories
                                    </button>
                                </form>
                            </div>

                            {/* BMI Result */}
                            {bmiResult && (
                                <motion.div
                                    className="glass rounded-3xl p-6 md:p-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <h3 className="text-lg font-bold font-display mb-6">📊 Your Results</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* BMI */}
                                        <div className="text-center">
                                            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${bmiResult.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                                                bmiResult.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                                    bmiResult.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                                        'bg-red-100 dark:bg-red-900/20'
                                                }`}>
                                                <div>
                                                    <p className="text-3xl font-black">{bmiResult.bmi}</p>
                                                    <p className="text-xs text-dark-500">BMI</p>
                                                </div>
                                            </div>
                                            <p className={`text-lg font-bold ${bmiResult.color === 'green' ? 'text-green-600' :
                                                bmiResult.color === 'yellow' ? 'text-yellow-600' :
                                                    bmiResult.color === 'blue' ? 'text-blue-600' :
                                                        'text-red-600'
                                                }`}>{bmiResult.category}</p>

                                            {/* BMI scale */}
                                            <div className="mt-4">
                                                <div className="h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full relative">
                                                    <motion.div
                                                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-dark-800 rounded-full border-2 border-dark-900 shadow-lg"
                                                        initial={{ left: '0%' }}
                                                        animate={{ left: `${Math.min(100, (bmiResult.bmi / 40) * 100)}%` }}
                                                        transition={{ duration: 1 }}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-1 text-[10px] text-dark-400">
                                                    <span>Under</span>
                                                    <span>Normal</span>
                                                    <span>Over</span>
                                                    <span>Obese</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Daily Calories */}
                                        <div className="text-center">
                                            <div className="w-32 h-32 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                                                <div>
                                                    <p className="text-3xl font-black gradient-text">{calorieResult}</p>
                                                    <p className="text-xs text-dark-500">kcal/day</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">Daily Calories Needed</p>
                                            <p className="text-xs text-dark-500 mt-2">
                                                Based on Mifflin-St Jeor equation
                                            </p>
                                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2">
                                                    <p className="text-sm font-bold text-green-600">{calorieResult - 500}</p>
                                                    <p className="text-[10px] text-dark-500">Lose</p>
                                                </div>
                                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-2">
                                                    <p className="text-sm font-bold text-purple-600">{calorieResult}</p>
                                                    <p className="text-[10px] text-dark-500">Maintain</p>
                                                </div>
                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2">
                                                    <p className="text-sm font-bold text-blue-600">{calorieResult + 500}</p>
                                                    <p className="text-[10px] text-dark-500">Gain</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Diet Mode */}
                    {activeTab === 'diet' && (
                        <motion.div
                            key="diet"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>🎯</span> Choose Your Diet Mode
                                </h3>
                                <p className="text-dark-500 dark:text-dark-400 text-sm mb-6">
                                    Select your fitness goal. AI suggestions will adapt to your chosen mode.
                                </p>
                                <div className="space-y-4">
                                    {dietModes.map((mode) => (
                                        <motion.button
                                            key={mode.id}
                                            onClick={() => { setDietMode(mode.id); toast.success(`Diet mode: ${mode.label} 🎯`); }}
                                            className={`w-full rounded-2xl p-5 text-left border-2 transition-all ${dietMode === mode.id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                                                : 'border-transparent bg-dark-50 dark:bg-dark-800/50 hover:border-dark-300 dark:hover:border-dark-600'
                                                }`}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-2xl shadow-md`}>
                                                    {mode.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">{mode.label}</h4>
                                                    <p className="text-sm text-dark-500 dark:text-dark-400">{mode.desc}</p>
                                                </div>
                                                {dietMode === mode.id && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-2xl"
                                                    >
                                                        ✅
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats */}
                    {activeTab === 'stats' && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="glass rounded-3xl p-6 md:p-8">
                                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                                    <span>🏆</span> Your Food Stats
                                </h3>

                                {sortedFoods.length > 0 ? (
                                    <div className="space-y-3">
                                        {sortedFoods.map(([food, count], i) => (
                                            <div key={food} className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-800/50">
                                                <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🍽️'}</span>
                                                <div className="flex-1">
                                                    <p className="font-semibold capitalize">{food}</p>
                                                    <div className="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full mt-1 overflow-hidden">
                                                        <motion.div
                                                            className="h-full gradient-primary rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(count / sortedFoods[0][1]) * 100}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-dark-500">{count}x</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-dark-500">
                                        <span className="text-4xl block mb-3">📊</span>
                                        <p>No stats yet. Start scanning food!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Auth Modal */}
                <AnimatePresence>
                    {showAuth && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAuth(false)}
                        >
                            <motion.div
                                className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-accent flex items-center justify-center text-3xl mb-3 shadow-lg">
                                        👤
                                    </div>
                                    <h3 className="text-xl font-bold font-display">
                                        {isLogin ? 'Welcome Back' : 'Create Account'}
                                    </h3>
                                    <p className="text-sm text-dark-500 mt-1">
                                        {isLogin ? 'Sign in to access your data' : 'Join NutriScan AI today'}
                                    </p>
                                </div>

                                <form onSubmit={handleAuth} className="space-y-4">
                                    {!isLogin && (
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={authForm.name}
                                            onChange={(e) => setAuthForm(f => ({ ...f, name: e.target.value }))}
                                            className="input-field"
                                            required
                                        />
                                    )}
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={authForm.email}
                                        onChange={(e) => setAuthForm(f => ({ ...f, email: e.target.value }))}
                                        className="input-field"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={authForm.password}
                                        onChange={(e) => setAuthForm(f => ({ ...f, password: e.target.value }))}
                                        className="input-field"
                                        required
                                    />
                                    <button type="submit" className="btn-accent w-full py-3.5">
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                    </button>
                                </form>

                                <p className="text-sm text-center text-dark-500 mt-4">
                                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-accent-500 font-semibold hover:underline"
                                    >
                                        {isLogin ? 'Sign Up' : 'Sign In'}
                                    </button>
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
