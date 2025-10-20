import React, { useState, useMemo } from 'react';
import { AdminUser, UserStatus } from '../types';
import CreateAdminUserModal from './CreateAdminUserModal';
import EditAdminUserModal from './EditAdminUserModal';
import PermissionsModal from './PermissionsModal';
import Card from './Card';
import { UserPlusIcon, SearchIcon, PencilIcon, TrashIcon, SettingIcon } from './Icons';

interface AdminAccessProps {
  users: AdminUser[];
  onAddUser: (newUser: AdminUser) => void;
  onUpdateUser: (updatedUser: AdminUser) => void;
  onDeleteUser: (userId: number) => void;
}

const AdminAccess: React.FC<AdminAccessProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<AdminUser | null>(null);


  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowercasedFilter) ||
      user.email.toLowerCase().includes(lowercasedFilter) ||
      user.role.toLowerCase().includes(lowercasedFilter)
    );
  }, [users, searchTerm]);

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        onDeleteUser(userId);
    }
  }

  const handleStatusToggle = (user: AdminUser) => {
    const newStatus: UserStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    onUpdateUser({ ...user, status: newStatus });
  };
  
  // const renderDisplayId = (user: AdminUser) => {
  //   if (user.display_id != null) return String(user.display_id);
  //   // fallback: if id is a UUID string, show first 8 chars; otherwise stringify
  //   if (typeof user.id === 'string') return user.id.length > 8 ? user.id.slice(0, 8) : user.id;
  //   return String(user.id);
  // };
  
  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-white">Admin Access Control</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Users">
                <p className="text-4xl font-bold text-gray-100">{users.length}</p>
            </Card>
            <Card title="Active Users">
                <p className="text-4xl font-bold text-positive">{users.filter(u => u.status === 'Active').length}</p>
            </Card>
            <Card title="Inactive Users">
                <p className="text-4xl font-bold text-gray-400">{users.filter(u => u.status === 'Inactive').length}</p>
            </Card>
        </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
            <input
                type="text"
                placeholder="Search for (name/email/role)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all w-full md:w-auto"
            >
            <UserPlusIcon className="w-5 h-5" />
            Create new user
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Password</th>
                <th scope="col" className="px-6 py-3">Joined Date</th>
                <th scope="col" className="px-6 py-3">Last Login</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{user.display_id}</th>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{user.name}</th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">********</td>
                  <td className="px-6 py-4">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4">
                    <label htmlFor={`status-toggle-${user.id}`} className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`status-toggle-${user.id}`}
                          className="sr-only"
                          checked={user.status === 'Active'}
                          onChange={() => handleStatusToggle(user)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition ${user.status === 'Active' ? 'bg-positive' : 'bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${user.status === 'Active' ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <div className="ml-3 text-sm font-medium">
                        {user.status}
                      </div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-4">
                        <button onClick={() => setEditingUser(user)} className="text-gray-400 hover:text-brand-primary transition" title="Edit User">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setPermissionsUser(user)} className="text-gray-400 hover:text-brand-primary transition" title="Permissions">
                            <SettingIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-negative transition" title="Delete User">
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
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 py-10">
            <p>No users found.</p>
        </div>
      )}

      <CreateAdminUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAddUser={onAddUser}
        existingUsers={users}
      />
      {editingUser && (
        <EditAdminUserModal
            isOpen={!!editingUser}
            onClose={() => setEditingUser(null)}
            onUpdateUser={onUpdateUser}
            userToEdit={editingUser}
        />
      )}
      {permissionsUser && (
        <PermissionsModal
            isOpen={!!permissionsUser}
            onClose={() => setPermissionsUser(null)}
            user={permissionsUser}
            onSave={onUpdateUser}
        />
      )}
    </div>
  );
};

export default AdminAccess;