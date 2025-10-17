import React, { useState, useEffect } from 'react';
import { AdminUser, View } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
  onSave: (updatedUser: AdminUser) => void;
}

const allViews: View[] = [
  'overview',
  'order',
  'service',
  'branches',
  'admin_access',
  'customer_data',
  'finance',
  'talent_data',
  'setting',
];

const PermissionsModal: React.FC<PermissionsModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [permissions, setPermissions] = useState<Partial<Record<View, boolean>>>({});

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions);
    }
  }, [user]);

  const handleToggle = (view: View) => {
    setPermissions(prev => ({
      ...prev,
      [view]: !prev[view],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, permissions });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Edit Permissions for {user.name}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {allViews.map(view => (
              <label key={view} htmlFor={`perm-toggle-${view}`} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-200 capitalize">{view.replace('_', ' ')}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`perm-toggle-${view}`}
                    className="sr-only"
                    checked={!!permissions[view]}
                    onChange={() => handleToggle(view)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition ${permissions[view] ? 'bg-positive' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${permissions[view] ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            ))}
          </div>
          <div className="p-5 border-t border-gray-700 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-primary hover:bg-opacity-90 transition">Save Permissions</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionsModal;
