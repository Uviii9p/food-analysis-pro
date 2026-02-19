import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('nutriscan_darkMode');
        return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('nutriscan_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [scanHistory, setScanHistory] = useState(() => {
        const saved = localStorage.getItem('nutriscan_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [dailyLog, setDailyLog] = useState(() => {
        const saved = localStorage.getItem('nutriscan_dailyLog');
        return saved ? JSON.parse(saved) : {};
    });

    const [dietMode, setDietMode] = useState(() => {
        return localStorage.getItem('nutriscan_dietMode') || 'maintenance';
    });

    useEffect(() => {
        localStorage.setItem('nutriscan_darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        if (user) localStorage.setItem('nutriscan_user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('nutriscan_history', JSON.stringify(scanHistory));
    }, [scanHistory]);

    useEffect(() => {
        localStorage.setItem('nutriscan_dailyLog', JSON.stringify(dailyLog));
    }, [dailyLog]);

    useEffect(() => {
        localStorage.setItem('nutriscan_dietMode', dietMode);
    }, [dietMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const addScan = (scan) => {
        const newScan = {
            ...scan,
            id: Date.now(),
            timestamp: new Date().toISOString(),
        };
        setScanHistory(prev => [newScan, ...prev]);

        // Add to daily log
        const today = new Date().toISOString().split('T')[0];
        setDailyLog(prev => ({
            ...prev,
            [today]: [
                ...(prev[today] || []),
                newScan
            ]
        }));

        return newScan;
    };

    const removeScan = (id) => {
        setScanHistory(prev => prev.filter(s => s.id !== id));
    };

    const clearHistory = () => {
        setScanHistory([]);
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nutriscan_user');
    };

    const signup = (userData) => {
        const newUser = {
            ...userData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        return newUser;
    };

    // Get today's nutrition totals
    const today = new Date().toISOString().split('T')[0];
    const todayScans = dailyLog[today] || [];
    const todayTotals = todayScans.reduce((acc, scan) => ({
        calories: acc.calories + (scan.nutrition?.calories || 0),
        protein: acc.protein + (scan.nutrition?.protein || 0),
        carbs: acc.carbs + (scan.nutrition?.carbs || 0),
        fat: acc.fat + (scan.nutrition?.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Get weekly data
    const getWeeklyData = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            const dayScans = dailyLog[key] || [];
            const dayTotal = dayScans.reduce((acc, scan) => ({
                calories: acc.calories + (scan.nutrition?.calories || 0),
                protein: acc.protein + (scan.nutrition?.protein || 0),
                carbs: acc.carbs + (scan.nutrition?.carbs || 0),
                fat: acc.fat + (scan.nutrition?.fat || 0),
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            days.push({
                date: key,
                label: date.toLocaleDateString('en', { weekday: 'short' }),
                ...dayTotal,
            });
        }
        return days;
    };

    return (
        <AppContext.Provider value={{
            darkMode, toggleDarkMode,
            user, login, logout, signup,
            scanHistory, addScan, removeScan, clearHistory,
            dailyLog, todayTotals, todayScans, getWeeklyData,
            dietMode, setDietMode,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
