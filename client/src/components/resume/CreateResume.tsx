// client/src/components/resume/CreateResume.tsx
import create from '@/pages/resumes/create';
// REMOVED INVALID IMPORT
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import CreateResume from '@/components/resume/CreateResume';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateResume = () => {
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId: string) => {
    navigate('/resume-builder', { state: { templateId } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Resume</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template 1 */}
        <div 
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer bg-white"
          onClick={() => handleTemplateSelect('template1')}
        >
          <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
            <div className="w-32 h-40 bg-white shadow m-2 p-2">
              <div className="h-6 bg-blue-500 mb-2"></div>
              <div className="h-3 bg-gray-300 mb-1 w-full"></div>
              <div className="h-3 bg-gray-300 mb-1 w-4/5"></div>
              <div className="h-3 bg-gray-300 mb-3 w-3/5"></div>
              <div className="h-2 bg-gray-200 mb-1 w-full"></div>
              <div className="h-2 bg-gray-200 mb-1 w-full"></div>
              <div className="h-2 bg-gray-200 mb-1 w-4/5"></div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">Modern Template</h3>
            <p className="text-gray-600 text-sm">Clean and professional design with a modern touch.</p>
          </div>
        </div>

        {/* Template 2 */}
        <div 
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer bg-white"
          onClick={() => handleTemplateSelect('template2')}
        >
          <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
            <div className="w-32 h-40 bg-white shadow m-2 p-2">
              <div className="flex h-8">
                <div className="w-1/3 bg-gray-700"></div>
                <div className="w-2/3 p-1">
                  <div className="h-2 bg-gray-400 mb-1"></div>
                  <div className="h-2 bg-gray-400 w-4/5"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-300 my-2 w-full"></div>
              <div className="h-2 bg-gray-200 mb-1 w-full"></div>
              <div className="h-2 bg-gray-200 mb-1 w-full"></div>
              <div className="h-2 bg-gray-200 mb-1 w-4/5"></div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">Professional Template</h3>
            <p className="text-gray-600 text-sm">Traditional and elegant design for serious professionals.</p>
          </div>
        </div>

        {/* Template 3 */}
        <div 
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer bg-white"
          onClick={() => handleTemplateSelect('template3')}
        >
          <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
            <div className="w-32 h-40 bg-white shadow m-2 p-2">
              <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 mb-2"></div>
              <div className="h-3 bg-gray-300 mb-1 w-full"></div>
              <div className="h-3 bg-gray-300 mb-3 w-3/5"></div>
              <div className="flex mb-1">
                <div className="h-2 w-2 bg-purple-500 rounded-full mr-1"></div>
                <div className="h-2 bg-gray-200 w-4/5"></div>
              </div>
              <div className="flex mb-1">
                <div className="h-2 w-2 bg-purple-500 rounded-full mr-1"></div>
                <div className="h-2 bg-gray-200 w-3/5"></div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">Creative Template</h3>
            <p className="text-gray-600 text-sm">Stand out with this modern and creative design.</p>
          </div>
        </div>

        {/* AI Resume Option */}
        <div 
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer bg-white border-blue-500"
          onClick={() => navigate('/ai/generator')}
        >
          <div className="h-48 bg-blue-50 flex items-center justify-center border-b">
            <div className="text-center p-4">
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <div className="text-blue-700 font-semibold">AI-Powered Resume</div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">AI Resume Generator</h3>
            <p className="text-gray-600 text-sm">Let our AI create a professional resume tailored to your experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;
