import React, { useState } from 'react';
import { Customer } from '../types';
import { Search, MapPin, Phone, Mail, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Customers: React.FC = () => {
  const { customers, orders } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Helper to get stats for a customer
  const getCustomerStats = (email: string) => {
    const customerOrders = orders.filter(o => o.customerEmail === email);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = customerOrders.length;
    const lastOrderDate = customerOrders.length > 0 
      ? customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date 
      : 'N/A';
    return { totalSpent, orderCount, customerOrders, lastOrderDate };
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500">Manage customer relationships and view histories.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const stats = getCustomerStats(customer.email);
                return (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{customer.name}</div>
                          <div className="text-xs text-slate-400">Joined {customer.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                         <span className="flex items-center mb-1"><Mail className="w-3 h-3 mr-1.5 text-slate-400"/> {customer.email}</span>
                         <span className="flex items-center"><Phone className="w-3 h-3 mr-1.5 text-slate-400"/> {customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{customer.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{stats.orderCount}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">₹{stats.totalSpent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-primary-600 hover:text-primary-800 font-medium text-xs border border-primary-200 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                 <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                       No customers found.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                 <div className="w-16 h-16 rounded-full bg-white border border-slate-200 p-1 shadow-sm">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                       {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                      <span className={`w-2 h-2 rounded-full mr-2 ${selectedCustomer.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                      Customer ID: {selectedCustomer.id}
                    </p>
                 </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Contact Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                   <div className="space-y-3">
                      <div className="flex items-start">
                        <Mail className="w-4 h-4 text-slate-400 mt-0.5 mr-3" />
                        <span className="text-sm text-slate-700">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-4 h-4 text-slate-400 mt-0.5 mr-3" />
                        <span className="text-sm text-slate-700">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 mr-3" />
                        <span className="text-sm text-slate-700">{selectedCustomer.location}</span>
                      </div>
                   </div>
                </div>

                {/* Metrics Card */}
                {(() => {
                    const stats = getCustomerStats(selectedCustomer.email);
                    return (
                      <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Customer Overview</h3>
                         <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                               <p className="text-xs text-indigo-600 font-medium mb-1">Total Spent</p>
                               <p className="text-lg font-bold text-indigo-900">₹{stats.totalSpent.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                               <p className="text-xs text-emerald-600 font-medium mb-1">Total Orders</p>
                               <p className="text-lg font-bold text-emerald-900">{stats.orderCount}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                               <p className="text-xs text-purple-600 font-medium mb-1">Last Order</p>
                               <p className="text-lg font-bold text-purple-900">{stats.lastOrderDate}</p>
                            </div>
                         </div>
                      </div>
                    );
                })()}
              </div>

              {/* Order History Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Order History</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                       <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                          <tr>
                             <th className="px-6 py-3">Order ID</th>
                             <th className="px-6 py-3">Date</th>
                             <th className="px-6 py-3">Items</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3 text-right">Total</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {getCustomerStats(selectedCustomer.email).customerOrders.map(order => (
                             <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-medium text-slate-900">{order.id}</td>
                                <td className="px-6 py-3">{order.date}</td>
                                <td className="px-6 py-3">{order.items} items</td>
                                <td className="px-6 py-3">
                                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                     ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                       order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                       order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                                       order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                       'bg-slate-100 text-slate-800'}`}>
                                     {order.status}
                                   </span>
                                </td>
                                <td className="px-6 py-3 text-right font-medium">₹{order.total.toFixed(2)}</td>
                             </tr>
                          ))}
                          {getCustomerStats(selectedCustomer.email).customerOrders.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                No orders found for this customer.
                              </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
               <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
               >
                  Close Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};