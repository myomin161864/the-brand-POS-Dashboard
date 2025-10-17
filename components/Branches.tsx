import React, { useState } from 'react';
import { BranchInfo } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from './Icons';
import CreateBranchModal from './CreateBranchModal';
import EditBranchModal from './EditBranchModal';

interface BranchesProps {
  branches: BranchInfo[];
  onAddBranch: (newBranch: BranchInfo) => void;
  onUpdateBranch: (updatedBranch: BranchInfo) => void;
  onDeleteBranch: (branchId: number) => void;
}

const Branches: React.FC<BranchesProps> = ({ branches, onAddBranch, onUpdateBranch, onDeleteBranch }) => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<BranchInfo | null>(null);

    const handleDelete = (branchId: number) => {
        if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
            onDeleteBranch(branchId);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Branches</h2>
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
                                <th scope="col" className="px-6 py-3">Link</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map((branch) => (
                                <tr key={branch.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{branch.name}</th>
                                    <td className="px-6 py-4">
                                        <a href={branch.link} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                                            {branch.link}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => setEditingBranch(branch)} className="text-gray-400 hover:text-brand-primary transition" title="Edit Branch">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(branch.id)} className="text-gray-400 hover:text-negative transition" title="Delete Branch">
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
             {branches.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    <p>No branches found. Click "Create" to add one.</p>
                </div>
            )}


            <CreateBranchModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onAddBranch={onAddBranch}
                existingBranches={branches}
            />

            {editingBranch && (
                <EditBranchModal
                    isOpen={!!editingBranch}
                    onClose={() => setEditingBranch(null)}
                    onUpdateBranch={onUpdateBranch}
                    branchToEdit={editingBranch}
                />
            )}
        </div>
    );
}

export default Branches;