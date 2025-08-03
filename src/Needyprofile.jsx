import React, { useState, useEffect } from "react";
import { Mail, Phone, User, Calendar, MapPin, Upload, Plus, Heart, Stethoscope, CreditCard } from 'lucide-react';
import { server_url } from '../config/url';

const NeedyForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    contact: "",
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    aadharFront: "",
    aadharBack: "",
  });

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [backDisabled, setBackDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData(prev => ({
        ...prev,
        email: storedEmail
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Contact number validation
    if (name === "contact") {
      const contactRegex = /^[0-9]*$/;
      if (value && !contactRegex.test(value)) {
        setContactError("Contact number should contain only digits");
        return;
      }
      if (value.length > 10) {
        setContactError("Contact number cannot exceed 10 digits");
        return;
      }
      if (value.length > 0 && value.length < 10) {
        setContactError("Contact number should be 10 digits");
      } else {
        setContactError("");
      }
    }

    // Reset submit button state when email changes after a duplicate error
    if (name === "email" && value !== lastSubmittedEmail) {
      setIsSubmitting(false);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function toDateInputValue(date) {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  }

  const handleFetch = async () => {
    if (!formData.email) return alert("Email ID is required");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(server_url+"/needy/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const resp = await response.json();
      console.log("Fetch response:", resp); // Debug

      if (resp.status && resp.data) {
        // Update form data with fetched values
        setFormData(prev => ({
          ...prev,
          fullName: resp.data.fullName || "",
          contact: resp.data.contact || "",
          dob: resp.data.dob ? toDateInputValue(resp.data.dob) : "",
          gender: resp.data.gender || "",
          address: resp.data.address || "",
          aadharFront: resp.data.aadharFront || "",
          aadharBack: resp.data.aadharBack || "",
        }));

        // Set image previews if they exist
        if (resp.data.aadharFront) {
          setFrontPreview(resp.data.aadharFront);
        }
        if (resp.data.aadharBack) {
          setBackPreview(resp.data.aadharBack);
        }

        // Clear contact error if data is fetched successfully
        setContactError("");
        
        alert("Data fetched successfully!");
      } else {
        alert(resp.msg || "No data found for this email");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Fetch failed. Check console for details.");
    }
  };

  const handleFrontUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFrontPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("aadharFront", file);

    // Simulate API call for front upload
    try {
      const response = await fetch(server_url+"/needy/upload-front", {
        method: "POST",
        body: fd,
      });
      const resp = await response.json();

      if (resp.status) {
        const { extracted, imageUrl } = resp;
        setFormData((prev) => ({
          ...prev,
          aadharFront: imageUrl,
          fullName: extracted.fullName || prev.fullName,
          dob: extracted.dob ? toDateInputValue(extracted.dob) : prev.dob,
          gender: extracted.gender || prev.gender,
          address: extracted.address || prev.address,
        }));
        if (extracted.address) setBackDisabled(true);
      } else alert("Aadhaar extraction failed");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleBackUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("aadharBack", file);

    // Simulate API call for back upload
    try {
      const response = await fetch(server_url+"/needy/upload-back", {
        method: "POST",
        body: fd,
      });
      const resp = await response.json();

      if (resp.status) {
        const { extracted, imageUrl } = resp;
        setFormData((prev) => ({
          ...prev,
          aadharBack: imageUrl,
          address: extracted.address || prev.address,
        }));
      } else alert("Back upload failed");
    } catch (err) {
      console.error(err);
      alert("Back upload error");
    }
  };

  const handleSubmit = async () => {
    if (formData.contact && contactError) {
      alert("Please fix the contact number error before submitting");
      return;
    }

    if (!formData.aadharFront || !formData.aadharBack) {
      alert("Please upload both front and back of the Aadhaar card before submitting.");
      return;
    }

    setIsSubmitting(true);
    setLastSubmittedEmail(formData.email);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(server_url+"/needy/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const resp = await response.json();

      if (resp.status) {
        alert("Saved successfully");
        setIsSubmitting(false);
      } else {
        alert(resp.msg);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
      setIsSubmitting(false);
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

      <div className="relative w-full max-w-4xl">
        {/* Main form card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white rounded-full p-3">
                <User className="text-blue-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Needy Profile</h1>
            <p className="text-blue-100 text-sm">Complete your profile information</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <div className="space-y-6">
              {/* Email & Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Enter 10-digit contact number"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${contactError ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                    </div>
                    {contactError && (
                      <p className="text-red-500 text-xs mt-1">{contactError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleFetch}
                    className="ml-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Fetch
                  </button>
                </div>
              </div>

              {/* Aadhaar Upload Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Front Aadhaar */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-blue-700 text-lg mb-4 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Front of Aadhaar Card
                  </h3>

                  <div className="space-y-4">
                    <label
                      htmlFor="front-upload"
                      className="cursor-pointer bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                    >
                      <Upload className="mr-2" size={16} />
                      Choose File
                    </label>
                    <input
                      id="front-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFrontUpload}
                      className="hidden"
                    />

                    {frontPreview && (
                      <div className="mt-4">
                        <img
                          src={frontPreview}
                          alt="Front Aadhaar Preview"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        placeholder="Date of Birth (YYYY-MM-DD)"
                        type="date"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-600"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Back Aadhaar */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-green-700 text-lg mb-4 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Back of Aadhaar Card
                  </h3>

                  <div className="space-y-4">
                    <label
                      htmlFor="back-upload"
                      className={`cursor-pointer ${backDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'} text-white px-4 py-2 rounded-lg inline-flex items-center transition-all duration-200`}
                    >
                      <Upload className="mr-2" size={16} />
                      Choose File
                    </label>
                    <input
                      id="back-upload"
                      type="file"
                      accept="image/*"
                      disabled={backDisabled}
                      onChange={handleBackUpload}
                      className="hidden"
                    />

                    {backPreview && (
                      <div className="mt-4">
                        <img
                          src={backPreview}
                          alt="Back Aadhaar Preview"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none">
                        <MapPin className="text-gray-400" size={20} />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (formData.contact && contactError) ||
                    !formData.aadharFront ||
                    !formData.aadharBack
                  }
                  className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 transform ${isSubmitting ||
                    (formData.contact && contactError) ||
                    !formData.aadharFront ||
                    !formData.aadharBack
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95'
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Send to Server"
                  )}
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
};

export default NeedyForm;