import React, { useState,useEffect } from 'react';
import { Mail, Package, Building, Calendar, Box, Hash, FileText, Plus, Heart, Stethoscope } from 'lucide-react';
import axios from "axios";
import { server_url } from '../config/url';

function MedicineDonation() {
  const [formData, setFormData] = useState({
    email: '',
    medicine: '',
    company: '',
    expiryDate: '',
    packingType: '',
    quantity: '',
    otherInfo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const packingTypes = [
    { value: '', label: 'Select Packing Type' },
    { value: 'Tablets', label: 'Tablets' },
    { value: 'Capsules', label: 'Capsules' },
    { value: 'Syrup', label: 'Syrup' },
    { value: 'Injection', label: 'Injection' },
    { value: 'Drops', label: 'Drops' },
    { value: 'Cream/Ointment', label: 'Cream/Ointment' },
    { value: 'Powder', label: 'Powder' },
    { value: 'Inhaler', label: 'Inhaler' },
    { value: 'Other', label: 'Other' }
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

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Medicine validation
    if (!formData.medicine) {
      newErrors.medicine = 'Medicine name is required';
    } else if (formData.medicine.length < 2) {
      newErrors.medicine = 'Medicine name must be at least 2 characters';
    }
    
    // Company validation
    if (!formData.company) {
      newErrors.company = 'Company name is required';
    } else if (formData.company.length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    }
    
    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }
    
    // Packing type validation
    if (!formData.packingType) {
      newErrors.packingType = 'Please select a packing type';
    }
    
    // Quantity validation
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (type) => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    let url = server_url+"/donor/availmed";

    const token = localStorage.getItem("token");

    let resp = await axios.post(url, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded", "authorization": `Bearer ${token}` },
    });
    //alert(JSON.stringify(resp.data));
    if (resp.data.status == true)
      alert(resp.data.msg);
    else {
      alert(resp.data.msg);
    }
    
    // Simulate API call
    setTimeout(() => {
      console.log('Medicine donation data:', formData);
    //   alert(`Medicine donation made available to public successfully! Thank you for your contribution.`);
      
      setIsSubmitting(false);
      setFormData({
        email: '',
        medicine: '',
        company: '',
        expiryDate: '',
        packingType: '',
        quantity: '',
        otherInfo: ''
      });
    }, 2000);
  };

  async function handleupdate() {
    if (!validateForm()) return;

    setIsSubmitting(true);

   
    let url = server_url + "/donor/medicineupdate";
    const token = localStorage.getItem("token");

    let fd = new FormData();
    for (let prop in formData) {
      fd.append(prop, formData[prop]);
    }
    let resp = await axios.post(url, fd, {
      headers: { "Content-Type": "application/x-www-form-urlencoded","authorization": `Bearer ${token}` },
    });

    if (resp.data.status === true) {
      alert("Updated successfully: " + resp.data.msg);
    } else {
      alert("Update failed: " + resp.data.msg);
    }
  

    // Simulate API call for update
    setTimeout(() => {
      console.log('Profile updated:', formData);
    //   alert('Profile updated successfully!');
      setIsSubmitting(false);
      setEditMode(false);
    }, 2000);
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

      <div className="relative w-full max-w-md">
        {/* Main donation form card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white rounded-full p-3">
                <Package className="text-blue-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Medicine Donation</h1>
            <p className="text-blue-100 text-sm">Share medicines to help others</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <div className="space-y-5">
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

              {/* Medicine Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="medicine"
                    value={formData.medicine}
                    onChange={handleInputChange}
                    placeholder="Enter medicine name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.medicine ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.medicine && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.medicine}
                  </p>
                )}
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.company}
                  </p>
                )}
              </div>

              {/* Expiry Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.expiryDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              {/* Packing Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Packing <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Box className="text-gray-400" size={20} />
                  </div>
                  <select
                    name="packingType"
                    value={formData.packingType}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${
                      errors.packingType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {packingTypes.map(type => (
                      <option key={type.value} value={type.value} disabled={type.value === ''}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.packingType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.packingType}
                  </p>
                )}
              </div>

              {/* Quantity Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.quantity}
                  </p>
                )}
              </div>

              {/* Other Info Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Information
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="text-gray-400" size={20} />
                  </div>
                  <textarea
                    name="otherInfo"
                    value={formData.otherInfo}
                    onChange={handleInputChange}
                    placeholder="Additional information about the medicine (optional)"
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleSubmit('public')}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 active:scale-95'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                  {/* {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : ( */}
                    Avail to Public
                  {/* )} */}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleupdate('update')}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {/* {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : ( */}
                    Update
                  {/* )} */}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Verified Donations
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Safe & Secure
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              Quality Assured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDonation;









