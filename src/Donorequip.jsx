import React, { useState ,useEffect} from 'react';
import { Mail, Stethoscope, Building, Calendar, Package, FileText, Upload, Camera, Heart, Plus } from 'lucide-react';
import axios from "axios";
import { server_url } from '../config/url';

function EquipmentDonation() {
  const [formData, setFormData] = useState({
    email: "",
    equipmentName: "",
    manufacturer: "",
    model: "",
    purchaseDate: "",
    condition: "",
    equipmentPhoto: null,
    otherInfo: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    equipmentPhoto: null
  });
  // const [email, setEmail] = useState("");

  const conditionTypes = [
    { value: '', label: 'Select Condition' },
    { value: 'excellent', label: 'Excellent (Like New)' },
    { value: 'very-good', label: 'Very Good' },
    { value: 'good', label: 'Good (Minor wear)' },
    { value: 'fair', label: 'Fair (Functional with issues)' },
    { value: 'poor', label: 'Poor (Needs repair)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData(prev => ({
        ...prev,
        email: storedEmail
      }));
    }
  }, []);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn(`No file selected for ${fieldName}`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));

    // Create preview for images
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImages(prev => ({
        ...prev,
        [fieldName]: reader.result
      }));
    };
    reader.readAsDataURL(file);

    // Clear error
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Equipment name validation
    if (!formData.equipmentName.trim()) {
      newErrors.equipmentName = 'Equipment name is required';
    } else if (formData.equipmentName.length < 2) {
      newErrors.equipmentName = 'Equipment name must be at least 2 characters';
    }
    
    // Manufacturer validation
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    } else if (formData.manufacturer.length < 2) {
      newErrors.manufacturer = 'Manufacturer must be at least 2 characters';
    }
    
    // Purchase date validation
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    } else {
      const selectedDate = new Date(formData.purchaseDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.purchaseDate = 'Purchase date cannot be in the future';
      }
    }
    
    // Condition validation
    if (!formData.condition) {
      newErrors.condition = 'Please select equipment condition';
    }
    
    // Image validation
    if (!formData.equipmentPhoto) {
      newErrors.equipmentPhoto = 'Please upload an image of the equipment';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    async function handleDonateEquipment() {
    if (validateForm()) {
      // Handle equipment donation
      console.log('Equipment Donation:', formData);

      const token = localStorage.getItem("token");
      let url = server_url+"/donor/saveEquip";

      let fd = new FormData();
      for (let prop in formData) {
        fd.append(prop, formData[prop]);
      }

      let resp = await axios.post(url, fd,{
        headers: { "Content-Type": "application/x-www-form-urlencoded","authorization": `Bearer ${token}` }
      });
      //alert(JSON.stringify(resp.data));
      if (resp.data.status == true)
        alert(resp.data.msg);
      else {
        alert(resp.data.msg);
      }
      
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
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

      <div className="relative w-full max-w-2xl">
        {/* Main donation card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white rounded-full p-3">
                <Heart className="text-blue-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Equipment Donation</h1>
            <p className="text-blue-100 text-sm">Share medical equipment to help others</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly
                    placeholder="Enter your email"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Equipment Name and Manufacturer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={formData.equipmentName}
                      onChange={handleInputChange}
                      placeholder="Enter equipment name"
                      required
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="Enter manufacturer"
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.manufacturer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.manufacturer && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.manufacturer}
                    </p>
                  )}
                </div>
              </div>

              {/* Model and Purchase Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Enter model number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.purchaseDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.purchaseDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.purchaseDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Condition Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="text-gray-400" size={20} />
                  </div>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${
                      errors.condition ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {conditionTypes.map((condition) => (
                      <option key={condition.value} value={condition.value} disabled={condition.value === ''}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.condition}
                  </p>
                )}
              </div>

              {/* Equipment Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Photo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="equipmentPhoto"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(e) => handleFileChange(e, 'equipmentPhoto')}
                    className="hidden"
                    id="equipmentPhoto"
                  />
                  <label
                    htmlFor="equipmentPhoto"
                    className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                      errors.equipmentPhoto ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {previewImages.equipmentPhoto ? (
                      <div className="text-center">
                        <img src={previewImages.equipmentPhoto} alt="Preview" className="w-24 h-24 object-cover rounded-lg mb-2" />
                        <p className="text-sm text-gray-600">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload equipment photo</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.equipmentPhoto && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.equipmentPhoto}
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FileText className="text-gray-400" size={20} />
                  </div>
                  <textarea
                    name="otherInfo"
                    value={formData.otherInfo}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Any additional details about the equipment, accessories, manuals included, etc..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleDonateEquipment}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Donation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Equipment
                  </div>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Thank you for your generous donation. Your equipment will help those in need.
              </p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Secure Donation
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Verified Recipients
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              Tax Deductible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentDonation;