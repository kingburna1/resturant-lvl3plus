"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

// NOTE: Replace 'your-background-video.mp4' with the actual path to your video file.
const VIDEO_SRC = '/videos/loops_video.mp4'; 

const HeroVideoSection = () => {
    
    // Framer Motion Variants for Staggered Text Entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    };

    return (
        <section className="relative w-full h-[85vh] overflow-hidden bg-gray-900">
            
            {/* 1. Background Video */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-70"
            >
                {/* Ensure you have an MP4 file or similar format for browser compatibility */}
                <source src={VIDEO_SRC} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* 2. Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-black opacity-40"></div>
            
            {/* 3. Hero Content (Text & CTAs) */}
            <motion.div 
                className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Main Headline */}
                <motion.h1 
                    className="text-xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-lg"
                    variants={itemVariants}
                >
                    The Culinary Experience
                </motion.h1>

                {/* Sub-Headline / Tagline */}
                <motion.p 
                    className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-md"
                    variants={itemVariants}
                >
                    Walk in, order fast, and indulge in a masterpiece crafted just for you.
                </motion.p>

                {/* Call-to-Action Buttons */}
               <motion.div 
    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto" // Added w-full for stacking on mobile
    variants={itemVariants}
>
    {/* Primary CTA: Responsive Sizing */}
    <Link 
        href="/menu"
        className="
            /* Mobile (Default) */
            w-full sm:w-auto text-center 
            px-4 py-3 text-base font-bold rounded-full 
            
            /* Tablet/Desktop Scaling */
            sm:px-6 sm:py-2 sm:text-lg 
            
            /* Colors & Effects (Unchanged) */
            text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-xl border-2 border-indigo-600
        "
    >
        ORDER YOUR MASTERPIECE
    </Link>
    
    {/* Secondary CTA: Responsive Sizing */}
    <Link 
        href="/categories"
        className="
            /* Mobile (Default) */
            w-full sm:w-auto text-center
            px-4 py-3 text-base font-bold rounded-full 
            
            /* Tablet/Desktop Scaling */
            sm:px-6 sm:py-2 sm:text-lg 
            
            /* Colors & Effects (Unchanged) */
            text-white border-2 border-white hover:bg-white hover:text-gray-900 transition duration-300
        "
    >
        EXPLORE ALL CATEGORIES
    </Link>
</motion.div>

            </motion.div>
        </section>
    );
};

export default HeroVideoSection;