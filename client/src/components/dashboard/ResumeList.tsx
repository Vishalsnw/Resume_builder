// client/src/components/resume/ResumeList.tsx

import React, { forwardRef, useState } from 'react';
import {
  FiFile,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiShare2,
  FiStar,
  FiClock,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiMoreVertical,
  FiPlus
} from 'react-icons/fi';

interface Resume {
  id: string;
  title: string;
  lastModified: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  starred?: boolean;
  tags?: string[];
  downloadUrl?: string;
  previewUrl?: string;
}

interface ResumeListProps {
  resumes: Resume[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onStar?: (id: string) => void;
  onCreateNew?: () => void;
  viewMode?: 'list' | 'grid';
  loading?: boolean;
  className?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const ResumeList = forwardRef<HTMLDivElement, ResumeListProps>(({
  resumes,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onStar,
  onCreateNew,
  viewMode = 'list',
  loading = false,
  className = '',
  currentDateTime = '2025-06-07 19:29:18',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [selectedView, setSelectedView] = useState(viewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date'>('date');
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter(resume => {
      const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || resume.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    });

  const handleResumeSelect = (id: string) => {
    setSelectedResumes(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderListView = () => (
    <div className="divide-y divide-gray-200">
      {filteredResumes.map(resume => (
        <div
          key={resume.id}
          className={`
            flex items-center py-4 px-6 hover:bg-gray-50
            ${selectedResumes.includes(resume.id) ? 'bg-blue-50' : ''}
          `}
        >
          <input
            type="checkbox"
            checked={selectedResumes.includes(resume.id)}
            onChange={() => handleResumeSelect(resume.id)}
            className="mr-4"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <FiFile className="mr-2 text-gray-400" />
              <h3 className="font-medium text-gray-900">{resume.title}</h3>
              {resume.starred && (
                <FiStar className="ml-2 text-yellow-400" />
              )}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FiClock className="mr-1" />
              <span>Modified {formatDate(resume.lastModified)}</span>
              <span className="mx-2">•</span>
              <span className={`
                px-2 py-1 rounded-full text-xs
                ${resume.status === 'published' ? 'bg-green-100 text-green-800' :
                  resume.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'}
              `}>
                {resume.status}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit?.(resume.id)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Edit"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => onDownload?.(resume.id)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Download"
            >
              <FiDownload />
            </button>
            <button
              onClick={() => onShare?.(resume.id)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Share"
            >
              <FiShare2 />
            </button>
            <button
              onClick={() => onDelete?.(resume.id)}
              className="p-2 hover:bg-red-100 text-red-600 rounded"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResumes.map(resume => (
        <div
          key={resume.id}
          className={`
            relative rounded-lg border hover:shadow-md
            ${selectedResumes.includes(resume.id) ? 'border-blue-500' : 'border-gray-200'}
          `}
        >
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => onStar?.(resume.id)}
              className={`p-1 rounded hover:bg-gray-100 ${resume.starred ? 'text-yellow-400' : 'text-gray-400'}`}
            >
              <FiStar />
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <FiMoreVertical />
            </button>
          </div>
          
          <div className="p-4">
            <div className="aspect-w-8 aspect-h-11 bg-gray-100 rounded mb-4">
              {resume.thumbnail ? (
                <img
                  src={resume.thumbnail}
                  alt={resume.title}
                  className="object-cover rounded"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <FiFile className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 truncate">{resume.title}</h3>
            <div className="mt-1 text-sm text-gray-500">
              Modified {formatDate(resume.lastModified)}
            </div>
            <div className="mt-2">
              {resume.tags?.map(tag => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 mr-1 mb-1 text-xs bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
          <button
            onClick={onCreateNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Create New
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 border rounded-lg">
          <button
            onClick={() => setSelectedView('list')}
            className={`p-2 ${selectedView === 'list' ? 'bg-gray-100' : ''}`}
          >
            <FiList />
          </button>
          <button
            onClick={() => setSelectedView('grid')}
            className={`p-2 ${selectedView === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center py-12">
          <FiFile className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new resume.
          </p>
          <div className="mt-6">
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiPlus className="mr-2" />
              Create New Resume
            </button>
          </div>
        </div>
      ) : (
        selectedView === 'list' ? renderListView() : renderGridView()
      )}

      {/* Metadata */}
      <div className="mt-4 text-xs text-gray-500">
        Last modified by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

ResumeList.displayName = 'ResumeList';

export default ResumeList;
