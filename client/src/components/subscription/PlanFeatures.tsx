// client/src/components/subscription/PlanFeatures.tsx

import React, { useState } from 'react';
import {
  FiCheck,
  FiX,
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PlanFeaturesProps {
  currentPlan?: string;
  onUpgrade?: (plan: string) => void;
  currentUser?: string;
  currentDateTime?: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  basic: boolean | number | string;
  professional: boolean | number | string;
  enterprise: boolean | number | string;
  comingSoon?: boolean;
  beta?: boolean;
}

const PlanFeatures: React.FC<PlanFeaturesProps> = ({
  currentPlan = 'basic',
  onUpgrade,
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:49:55'
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['resume-builder']);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const categories = {
    'resume-builder': 'Resume Builder',
    'ai-features': 'AI Features',
    'export-options': 'Export Options',
    'templates': 'Templates & Designs',
    'support': 'Support & Services',
    'collaboration': 'Collaboration Tools',
    'analytics': 'Analytics & Insights',
    'integration': 'Integrations',
  };

  const features: Feature[] = [
    // Resume Builder Features
    {
      id: 'basic-builder',
      name: 'Resume Builder',
      description: 'Create and edit professional resumes',
      category: 'resume-builder',
      basic: true,
      professional: true,
      enterprise: true
    },
    {
      id: 'sections',
      name: 'Custom Sections',
      description: 'Add and customize resume sections',
      category: 'resume-builder',
      basic: '3 sections',
      professional: 'Unlimited',
      enterprise: 'Unlimited'
    },
    {
      id: 'templates',
      name: 'Resume Templates',
      description: 'Access to professional templates',
      category: 'templates',
      basic: '5 templates',
      professional: '25+ templates',
      enterprise: 'Custom templates'
    },

    // AI Features
    {
      id: 'ai-suggestions',
      name: 'AI Content Suggestions',
      description: 'Get AI-powered content improvements',
      category: 'ai-features',
      basic: 'Basic',
      professional: 'Advanced',
      enterprise: 'Enterprise-grade'
    },
    {
      id: 'ai-analysis',
      name: 'AI Resume Analysis',
      description: 'Get detailed AI feedback on your resume',
      category: 'ai-features',
      basic: false,
      professional: true,
      enterprise: true
    },
    {
      id: 'keyword-optimization',
      name: 'ATS Keyword Optimization',
      description: 'AI-powered keyword suggestions for ATS',
      category: 'ai-features',
      basic: false,
      professional: true,
      enterprise: true
    },

    // Export Options
    {
      id: 'pdf-export',
      name: 'PDF Export',
      description: 'Export resumes to PDF format',
      category: 'export-options',
      basic: true,
      professional: true,
      enterprise: true
    },
    {
      id: 'docx-export',
      name: 'Word Export',
      description: 'Export resumes to DOCX format',
      category: 'export-options',
      basic: false,
      professional: true,
      enterprise: true
    },
    {
      id: 'custom-formatting',
      name: 'Custom Formatting',
      description: 'Advanced formatting options for exports',
      category: 'export-options',
      basic: false,
      professional: true,
      enterprise: true
    },

    // Support Features
    {
      id: 'email-support',
      name: 'Email Support',
      description: 'Get support via email',
      category: 'support',
      basic: '24h response',
      professional: '12h response',
      enterprise: '1h response'
    },
    {
      id: 'chat-support',
      name: 'Live Chat Support',
      description: 'Real-time chat support',
      category: 'support',
      basic: false,
      professional: 'Business hours',
      enterprise: '24/7'
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: 'Get priority assistance',
      category: 'support',
      basic: false,
      professional: true,
      enterprise: true
    },

    // Collaboration Features
    {
      id: 'sharing',
      name: 'Resume Sharing',
      description: 'Share resumes with others',
      category: 'collaboration',
      basic: 'Basic link sharing',
      professional: 'Advanced sharing',
      enterprise: 'Team sharing'
    },
    {
      id: 'team-management',
      name: 'Team Management',
      description: 'Manage team members and permissions',
      category: 'collaboration',
      basic: false,
      professional: false,
      enterprise: true
    },

    // Analytics Features
    {
      id: 'basic-analytics',
      name: 'Resume Analytics',
      description: 'Track resume performance',
      category: 'analytics',
      basic: 'Basic stats',
      professional: 'Advanced analytics',
      enterprise: 'Custom reports'
    },
    {
      id: 'ats-analytics',
      name: 'ATS Performance Analytics',
      description: 'Track ATS performance metrics',
      category: 'analytics',
      basic: false,
      professional: true,
      enterprise: true
    },

    // Integration Features
    {
      id: 'job-board',
      name: 'Job Board Integration',
      description: 'Connect with popular job boards',
      category: 'integration',
      basic: false,
      professional: '3 integrations',
      enterprise: 'Unlimited'
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Access to our API',
      category: 'integration',
      basic: false,
      professional: false,
      enterprise: true
    }
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderValue = (value: boolean | number | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <FiCheck className="w-5 h-5 text-green-500" />
      ) : (
        <FiX className="w-5 h-5 text-gray-300" />
      );
    }
    return <span className="text-gray-900">{value}</span>;
  };

  const handleUpgradeClick = (plan: string) => {
    if (onUpgrade) {
      onUpgrade(plan);
    } else {
      toast.error('Upgrade functionality not implemented');
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Feature Comparison</h2>
          <p className="mt-4 text-lg text-gray-600">
            Compare our plans and choose the best one for your needs
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-8">
          {Object.entries(categories).map(([categoryKey, categoryName]) => {
            const categoryFeatures = features.filter(f => f.category === categoryKey);
            const isExpanded = expandedCategories.includes(categoryKey);

            if (!showAllFeatures && categoryFeatures.length === 0) return null;

            return (
              <div key={categoryKey} className="border rounded-lg shadow-sm">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 rounded-t-lg hover:bg-gray-100"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {categoryName}
                  </h3>
                  {isExpanded ? (
                    <FiChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* Feature List */}
                {isExpanded && (
                  <div className="divide-y divide-gray-200">
                    {categoryFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="grid grid-cols-5 gap-4 px-6 py-4 items-center"
                      >
                        <div className="col-span-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">
                              {feature.name}
                            </span>
                            {feature.comingSoon && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Coming Soon
                              </span>
                            )}
                            {feature.beta && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                Beta
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {feature.description}
                          </p>
                        </div>
                        <div className="text-center">
                          {renderValue(feature.basic)}
                        </div>
                        <div className="text-center">
                          {renderValue(feature.professional)}
                        </div>
                        <div className="text-center">
                          {renderValue(feature.enterprise)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Plan Selection */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          {['basic', 'professional', 'enterprise'].map((plan) => (
            <div
              key={plan}
              className={`p-6 rounded-lg border ${
                currentPlan === plan
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <h3 className="text-lg font-semibold capitalize">{plan}</h3>
              {currentPlan === plan ? (
                <span className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Current Plan
                </span>
              ) : (
                <button
                  onClick={() => handleUpgradeClick(plan)}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upgrade
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Show All Features Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <FiInfo className="w-5 h-5 mr-2" />
            {showAllFeatures ? 'Show Core Features' : 'Show All Features'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {currentDateTime}</p>
          <p>Updated by: {currentUser}</p>
        </div>
      </div>
    </div>
  );
};

export default PlanFeatures;
