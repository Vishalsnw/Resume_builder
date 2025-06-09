// client/src/components/layout/Footer.tsx

import App from '@/App';
import contact from '@/pages/help/contact';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import settings from '@/pages/profile/settings';
// REMOVED INVALID IMPORT
import faq from '@/pages/help/faq';
import Footer from '@/components/layout/Footer';
import Settings from '@/components/settings/Settings';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  currentUser: string;
}

const Footer: React.FC<FooterProps> = ({ currentUser }) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  // Update current date time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toISOString()
        .replace('T', ' ')
        .substring(0, 19);
      setCurrentDateTime(formatted);
    };

    updateDateTime(); // Initial call
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mobile app specific links
  const mobileAppLinks = [
    { name: 'Rate App', href: 'market://details?id=com.airesume.builder' },
    { name: 'Share App', href: '#' },
    { name: 'Offline Mode', href: '/offline-access' },
    { name: 'App Settings', href: '/app-settings' },
  ];

  const footerLinks = {
    features: [
      { name: 'Resume Builder', href: '/resume/builder' },
      { name: 'AI Assistant', href: '/resume/ai' },
      { name: 'Templates', href: '/resume/templates' },
      { name: 'Cover Letters', href: '/cover-letters' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Tutorial', href: '/tutorial' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Use', href: '/terms' },
      { name: 'Data Policy', href: '/data-policy' },
      { name: 'Licenses', href: '/licenses' },
    ],
  };

  // Handle share app functionality
  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Resume Builder',
          text: 'Create professional resumes with AI assistance!',
          url: 'https://play.google.com/store/apps/details?id=com.airesume.builder'
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 pb-safe-area">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          {/* App Info */}
          <div className="text-center mb-6">
            <img
              src="/logo.svg"
              alt="AI Resume Builder"
              className="h-8 mx-auto mb-2"
            />
            <p className="text-sm text-gray-500">
              Version 1.0.0
            </p>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="text-center">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile App Specific Actions */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleShareApp}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Share App
            </button>
            <a
              href="market://details?id=com.airesume.builder"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
            >
              Rate Us
            </a>
          </div>

          {/* User Info & DateTime */}
          <div className="text-center text-xs text-gray-400 space-y-1">
            <p>Logged in as: {currentUser}</p>
            <p>Last Updated: {currentDateTime} UTC</p>
          </div>
        </div>

        {/* Copyright - Safe Area Aware */}
        <div className="border-t border-gray-200 py-4">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
