import React, { useState } from 'react';
import { BriefcaseBusiness, MapPin, Check, Archive, GraduationCap, Asterisk, Stethoscope, Search, Plus, Heart, User, Phone, Mail, Calendar, Package, Image, X } from 'lucide-react';
import axios from "axios";
import { server_url } from '../config/url';

function EquipmentFinder() {
  const [searchData, setSearchData] = useState({
    city: '',
    equipmentName: ''
  });

  const [equipments, setEquipments] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedEquipmentImage, setSelectedEquipmentImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDonor, setIsLoadingDonor] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  
  const handleSearch = async () => {
    if (!searchData.city.trim() || !searchData.equipmentName.trim()) {
      return setErrors({
        city: !searchData.city.trim() ? 'City required' : '',
        equipmentName: !searchData.equipmentName.trim() ? 'Equipment required' : ''
      });
    }

    setIsSearching(true);
    setEquipments([]);
    try {
       const token = localStorage.getItem("token"); 

      const res = await fetch(server_url+'/needy/find-equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',"authorization": `Bearer ${token}` },
        body: JSON.stringify(searchData)
      });
      const data = await res.json();
      if (data.status) {
        if (Array.isArray(data.equipments) && data.equipments.length > 0) {
          setEquipments(data.equipments);
        } else {
          setEquipments([]);
          alert('No matches found in your city for this medicine.');
        }
      } else {
        alert(data.msg || 'Something went wrong.');
      }
    } catch (e) {
      console.error(e);
      alert('Server error');
    } finally {
      setIsSearching(false);
    }
  };

  const getDonorDetails = async (email) => {
    try {
      const token = localStorage.getItem("token"); 
      
      const res = await fetch(server_url+'/needy/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',"authorization": `Bearer ${token}` },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.status) {
        setSelectedDonor(data.donor);
        setShowDonorModal(true);
      } else {
        alert(data.msg);
      }
    } catch (e) {
      console.error(e);
      alert('Error fetching donor');
    }
  };

  const showEquipmentImage = (equipment) => {
    setSelectedEquipmentImage(equipment);
    setShowImageModal(true);
  };

  const closeDonorModal = () => {
    setShowDonorModal(false);
    setSelectedDonor(null);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedEquipmentImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      {/* Floating medical icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-blue-200 opacity-20">
          <Plus size={64} />
        </div>
        <div className="absolute top-40 right-32 text-green-200 opacity-20">
          <Heart size={48} />
        </div>
        <div className="absolute bottom-32 left-16 text-blue-200 opacity-20">
          <Stethoscope size={56} />
        </div>
        <div className="absolute bottom-20 right-20 text-green-200 opacity-20">
          <Plus size={40} />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto pt-16">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white rounded-full p-3">
                <Search className="text-blue-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Equipment Finder</h1>
            <p className="text-blue-100 text-sm">Find available medical equipment in your city</p>
          </div>

          {/* Search Form */}
          <div className="px-8 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* City Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={searchData.city || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Equipment Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="equipmentName"
                    value={searchData.equipmentName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter equipment name (e.g., MRI, X-ray, Ultrasound)"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.equipmentName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.equipmentName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.equipmentName}
                  </p>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-6">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                  isSearching
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="mr-2" size={20} />
                    Find Equipment
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Equipment Cards */}
        {equipments.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments.map((equipment, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-blue-100 to-green-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-white rounded-full p-2">
                      <Stethoscope className="text-blue-600" size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                      Available
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{equipment.equipmentName}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Package className="mr-2" size={16} />
                      <span className="text-sm">Manufacturer: {equipment.manufacturer}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Archive className="mr-2" size={16} />
                      <span className="text-sm">Model: {equipment.model}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-2" size={16} />
                      <span className="text-sm">Purchase Date: {new Date(equipment.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Check className="mr-2" size={16} />
                      <span className="text-sm">Condition: {equipment.condition}</span>
                    </div>
                  </div>

                  {equipment.otherInfo && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Additional Info:</p>
                      <p className="text-gray-600 text-sm line-clamp-3 bg-gray-50 p-2 rounded-lg">
                        {equipment.otherInfo}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => getDonorDetails(equipment.email)}
                      disabled={isLoadingDonor}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <User className="mr-1" size={16} />
                      {isLoadingDonor ? 'Loading...' : 'Donor Details'}
                    </button>
                    
                    <button
                      onClick={() => showEquipmentImage(equipment)}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center min-w-fit"
                      title="View Equipment Image"
                    >
                      <Image size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Verified Equipment
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Trusted Donors
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              Real-time Search
            </div>
          </div>
        </div>

        {/* Donor Details Modal */}
        {showDonorModal && selectedDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-white rounded-full p-1 border-4 border-blue-100">
                    <img
                      src={selectedDonor.profilePic || 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=Donor'}
                      alt="Donor"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">Donor Details</h2>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedDonor.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedDonor.emailid}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedDonor.contactNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{selectedDonor.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Asterisk className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-medium">{selectedDonor.age}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <GraduationCap className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Qualification</p>
                      <p className="font-medium">{selectedDonor.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <BriefcaseBusiness className="text-gray-400 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Occupation</p>
                      <p className="font-medium">{selectedDonor.occupation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={closeDonorModal}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Image Modal */}
        {showImageModal && selectedEquipmentImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Image className="text-white mr-2" size={24} />
                  <h2 className="text-xl font-bold text-white">Equipment Image</h2>
                </div>
                <button
                  onClick={closeImageModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedEquipmentImage.equipmentName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedEquipmentImage.manufacturer} - {selectedEquipmentImage.model}
                  </p>
                </div>

                {/* Equipment Image */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  {selectedEquipmentImage.equipmentPhoto ? (
                    <img
                      src={selectedEquipmentImage.equipmentPhoto}
                      alt={selectedEquipmentImage.equipmentName}
                      className="w-full h-64 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Equipment+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Image size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Equipment Details */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Condition</p>
                    <p className="font-medium capitalize">{selectedEquipmentImage.condition}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Purchase Date</p>
                    <p className="font-medium">{new Date(selectedEquipmentImage.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedEquipmentImage.otherInfo && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Additional Information</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                      {selectedEquipmentImage.otherInfo}
                    </p>
                  </div>
                )}

                <button
                  onClick={closeImageModal}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EquipmentFinder;