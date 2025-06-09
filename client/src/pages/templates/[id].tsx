// pages/templates/[id].tsx

import index from '@/pages/help/index';
import create from '@/pages/resumes/create';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import Tabs from '@/components/common/ui/Tabs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiStar, 
  FiShare2,
  FiEye,
  FiGrid,
  FiHeart,
  FiTag,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi';

interface Template {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  previewImages: string[];
  category: 'professional' | 'creative' | 'simple' | 'modern' | 'academic';
  tags: string[];
  features: string[];
  suitableFor: string[];
  popularity: number;
  downloads: number;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  price?: number;
  lastUpdated: string;
  creator: {
    name: string;
    avatar: string;
    templates: number;
  };
  reviews: Array<{
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    rating: number;
    comment: string;
    date: string;
  }>;
}

const TemplateDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews'>('overview');

  useEffect(() => {
    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

  const fetchTemplateDetails = async () => {
    try {
      const response = await fetch(`/api/templates/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
        // Check if template is in user's favorites
        if (session) {
          const favResponse = await fetch(`/api/users/favorites/templates/${id}`);
          setIsFavorite(favResponse.ok);
        }
      } else {
        throw new Error('Failed to fetch template details');
      }
    } catch (error) {
      toast.error('Failed to load template details');
      router.push('/templates');
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    if (!session) {
      toast.info('Please sign in to use this template');
      router.push('/login');
      return;
    }

    if (template?.isPremium && !session.user?.isPremium) {
      toast.info('This is a premium template. Please upgrade to use it.');
      router.push('/pricing');
      return;
    }

    router.push(`/resumes/create?template=${id}`);
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      toast.info('Please sign in to save favorites');
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/users/favorites/templates/${id}`, {
        method,
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      } else {
        throw new Error('Failed to update favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Template link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Template not found</h2>
          <p className="mt-2 text-gray-600">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/templates"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {template.name}
              {template.isPremium && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Premium
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full ${
                isFavorite ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
              }`}
            >
              <FiHeart className="h-6 w-6" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600"
            >
              <FiShare2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Section */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src={template.previewImages[selectedPreview]}
              alt={`${template.name} preview`}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {template.previewImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedPreview(index)}
                className={`relative rounded-lg overflow-hidden ${
                  selectedPreview === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img src={image} alt={`Preview ${index + 1}`} className="w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(['overview', 'features', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">About this template</h3>
                  <p className="mt-2 text-gray-500">{template.longDescription}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Best suited for</h3>
                  <ul className="mt-2 space-y-2">
                    {template.suitableFor.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-500">
                        <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {template.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start">
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">
                          {review.user.name}
                        </h4>
                        <div className="mt-1 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-gray-500">{review.comment}</p>
                        <p className="mt-2 text-sm text-gray-400">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleUseTemplate}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Use this template
              {template.isPremium && (
                <span className="ml-2">({template.price} Credits)</span>
              )}
            </button>
            {template.isPremium && !session?.user?.isPremium && (
              <p className="text-sm text-gray-500 text-center">
                This is a premium template. 
                <Link href="/pricing" className="text-blue-600 hover:text-blue-500 ml-1">
                  Upgrade to use
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Last updated info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:40:30
      </div>
    </div>
  );
};

export default TemplateDetailPage;
