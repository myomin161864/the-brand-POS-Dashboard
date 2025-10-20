import React, { useState, useEffect } from 'react';
import type { AdminUser, AdminRole, UserStatus } from '../types';

interface EditAdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: AdminUser) => Promise<void> | void;
  userToEdit: AdminUser;
}

// Choose roles set that matches your DB constraint:
const roles: AdminRole[] = ['Owner', 'Manager', 'Staff'];
// Or expanded:
// const roles: AdminRole[] = ['Owner', 'Manager', 'Staff', 'Founder', 'Customer Service Executive', 'Supervisor'];

const EditAdminUserModal: React.FC<EditAdminUserModalProps> = ({ isOpen, onClose, onUpdateUser, userToEdit }) => {
  const [name, setName] = useState(userToEdit?.name ?? '');
  const [email, setEmail] = useState(userToEdit?.email ?? '');
  const [role, setRole] = useState<AdminRole>(userToEdit?.role ?? 'Staff');
  const [status, setStatus] = useState<UserStatus>(userToEdit?.status ?? 'Active');
  const [errors, setErrors] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role as AdminRole);
      setStatus(userToEdit.status as UserStatus);
    }
  }, [userToEdit]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({ name: '', email: '' });
      setSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;
    if (!name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
    if (!email.trim()) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Email is invalid'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const updatedUser: AdminUser = {
        ...userToEdit,
        name,
        email,
        role,
        status
      };
      await onUpdateUser(updatedUser);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
        <h3 className="text-xl font-bold text-gray-100">Edit Admin</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full p-2 bg-gray-700 border ${errors.name ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full p-2 bg-gray-700 border ${errors.email ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as AdminRole)}
                className="w-full p-2 bg-gray-700 border border-gray-600 
                rounded-lg text-gray-200 focus:ring-2 
                focus:ring-brand-primary focus:border-transparent transition">
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as UserStatus)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm mb-1">Password (optional)</label>
                <button
                  type="button"
                  className="text-xs underline text-gray-300"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.password ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
                placeholder="Leave blank to send invite"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div> */}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500">
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default EditAdminUserModal;