// pages/dashboard.tsx

import dashboard from '@/pages/dashboard';
import edit from '@/pages/profile/edit';
import create from '@/pages/resumes/create';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import Dashboard from '@/components/dashboard/Dashboard';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FiPlus, 
  FiFileText, 
  FiDownload, 
  FiEdit, 
  FiTrash2, 
  FiClock,
  FiGrid,
  FiList,
  FiChevronRight,
  FiActivity,
  FiStar,
  FiEye
} from 'react-icons/fi';

interface Resume {
  id: string;
  title: string;
  lastModified: string;
  status: 'draft' | 'completed';
  template: string;
  views: number;
  downloads: number;
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalDownloads: 0,
    totalViews: 0,
  });

  // Fetch user's resumes and stats
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated') {
        try {
          const [resumesRes, statsRes] = await Promise.all([
            fetch('/api/resumes'),
            fetch('/api/stats'),
          ]);

          if (resumesRes.ok && statsRes.ok) {
            const [resumesData, statsData] = await Promise.all([
              resumesRes.json(),
              statsRes.json(),
            ]);

            setResumes(resumesData);
            setStats(statsData);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [status]);

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleDeleteResume = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const response = await fetch(`/api/resumes/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setResumes(resumes.filter(resume => resume.id !== id));
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiFileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Resumes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalResumes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiDownload className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Downloads
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalDownloads}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiEye className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Views
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalViews}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Your Resumes</h2>
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
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

            {/* Create New Resume Button */}
            <Link
              href="/resumes/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Create Resume
            </Link>
          </div>
        </div>

        {/* Resumes Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new resume.
            </p>
            <div className="mt-6">
              <Link
                href="/resumes/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="h-4 w-4 mr-2" />
                Create Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }`}>
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`bg-white shadow rounded-lg overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center' : ''
                }`}
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {resume.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      resume.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {resume.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiClock className="h-4 w-4 mr-1" />
                    Last modified {new Date(resume.lastModified).toLocaleDateString()}
                  </div>

                  {viewMode === 'grid' && (
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiEye className="h-4 w-4 mr-1" />
                        {resume.views} views
                      </div>
                      <div className="flex items-center">
                        <FiDownload className="h-4 w-4 mr-1" />
                        {resume.downloads} downloads
                      </div>
                    </div>
                  )}

                  <div className={`${
                    viewMode === 'grid' ? 'mt-4' : 'ml-4'
                  } flex items-center space-x-2`}>
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
                      <FiEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      <FiTrash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {/* Activity items would go here */}
            </ul>
          </div>
        </div>
      </main>

      {/* Last updated info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-xs text-gray-500">
          Last updated by Vishalsnw at 2025-06-07 20:04:45
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
