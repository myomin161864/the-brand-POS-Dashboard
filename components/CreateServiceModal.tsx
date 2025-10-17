import React, { useState, useEffect } from 'react';
import { Service } from '../types';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (newService: Service) => void;
  existingServices: Service[];
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ isOpen, onClose, onAddService, existingServices }) => {
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [errors, setErrors] = useState({ name: '', serviceId: '' });

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setName('');
      setServiceId('');
      setErrors({ name: '', serviceId: '' });
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = { name: '', serviceId: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Service name is required';
      isValid = false;
    }
    if (!serviceId.trim()) {
      newErrors.serviceId = 'ID is required';
      isValid = false;
    } else if (existingServices.some(s => s.serviceId.toLowerCase() === serviceId.trim().toLowerCase())) {
      newErrors.serviceId = 'This ID already exists';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newService: Service = {
        id: Math.max(0, ...existingServices.map(s => s.id)) + 1,
        name: name.trim(),
        serviceId: serviceId.trim(),
      };
      onAddService(newService);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Create New Service</h3>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="service-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input id="service-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full p-2 bg-gray-700 border ${errors.name ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200`} />
              {errors.name && <p className="text-negative text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="service-id" className="block text-sm font-medium text-gray-300 mb-1">ID</label>
              <input id="service-id" type="text" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={`w-full p-2 bg-gray-700 border ${errors.serviceId ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200`} />
              {errors.serviceId && <p className="text-negative text-xs mt-1">{errors.serviceId}</p>}
            </div>
          </div>
          <div className="p-5 border-t border-gray-700 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-primary hover:bg-opacity-90 transition">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;