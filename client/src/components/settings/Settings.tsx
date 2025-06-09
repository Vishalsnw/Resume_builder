import Settings from '@/components/settings/Settings';
import React from 'react';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Account settings form */}
        <form>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Email Notifications</label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                  <span className="ml-2">Receive job alerts</span>
                </label>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <button type="button" className="text-blue-500 hover:underline">Change Password</button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
