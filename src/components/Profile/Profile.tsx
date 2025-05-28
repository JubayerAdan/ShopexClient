import React from 'react';


import { Home, Briefcase, Plus, Edit3, LogOut } from 'lucide-react';

function Profile() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-gray-100/50 ring-1 ring-gray-200/30">
      {/* Profile Header */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 px-3 py-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200">
            <span className="text-sm">Pro Member</span>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">John Doe</h2>
          <p className="text-gray-500 mt-1">johndoe@example.com</p>
        </div>
      </div>

      {/* Account Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">5</p>
          <p className="text-sm text-gray-600 mt-1">Saved Addresses</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <p className="text-2xl font-bold text-purple-600">12</p>
          <p className="text-sm text-gray-600 mt-1">Wishlist</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-cyan-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Active Orders</p>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Address Book</h3>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 
                       border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Home</p>
              <p className="text-sm text-gray-500 mt-1">123 Main St, Springfield</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Work</p>
              <p className="text-sm text-gray-500 mt-1">456 Corporate Blvd, Metropolis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3 justify-end">
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 
                     border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 
                     rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-red-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
