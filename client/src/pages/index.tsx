// pages/index.tsx

import index from '@/pages/help/index';
import login from '@/pages/api/auth/login';
import contact from '@/pages/help/contact';
import create from '@/pages/resumes/create';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
import 500 from '@/pages/500';
import faq from '@/pages/help/faq';
import Footer from '@/components/layout/Footer';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiFileText, 
  FiEdit, 
  FiDownload, 
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Features section data
  const features = [
    {
      icon: <FiFileText className="w-6 h-6 text-blue-500" />,
      title: 'Professional Templates',
      description: 'Choose from a variety of professionally designed templates.',
    },
    {
      icon: <FiEdit className="w-6 h-6 text-green-500" />,
      title: 'Easy to Customize',
      description: 'Customize your resume with an intuitive editor.',
    },
    {
      icon: <FiDownload className="w-6 h-6 text-purple-500" />,
      title: 'Export Options',
      description: 'Download your resume in PDF, Word, or other formats.',
    },
  ];

  // Benefits list
  const benefits = [
    'ATS-friendly templates',
    'Real-time preview',
    'Multiple format support',
    'Cloud storage',
    'Version history',
    'Privacy focused',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Create Professional Resumes in Minutes
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Stand out from the crowd with a professionally designed resume. 
                Easy to create, customize, and download.
              </p>
              <div className="space-x-4">
                {!session ? (
                  <>
                    <Link 
                      href="/register" 
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Get Started <FiArrowRight className="ml-2" />
                    </Link>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <Link 
                    href="/resumes/create" 
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Create Resume <FiArrowRight className="ml-2" />
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              {/* Add hero image or resume preview */}
              <div className="bg-white p-4 rounded-lg shadow-xl">
                {/* Placeholder for resume preview */}
                <div className="aspect-w-8 aspect-h-11 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Resume Builder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Everything You Need for a Perfect Resume
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              {/* Add statistics or testimonial */}
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Resumes Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of job seekers who have successfully created their resumes
          </p>
          {!session ? (
            <Link 
              href="/register" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Get Started Now <FiArrowRight className="ml-2" />
            </Link>
          ) : (
            <Link 
              href="/resumes/create" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Create Your Resume <FiArrowRight className="ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Resume Builder</h3>
              <p className="text-gray-600 text-sm">
                Create professional resumes easily and quickly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/templates">Templates</Link></li>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/help/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/help/contact">Support</Link></li>
                <li>contact@resumebuilder.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Resume Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
