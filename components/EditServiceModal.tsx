import React, { useState, useEffect } from 'react';
import { Service } from '../types';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateService: (updatedService: Service) => void;
  serviceToEdit: Service;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ isOpen, onClose, onUpdateService, serviceToEdit }) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({ name: '' });
  
  useEffect(() => {
    if (serviceToEdit) {
        setName(serviceToEdit.name);
    }
  }, [serviceToEdit]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({ name: '' });
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = { name: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Service name is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const updatedService: Service = {
        ...serviceToEdit,
        name: name.trim(),
      };
      onUpdateService(updatedService);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Edit Service</h3>
        </div>
        <form onSubmit={handleSubmit} noValidate>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="edit-service-id" className="block text-sm font-medium text-gray-300 mb-1">ID</label>
                    <input id="edit-service-id" type="text" value={serviceToEdit.serviceId} readOnly className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                    <label htmlFor="edit-service-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input id="edit-service-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full p-2 bg-gray-700 border ${errors.name ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200`} />
                    {errors.name && <p className="text-negative text-xs mt-1">{errors.name}</p>}
                </div>
            </div>
            <div className="p-5 border-t border-gray-700 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-primary hover:bg-opacity-90 transition">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;