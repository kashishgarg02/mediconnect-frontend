import React, { useState } from 'react';
import {
  User,
  Search,
  Stethoscope,
  Plus,
  ChevronRight,
  Heart,
  Activity,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { server_url } from '../config/url';

function NeedyDashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const dashboardCards = [
    {
      id: 1,
      title: "Needy Profile",
      description: "Manage your personal information and medical requirements",
      icon: <User className="w-12 h-12" />,
      buttonText: "View Profile",
      gradient: "from-blue-500 to-blue-600",
      bgPattern: "bg-gradient-to-br from-blue-50 to-blue-100",
      link:"/nprofile"
    },
    {
      id: 2,
      title: "Medicine Finder",
      description: "Search and find medicines you need from available donations",
      icon: <Search className="w-12 h-12" />,
      buttonText: "Find Medicine",
      gradient: "from-green-500 to-green-600",
      bgPattern: "bg-gradient-to-br from-green-50 to-green-100",
      link:"/medfinder"
    },
    {
      id: 3,
      title: "Equipment Finder",
      description: "Discover medical equipment and devices available for your needs",
      icon: <Stethoscope className="w-12 h-12" />,
      buttonText: "Find Equipment",
      gradient: "from-purple-500 to-purple-600",
      bgPattern: "bg-gradient-to-br from-purple-50 to-purple-100",
      link:"/equipfinder"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
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
                <p className="text-sm text-gray-600">Needy Dashboard</p>
              </div>
            </div>
            <button onClick={() => navigate('/')}  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-10 text-blue-200 opacity-10 animate-pulse">
          <Plus size={64} />
        </div>
        <div className="absolute top-48 right-16 text-green-200 opacity-10 animate-pulse delay-1000">
          <Heart size={48} />
        </div>
        <div className="absolute bottom-48 left-20 text-purple-200 opacity-10 animate-pulse delay-2000">
          <Package size={56} />
        </div>
        <div className="absolute bottom-32 right-32 text-green-200 opacity-10 animate-pulse delay-3000">
          <Activity size={40} />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Access Healthcare Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the medicines and medical equipment you need through our compassionate community of donors.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className={`${card.bgPattern} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/50`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Icon Section */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-2xl text-white mb-4 shadow-lg`}>
                  {card.icon}
                </div>
                
                {/* Decorative image placeholder */}
                <div className="w-full h-32 bg-white/50 rounded-xl mb-4 flex items-center justify-center border-2 border-white/80">
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-full flex items-center justify-center opacity-20`}>
                    {card.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>

              {/* Button */}
              <div className="text-center">
                <button 
                 onClick={() => navigate(card.link)}
                  className={`w-full bg-gradient-to-r ${card.gradient} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform transition-all duration-200 flex items-center justify-center space-x-2 ${
                    hoveredCard === card.id ? 'scale-105' : ''
                  }`}
                >
                  <span>{card.buttonText}</span>
                  <ChevronRight className={`transition-transform duration-200 ${
                    hoveredCard === card.id ? 'translate-x-1' : ''
                  }`} size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NeedyDashboard;