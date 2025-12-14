import React, { useState } from "react";
import FoodSpinner from "./components/spinner/FoodSpinner";
import PayerSpinner from "./components/spinner/PayerSpinner";
import { Utensils, CreditCard } from "lucide-react";

type Mode = 'food' | 'payer';

const App = () => {
    const [mode, setMode] = useState<Mode>('food');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mode Toggle */}
            <div className="sticky top-0 z-50 bg-white shadow-md border-b">
                <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
                    <div className="flex justify-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setMode('food')}
                            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${mode === 'food'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden xs:inline">Quay chọn người trả tiền</span>
                            <span className="xs:hidden">Trả tiền</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="py-2 sm:py-4 md:py-8">
                <div className="container mx-auto px-2 sm:px-4">
                    {mode === 'food' ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8">Ăn gì bây giờ...</h1>
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
