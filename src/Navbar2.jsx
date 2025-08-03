import React from 'react';
import {
  Plus,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { server_url } from '../config/url';

function Navbar2() {
    const navigate = useNavigate();
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-full p-2">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MediConnect
              </h1>
              <p className="text-sm text-gray-600">Healthcare Platform</p>
            </div>
          </div>
          <button onClick={() => navigate('/needy-dashboard')}  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar2;