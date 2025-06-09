// src/components/templates/TemplateSelector.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineCheck,
  HiOutlineChevronRight,
  HiOutlineDocumentText
} from 'react-icons/hi';

// Import template preview images - you'll need to create these
import professionalPreview from '../../assets/images/templates/professional.png';
import modernPreview from '../../assets/images/templates/modern.png';
import creativePreview from '../../assets/images/templates/creative.png';
import minimalPreview from '../../assets/images/templates/minimal.png';
import executivePreview from '../../assets/images/templates/executive.png';
import chronologicalPreview from '../../assets/images/templates/chronological.png';

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and polished design suitable for traditional industries.',
    image: professionalPreview,
    tags: ['Traditional', 'Corporate', 'Finance']
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with a focus on skills and achievements.',
    image: modernPreview,
    tags: ['Tech', 'Marketing', 'Design']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, unique design for standing out in creative fields.',
    image: creativePreview,
    tags: ['Design', 'Art', 'Media']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, distraction-free layout that prioritizes content.',
    image: minimalPreview,
    tags: ['All Industries', 'Clean', 'Focused']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals and leadership roles.',
    image: executivePreview,
    tags: ['Management', 'Executive', 'Leadership']
  },
  {
    id: 'chronological',
    name: 'Chronological',
    description: 'Traditional format emphasizing work history and progression.',
    image: chronologicalPreview,
    tags: ['Traditional', 'Experience', 'Career Growth']
  }
];

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredTemplates = filter 
    ? templates.filter(template => template.tags.includes(filter))
    : templates;
    
  const tags = Array.from(new Set(templates.flatMap(template => template.tags)));
  
  const handleContinue = () => {
    if (selectedTemplate) {
      navigate(`/resume/editor?template=${selectedTemplate}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <HiOutlineArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Choose a Template</h1>
            </div>
            <button
              onClick={handleContinue}
              disabled={!selectedTemplate}
              className={`btn-primary ${!selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue
              <HiOutlineChevronRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>
