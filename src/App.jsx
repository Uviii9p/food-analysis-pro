import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import { useState } from 'react';

function App() {
    const [analysisResult, setAnalysisResult] = useState(null);

    return (
        <AppProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
                    <Navbar />
                    <main className="pt-20">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/upload" element={<UploadPage setAnalysisResult={setAnalysisResult} />} />
                            <Route path="/result" element={<ResultPage analysisResult={analysisResult} />} />
                            <Route path="/history" element={<HistoryPage setAnalysisResult={setAnalysisResult} />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                    </main>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            className: 'glass-strong !rounded-2xl !font-medium',
                            duration: 3000,
                            style: {
                                background: 'var(--toast-bg, #fff)',
                                color: 'var(--toast-color, #1e293b)',
                            },
                        }}
                    />
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
