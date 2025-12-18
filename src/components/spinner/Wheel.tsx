import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WheelItem {
    id: string;
    name: string;
    color: string;
    imageUrl?: string;
    avatar?: string;
}

interface WheelProps {
    items: WheelItem[];
    rotation: number;
    isSpinning: boolean;
}

const Wheel: React.FC<WheelProps> = ({ items, rotation, isSpinning }) => {
    // Memoize the gradient calculation to avoid recalculating on every render
    const gradientStyle = useMemo(() => {
        const gradient = items.map((item, index) => {
            const segmentPercent = 100 / items.length;
            const startPercent = index * segmentPercent;
            const endPercent = (index + 1) * segmentPercent;
            return `${item.color} ${startPercent}% ${endPercent}%`;
        }).join(', ');

        return {
            background: `conic-gradient(from 0deg, ${gradient})`,
        };
    }, [items]);

    return (
        <motion.div
            className="w-full h-full rounded-full overflow-hidden border-8 border-gray-200 dark:border-gray-700 shadow-lg relative transition-colors duration-200"
            animate={{ rotate: rotation }}
            transition={{
                duration: isSpinning ? 3 + Math.random() * 2 : 0,
                ease: isSpinning ? [0.2, 0.5, 0.3, 0.99] : 'linear',
            }}
            style={{
                ...gradientStyle,
                // GPU acceleration hints
                willChange: isSpinning ? 'transform' : 'auto',
                transform: 'translateZ(0)', // Force GPU compositing
            }}
        >
            {/* Item labels positioned correctly */}
            {items.map((item, index) => {
                const segmentAngle = 360 / items.length;
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
                        key={item.id}
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
                            className="px-2 sm:px-3 py-1 sm:py-2 bg-black/60 rounded-full text-white font-medium text-xs sm:text-sm md:text-base whitespace-normal flex items-center justify-center shadow-lg max-w-[80px] sm:max-w-[120px] text-center"
                            style={{
                                transform: `rotate(${middleAngle > 90 && middleAngle < 270 ? middleAngle + 180 : middleAngle}deg)`,
                            }}
                        >
                            {/* Show avatar emoji for people */}
                            {item.avatar && (
                                <span className="mr-1 text-lg">{item.avatar}</span>
                            )}
                            {/* Show food image if available */}
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-4 h-4 object-cover rounded-full mr-1"
                                />
                            )}
                            {item.name}
                        </div>
                    </div>
                );
            })}
        </motion.div>
    );
};

export default React.memo(Wheel);
