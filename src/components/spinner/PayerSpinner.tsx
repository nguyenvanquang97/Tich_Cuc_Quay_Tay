import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Award, XCircle, PartyPopper, CreditCard } from 'lucide-react';
import { people, Person } from '../../data/people';
import Confetti from './Confetti';
import SuccessAnimation from './SuccessAnimation';

const PayerSpinner: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const spinnerRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (people.length < 2) {
      alert('Cần ít nhất 2 người để quay!');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedPerson(null);

    const spinDuration = 3 + Math.random() * 2;
    const extraRotation = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * (2 + Math.floor(Math.random() * 3))) + extraRotation;

    setRotation(totalRotation);

    setTimeout(() => {
      const segmentAngle = 360 / people.length;
      const normalizedRotation = totalRotation % 360;
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle);
      const actualIndex = people.length - 1 - selectedIndex;
      setSelectedPerson(people[actualIndex % people.length]);
      setIsSpinning(false);
      setShowPopup(true);
    }, spinDuration * 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 md:p-8 transition-colors duration-200">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800 dark:text-gray-100">
        <CreditCard className="inline-block w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2" />
        Ai sẽ trả tiền?
      </h2>

      <div className="relative w-full max-w-[min(90vw,80vh)] sm:max-w-[80vh] aspect-square">
        {/* Spinner */}
        <motion.div
          ref={spinnerRef}
          className="w-full h-full rounded-full overflow-hidden border-8 border-gray-200 dark:border-gray-700 shadow-lg relative transition-colors duration-200"
          animate={{ rotate: rotation }}
          transition={{
            duration: isSpinning ? 3 + Math.random() * 2 : 0,
            ease: isSpinning ? [0.2, 0.5, 0.3, 0.99] : 'linear',
          }}
          style={{
            background: 'conic-gradient(from 0deg, ' +
              people.map((person, index) => {
                const segmentPercent = 100 / people.length;
                const startPercent = index * segmentPercent;
                const endPercent = (index + 1) * segmentPercent;
                return `${person.color} ${startPercent}% ${endPercent}%`;
              }).join(', ') + ')',
          }}
        >
          {/* Person names positioned correctly */}
          {people.map((person, index) => {
            const segmentAngle = 360 / people.length;
            const startAngle = index * segmentAngle;
            const middleAngle = startAngle + segmentAngle / 2;

            // Convert to radians for calculations
            const angleRad = (middleAngle - 90) * Math.PI / 180; // -90 to start from top

            // Calculate position (75% from center to edge)
            const radius = 40; // percentage of container
            const x = 50 + radius * Math.cos(angleRad);
            const y = 50 + radius * Math.sin(angleRad);

            return (
              <div
                key={person.id}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 'auto',
                  height: 'auto',
                }}
              >
                <div
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-black/60 rounded-full text-white font-medium text-xs sm:text-sm whitespace-normal flex items-center justify-center shadow-lg max-w-[80px] sm:max-w-[120px] text-center"
                  style={{
                    transform: `rotate(${middleAngle > 90 && middleAngle < 270 ? middleAngle + 180 : middleAngle}deg)`,
                  }}
                >
                  <span className="mr-1 text-lg">{person.avatar}</span>
                  {person.name}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-8 border-gray-800 dark:border-gray-300 z-10 transition-colors duration-200"></div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 z-10">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-gray-800 dark:border-b-gray-300 mx-auto transition-colors duration-200"></div>
        </div>
      </div>

      {/* Spin button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || people.length < 2}
        className={`mt-4 sm:mt-6 md:mt-8 flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-white font-bold text-sm sm:text-base md:text-lg shadow-lg transition-all ${isSpinning ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-95'
          }`}
      >
        <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        <span className="hidden sm:inline">{isSpinning ? 'Đang quay...' : 'Quay chọn người trả tiền!'}</span>
        <span className="sm:hidden">{isSpinning ? 'Quay...' : 'Quay!'}</span>
      </button>

      {/* Result Popup */}
      <AnimatePresence>
        {showPopup && selectedPerson && (
          <>
            <Confetti pieces={150} duration={5000} />
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden transition-colors duration-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -10, 0],
                  transition: { y: { repeat: 2, duration: 0.5 } }
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <PartyPopper className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Người trả tiền được chọn!</h3>
                  </div>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="text-center py-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <SuccessAnimation color={selectedPerson.color} />
                    <div
                      className="w-full h-full rounded-full mx-auto flex items-center justify-center relative z-10 text-6xl"
                      style={{ backgroundColor: selectedPerson.color }}
                    >
                      {selectedPerson.avatar}
                    </div>
                  </div>
                  <motion.p
                    className="text-gray-600 dark:text-gray-300 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Người được chọn trả tiền:
                  </motion.p>
                  <motion.p
                    className="text-3xl font-bold mb-4"
                    style={{ color: selectedPerson.color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    {selectedPerson.name}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Chuẩn bị ví đi nào!
                    </p>
                  </motion.div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayerSpinner;