import React, { useState, useEffect } from 'react';
import { Customer, Branch } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (newCustomer: Customer) => void;
  existingCustomers: Customer[];
}

const branches: Branch[] = ['The Idea Plat', 'The Advisor Plat', 'The Consultant Plat'];
const branchPrefixes: Record<Branch, string> = {
  'The Idea Plat': 'TBI',
  'The Advisor Plat': 'TBA',
  'The Consultant Plat': 'TBC',
};

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ isOpen, onClose, onAddCustomer, existingCustomers }) => {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState<Branch>(branches[0]);
  const [generatedId, setGeneratedId] = useState('');
  const [contact, setContact] = useState('');
  const [pages, setPages] = useState<string[]>(['']);
  const [errors, setErrors] = useState({ name: '', contact: '' });

  useEffect(() => {
    if (isOpen) {
        const prefix = branchPrefixes[branch];
        const branchCustomers = existingCustomers.filter(c => c.branch === branch);
        const nextIdNumber = branchCustomers.length + 1;
        const paddedId = String(nextIdNumber).padStart(4, '0');
        setGeneratedId(`${prefix}${paddedId}`);
    }
  }, [isOpen, branch, existingCustomers]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setName('');
      setBranch(branches[0]);
      setContact('');
      setGeneratedId('');
      setPages(['']);
      setErrors({ name: '', contact: '' });
    }
  }, [isOpen]);

  const handlePageChange = (index: number, value: string) => {
    const newPages = [...pages];
    newPages[index] = value;
    setPages(newPages);
  };

  const addPageInput = () => {
    setPages([...pages, '']);
  };

  const removePageInput = (index: number) => {
    if (pages.length > 1) {
      const newPages = pages.filter((_, i) => i !== index);
      setPages(newPages);
    }
  };

  const validate = () => {
    const newErrors = { name: '', contact: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!contact.trim()) {
      newErrors.contact = 'Contact is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newCustomer: Customer = {
        id: generatedId,
        name,
        branch,
        contact,
        joinedDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalDollar: 0,
        discountRate: '0%',
        pages: pages.filter(p => p.trim() !== ''),
      };
      onAddCustomer(newCustomer);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Create new</h3>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Names</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.name ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
              />
              {errors.name && <p className="text-negative text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value as Branch)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              >
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-1">ID</label>
              <input
                id="id"
                type="text"
                value={generatedId}
                readOnly
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">Contact</label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.contact ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
              />
               {errors.contact && <p className="text-negative text-xs mt-1">{errors.contact}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Pages</label>
              <div className="space-y-2">
                {pages.map((page, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={page}
                      onChange={(e) => handlePageChange(index, e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                      placeholder="e.g., facebook.com/username"
                    />
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePageInput(index)}
                        className="p-2 text-gray-400 hover:text-negative rounded-full hover:bg-gray-600 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPageInput}
                className="flex items-center gap-1 text-sm text-brand-primary hover:opacity-80 transition mt-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add another page
              </button>
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

export default CreateCustomerModal;