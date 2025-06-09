// src/components/dashboard/Dashboard.tsx

import Dashboard from '@/components/dashboard/Dashboard';
import Select from '@/components/common/forms/Select';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineDocumentAdd, 
  HiOutlineDocumentDuplicate,
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineViewGrid,
  HiOutlineCog
} from 'react-icons/hi';

// Sample data for resumes
const sampleResumes = [
  { id: '1', name: 'Software Engineer Resume', lastModified: '2023-05-15', template: 'Professional' },
  { id: '2', name: 'Product Manager Resume', lastModified: '2023-06-01', template: 'Modern' },
  { id: '3', name: 'UX Designer Resume', lastModified: '2023-06-08', template: 'Creative' },
];

const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState(sampleResumes);
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const handleDelete = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };
  
  const toggleSelection = (id: string) => {
    if (selectedResumes.includes(id)) {
      setSelectedResumes(selectedResumes.filter(resumeId => resumeId !== id));
    } else {
      setSelectedResumes([...selectedResumes, id]);
    }
  };
  
  const selectAll = () => {
    if (selectedResumes.length === resumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(resumes.map(resume => resume.id));
    }
  };
  
  const deleteSelected = () => {
    setResumes(resumes.filter(resume => !selectedResumes.includes(resume.id)));
    setSelectedResumes([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Resume Builder</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <HiOutlineCog className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <HiOutlineUser className="h-5 w-5 text-blue-500" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and create your professional resumes
            </p>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-3">
              <Link
                to="/resume/create"
                className="btn-primary"
              >
                <HiOutlineDocumentAdd className="-ml-1 mr-2 h-5 w-5" />
                Create New Resume
              </Link>
              
              {selectedResumes.length > 0 && (
                <>
                  <button className="btn-secondary">
                    <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
                    Download
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={deleteSelected}
                  >
                    <HiOutlineTrash className="-ml-1 mr-2 h-5 w-5" />
                    Delete
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="select-all"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedResumes.length === resumes.length && resumes.length > 0}
                  onChange={selectAll}
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                  Select All
                </label>
              </div>
              
              <div className="flex border rounded-md p-1 bg-gray-100">
                <button
                  className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow' : ''}`}
                  onClick={() => setView('grid')}
                >
                  <HiOutlineViewGrid className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow' : ''}`}
                  onClick={() => setView('list')}
                >
                  <HiOutlineDocumentDuplicate className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Resumes Grid/List */}
          {resumes.length > 0 ? (
            view === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume) => (
                  <div key={resume.id} className="card hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      <div className="h-40 bg-gray-100 flex items-center justify-center border-b">
                        <div className="text-gray-400 text-center p-4">
                          <HiOutlineDocumentDuplicate className="mx-auto h-12 w-12" />
                          <span className="block mt-2">{resume.template} Template</span>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedResumes.includes(resume.id)}
                          onChange={() => toggleSelection(resume.id)}
                        />
                      </div>
                    </div>
                    <div className="px-4 py-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{resume.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Last modified: {resume.lastModified}</p>
                      <div className="mt-4 flex space-x-3">
                        <Link to={`/resume/edit/${resume.id}`} className="btn-secondary flex-1 py-1.5">
                          <HiOutlinePencil className="-ml-1 mr-1 h-4 w-4" />
                          Edit
                        </Link>
                        <button 
                          className="btn-danger flex-1 py-1.5"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <HiOutlineTrash className="-ml-1 mr-1 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <li key={resume.id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={selectedResumes.includes(resume.id)}
                              onChange={() => toggleSelection(resume.id)}
                            />
                          </div>
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-blue-600 truncate">{resume.name}</p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate">{resume.template} Template</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0 flex space-x-2">
                          <p className="text-sm text-gray-500">{resume.lastModified}</p>
                          <span className="text-gray-300">|</span>
                          <Link 
                            to={`/resume/edit/${resume.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <HiOutlinePencil className="h-5 w-5" />
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(resume.id)}
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <HiOutlineDocumentAdd className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No resumes yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first resume!</p>
              <div className="mt-6">
                <Link
                  to="/resume/create"
                  className="btn-primary"
                >
                  Create New Resume
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
