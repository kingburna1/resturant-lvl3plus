import Link from 'next/link';
import { Zap, MapPin, Phone, Mail } from 'lucide-react';

// --- Configuration Data ---
const FOOTER_LINKS = {
  Menu: [
    { name: 'Main Course', href: '/category/main-course' },
    { name: 'Starters', href: '/category/starter' },
    { name: 'Desserts & Drinks', href: '/category/dessert' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Table Reservations', href: '/reservations' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
    { name: 'Facebook', href: 'https://facebook.com/fastorder' },
    { name: 'Instagram', href: 'https://instagram.com/fastorder' },
    { name: 'Twitter', href: 'https://twitter.com/fastorder' },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          
          {/* 1. Logo and Branding */}
          <div className="space-y-4 xl:col-span-1 mb-8 xl:mb-0">
            <Link href="/" className="flex items-center text-3xl font-bold text-gray-900 tracking-wider">
              <Zap size={30} className="text-indigo-600 mr-2"/>
              Fast<span className="text-indigo-600">Order</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs">
              Your fastest way to enjoy a culinary masterpiece, perfected for walk-in convenience.
            </p>
            <div className="flex space-x-4 pt-2">
                {SOCIAL_LINKS.map((item) => (
                    <a 
                        key={item.name} 
                        href={item.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        aria-label={item.name}
                    >
                        {/* You would use an icon library (like Lucide or FontAwesome) here, but we'll use simple text/emoji for simplicity */}
                        <span className="text-xl">
                            {item.name === 'Facebook' ? '📘' : item.name === 'Instagram' ? '📸' : '🐦'}
                        </span>
                    </a>
                ))}
            </div>
          </div>
          
          {/* 2. Navigation Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2 md:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                  {title}
                </h3>
                <ul role="list" className="space-y-3">
                  {links.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-500 hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Contact Information */}
          <div className="mt-12 xl:mt-0 xl:col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul role="list" className="space-y-4 text-gray-500">
                <li className="flex items-start">
                    <MapPin size={20} className="flex-0 text-indigo-600 mr-3 mt-1"/>
                    <span>
                        123 Culinary St.<br/>
                        Food City, FC 90210
                    </span>
                </li>
                <li className="flex items-center">
                    <Phone size={20} className="flex-0 text-indigo-600 mr-3"/>
                    <a href="tel:+15551234567" className="hover:text-indigo-600 transition-colors">
                        +1 (555) 123-4567
                    </a>
                </li>
                <li className="flex items-center">
                    <Mail size={20} className="flex-0 text-indigo-600 mr-3"/>
                    <a href="mailto:support@fastorder.com" className="hover:text-indigo-600 transition-colors">
                        support@fastorder.com
                    </a>
                </li>
            </ul>
          </div>

        </div>
        
        {/* 4. Copyright and Legal */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} FastOrder Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;