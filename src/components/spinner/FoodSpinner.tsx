import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, RotateCw, Award, XCircle, PartyPopper, Menu, ChevronLeft } from 'lucide-react';
import { lunchFoods, snackFoods, drinkFoods, alcoholFoods, Food as FoodType } from '../../data/foodCategories';
import Confetti from './Confetti';
import SuccessAnimation from './SuccessAnimation';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
  '#EF476F', '#FFC43D', '#1B9AAA', '#6A0572', '#AB83A1',
  '#F15BB5', '#9B5DE5', '#00BBF9', '#00F5D4', '#FEE440'
];

const FoodSpinner: React.FC = () => {
  const [foods, setFoods] = useState<FoodType[]>(lunchFoods);
  const [currentCategory, setCurrentCategory] = useState<'lunch' | 'snack' | 'drink' | 'alcohol'>('lunch');

  const [newFood, setNewFood] = useState('');
  const [newFoodImage, setNewFoodImage] = useState<File | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [rotation, setRotation] = useState(0);
  const [editingFood, setEditingFood] = useState<FoodType | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const spinnerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hàm chuyển đổi danh mục thực phẩm
  const changeCategory = (category: 'lunch' | 'snack' | 'drink' | 'alcohol') => {
    setCurrentCategory(category);
    switch (category) {
      case 'lunch':
        setFoods(lunchFoods);
        break;
      case 'snack':
        setFoods(snackFoods);
        break;
      case 'drink':
        setFoods(drinkFoods);
        break;
      case 'alcohol':
        setFoods(alcoholFoods);
        break;
    }
  };

  const addFood = async () => {
    if (newFood.trim() !== '') {
      let imageUrl = '';

      const newFoodItem: FoodType = {
        id: Date.now().toString(),
        name: newFood.trim(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        category: currentCategory,
        imageUrl: imageUrl || undefined
      };

      setFoods([...foods, newFoodItem]);
      setNewFood('');
      setNewFoodImage(null);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const deleteFood = async (id: string) => {
    if (foods.length <= 10) {
      alert('Không thể xóa món ăn khi còn 10 món hoặc ít hơn!');
      return;
    }
    const foodToDelete = foods.find(food => food.id === id);
    setFoods(foods.filter(food => food.id !== id));
  };

  const startEdit = (food: FoodType) => {
    setEditingFood(food);
    setEditValue(food.name);
    setEditImage(null);
  };

  const saveEdit = async () => {
    if (editingFood && editValue.trim() !== '') {
      let updatedImageUrl = editingFood.imageUrl;

      setFoods(foods.map(food =>
        food.id === editingFood.id ? {
          ...food,
          name: editValue.trim(),
          imageUrl: updatedImageUrl
        } : food
      ));

      setEditingFood(null);
    }
  };

  const cancelEdit = () => {
    setEditingFood(null);
  };

  const spinWheel = () => {
    if (foods.length < 2) {
      alert('Thêm ít nhất 2 món ăn để quay!');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedFood(null);

    const spinDuration = 3 + Math.random() * 2;
    const extraRotation = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * (2 + Math.floor(Math.random() * 3))) + extraRotation;

    setRotation(totalRotation);

    setTimeout(() => {
      const segmentAngle = 360 / foods.length;
      const normalizedRotation = totalRotation % 360;
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle);
      const actualIndex = foods.length - 1 - selectedIndex;
      setSelectedFood(foods[actualIndex % foods.length]);
      setIsSpinning(false);
      setShowPopup(true);
    }, spinDuration * 1000);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await addFood();
    }
  };

  const handleEditKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse w-full h-screen mx-auto gap-0 p-0 overflow-hidden relative">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-16 right-2 z-50 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        {showSidebar ? <ChevronLeft className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for closing sidebar on mobile */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="flex-[3] flex flex-col items-center justify-start h-full bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 md:p-8 transition-colors duration-200">




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
                foods.map((food, index) => {
                  const segmentPercent = 100 / foods.length;
                  const startPercent = index * segmentPercent;
                  const endPercent = (index + 1) * segmentPercent;
                  return `${food.color} ${startPercent}% ${endPercent}%`;
                }).join(', ') + ')',
            }}
          >
            {/* Food names positioned correctly */}
            {foods.map((food, index) => {
              const segmentAngle = 360 / foods.length;
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
                  key={food.id}
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
                    {food.imageUrl && (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-4 h-4 object-cover rounded-full mr-1"
                      />
                    )}
                    {food.name}
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
          disabled={isSpinning || foods.length < 2}
          className={`mt-4 sm:mt-6 md:mt-8 flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-white font-bold text-sm sm:text-base md:text-lg shadow-lg transition-all ${isSpinning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
        >
          <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          <span className="hidden sm:inline">{isSpinning ? 'Đang quay...' : 'Quay!'}</span>
          <span className="sm:hidden">{isSpinning ? 'Quay...' : 'Quay!'}</span>
        </button>

        {/* Result Popup */}
        <AnimatePresence>
          {showPopup && selectedFood && (
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
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Kết quả quay</h3>
                    </div>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="text-center py-6">
                    {selectedFood.imageUrl ? (
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <SuccessAnimation color={selectedFood.color} />
                        <img
                          src={selectedFood.imageUrl}
                          alt={selectedFood.name}
                          className="w-full h-full object-cover rounded-full border-4 relative z-10"
                          style={{ borderColor: selectedFood.color }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <SuccessAnimation color={selectedFood.color} />
                        <div
                          className="w-full h-full rounded-full mx-auto flex items-center justify-center relative z-10"
                          style={{ backgroundColor: selectedFood.color }}
                        >
                          <span className="text-white text-4xl font-bold">{selectedFood.name.charAt(0)}</span>
                        </div>
                      </div>
                    )}
                    <motion.p
                      className="text-gray-600 dark:text-gray-300 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Món ăn được chọn:
                    </motion.p>
                    <motion.p
                      className="text-3xl font-bold mb-4"
                      style={{ color: selectedFood.color }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      {selectedFood.name}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Chúc bạn ngon miệng!</p>
                    </motion.div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
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

      {/* Sidebar - hidden on mobile by default, shown when showSidebar is true */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-80 md:w-auto md:relative md:flex-1 flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg transition-all duration-300 z-40 ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <h2 className="text-lg sm:text-xl font-bold py-3 sm:py-4 text-center bg-blue-600 text-white sticky top-0">Danh Sách Món Ăn</h2>

        {/* Category indicator */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2 bg-gray-100 dark:bg-gray-700 sticky top-[52px] sm:top-[60px] z-10 transition-colors duration-200">
          <button
            onClick={() => changeCategory('lunch')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${currentCategory === 'lunch' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}
          >
            Đồ ăn trưa
          </button>
          <button
            onClick={() => changeCategory('snack')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${currentCategory === 'snack' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}
          >
            Đồ ăn vặt
          </button>
          <button
            onClick={() => changeCategory('drink')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${currentCategory === 'drink' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}
          >
            Đồ uống
          </button>
          <button
            onClick={() => changeCategory('alcohol')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${currentCategory === 'alcohol' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}
          >
            Món nhậu
          </button>
        </div>

        {/* Add food form */}
        <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-[104px] sm:top-[120px] bg-white dark:bg-gray-800 z-10 transition-colors duration-200">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tên món ăn..."
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
            <button
              onClick={async () => await addFood()}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Food list */}
        <div className="flex-1 overflow-y-auto">
          {foods.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">Chưa có món ăn nào. Hãy thêm món ăn!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {foods.map((food) => (
                <li key={food.id} className="p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors">
                  {editingFood?.id === food.id ? (
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          autoFocus
                          className="flex-1 px-2 py-1 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        />
                        <button
                          onClick={async () => await saveEdit()}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <span
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: food.color }}
                        ></span>
                        <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">{food.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(food)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={async () => await deleteFood(food.id)}
                          disabled={foods.length <= 10}
                          className={`w-5 h-5 ${foods.length <= 10
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800'
                            }`}
                          title={foods.length <= 10 ? 'Không thể xóa khi còn 10 món hoặc ít hơn' : 'Xóa món ăn'}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodSpinner;