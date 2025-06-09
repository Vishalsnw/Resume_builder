// pages/help/faq.tsx

import 500 from '@/pages/500';
import faq from '@/pages/help/faq';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import React, { useState, useCallback } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiTag, FiSearch } from 'react-icons/fi';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { prisma } from '@/lib/prisma';

interface FAQProps {
  categories: Category[];
  faqs: FAQ[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  votes: number;
  lastUpdated: string;
}

export default function FAQPage({ categories, faqs: initialFaqs }: FAQProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setExpandedFAQ(null);
  }, []);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVote = async (faqId: string, helpful: boolean) => {
    try {
      const response = await fetch('/api/help/faq/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faqId, helpful }),
      });

      if (response.ok) {
        const updatedFAQ = await response.json();
        setFaqs(current => 
          current.map(faq => 
            faq.id === faqId ? { ...faq, votes: updatedFAQ.votes } : faq
          )
        );
      }
    } catch (error) {
      console.error('Error voting on FAQ:', error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>FAQ - Resume Builder</title>
        <meta name="description" content="Frequently asked questions about using our Resume Builder platform" />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find answers to common questions about our Resume Builder
          </p>
          <SearchBar
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search FAQs..."
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Questions
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.slug 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform
                      ${expandedFAQ === faq.id ? 'transform rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4">
                        <div className="prose prose-blue max-w-none">
                          {faq.answer}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleVote(faq.id, true)}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              Was this helpful?
                            </button>
                            <span className="text-gray-500">
                              {faq.votes} people found this helpful
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <FiTag className="w-4 h-4 mr-2" />
                            {faq.category}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No FAQs found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {/* Last updated timestamp */}
        <div className="text-center text-sm text-gray-500 mt-12">
          Last updated by Vishalsnw at 2025-06-07 21:10:34
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch FAQ categories with counts
  const categories = await prisma.faqCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          faqs: true,
        },
      },
    },
  });

  // Fetch all FAQs
  const faqs = await prisma.faq.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      question: true,
      answer: true,
      votes: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        votes: 'desc',
      },
      {
        updatedAt: 'desc',
      },
    ],
  });

  return {
    props: {
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category._count.faqs,
      })),
      faqs: faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category.name,
        votes: faq.votes,
        lastUpdated: faq.updatedAt.toISOString(),
      })),
    },
    revalidate: 3600, // Revalidate every hour
  };
};
