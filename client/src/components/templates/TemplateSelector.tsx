// src/components/resume/TemplateSelector.tsx

import React from 'react';
import { HiOutlineCheck } from 'react-icons/hi';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // Path to the thumbnail image
  primaryColor: string;
}

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const templates: Template[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'A clean and traditional template suitable for corporate environments',
    thumbnail: '/templates/professional-thumb.jpg',
    primaryColor: '#2563eb' // blue-600
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A contemporary design with a fresh and innovative look',
    thumbnail: '/templates/modern-thumb.jpg',
    primaryColor: '#4f46e5' // indigo-600
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative fields like design, arts, or marketing',
    thumbnail: '/templates/creative-thumb.jpg',
    primaryColor: '#8b5cf6' // violet-500
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, simple design that focuses on content with minimal styling',
    thumbnail: '/templates/minimal-thumb.jpg',
    primaryColor: '#111827' // gray-900
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated template for senior positions and leadership roles',
    thumbnail: '/templates/executive-thumb.jpg',
    primaryColor: '#1e40af' // blue-800
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for technical roles with emphasis on skills and projects',
    thumbnail: '/templates/technical-thumb.jpg', 
    primaryColor: '#0e7490' // cyan-700
  }
];

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(template.id)}
      className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 shadow-md transform scale-[1.02]' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Template Thumbnail */}
      <div className="aspect-[3/4] bg-gray-100 relative">
        {/* If you have actual thumbnails, use an img tag instead */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ 
            backgroundColor: template.primaryColor + '10', // Add slight transparency
            backgroundImage: `url(${template.thumbnail})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Fallback if image doesn't load */}
          <div 
            className="text-5xl font-bold opacity-50"
            style={{ color: template.primaryColor }}
          >
            {template.name[0]}
          </div>
        </div>
        
        {/* Selected indicator overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <span className="bg-blue-500 text-white p-2 rounded-full">
              <HiOutlineCheck className="h-6 w-6" />
            </span>
          </div>
        )}
      </div>
      
      {/* Template Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{template.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{template.description}</p>
      </div>
      
      {/* Color accent bar at bottom */}
      <div 
        className="h-1.5 w-full"
        style={{ backgroundColor: template.primaryColor }}
      ></div>
    </div>
  );
};

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  onTemplateChange 
}) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Choose a Template</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select a template that best represents your professional style.
        </p>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={onTemplateChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
