import React, { useState,useEffect } from 'react';
import { Mail, Lock, User, Stethoscope, Plus, Heart, Search, Save, Edit, Phone, MapPin, Calendar, Upload, FileText, Camera } from 'lucide-react';
import axios from "axios";
import { server_url } from '../config/url';

function DonorProfile() {
  const [formData, setFormData] = useState({
    emailid: '',
    name: '',
    gender: '',
    age: '',
    address: '',
    city: '',
    contactNo: '',
    qualification: '',
    occupation: '',
    aadharCard: null,
    profilePic: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [editMode, setEditMode] = useState(true);
  // const [email, setEmail] = useState("");

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const qualificationOptions = [
    { value: '', label: 'Select Qualification' },
    { value: 'High School', label: 'High School' },
    { value: 'Bachelor\'s Degree', label: 'Bachelor\'s Degree' },
    { value: 'Master\'s Degree', label: 'Master\'s Degree' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Other', label: 'Other' }
  ];

  const occupationOptions = [
    { value: '', label: 'Select Occupation' },
    { value: 'Doctor', label: 'Doctor' },
    { value: 'Engineer', label: 'Engineer' },
    { value: 'Teacher', label: 'Teacher' },
    { value: 'Business Owner', label: 'Business Owner' },
    { value: 'Government Employee', label: 'Government Employee' },
    { value: 'Private Employee', label: 'Private Employee' },
    { value: 'Student', label: 'Student' },
    { value: 'Retired', label: 'Retired' },
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
      emailid: storedEmail
    }));
  }
}, []);


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));

      // Clear error when user selects a file
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.emailid) {
      newErrors.emailid = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailid)) {
      newErrors.emailid = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    // Contact number validation
    if (!formData.contactNo) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Please enter a valid 10-digit contact number';
    }

    // Qualification validation
    if (!formData.qualification) {
      newErrors.qualification = 'Please select qualification';
    }

    // Occupation validation
    if (!formData.occupation) {
      newErrors.occupation = 'Please select occupation';
    }

    // Aadhar Card validation
    if (!formData.aadharCard || (typeof formData.aadharCard === 'string' && formData.aadharCard.trim() === '')) {
      newErrors.aadharCard = 'Aadhar card is required';
    }

    // Profile Picture validation
    if (!formData.profilePic || (typeof formData.profilePic === 'string' && formData.profilePic.trim() === '')) {
      newErrors.profilePic = 'Profile picture is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // search donor details by email
 const handleSearch = async () => {
  if (!formData.emailid) {
    setErrors({ emailid: 'Please enter email to search' });
    return;
  }

  setIsSearching(true);
  setErrors({});

  try {
    const token = localStorage.getItem("token"); // Get the token

    const response = await axios.post(
      server_url+"/donor/donorpsearch",
      { emailid: formData.emailid },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "authorization": `Bearer ${token}` // Add the token to headers
        }
      }
    );

    if (response.data.status === true) {
      const donor = response.data.data;

      setFormData({
        emailid: donor.emailid,
        name: donor.name || '',
        gender: donor.gender || '',
        age: donor.age || '',
        address: donor.address || '',
        city: donor.city || '',
        contactNo: donor.contactNo || '',
        qualification: donor.qualification || '',
        occupation: donor.occupation || '',
        aadharCard: donor.aadharCard || '',
        profilePic: donor.profilePic || ''
      });

      setEditMode(false); // lock form after loading data
    } else {
      alert(response.data.msg || "No record found");
      setEditMode(true); // allow new entry
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("Error occurred while searching.");
  }

  setIsSearching(false);
};

  // save donor details
  async function handleSave() {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // alert();
    let url = server_url+"/donor/donorpsave";

    let fd = new FormData();
    for (let prop in formData) {
      fd.append(prop, formData[prop]);
    }
    let token=localStorage.getItem("token");
    let resp = await axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data','authorization' : `Bearer ${token}` } });
    //alert(JSON.stringify(resp.data));
    if (resp.data.status == true)
      alert(resp.data.msg);
    else {
      alert(resp.data.msg);
    }

    // Simulate API call for save
    setTimeout(() => {
      console.log('Profile saved:', formData);
      // alert('Profile saved successfully!');
      setIsSubmitting(false);
      setEditMode(false);
    }, 2000);
  };


  // update donor details
  async function handleUpdate() {
    if (!validateForm()) return;

    setIsSubmitting(true);


    let url = server_url+"/donor/donorpupdate";

    let fd = new FormData();
    for (let prop in formData) {
      fd.append(prop, formData[prop]);
    }
    let token=localStorage.getItem("token");
    let resp = await axios.post(url, fd, {
      headers: { 'Content-Type': 'multipart/form-data' ,'authorization' : `Bearer ${token}`}
    });

    if (resp.data.status === true) {
      alert(resp.data.msg);
    } else {
      alert("Update failed: " + resp.data.msg);
    }


    // Simulate API call for update
    setTimeout(() => {
      console.log('Profile updated:', formData);
      // alert('Profile updated successfully!');
      setIsSubmitting(false);
      setEditMode(false);
    }, 2000);
  };

  const handleEdit = () => {
    setEditMode(true);
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
        {/* Main profile card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white rounded-full p-3">
                <Heart className="text-blue-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Donor Profile</h1>
            <p className="text-blue-100 text-sm">Manage your donor information</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <div className="space-y-6">
              {/* Email Field with Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      name="emailid"
                      value={formData.emailid}
                       onChange={handleInputChange}
                       readOnly
                      placeholder="Enter email to search or add new"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.emailid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Search size={20} />
                    )}
                  </button>
                </div>
                {errors.emailid && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.emailid}
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    disabled={!editMode}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${!editMode ? 'bg-gray-50' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Gender and Age Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${!editMode ? 'bg-gray-50' : ''}`}
                  >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value} disabled={option.value === ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      min="18"
                      max="100"
                      disabled={!editMode}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } ${!editMode ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-gray-400" size={20} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    rows="3"
                    disabled={!editMode}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${!editMode ? 'bg-gray-50' : ''}`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* City and Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    disabled={!editMode}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${!editMode ? 'bg-gray-50' : ''}`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit number"
                      disabled={!editMode}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.contactNo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } ${!editMode ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.contactNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNo}</p>
                  )}
                </div>
              </div>

              {/* Qualification and Occupation Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Qualification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${errors.qualification ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${!editMode ? 'bg-gray-50' : ''}`}
                  >
                    {qualificationOptions.map(option => (
                      <option key={option.value} value={option.value} disabled={option.value === ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
                  )}
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${errors.occupation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${!editMode ? 'bg-gray-50' : ''}`}
                  >
                    {occupationOptions.map(option => (
                      <option key={option.value} value={option.value} disabled={option.value === ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.occupation && (
                    <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>
                  )}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhar Card Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Card
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="aadharCard"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={!editMode}
                      className="hidden"
                      id="aadharCard"
                    />
                    <label
                      htmlFor="aadharCard"
                      className={`w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center ${editMode ? 'border-gray-300 hover:border-blue-400' : 'border-gray-200 cursor-not-allowed'
                        }`}
                    >
                      <div className="text-center">
                        <FileText className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600">
                          {formData.aadharCard && typeof formData.aadharCard !== 'string'
                            ? formData.aadharCard.name
                            : 'Upload Aadhar Card'}
                        </p>
                      </div>
                    </label>

                    {/* Preview (Image or PDF) */}
                    {formData.aadharCard && (
                      <div className="mt-3 text-center">
                        {typeof formData.aadharCard === 'string' ? (
                          formData.aadharCard.endsWith('.pdf') ? (
                            <iframe
                              src={formData.aadharCard}
                              title="Aadhar PDF"
                              className="w-full h-48 border rounded"
                            />
                          ) : (
                            <img
                              src={formData.aadharCard}
                              alt="Aadhar Preview"
                              className="mx-auto rounded-md shadow-md h-32 object-cover"
                            />
                          )
                        ) : formData.aadharCard.type.includes('pdf') ? (
                          <iframe
                            src={URL.createObjectURL(formData.aadharCard)}
                            title="Aadhar PDF"
                            className="w-full h-48 border rounded"
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(formData.aadharCard)}
                            alt="Aadhar Preview"
                            className="mx-auto rounded-md shadow-md h-32 object-cover"
                          />
                        )}
                      </div>
                    )}
                    {errors.aadharCard && (
                      <p className="mt-1 text-sm text-red-600 text-center">{errors.aadharCard}</p>
                    )}

                  </div>
                </div>


                {/* Profile Picture Upload */}
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png"
                      disabled={!editMode}
                      className="hidden"
                      id="profilePic"
                    />
                    <label
                      htmlFor="profilePic"
                      className={`w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center ${editMode ? 'border-gray-300 hover:border-blue-400' : 'border-gray-200 cursor-not-allowed'
                        }`}
                    >
                      <div className="text-center">
                        <Camera className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600">
                          {formData.profilePic && typeof formData.profilePic !== 'string'
                            ? formData.profilePic.name
                            : 'Upload Profile Picture'}
                        </p>
                      </div>
                    </label>

                    {/* Image Preview */}
                    {formData.profilePic && (
                      <div className="mt-3 text-center">
                        <img
                          src={
                            typeof formData.profilePic === 'string'
                              ? formData.profilePic
                              : URL.createObjectURL(formData.profilePic)
                          }
                          alt="Profile Preview"
                          className="mx-auto rounded-md shadow-md h-32 object-cover"
                        />
                      </div>
                    )}
                    {errors.profilePic && (
                      <p className="mt-1 text-sm text-red-600 text-center">{errors.profilePic}</p>
                    )}

                  </div>
                </div>

              </div> 

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 active:scale-95'
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                    >
                      {/* {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : ( */}
                      <div className="flex items-center justify-center">
                        <Save size={20} className="mr-2" />
                        Save Profile
                      </div>
                      {/* )} */}
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdate}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      {/* {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : ( */}
                      <div className="flex items-center justify-center">
                        <Edit size={20} className="mr-2" />
                        Update Profile
                      </div>
                      {/* )}  */}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-center">
                      <Edit size={20} className="mr-2" />
                      Edit Profile
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              HIPAA Compliant
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              Secure Storage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorProfile;