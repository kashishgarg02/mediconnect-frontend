import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Mail, Search, Edit, Trash2, Building, Calendar,
    Box, Hash, FileText, AlertCircle, CheckCircle, Loader, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react';
import { server_url } from '../config/url';


function MedicineList() {
    const navigate = useNavigate();
    const [searchEmail, setSearchEmail] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [editFormData,

    ] = useState({});
    const [equipments, setEquipments] = useState([]);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const packingTypes = [
        'Tablets', 'Capsules', 'Syrup', 'Injection', 'Drops',
        'Cream/Ointment', 'Powder', 'Inhaler', 'Other'
    ];

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setSearchEmail(storedEmail);
            // Don't auto-trigger search, let user click the button
        }
    }, []);

    const handleSearch = async () => {
    if (!searchEmail.trim()) {
        setError('Please enter an email address');
        return;
    }

    setLoading(true);
    setSearchPerformed(true);
    setError('');

    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(server_url+"/donor/medicinesbyemail", {
            email: searchEmail
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = response.data;

        if (data.status) {
            setMedicines(data.medicines || []);
            setEquipments(data.equipments || []);
            setError('');
        } else {
            setMedicines([]);
            setEquipments([]);
            setError(data.msg || 'No data found for this email');
        }

    } catch (error) {
        console.error('Error fetching medicines:', error);
        setError('Failed to fetch medicines. Please try again later.');
        setMedicines([]);
        setEquipments([]);
    } finally {
        setLoading(false);
    }
};


    const handleSaveEdit = async (medicineId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(server_url+"/donor/medicineupdate", {
            email: searchEmail, // 🔥 REQUIRED FOR YOUR CURRENT BACKEND
            ...editFormData
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = response.data;

        if (data.status) {
            setMedicines((prev) =>
                prev.map((med) =>
                    med._id === medicineId ? { ...med, ...editFormData } : med
                )
            );
            setEditingMedicine(null);
            setEditFormData({});
            alert("Medicine updated successfully!");
        } else {
            alert(data.msg || "Update failed");
        }
    } catch (error) {
        console.error("Error updating medicine:", error);
        alert("Server error while updating.");
    }
};

    const handleEdit = (medicine) => {
        setEditingMedicine(medicine._id);
        setEditFormData({
            medicine: medicine.medicine || medicine.medicineName || '',
            company: medicine.company || '',
            expiryDate: medicine.expiryDate ? medicine.expiryDate.slice(0, 10) : '',
            packingType: medicine.packingType || medicine.packagingType || '',
            quantity: medicine.quantity || '',
            otherInfo: medicine.otherInfo || ''
        });

    };

    const handleDelete = async (item, type) => {
        try {
            const token = localStorage.getItem("token");

            // Determine the endpoint based on type
            const endpoint = type === 'medicine' ?
                server_url+'/donor/delmedicines' :
                server_url+'/donor/delequipments';

            const response = await axios.post(endpoint, {
                id: item._id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = response.data;

            if (data.status) {
                // Remove deleted item from state based on type
                if (type === 'medicine') {
                    setMedicines((prev) => prev.filter((med) => med._id !== item._id));
                } else {
                    setEquipments((prev) => prev.filter((eq) => eq._id !== item._id));
                }
                setShowDeleteModal(null); // Close modal
                alert(`${type === 'medicine' ? 'Medicine' : 'Equipment'} deleted successfully!`);
            } else {
                setError(data.msg || `Failed to delete ${type}.`);
            }
        } catch (err) {
            console.error('Error deleting:', err);
            setError(`An error occurred while deleting the ${type}.`);
        }
    };

    const handleCancelEdit = () => {
        setEditingMedicine(null);
        setEditFormData({});
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Medicine Inventory</h1>
                    <p className="text-gray-600">Search and manage donated medicines</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search by Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    readOnly
                                    placeholder="Enter email address"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin mr-2" size={20} />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2" size={20} />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <div className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {searchPerformed && (
                    <div className="space-y-4">
                        {medicines.length === 0 && equipments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-700 mb-2">No Medicines or Equipment Found</h3>
                                <p className="text-gray-500">No items are associated with this email address.</p>
                            </div>
                        ) : (
                            <>
                                {medicines.length > 0 && (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                Found {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} for: {searchEmail}
                                            </h2>
                                            <div className="flex items-center text-green-600">
                                                <CheckCircle size={20} className="mr-1" />
                                                <span className="text-sm font-medium">Active Donations</span>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {medicines.map((medicine, index) => (
                                                <div key={medicine._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
                                                    <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 flex items-center justify-between">
                                                        <h3 className="text-white font-bold text-lg truncate">
                                                            {index + 1}. {medicine.medicineName || medicine.medicine}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(medicine)}
                                                                className="text-white hover:text-yellow-200 p-1 rounded-full"
                                                                title="Edit"
                                                            >
                                                                <Edit size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowDeleteModal({ item: medicine, type: 'medicine' })}
                                                                className="text-white hover:text-red-300 p-1 rounded-full"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        {editingMedicine === medicine._id ? (
                                                            <div className="space-y-3">
                                                                <input type="text" name="medicine" value={editFormData.medicine || ''} onChange={handleEditInputChange} />
                                                                <input type="text" name="company" value={editFormData.company || ''} onChange={handleEditInputChange} />
                                                                <input type="date" name="expiryDate" value={editFormData.expiryDate || ''} onChange={handleEditInputChange} />
                                                                <select name="packingType" value={editFormData.packingType || ''} onChange={handleEditInputChange}>
                                                                    {packingTypes.map(type => (
                                                                        <option key={type} value={type}>{type}</option>
                                                                    ))}
                                                                </select>
                                                                <input type="number" name="quantity" value={editFormData.quantity || ''} onChange={handleEditInputChange} />
                                                                <textarea name="otherInfo" value={editFormData.otherInfo || ''} onChange={handleEditInputChange}></textarea>

                                                                <div className="flex justify-end space-x-2">
                                                                    <button onClick={() => handleSaveEdit(medicine._id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                                                                    <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1 text-sm text-gray-700">
                                                                <div><Building className="inline mr-1" size={14} /> Company: {medicine.company}</div>
                                                                <div><Calendar className="inline mr-1" size={14} /> Expiry: {formatDate(medicine.expiryDate)}</div>
                                                                <div><Box className="inline mr-1" size={14} /> Packing: {medicine.packingType}</div>
                                                                <div><Hash className="inline mr-1" size={14} /> Quantity: {medicine.quantity}</div>
                                                                {medicine.otherInfo && (
                                                                    <div><FileText className="inline mr-1" size={14} /> Info: {medicine.otherInfo}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {equipments.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 mt-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800">Available Equipment</h2>
                                            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                                                {equipments.length} Found
                                            </span>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {equipments.map((equipment, index) => (
                                                <div key={equipment._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
                                                    <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 flex items-center justify-between">
                                                        <h3 className="text-white font-bold text-lg truncate">
                                                            {index + 1}. {equipment.equipmentName}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => setShowDeleteModal({ item: equipment, type: 'equipment' })}
                                                                className="text-white hover:text-red-300 p-1 rounded-full"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 space-y-1 text-sm text-gray-700">
                                                        <div><Building className="inline mr-1" size={14} /> Manufacturer: {equipment.manufacturer}</div>
                                                        <div><Package className="inline mr-1" size={14} /> Condition: {equipment.condition}</div>
                                                        <div><Hash className="inline mr-1" size={14} /> Model: {equipment.model}</div>
                                                        {equipment.otherInfo && (
                                                            <div><FileText className="inline mr-1" size={14} /> Info: {equipment.otherInfo}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                    <Trash2 className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Delete {showDeleteModal.type === 'medicine' ? 'Medicine' : 'Equipment'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete "{
                                        showDeleteModal.type === 'medicine'
                                            ? (showDeleteModal.item.medicineName || showDeleteModal.item.medicine)
                                            : showDeleteModal.item.equipmentName
                                    }"? This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(null)}
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(showDeleteModal.item, showDeleteModal.type)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                    >
                                        Delete
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

export default MedicineList;