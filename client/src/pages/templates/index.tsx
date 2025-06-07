// pages/templates/index.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList,
  FiEye,
  FiStar,
  FiDownload,
  FiTag,
  FiChevronDown
} from 'react-icons/fi';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'professional' | 'creative' | 'simple' | 'modern' | 'academic';
  tags: string[];
  popularity: number;
  downloads: number;
  rating: number;
  isPremium: boolean;
  previewUrl: string;
  lastUpdated: string;
}

const TemplatesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'downloads' | 'rating' | 'newest'>('popularity');
  const [filters, setFilters] = useState({
    isPremium: false,
    hasAts: false,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'simple', name: 'Simple' },
    { id: 'modern', name: 'Modern' },
    { id: 'academic', name: 'Academic' },
  ];

  const filteredTemplates = templates
    .filter(template => {
      if (selectedCategory !== 'all' && template.category !== selectedCategory) return false;
      if (filters.isPremium && !template.isPremium) return false;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return b.popularity - a.popularity;
      }
    });

  const handlePreview = (templateId: string) => {
    router.push(`/templates/${templateId}/preview`);
  };

  const handleUseTemplate = (templateId: string) => {
    if (!session) {
      toast.info('Please sign in to use this template');
      router.push('/login');
      return;
    }

    router.push(`/resumes/create?template=${templateId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resume Templates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose from our collection of professional resume templates
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="popularity">Most Popular</option>
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FiGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FiList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
        : 'space-y-4'
      }>
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white shadow rounded-lg overflow-hidden ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Template Thumbnail */}
            <div className={viewMode === 'list' ? 'w-48' : ''}>
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Template Details */}
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {template.name}
                  {template.isPremium && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  )}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {template.rating.toFixed(1)}
                  </span>
                  <FiStar className="h-4 w-4 text-yellow-400" />
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {template.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePreview(template.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiEye className="h-4 w-4 mr-1.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Use Template
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {template.downloads.toLocaleString()} downloads
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No templates found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Last updated info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:37:39
      </div>
    </div>
  );
};

export default TemplatesPage;
