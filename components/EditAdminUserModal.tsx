import React, { useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types';

interface EditAdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: AdminUser) => void;
  userToEdit: AdminUser;
}

const roles: AdminRole[] = ['Founder', 'Manager', 'Supervisor', 'Customer Service Executive'];

const EditAdminUserModal: React.FC<EditAdminUserModalProps> = ({ isOpen, onClose, onUpdateUser, userToEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Customer Service Executive');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '' });

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setPassword(''); // Clear password field on open
    }
  }, [userToEdit]);
  
  useEffect(() => {
    if (!isOpen) {
      setErrors({ name: '', email: '' });
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
        isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const updatedUser: AdminUser = {
        ...userToEdit,
        name,
        email,
        role,
      };
      if (password) {
        updatedUser.password = password;
      }
      onUpdateUser(updatedUser);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Edit User</h3>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.email ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
              />
               {errors.email && <p className="text-negative text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="Leave blank to keep current"
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
              />
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

export default EditAdminUserModal;