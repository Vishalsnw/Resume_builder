// client/src/components/common/activity/ActivityLog.tsx

import dashboard from '@/pages/dashboard';
import upload from '@/pages/api/upload';
import create from '@/pages/resumes/create';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
// REMOVED INVALID IMPORT
import ActivityLog from '@/components/dashboard/ActivityLog';
import React, { forwardRef, useState } from 'react';
import {
  FiActivity,
  FiGitCommit,
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiUpload,
  FiDownload,
  FiShare2,
  FiCalendar,
  FiFilter,
  FiSearch,
  FiMoreHorizontal,
  FiClock,
  FiChevronDown,
  FiCheck,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'upload' | 'download' | 'share' | 'login' | 'logout' | 'other';
  action: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  details?: string;
  metadata?: Record<string, any>;
  relatedItem?: {
    id: string;
    type: string;
    name: string;
    url?: string;
  };
  status?: 'success' | 'error' | 'pending';
}

interface ActivityLogProps {
  activities: ActivityItem[];
  loading?: boolean;
  onFilterChange?: (filters: Record<string, any>) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  groupByDate?: boolean;
  showFilters?: boolean;
  maxHeight?: number;
  className?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const ActivityLog = forwardRef<HTMLDivElement, ActivityLogProps>(({
  activities,
  loading = false,
  onFilterChange,
  onLoadMore,
  hasMore = false,
  groupByDate = true,
  showFilters = true,
  maxHeight,
  className = '',
  currentDateTime = '2025-06-07 19:35:19',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: '7days',
    user: 'all',
    status: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Activity type icons
  const typeIcons = {
    create: <FiGitCommit className="text-green-500" />,
    update: <FiEdit className="text-blue-500" />,
    delete: <FiTrash2 className="text-red-500" />,
    upload: <FiUpload className="text-purple-500" />,
    download: <FiDownload className="text-indigo-500" />,
    share: <FiShare2 className="text-yellow-500" />,
    login: <FiUserPlus className="text-teal-500" />,
    logout: <FiUserPlus className="text-gray-500" />,
    other: <FiActivity className="text-gray-500" />,
  };

  // Status styles
  const statusStyles = {
    success: 'text-green-600 bg-green-50',
    error: 'text-red-600 bg-red-50',
    pending: 'text-yellow-600 bg-yellow-50',
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupActivitiesByDate = (activities: ActivityItem[]) => {
    const groups: Record<string, ActivityItem[]> = {};
    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  };

  const renderFilters = () => (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Type Filter */}
      <select
        value={filters.type}
        onChange={(e) => handleFilterChange('type', e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="all">All Types</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
        <option value="upload">Upload</option>
        <option value="download">Download</option>
        <option value="share">Share</option>
      </select>

      {/* Date Range Filter */}
      <select
        value={filters.dateRange}
        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="all">All Time</option>
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="all">All Status</option>
        <option value="success">Success</option>
        <option value="error">Error</option>
        <option value="pending">Pending</option>
      </select>

      {/* Reset Filters */}
      <button
        onClick={() => {
          setFilters({
            type: 'all',
            dateRange: '7days',
            user: 'all',
            status: 'all',
          });
          setSearchQuery('');
        }}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        <FiRefreshCw className="w-5 h-5" />
      </button>
    </div>
  );

  const renderActivityItem = (activity: ActivityItem) => (
    <div
      key={activity.id}
      className={`
        relative flex items-start space-x-4 p-4
        ${activity.status ? `border-l-4 border-${activity.status === 'success' ? 'green' : activity.status === 'error' ? 'red' : 'yellow'}-500` : ''}
        hover:bg-gray-50
      `}
    >
      {/* Activity Icon */}
      <div className="flex-shrink-0 mt-1">
        {typeIcons[activity.type]}
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">
            {activity.user.name}
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(activity.timestamp)}
          </div>
        </div>

        <div className="mt-1">
          <div className="text-sm text-gray-600">
            {activity.action}
            {activity.relatedItem && (
              <span className="ml-1">
                on <a href={activity.relatedItem.url} className="text-blue-600 hover:underline">
                  {activity.relatedItem.name}
                </a>
              </span>
            )}
          </div>
        </div>

        {activity.status && (
          <span className={`
            inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium
            ${statusStyles[activity.status]}
          `}>
            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
          </span>
        )}

        {/* Expandable Details */}
        {activity.details && (
          <div className="mt-2">
            <button
              onClick={() => toggleItemExpansion(activity.id)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <FiChevronDown
                className={`w-4 h-4 mr-1 transform transition-transform ${
                  expandedItems.includes(activity.id) ? 'rotate-180' : ''
                }`}
              />
              Details
            </button>
            {expandedItems.includes(activity.id) && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {activity.details}
                {activity.metadata && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(activity.metadata, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const groupedActivities = groupByDate ? groupActivitiesByDate(activities) : { all: activities };

  return (
    <div ref={ref} className={className}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track all activities and changes in your system
        </p>
      </div>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Activity List */}
      <div
        className={`
          border rounded-lg bg-white overflow-hidden
          ${maxHeight ? `max-h-[${maxHeight}px] overflow-y-auto` : ''}
        `}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiActivity className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No activities found</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedActivities).map(([date, activities]) => (
              <div key={date}>
                {groupByDate && (
                  <div className="sticky top-0 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500">
                    {formatDate(date)}
                  </div>
                )}
                <div className="divide-y divide-gray-200">
                  {activities.map(renderActivityItem)}
                </div>
              </div>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="p-4 text-center">
                <button
                  onClick={onLoadMore}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-4 text-xs text-gray-500">
        Last updated by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

ActivityLog.displayName = 'ActivityLog';

export default ActivityLog;
