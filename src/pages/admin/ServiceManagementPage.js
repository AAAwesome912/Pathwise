import React, { useState, useEffect } from 'react';
import { PlusCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosInstance';

// The EditServiceModal component with axios API calls.
const EditServiceModal = ({ service, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        service_name: service.service_name,
        office_name: service.office_name,
        is_active: service.is_active === 1,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                service_name: formData.service_name,
                office_name: formData.office_name,
                is_active: formData.is_active ? 1 : 0,
            };

            await axios.put(`/api/services/${service.id}`, payload);
            
            toast.success('Service updated successfully!');
            onSave(service.id, payload);
            onClose();
        } catch (err) {
            console.error('Error updating service:', err);
            const errorMsg = err.response?.data?.message || 'Failed to update service.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Edit Service</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <XCircle size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="service_name" className="block text-sm font-medium text-gray-700">Service Name</label>
                        <input
                            type="text"
                            id="service_name"
                            name="service_name"
                            value={formData.service_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="office_name" className="block text-sm font-medium text-gray-700">Assigned Office</label>
                        <input
                            type="text"
                            id="office_name"
                            name="office_name"
                            value={formData.office_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">Active</label>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// The new AddServiceModal component with axios API calls.
const AddServiceModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        service_name: '',
        office_name: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                service_name: formData.service_name,
                office_name: formData.office_name,
                is_active: formData.is_active ? 1 : 0,
            };

            const response = await axios.post('/api/services', payload);
            
            // The backend is now correctly returning the ID in the response.
            // We need to construct the full new service object to add to our state.
            const newService = {
                id: response.data.id, // The backend now provides the ID.
                service_name: payload.service_name,
                office_name: payload.office_name,
                is_active: payload.is_active
            };
            
            toast.success('Service added successfully!');
            onSave(newService);
            onClose();
        } catch (err) {
            console.error('Error adding service:', err);
            const errorMsg = err.response?.data?.message || 'Failed to add service.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Add New Service</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <XCircle size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="service_name" className="block text-sm font-medium text-gray-700">Service Name</label>
                        <input
                            type="text"
                            id="service_name"
                            name="service_name"
                            value={formData.service_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="office_name" className="block text-sm font-medium text-gray-700">Assigned Office</label>
                        <input
                            type="text"
                            id="office_name"
                            name="office_name"
                            value={formData.office_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">Active</label>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition"
                        >
                            {loading ? 'Adding...' : 'Add Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main component
const ServiceManagementPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    
    // 💡 This is the crucial fix: set the Authorization header for all future requests
    useEffect(() => {
        // You would typically get this token from a user context or local storage after login
        const token = localStorage.getItem('token'); 
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            // The request now automatically includes the Authorization header
            const response = await axios.get('/api/services/all');
            
            setServices(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching services:', err);
            const errorMsg = err.response?.data?.message || 'Failed to fetch services. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (serviceId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            await axios.put(`/api/services/${serviceId}`, { is_active: newStatus ? 1 : 0 });
            
            setServices(prevServices =>
                prevServices.map(service =>
                    service.id === serviceId ? { ...service, is_active: newStatus ? 1 : 0 } : service
                )
            );
        } catch (err) {
            console.error('Error updating service status:', err);
            const errorMsg = err.response?.data?.message || 'Failed to update service status.';
            setError(errorMsg);
            fetchServices(); // Re-fetch data on failure to sync
        }
    };

    const handleEditClick = (service) => {
        setEditingService(service);
        setIsEditModalOpen(true);
    };

    const handleAddNewClick = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingService(null);
        setIsEditModalOpen(false);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleSaveEditModal = (updatedId, updatedData) => {
        setServices(prevServices =>
            prevServices.map(service =>
                service.id === updatedId ? { ...service, ...updatedData } : service
            )
        );
    };

    // This function is updated to correctly handle the new service object.
    const handleSaveAddModal = (newService) => {
        setServices(prevServices => [...prevServices, newService]);
    };

    if (loading) {
        return <div className="text-center p-8">Loading services...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            {/* The style block for the toggle switch */}
            <style>
                {`
                .toggle-container .block {
                    background-color: #6B7280;
                }
                .toggle-container input:checked ~ .block {
                    background-color: #10B981;
                }
                .toggle-container input:checked ~ .dot {
                    transform: translateX(1.5rem);
                }
                `}
            </style>
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
                <button
                    onClick={handleAddNewClick}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150"
                >
                    <PlusCircle size={20} className="mr-2" /> Add New Service
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">ID</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Service Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Assigned Office</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {services.length > 0 ? (
                            services.map(service => (
                                <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">{service.id}</td>
                                    <td className="py-3 px-4">{service.service_name}</td>
                                    <td className="py-3 px-4">{service.office_name}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleEditClick(service)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <label htmlFor={`toggle-${service.id}`} className="flex items-center cursor-pointer toggle-container">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id={`toggle-${service.id}`}
                                                    className="sr-only"
                                                    checked={service.is_active === 1}
                                                    onChange={() => handleToggleActive(service.id, service.is_active === 1)}
                                                />
                                                <div className="block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out"></div>
                                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out"></div>
                                            </div>
                                            <div className="ml-3 text-gray-700 font-medium">
                                                {service.is_active === 1 ? 'Active' : 'Inactive'}
                                            </div>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">No services found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <button
                onClick={() => navigate('/admin')}
                className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
            >
                Back to Dashboard
            </button>

            {/* Render the modals conditionally */}
            {isEditModalOpen && editingService && (
                <EditServiceModal
                    service={editingService}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEditModal}
                />
            )}
            {isAddModalOpen && (
                <AddServiceModal
                    onClose={handleCloseAddModal}
                    onSave={handleSaveAddModal}
                />
            )}
        </div>
    );
};

export default ServiceManagementPage;
