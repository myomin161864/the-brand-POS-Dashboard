import React, { useState, useEffect } from 'react';
import type { AdminRole, UserStatus } from '../types';
import { supabase } from '../src/lib/supabase';

interface CreateAdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (payload: {
    name: string;
    email: string;
    role: AdminRole;
    status?: UserStatus;
    auth_user_id?: string | null;
  }) => Promise<void> | void;
}

const roles: AdminRole[] = ['Owner', 'Manager', 'Staff'];

const CreateAdminUserModal: React.FC<CreateAdminUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Staff');
  const [status, setStatus] = useState<UserStatus>('Active');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [errors, setErrors] = useState<{ name: string; email: string; password?: string; confirm?: string }>({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setRole('Staff');
      setStatus('Active');
      setPassword('');
      setConfirm('');
      setShowPwd(false);
      setInviteUrl(null);
      setErrors({ name: '', email: '', password: '', confirm: '' });
      setSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { name: string; email: string; password?: string; confirm?: string } = { name: '', email: '' };
    let isValid = true;

    if (!name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
    if (!email.trim()) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Email is invalid'; isValid = false; }

    // Password is optional: if provided, enforce strength & confirm
    if (password.length > 0) {
      if (password.length < 8) { newErrors.password = 'Password must be at least 8 characters'; isValid = false; }
      if (!/[A-Z]/.test(password)) { newErrors.password = 'Include at least one uppercase letter'; isValid = false; }
      if (!/[a-z]/.test(password)) { newErrors.password = 'Include at least one lowercase letter'; isValid = false; }
      if (!/[0-9]/.test(password)) { newErrors.password = 'Include at least one number'; isValid = false; }
      if (password !== confirm) { newErrors.confirm = 'Passwords do not match'; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setInviteUrl(null);

    try {
      // Get the current admin's JWT (your existing approach)
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('You must be logged in');

      // If password is empty, we will ask the function to generate an invite link
      const send_invite = password.trim().length === 0;

      const res = await fetch(
        // same endpoint you used previously
        'https://ugiqiqztpxzyiczznafp.supabase.co/functions/v1/create-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            role,
            status,
            // if provided, the function will create the user immediately with email_confirm: true
            password: send_invite ? undefined : password,
            // optional toggles; can be omitted
            email_confirm: true,
            send_invite,
            redirect_to: undefined, // put your app's callback if you want
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to create user');

      // Invite path: show URL so you can copy/share
      if (json.invite_url) {
        setInviteUrl(json.invite_url);
      } else {
        // Created-with-password path: call your callback
        onAddUser({
          name,
          email,
          role,
          status,
          auth_user_id: json.auth_user_id ?? null,
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
      // TODO: show toast/snackbar
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-gray-100">Create New User</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.name ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
                placeholder="Jane Doe"
                required
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 bg-gray-700 border ${errors.email ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
                placeholder="jane@yourbrand.com"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                >
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Password (optional) */}
            <div>
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
            </div>

            {/* Confirm Password (shown only when password is provided) */}
            {password.length > 0 && (
              <div>
                <label className="block text-sm mb-1">Confirm Password</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`w-full p-2 bg-gray-700 border ${errors.confirm ? 'border-negative' : 'border-gray-600'} rounded-lg text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition`}
                  placeholder="Repeat password"
                />
                {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
              </div>
            )}

            {/* Invite URL result */}
            {inviteUrl && (
              <div className="mt-2 p-2 bg-gray-700 rounded">
                <p className="text-sm text-gray-200">Invite link generated:</p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    readOnly
                    className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-gray-200"
                    value={inviteUrl}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteUrl);
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-gray-300">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500">
                {submitting ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUserModal;