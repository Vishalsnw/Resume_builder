// pages/profile/settings.tsx

import settings from '@/pages/profile/settings';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Profile from '@/components/profile/Profile';
import Footer from '@/components/layout/Footer';
import Settings from '@/components/settings/Settings';
import Sidebar from '@/components/layout/Sidebar';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { 
  FiBell, 
  FiLock, 
  FiEye, 
  FiGlobe, 
  FiDownload,
  FiTrash2,
  FiSave,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiAlertCircle,
  FiMail,
  FiSmartphone,
  FiClock,
  FiGlobe2
} from 'react-icons/fi';

interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
    updates: boolean;
    newsletter: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showPhone: boolean;
    allowMessaging: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    deviceHistory: boolean;
    sessionTimeout: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
  };
  export: {
    includePersonalData: boolean;
    includeActivityHistory: boolean;
    format: 'json' | 'csv' | 'pdf';
  };
}

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof UserSettings>('notifications');

  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      browser: true,
      mobile: true,
      updates: true,
      newsletter: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessaging: true,
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      deviceHistory: true,
      sessionTimeout: 30,
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
    },
    export: {
      includePersonalData: true,
      includeActivityHistory: false,
      format: 'json',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      loadSettings();
    }
  }, [status, router]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('Failed to load settings');
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: keyof UserSettings) => {
    setActiveTab(tab);
  };

  const handleChange = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
        setHasChanges(false);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications via {key}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChange('notifications', key, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Enable {key} notifications</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Profile Visibility
          </label>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleChange('privacy', 'profileVisibility', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="contacts">Contacts Only</option>
          </select>
        </div>
        {/* Add other privacy settings here */}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
      {/* Add security settings here */}
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">User Preferences</h3>
      {/* Add preferences settings here */}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Content */}
        <div className="flex min-h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 pt-6">
            <nav className="space-y-1">
              {Object.keys(settings).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as keyof UserSettings)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-6 py-6">
            {activeTab === 'notifications' && renderNotificationsSection()}
            {activeTab === 'privacy' && renderPrivacySection()}
            {activeTab === 'security' && renderSecuritySection()}
            {activeTab === 'preferences' && renderPreferencesSection()}

            {/* Save Button */}
            {hasChanges && (
              <div className="fixed bottom-0 right-0 p-6 bg-white border-t border-l border-gray-200 rounded-tl-lg shadow-lg">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
          Last updated by Vishalsnw at 2025-06-07 20:23:16
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
