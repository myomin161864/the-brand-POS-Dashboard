import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import CreateCustomerModal from './CreateCustomerModal';
import EditCustomerModal from './EditCustomerModal';
import Card from './Card';
import { UserPlusIcon, SearchIcon, PencilIcon, TrashIcon } from './Icons';

interface CustomerDataProps {
  customers: Customer[];
  onAddCustomer: (newCustomer: Customer) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomerData: React.FC<CustomerDataProps> = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);


  const customerStats = useMemo(() => {
    const ideaPlat = customers.filter(c => c.branch === 'The Idea Plat').length;
    const advisorPlat = customers.filter(c => c.branch === 'The Advisor Plat').length;
    const consultantPlat = customers.filter(c => c.branch === 'The Consultant Plat').length;
    const total = ideaPlat + advisorPlat + consultantPlat;
    return { total, ideaPlat, advisorPlat, consultantPlat };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedFilter = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedFilter) ||
      customer.id.toLowerCase().includes(lowercasedFilter) ||
      customer.branch.toLowerCase().includes(lowercasedFilter)
    );
  }, [customers, searchTerm]);

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        onDeleteCustomer(customerId);
    }
  }
  
  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-white">Customer Data</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Customers">
                <p className="text-4xl font-bold text-gray-100">{customerStats.total}</p>
            </Card>
            <Card title="The Idea Plat">
                <p className="text-4xl font-bold text-gray-100">{customerStats.ideaPlat}</p>
            </Card>
            <Card title="The Advisor Plat">
                <p className="text-4xl font-bold text-gray-100">{customerStats.advisorPlat}</p>
            </Card>
            <Card title="The Consultant Plat">
                <p className="text-4xl font-bold text-gray-100">{customerStats.consultantPlat}</p>
            </Card>
        </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
            <input
                type="text"
                placeholder="Search for (name/id/Branch)..."
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
            Create new
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Branches</th>
                <th scope="col" className="px-6 py-3">Joined Date</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3 text-right">Total Order</th>
                <th scope="col" className="px-6 py-3 text-right">Total Dollar</th>
                <th scope="col" className="px-6 py-3 text-right">Discount Rate</th>
                <th scope="col" className="px-6 py-3">Pages</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{customer.name}</th>
                  <td className="px-6 py-4">{customer.id}</td>
                  <td className="px-6 py-4">{customer.branch}</td>
                  <td className="px-6 py-4">{new Date(customer.joinedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{customer.contact}</td>
                  <td className="px-6 py-4 text-right">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-right font-semibold text-positive">${customer.totalDollar.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">{customer.discountRate}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.pages && customer.pages.map((page, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                          {page}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={() => setEditingCustomer(customer)} className="text-gray-400 hover:text-brand-primary transition" title="Edit Customer">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                         <button onClick={() => handleDelete(customer.id)} className="text-gray-400 hover:text-negative transition" title="Delete Customer">
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
      {filteredCustomers.length === 0 && (
        <div className="text-center text-gray-400 py-10">
            <p>No customers found.</p>
        </div>
      )}

      <CreateCustomerModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAddCustomer={onAddCustomer}
        existingCustomers={customers}
      />
      {editingCustomer && (
        <EditCustomerModal 
            isOpen={!!editingCustomer}
            onClose={() => setEditingCustomer(null)}
            onUpdateCustomer={onUpdateCustomer}
            customerToEdit={editingCustomer}
        />
      )}
    </div>
  );
};

export default CustomerData;