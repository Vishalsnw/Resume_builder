// pages/help/index.tsx

import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  FiSearch, 
  FiBook, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiHelpCircle,
  FiChevronRight,
  FiStar,
  FiClock
} from 'react-icons/fi';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/help/CategoryCard';
import { ArticleCard } from '@/components/help/ArticleCard';
import { ContactSupport } from '@/components/help/ContactSupport';
import { prisma } from '@/lib/prisma';

interface HelpCenterProps {
  categories: Category[];
  popularArticles: Article[];
  recentArticles: Article[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  views: number;
  lastUpdated: string;
}

export default function HelpCenter({ 
  categories, 
  popularArticles, 
  recentArticles 
}: HelpCenterProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchArticles = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/help/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.articles);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchArticles, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <Layout>
      <Head>
        <title>Help Center - Resume Builder</title>
        <meta name="description" content="Get help and support for using our Resume Builder platform" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Search our help center or browse the categories below
          </p>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles..."
            isLoading={isSearching}
          />
        </div>

        {/* Search Results */}
        {searchQuery.length >= 2 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Search Results
            </h2>
            {isSearching ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Browse Help Categories
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Popular Articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showViews
                icon={<FiStar className="text-yellow-400" />}
              />
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Recent Updates
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showDate
                icon={<FiClock className="text-blue-500" />}
              />
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <ContactSupport session={session} />
      </div>

      {/* Last updated timestamp */}
      <div className="text-center text-sm text-gray-500 mt-8 pb-8">
        Last updated by Vishalsnw at 2025-06-07 21:08:43
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch categories
  const categories = await prisma.helpCategory.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });

  // Fetch popular articles
  const popularArticles = await prisma.helpArticle.findMany({
    where: {
      published: true,
    },
    orderBy: {
      views: 'desc',
    },
    take: 6,
    select: {
      id: true,
      title: true,
      excerpt: true,
      category: {
        select: {
          name: true,
        },
      },
      slug: true,
      views: true,
      updatedAt: true,
    },
  });

  // Fetch recent articles
  const recentArticles = await prisma.helpArticle.findMany({
    where: {
      published: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 6,
    select: {
      id: true,
      title: true,
      excerpt: true,
      category: {
        select: {
          name: true,
        },
      },
      slug: true,
      views: true,
      updatedAt: true,
    },
  });

  return {
    props: {
      categories: categories.map(cat => ({
        ...cat,
        articleCount: cat._count.articles,
      })),
      popularArticles: popularArticles.map(article => ({
        ...article,
        category: article.category.name,
        lastUpdated: article.updatedAt.toISOString(),
      })),
      recentArticles: recentArticles.map(article => ({
        ...article,
        category: article.category.name,
        lastUpdated: article.updatedAt.toISOString(),
      })),
    },
    revalidate: 3600, // Revalidate every hour
  };
};
