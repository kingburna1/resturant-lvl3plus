"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingCart, Home, Utensils, Zap, ChevronDown, X, Globe } from 'lucide-react';

// --- Configuration Data (UPDATED) ---
const CATEGORIES = [
  { name: 'Main Course', icon: '🍲' },
  { name: 'Starter', icon: '🥗' },
  { name: 'Dessert', icon: '🍰' },
  { name: 'Drink', icon: '🍹' },
];

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'French', flag: '🇫🇷' },
];

const currentCartCount = 3; // Mock cart state
const currentTable = '5'; // Mock table indicator

// --- Sub-Components & Logic ---

// 1. Mobile Drawer Component (Updated Categories)
const MobileDrawer = ({ isOpen, toggleOpen, categories, currentLanguage, setLanguage }) => {
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 top-14 bg-white z-40 p-4 md:hidden overflow-y-auto shadow-xl"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={drawerVariants}
        >
          <div className="flex justify-end mb-4">
             <button onClick={toggleOpen} className="p-2 text-gray-500 hover:text-indigo-600">
                <X size={24} />
             </button>
          </div>
          
          <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2 border-b pb-1">Menu Categories</h3>
          <div className="space-y-1 mb-6">
            {categories.map((item) => (
              <Link key={item.name} href={`/category/${item.name.toLowerCase().replace(/\s/g, '-')}`} onClick={toggleOpen} className="flex items-center p-3 rounded-lg hover:bg-indigo-50 text-gray-800 hover:text-indigo-600 transition-colors">
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2 border-b pb-1">Settings</h3>
           <div className="space-y-1">
             <div className="flex items-center p-3 rounded-lg text-gray-600">
                <Utensils size={20} className="mr-3"/>
                <span className="font-medium">Table {currentTable} | Walk-In Settings</span>
             </div>
             
             {/* Language Selector in Drawer */}
             <div className="flex justify-between items-center p-3 rounded-lg text-gray-600">
                <div className="flex items-center">
                    <Globe size={20} className="mr-3"/>
                    <span className="font-medium">Language</span>
                </div>
                <select 
                    value={currentLanguage.code}
                    onChange={(e) => setLanguage(LANGUAGES.find(lang => lang.code === e.target.value))}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.label}
                        </option>
                    ))}
                </select>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Simple NavLink Component for Desktop
const NavLink = ({ href, children }) => (
  <motion.div
    initial={false}
    whileHover="hover"
    whileTap="tap"
    className="relative h-full flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
  >
    <Link href={href}>
      {children}
    </Link>
    
    {/* Animated Underline */}
    <motion.div 
      className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600"
      variants={{
        hover: { scaleX: 1, originX: 0 },
        initial: { scaleX: 0, originX: 0 },
        tap: { scaleX: 1, originX: 0.5, scaleY: 1.5 },
      }}
      initial="initial"
    />
  </motion.div>
);

// Sticky Category Chips Component (Updated Categories)

// const StickyCategoryChips = ({ categories, activeCategory, setActiveCategory }) => {
//   return (
//     <div className="sticky top-18 md:top-24 z-40 lg:hidden bg-white shadow-inner border-t border-gray-100 overflow-x-auto whitespace-nowrap py-2 transition-all duration-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex space-x-3">
//           {categories.map((cat) => (
//             <button
//               key={cat.name}
//               onClick={() => setActiveCategory(cat.name)}
//               className={`
//                 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
//                 ${activeCategory === cat.name 
//                   ? 'bg-indigo-600 text-white shadow-lg' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }
//               `}
//             >
//               {cat.icon} {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };



const WalkInRestaurantNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name); // Mock active category
  // New State for Language
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]); // Default to English
  
  const { scrollY } = useScroll();
  
  // --- Framer Motion Scroll Transformations (Unchanged) ---
  const SCROLL_THRESHOLD = 80;
  const height = useTransform(scrollY, [0, SCROLL_THRESHOLD], ['96px', '72px']);
  const logoScale = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1.2, 1]);
  const logoTextOpacity = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1, 0]);
  const ctaTextOpacity = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1, 0]);
  const taglineOpacity = useTransform(scrollY, [0, 40], [1, 0]);
  const shadow = useTransform(
    scrollY, 
    [0, SCROLL_THRESHOLD], 
    ['0 0px 0px rgba(0,0,0,0)', '0 6px 20px rgba(0,0,0,0.08)']
  );
  
  const setLanguage = (lang) => {
      setCurrentLanguage(lang);
      // In a real app, you would dispatch a change event here for internationalization (i18n)
  };

  return (
    <>
      {/* 1. Main Navbar */}
      <motion.nav
        className="sticky top-0 z-50 bg-white transition-colors duration-300 border-b border-gray-200 shadow-sm"
        style={{ height, boxShadow: shadow }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* LEFT SIDE: Logo & Table Indicator */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            {/* Restaurant Logo */}
            <Link href="/">
              <motion.div style={{ scale: logoScale }} className="flex items-center">
                <Zap size={32} className="text-indigo-600"/>
                <motion.div style={{ opacity: logoTextOpacity }} className="hidden lg:block ml-2 text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                  FastOrder
                </motion.div>
               
              </motion.div>
            </Link>

           
          </div>

          {/* CENTER: Desktop Categories & Search */}
          <div className="hidden lg:flex items-center space-x-6 h-full">
            {/* Categories (Full text on Desktop - Using updated list) */}
            <div className="hidden xl:flex space-x-4">
              {CATEGORIES.map(cat => (
                <NavLink key={cat.name} href={`/category/${cat.name.toLowerCase().replace(/\s/g, '-')}`}>
                  {cat.name}
                </NavLink>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="hidden lg:flex relative items-center">
                <Search size={18} className="absolute left-3 text-gray-400"/>
                <input 
                  type="text" 
                  placeholder="Search dishes..." 
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-full text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
            </div>
          </div>

          {/* RIGHT SIDE: CTA, Cart, Language (Dropdown Implemented) */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Order Now CTA */}
            <motion.div 
  className="bg-indigo-600 text-white rounded-full transition-colors duration-200 hover:bg-indigo-700 font-bold"
  whileTap={{ scale: 0.95 }}
>
  <Link 
    href="/checkout" 
    // FIXED: Responsive Padding & Layout on the Link
    className="flex items-center justify-center 
               h-10 
               w-10 lg:w-auto 
               p-0 lg:px-4 lg:py-2" 
    aria-label="Checkout Now"
  >
    {/* Mobile Icon (Visible only on small screens) */}
    <Home size={20} className="lg:hidden"/>
    
    {/* Desktop Text (Visible on large screens) */}
    <motion.span 
      style={{ opacity: ctaTextOpacity }} 
      className="hidden lg:inline-block whitespace-nowrap"
    >
      Checkout Now
    </motion.span>
  </Link>
</motion.div>

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={24} />
              {currentCartCount > 0 && (
                <motion.span 
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 0.5, repeat: Infinity, delay: 5, repeatDelay: 10 }}
                >
                  {currentCartCount}
                </motion.span>
              )}
            </Link>

            {/* Language Selector (Dropdown for Desktop) */}
            <motion.div 
              style={{ opacity: taglineOpacity }} 
              className="hidden xl:flex text-gray-700 cursor-pointer text-sm items-center transition-opacity"
            >
                <select 
                    value={currentLanguage.code}
                    onChange={(e) => setLanguage(LANGUAGES.find(lang => lang.code === e.target.value))}
                    className="appearance-none bg-transparent border-none text-gray-700 font-medium pr-6 focus:outline-none focus:ring-0"
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.label}
                        </option>
                    ))}
                </select>
                <ChevronDown size={16} className="-ml-5 pointer-events-none"/>
            </motion.div>
          </div>
        </div>

        {/* Categories Underline (Visual separator) */}
        <motion.div 
          style={{ height: '1px', opacity: useTransform(scrollY, [0, SCROLL_THRESHOLD], [0, 1]) }} 
          className="w-full bg-gray-200 absolute bottom-0 "
        />

      </motion.nav>

      {/* 2. Sticky Category Chips */}
      {/* <StickyCategoryChips categories={CATEGORIES} activeCategory={activeCategory} setActiveCategory={setActiveCategory} /> */}
      
      {/* 3. Mobile Off-Canvas Drawer (Passes language state and setter) */}
      <MobileDrawer 
        isOpen={isDrawerOpen} 
        toggleOpen={() => setIsDrawerOpen(!isDrawerOpen)} 
        categories={CATEGORIES}
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
      />
    </>
  );
};

export default WalkInRestaurantNavbar;