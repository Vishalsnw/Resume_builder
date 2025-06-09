import 500 from '@/pages/500';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Profile from '@/components/profile/Profile';
import React from 'react';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {/* Profile image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="text-blue-500 hover:underline">Upload photo</button>
            </div>
          </div>
          <div className="md:w-2/3 md:pl-6">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Name</label>
                  <input type="text" className="form-input w-full px-4 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="form-input w-full px-4 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input type="email" className="form-input w-full px-4 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="form-input w-full px-4 py-2 border rounded" />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
