import React, { useState, useEffect } from 'react';
import { useNavigate ,Outlet} from 'react-router-dom'
import {
  Plus,
  Heart,
  Stethoscope,
  ChevronRight,
  Shield,
  Clock,
  Users,
  Star,
  Activity,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

function IndexPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Donate with Purpose",
      description: "Share unused or surplus medicines and equipments securely and give the gift of health to someone in need."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Verified",
      description: "All donated medicines and equipments are verified for safety and distributed to registered recipients."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick & Easy Process",
      description: "Donate or request medicines and equipments in just a few clicks — no red tape, just real help."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join a Caring Community",
      description: "Be part of a growing community dedicated to making healthcare accessible for all."
    }
  ];

  const stats = [
    { number: "15,000+", label: "Medicines & Equipments Donated" },
    { number: "8,000+", label: "Needy Beneficiaries" },
    { number: "1,200+", label: "Verified Donors" },
    { number: "100%", label: "Free for All" }
  ];

  const teamCards = [
    {
      heading: "Under the Guidance of:",
      name: "Prof. Rajesh Bansal",
      role: "Technical Instructor",
      description: "Coding is a fun!!  Its a great way to challenge yourself to learn new things.",
    },
    {
      heading: "Developed by:",
      name: "Kashish",
      role: "Lead Developer",
      description: "A passionate sophomore and full-stack developer.",
    }
  ];

  // Navigation function - replace this with your actual routing logic
   let navg=useNavigate();
  function doNavigate(url) {
     navg("/"+url)  ;
    console.log('Navigate to:', url);
    // Replace with your actual navigation logic
    // For example: window.location.href = '/' + url;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-full p-2">
                <Plus className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MediConnect
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => doNavigate("/")} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                // onClick={() => doNavigate("about")} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </button>
              <button 
                // onClick={() => doNavigate("services")} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Services
              </button>
              <button 
                // onClick={() => doNavigate("contact")} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors" 
                onClick={() => doNavigate("login")}
              >
                Login
              </button>
              <button  
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200" 
                onClick={() => doNavigate("signup")} 
              >
                Sign up
              </button>
            </div>
            <Outlet></Outlet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-10 text-blue-200 opacity-20 animate-pulse">
            <Plus size={64} />
          </div>
          <div className="absolute top-48 right-16 text-green-200 opacity-20 animate-pulse delay-1000">
            <Heart size={48} />
          </div>
          <div className="absolute bottom-48 left-20 text-blue-200 opacity-20 animate-pulse delay-2000">
            <Stethoscope size={56} />
          </div>
          <div className="absolute bottom-32 right-32 text-green-200 opacity-20 animate-pulse delay-3000">
            <Activity size={40} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Donate Medicines & Equipments,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Save Lives
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join a growing network of compassionate donors and help those in need get access to life-saving medicines and medical equipments — all for free.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Donate Through MediConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy and safe to share surplus medicines and equipments with people who need them most.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamCards.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{member.heading}</h3>
                <div className="flex flex-col items-center text-center">
                  {/* <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-500"
                  /> */}
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Give Hope Through Medicine & Equipments
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're a donor or someone in need, MediConnect connects lives through medicine and medical equipments. 
            Take the first step today.
          </p>
          <div className="flex justify-center">
            <button
             onClick={() => doNavigate("signup")}  
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
              Donate Medicines & Equipments
            </button>
          </div>
        </div>
      </section>

      {/* Visit Us - Google Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Us
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Find us at our location for any assistance or inquiries.
            </p>
          </div>
          
          {/* Google Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.8073639904906!2d76.3621262754033!3d30.356424174768048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391028ab86533db5%3A0x93cc1f72eae1c9a8!2sThapar%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1754207384679!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MediConnect Office Location"
            ></iframe>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">9056676527</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">gargkashish910@gmail.com</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IndexPage;