import React, { useState } from 'react';
import { MapPin, Pill, Search, Plus, Heart, Stethoscope, User, Phone, Mail, Calendar, Package } from 'lucide-react';
import { server_url } from '../config/url';

function MedicineFinder() {
    const [searchData, setSearchData] = useState({
        city: '',
        medicineName: ''
    });

    const [medicines, setMedicines] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingDonor, setIsLoadingDonor] = useState(false);
    const [errors, setErrors] = useState({});
    const [showDonorModal, setShowDonorModal] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};

        if (!searchData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!searchData.medicineName.trim()) {
            newErrors.medicineName = 'Medicine name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = async () => {
        if (!searchData.city.trim() || !searchData.medicineName.trim()) {
            return setErrors({
                city: !searchData.city.trim() ? 'City required' : '',
                medicineName: !searchData.medicineName.trim() ? 'Medicine required' : ''
            });
        }

        setIsSearching(true);
        setMedicines([]);
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(server_url+'/needy/find-meds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',"authorization": `Bearer ${token}` },
                body: JSON.stringify(searchData)
            });
            const data = await res.json();
            if (data.status) {
                setMedicines(data.medicines);
                if (!data.medicines.length) alert('No matches found');
            } else {
                alert(data.msg);
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


    const closeDonorModal = () => {
        setShowDonorModal(false);
        setSelectedDonor(null);
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

            <div className="relative max-w-6xl mx-auto">
                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-white rounded-full p-3">
                                <Search className="text-blue-600" size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Medicine Finder</h1>
                        <p className="text-blue-100 text-sm">Find available medicines in your city</p>
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
                                        value={searchData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
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

                            {/* Medicine Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medicine Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Pill className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="medicineName"
                                        value={searchData.medicineName}
                                        onChange={handleInputChange}
                                        placeholder="Enter medicine name"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.medicineName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.medicineName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.medicineName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-6">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${isSearching
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
                                        Find Now
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Medicine Cards */}
                {medicines.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {medicines.map((medicine, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="bg-gradient-to-r from-blue-100 to-green-100 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-white rounded-full p-2">
                                            <Pill className="text-blue-600" size={24} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                                            Available
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{medicine.medicine}</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <Package className="mr-2" size={16} />
                                            <span className="text-sm">company: {medicine.company}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="mr-2" size={16} />
                                            <span className="text-sm">Expires: {medicine.expiryDate}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="mr-2" size={16} />
                                            <span className="text-sm">City: {medicine.city}</span>
                                        </div>
                                    </div>

                                    {medicine.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {medicine.description}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => getDonorDetails(medicine.email)}
                                        disabled={isLoadingDonor}
                                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
                                    >
                                        {isLoadingDonor ? 'Loading...' : 'More Details'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Donor Details Modal */}
                {showDonorModal && selectedDonor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="bg-white rounded-full p-3">
                                        <User className="text-blue-600" size={24} />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white">Donor Details</h2>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {selectedDonor.profilePic && (
                                        <div className="flex justify-center mb-4">
                                            <img
                                                src={selectedDonor.profilePic}
                                                alt="Donor Profile"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
                                            />
                                        </div>
                                    )}


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
                                            <p className="font-medium">{selectedDonor.contactNo}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <MapPin className="text-gray-400 mr-3" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium">{selectedDonor.address}</p>
                                        </div>
                                    </div>

                                    {selectedDonor.additionalInfo && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">occupation</p>
                                            <p className="font-medium">{selectedDonor.occupation}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex space-x-3">
                                    <button
                                        onClick={closeDonorModal}
                                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => window.open(`tel:${selectedDonor.contactNo}`, '_self')}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                                    >
                                        Call Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MedicineFinder;