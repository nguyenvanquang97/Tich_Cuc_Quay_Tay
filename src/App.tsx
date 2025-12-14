import React, { useState } from "react";
import FoodSpinner from "./components/spinner/FoodSpinner";
import PayerSpinner from "./components/spinner/PayerSpinner";
import { Utensils, CreditCard, Moon, Sun } from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";

type Mode = 'food' | 'payer';

const App = () => {
    const [mode, setMode] = useState<Mode>('food');
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Mode Toggle */}
            <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
                    <div className="flex justify-between items-center">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700" />
                            )}
                        </button>

                        {/* Mode selection buttons */}
                        <div className="flex gap-2 sm:gap-4">
                            <button
                                onClick={() => setMode('food')}
                                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${mode === 'food'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden xs:inline">Quay chọn món ăn</span>
                                <span className="xs:hidden">Món ăn</span>
                            </button>
                            <button
                                onClick={() => setMode('payer')}
                                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${mode === 'payer'
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden xs:inline">Quay chọn người trả tiền</span>
                                <span className="xs:hidden">Trả tiền</span>
                            </button>
                        </div>

                        {/* Spacer for symmetry */}
                        <div className="w-9"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="py-2 sm:py-4 md:py-8">
                <div className="container mx-auto px-2 sm:px-4">
                    {mode === 'food' ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800 dark:text-gray-100">Ăn gì bây giờ...</h1>
                            <FoodSpinner />
                        </>
                    ) : (
                        <PayerSpinner />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
