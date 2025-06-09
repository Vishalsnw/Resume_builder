// pages/resumes/index.tsx

import Card from '@/components/common/ui/Card';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiGrid, 
  FiList, 
  FiFilter, 
  FiDownload, 
  FiEdit2,
  FiEye,
  FiTrash2,
  FiClock,
  FiStar,
  FiShare2,
  FiMoreVertical,
  FiChevronDown
} from 'react-icons/fi';

interface Resume {
  id: string;
  title: string;
  template: string;
  lastModified: string;
  status: 'draft' | 'completed';
  isStarred: boolean;
  views: number;
  downloads: number;
  shareLink?: string;
  thumbnail: string;
  tags: string[];
}

const ResumesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'lastModified' | 'title' | 'views' | 'downloads'>('lastModified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchResumes();
    }
  }, [status, router]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      } else {
        throw new Error('Failed to fetch resumes');
      }
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const response = await fetch(`/api/resumes/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setResumes(current => current.filter(resume => resume.id !== id));
          toast.success('Resume deleted successfully');
        } else {
          throw new Error('Failed to delete resume');
        }
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleToggleStar = async (id: string) => {
    try {
      const resume = resumes.find(r => r.id === id);
      if (!resume) return;

      const response = await fetch(`/api/resumes/${id}/star`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStarred: !resume.isStarred }),
      });

      if (response.ok) {
        setResumes(current =>
          current.map(r =>
            r.id === id ? { ...r, isStarred: !r.isStarred } : r
          )
        );
      } else {
        throw new Error('Failed to update star status');
      }
    } catch (error) {
      toast.error('Failed to update star status');
    }
  };

  const handleShare = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}/share`, {
        method: 'POST',
      });

      if (response.ok) {
        const { shareLink } = await response.json();
        await navigator.clipboard.writeText(shareLink);
        toast.success('Share link copied to clipboard');
      } else {
        throw new Error('Failed to generate share link');
      }
    } catch (error) {
      toast.error('Failed to share resume');
    }
  };

  const filteredAndSortedResumes = resumes
    .filter(resume => {
      if (filterStatus !== 'all' && resume.status !== filterStatus) return false;
      if (searchQuery) {
        return resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               resume.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    })
    .sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'lastModified') {
        return modifier * (new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      }
      if (sortBy === 'title') {
        return modifier * a.title.localeCompare(b.title);
      }
      return modifier * ((b[sortBy] || 0) - (a[sortBy] || 0));
    });

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your resumes
          </p>
        </div>
        <Link
          href="/resumes/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Create Resume
        </Link>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="lastModified">Last Modified</option>
              <option value="title">Title</option>
              <option value="views">Views</option>
              <option value="downloads">Downloads</option>
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
      </div>

      {/* Resumes Grid/List */}
      {filteredAndSortedResumes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiFile className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new resume
          </p>
          <div className="mt-6">
            <Link
              href="/resumes/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Create Resume
            </Link>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
        }>
          {filteredAndSortedResumes.map((resume) => (
            <div
              key={resume.id}
              className={`bg-white shadow rounded-lg overflow-hidden ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
            >
              {/* Resume Card Content */}
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {resume.title}
                  </h3>
                  <button
                    onClick={() => handleToggleStar(resume.id)}
                    className={`p-1 rounded-full ${
                      resume.isStarred ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                  >
                    <FiStar className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FiClock className="h-4 w-4 mr-1" />
                  Last modified {new Date(resume.lastModified).toLocaleDateString()}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link
                      href={`/resumes/${resume.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <FiEye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/resumes/edit/${resume.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <FiEdit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      <FiTrash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleShare(resume.id)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <FiShare2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Last updated info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:26:07
      </div>
    </div>
  );
};

export default ResumesPage;
