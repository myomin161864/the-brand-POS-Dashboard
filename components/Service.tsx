import React, { useState } from 'react';
import { Service } from '../types';
import CreateServiceModal from './CreateServiceModal';
import EditServiceModal from './EditServiceModal';
import { PlusIcon, PencilIcon, TrashIcon } from './Icons';

interface ServiceProps {
  services: Service[];
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: number) => void;
}

const ServiceComponent: React.FC<ServiceProps> = ({ services, onAddService, onUpdateService, onDeleteService }) => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleDelete = (serviceId: number) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            onDeleteService(serviceId);
        }
    }
  
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Services</h2>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                    >
                    <PlusIcon className="w-5 h-5" />
                    Create
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {services.map((service) => (
                        <tr key={service.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{service.name}</th>
                            <td className="px-6 py-4">{service.serviceId}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={() => setEditingService(service)} className="text-gray-400 hover:text-brand-primary transition" title="Edit Service">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-negative transition" title="Delete Service">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            {services.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    <p>No services found.</p>
                </div>
            )}

            <CreateServiceModal 
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onAddService={onAddService}
                existingServices={services}
            />
            {editingService && (
                <EditServiceModal
                    isOpen={!!editingService}
                    onClose={() => setEditingService(null)}
                    onUpdateService={onUpdateService}
                    serviceToEdit={editingService}
                />
            )}
        </div>
    );
};

export default ServiceComponent;