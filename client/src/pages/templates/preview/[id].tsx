// pages/templates/preview/[id].tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiDownload,
  FiShare2,
  FiPrinter,
  FiArrowLeft,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';

interface TemplatePreview {
  id: string;
  name: string;
  previewImages: string[];
  pages: number;
  isPremium: boolean;
  watermarked: boolean;
}

const PreviewPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [template, setTemplate] = useState<TemplatePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (id) {
      fetchTemplatePreview();
    }
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const fetchTemplatePreview = async () => {
    try {
      const response = await fetch(`/api/templates/${id}/preview`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      } else {
        throw new Error('Failed to fetch template preview');
      }
    } catch (error) {
      toast.error('Failed to load preview');
      router.push('/templates');
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(current => {
      const newZoom = direction === 'in' ? current + 25 : current - 25;
      return Math.max(25, Math.min(200, newZoom));
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Preview link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'tablet':
        return 'max-w-[768px]';
      case 'mobile':
        return 'max-w-[375px]';
      default:
        return 'max-w-full';
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
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl font-bold text-gray-900">Preview not available</h2>
        <p className="mt-2 text-gray-600">
          The template preview you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/templates"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/templates/${id}`}
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </Link>
            <h1 className="text-lg font-medium text-gray-900">{template.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Controls */}
            <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md ${
                  viewMode === 'desktop' ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <FiMonitor className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded-md ${
                  viewMode === 'tablet' ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <FiTablet className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md ${
                  viewMode === 'mobile' ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <FiSmartphone className="h-5 w-5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleZoom('out')}
                disabled={zoomLevel <= 25}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <FiZoomOut className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">{zoomLevel}%</span>
              <button
                onClick={() => handleZoom('in')}
                disabled={zoomLevel >= 200}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <FiZoomIn className="h-5 w-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <FiPrinter className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                {isFullscreen ? (
                  <FiMinimize2 className="h-5 w-5" />
                ) : (
                  <FiMaximize2 className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="pt-16 pb-8 px-4">
        <div className={`mx-auto ${getViewportClass()} transition-all duration-300`}>
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <img
              src={template.previewImages[currentPage]}
              alt={`${template.name} preview page ${currentPage + 1}`}
              className="w-full"
            />
          </div>

          {/* Page Navigation */}
          {template.pages > 1 && (
            <div className="flex items-center justify-center mt-4 space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FiChevronsLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {template.pages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(template.pages - 1, prev + 1))}
                disabled={currentPage === template.pages - 1}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FiChevronsRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Last updated info */}
      <div className="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:43:21
      </div>
    </div>
  );
};

export default PreviewPage;
