import React, { useState, useEffect } from 'react';
import { BranchInfo } from '../types';

interface CreateBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBranch: (newBranch: BranchInfo) => void;
  existingBranches: BranchInfo[];
}

const CreateBranchModal: React.FC<CreateBranchModalProps> = ({ isOpen, onClose, onAddBranch, existingBranches }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState({ name: '', link: '' });

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setName('');
      setLink('');
      setErrors({ name: '', link: '' });
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = { name: '', link: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Branch name is required';
      isValid = false;
    }
    if (!link.trim()) {
      newErrors.link = 'Link is required';
      isValid = false;
    } else {
        try {
            new URL(link);
        } catch (_) {
            newErrors.link = 'Please enter a valid URL';
            isValid = false;
        }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newBranch: BranchInfo = {
        id: Math.max(0, ...existingBranches.map(b => b.id)) + 1,
        name,
        link,
      };
      onAddBranch(newBranch);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Create Branch</h3>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 space-y-4">
            <div>
              <label htmlFor="branch-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                id="branch-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.name ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200`}
                placeholder="e.g., Main Branch"
              />
              {errors.name && <p className="text-negative text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">Link</label>
              <input
                id="link" type="text" value={link} onChange={(e) => setLink(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.link ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200`}
                placeholder="e.g., https://example.com/branch"
              />
              {errors.link && <p className="text-negative text-xs mt-1">{errors.link}</p>}
            </div>
          </div>
          <div className="p-5 border-t border-gray-700 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-primary hover:bg-opacity-90">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBranchModal;