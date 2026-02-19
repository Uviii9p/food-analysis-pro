import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { recognizeFood, getNutritionData, getHealthRating, getHealthSuggestion } from '../services/api';
import toast from 'react-hot-toast';

export default function UploadPage({ setAnalysisResult }) {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeStep, setAnalyzeStep] = useState('');
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const { addScan, dietMode } = useApp();
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

    const handleFile = useCallback((file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image too large. Max 10MB allowed.');
            return;
        }

        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleAnalyze = async () => {
        if (!image) {
            toast.error('Please upload an image first');
            return;
        }

        setIsAnalyzing(true);
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // Step 1: Recognize food
            setAnalyzeStep('🔍 Scanning image pixels...');
            await sleep(1200);

            setAnalyzeStep('🧠 Identifying components...');
            const foods = await recognizeFood(image);
            await sleep(1000);

            if (!foods || foods.length === 0) {
                toast.error('Could not detect food in image. Please try another photo.');
                setIsAnalyzing(false);
                return;
            }

            // Step 2: Get nutrition/health data
            setAnalyzeStep('📊 Extracting nutritional data...');
            await sleep(1500);

            setAnalyzeStep('⚡ Calculating macro balance...');
            await sleep(1000);

            const results = await Promise.all(foods.map(async (food) => {
                // If the recognition step already provided full analysis (OpenAI Vision path)
                if (food.nutrition && food.healthRating) {
                    return {
                        food: food.name,
                        confidence: food.confidence,
                        nutrition: food.nutrition,
                        healthRating: food.healthRating,
                        suggestions: food.suggestions || [],
                    };
                }

                // Fallback path (Clarifai / Smart Detection)
                const nutrition = await getNutritionData(food.name);
                const healthRating = getHealthRating(nutrition);
                const suggestions = getHealthSuggestion(nutrition, dietMode);

                return {
                    food: food.name,
                    confidence: food.confidence,
                    nutrition,
                    healthRating,
                    suggestions,
                };
            }));

            setAnalyzeStep('✨ Finalizing your report...');
            await sleep(800);

            // Primary result (highest confidence)
            const primaryResult = results[0];
            const allResults = results;

            const scanData = {
                imagePreview,
                primaryFood: primaryResult.food,
                confidence: primaryResult.confidence,
                nutrition: primaryResult.nutrition,
                healthRating: primaryResult.healthRating,
                suggestions: primaryResult.suggestions,
                allResults,
            };

            // Save to history
            addScan(scanData);

            // Set result and navigate
            setAnalysisResult(scanData);
            toast.success(`Analysis Complete: ${primaryResult.food}!`);
            navigate('/result');

        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
            setAnalyzeStep('');
        }
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-10"
                    variants={jelly}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                >
                    <h1 className="section-title mb-3">
                        <span className="gradient-text">Scan</span> Your Food
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Upload a food photo and let AI analyze its nutritional content
                    </p>
                </motion.div>

                {/* Upload Area */}
                <motion.div
                    variants={jelly}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                >
                    <AnimatePresence mode="wait">
                        {!imagePreview ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`relative glass rounded-3xl border-2 border-dashed transition-all duration-300 ${isDragging
                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 scale-[1.02]'
                                    : 'border-dark-300 dark:border-dark-600 hover:border-primary-400'
                                    } upload-pulse`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <div className="p-12 md:p-20 text-center">
                                    <motion.div
                                        className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                                        animate={{
                                            scale: isDragging ? 1.2 : [1, 1.05, 1],
                                            rotate: isDragging ? 5 : [0, 2, -2, 0]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <span className="text-5xl">{isDragging ? '📥' : '📷'}</span>
                                    </motion.div>

                                    <h3 className="text-xl md:text-2xl font-bold font-display mb-3">
                                        {isDragging ? 'Drop your image here!' : 'Upload Food Image'}
                                    </h3>
                                    <p className="text-dark-500 dark:text-dark-400 mb-8 max-w-md mx-auto">
                                        Drag & drop an image here, or use the buttons below to upload
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        {/* Gallery upload */}
                                        <motion.button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="btn-primary flex items-center gap-3 w-full sm:w-auto"
                                            whileHover={jellyHover}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="text-xl">🖼️</span>
                                            <span>Choose from Gallery</span>
                                        </motion.button>

                                        {/* Camera */}
                                        <motion.button
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="btn-accent flex items-center gap-3 w-full sm:w-auto"
                                            whileHover={jellyHover}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="text-xl">📸</span>
                                            <span>Take Photo</span>
                                        </motion.button>
                                    </div>

                                    <p className="text-xs text-dark-400 dark:text-dark-500 mt-6">
                                        Supports JPG, PNG, WebP • Max 10MB
                                    </p>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                />
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass rounded-3xl overflow-hidden"
                            >
                                {/* Image preview */}
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Food preview"
                                        className="w-full h-64 md:h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                    {/* Remove button */}
                                    <motion.button
                                        onClick={clearImage}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        ✕
                                    </motion.button>

                                    <div className="absolute bottom-4 left-4">
                                        <span className="badge bg-black/30 backdrop-blur-md text-white">
                                            📷 Image Ready
                                        </span>
                                    </div>
                                </div>

                                {/* Analysis buttons */}
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <motion.button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing}
                                            className="btn-primary flex items-center gap-3 w-full sm:flex-1 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={!isAnalyzing ? jellyHover : {}}
                                            whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <motion.span
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="text-xl"
                                                    >
                                                        ⏳
                                                    </motion.span>
                                                    <span>Analyzing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xl">🧠</span>
                                                    <span>Analyze with AI</span>
                                                </>
                                            )}
                                        </motion.button>

                                        <motion.button
                                            onClick={clearImage}
                                            disabled={isAnalyzing}
                                            className="btn-secondary flex items-center gap-3 w-full sm:w-auto py-4 disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span>🔄</span>
                                            <span>Change Image</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Loading overlay */}
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                            <motion.div
                                className="glass-strong rounded-3xl p-8 md:p-12 max-w-md mx-4 text-center"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            >
                                <motion.div
                                    className="w-24 h-24 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-2xl shadow-primary-500/30"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span className="text-5xl">🧠</span>
                                </motion.div>

                                <h3 className="text-xl font-bold font-display mb-3">AI Analyzing...</h3>
                                <p className="text-dark-500 dark:text-dark-400 mb-6">{analyzeStep}</p>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full gradient-primary rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 4, ease: 'easeInOut' }}
                                    />
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2">
                                    {['🔍', '📊', '🧠', '✨'].map((emoji, i) => (
                                        <motion.span
                                            key={i}
                                            className="text-2xl"
                                            animate={{
                                                opacity: [0.3, 1, 0.3],
                                                scale: [0.8, 1.2, 0.8]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.3
                                            }}
                                        >
                                            {emoji}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tips Section */}
                <motion.div
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {[
                        { icon: '💡', title: 'Good Lighting', desc: 'Take photos in well-lit conditions for better accuracy' },
                        { icon: '🎯', title: 'Center the Food', desc: 'Make sure the food is centered and clearly visible' },
                        { icon: '📐', title: 'Close-up', desc: 'Take close-up shots for better food detection' },
                    ].map((tip, i) => (
                        <motion.div
                            key={i}
                            className="glass rounded-2xl p-4 flex items-start gap-4 border border-white/5 hover:border-blue-500/30 transition-all duration-300"
                            variants={jelly}
                            initial="hidden"
                            animate="visible"
                            custom={2 + i}
                            whileHover={jellyHover}
                        >
                            <span className="text-2xl">{tip.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-white">{tip.title}</h4>
                                <p className="text-xs text-slate-400 mt-1">{tip.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
