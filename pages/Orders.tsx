import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Mail, Loader2, X, Check, Filter, Plus, Eye, Save } from 'lucide-react';
import { generateCustomerEmail } from '../services/geminiService';
import { useData } from '../context/DataContext';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700 border-green-200',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200',
    Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export const Orders: React.FC = () => {
  const { orders, customers, products, addOrder, addCustomer, getNextOrderId, updateOrderStatus } = useData();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Email Modal State
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [emailContext, setEmailContext] = useState('Delay in shipping due to high demand');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Create Order Modal State
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    paymentMethod: 'Credit Card',
    selectedProductIds: [] as string[],
  });

  // View/Edit Modal State
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [viewOrderData, setViewOrderData] = useState<Order | null>(null);

  // --- AI Email Logic ---
  const handleGenerateEmail = async () => {
    if (!selectedOrder) return;
    setIsGenerating(true);
    const email = await generateCustomerEmail(
      selectedOrder.customerName,
      selectedOrder.id,
      selectedOrder.status,
      emailContext
    );
    setGeneratedEmail(email);
    setIsGenerating(false);
  };

  const openEmailModal = (order: Order) => {
    setSelectedOrder(order);
    setGeneratedEmail('');
    setEmailModalOpen(true);
  };

  // --- Create Order Logic ---
  const handleOpenCreateModal = () => {
    setNewOrderForm({
      customerName: '',
      customerEmail: '',
      paymentMethod: 'Credit Card',
      selectedProductIds: [],
    });
    setCreateModalOpen(true);
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const existingCustomer = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    setNewOrderForm(prev => ({
      ...prev,
      customerName: name,
      customerEmail: existingCustomer ? existingCustomer.email : prev.customerEmail
    }));
  };

  const handleProductToggle = (productId: string) => {
    setNewOrderForm(prev => {
      const current = prev.selectedProductIds;
      if (current.includes(productId)) {
        return { ...prev, selectedProductIds: current.filter(id => id !== productId) };
      } else {
        return { ...prev, selectedProductIds: [...current, productId] };
      }
    });
  };

  const handleCreateOrder = () => {
    if (!newOrderForm.customerName || !newOrderForm.customerEmail || newOrderForm.selectedProductIds.length === 0) {
      alert("Please fill in all required fields and select at least one product.");
      return;
    }

    // 1. Handle Customer (Find or Create)
    const existingCustomer = customers.find(c => c.name.toLowerCase() === newOrderForm.customerName.toLowerCase());
    if (!existingCustomer) {
      addCustomer({
        id: `C-${Date.now()}`,
        name: newOrderForm.customerName,
        email: newOrderForm.customerEmail,
        phone: 'N/A',
        location: 'Unknown',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
    }

    // 2. Calculate Totals
    const selectedProducts = products.filter(p => newOrderForm.selectedProductIds.includes(p.id));
    const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    // 3. Create Order
    const newOrder: Order = {
      id: getNextOrderId(),
      customerName: newOrderForm.customerName,
      customerEmail: newOrderForm.customerEmail,
      date: new Date().toISOString().split('T')[0],
      total: total,
      status: 'Pending',
      items: selectedProducts.length,
      paymentMethod: newOrderForm.paymentMethod
    };

    addOrder(newOrder);
    setCreateModalOpen(false);
  };

  // --- View/Edit Logic ---
  const handleOpenViewModal = (order: Order) => {
    setViewOrderData(order);
    setViewModalOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    if (viewOrderData) {
      const status = newStatus as OrderStatus;
      updateOrderStatus(viewOrderData.id, status);
      setViewOrderData({ ...viewOrderData, status });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500">Manage and track customer orders.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{order.customerName}</div>
                    <div className="text-xs text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">{order.paymentMethod}</td>
                  <td className="px-6 py-4 font-medium">₹{order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-2">
                       <button
                        onClick={() => handleOpenViewModal(order)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                        title="View & Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEmailModal(order)}
                        className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center"
                        title="AI Email Assistant"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Create New Order</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Order ID Preview */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order ID (Auto-generated)</label>
                <div className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-500 font-mono">
                  {getNextOrderId()}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    list="customer-list"
                    value={newOrderForm.customerName}
                    onChange={handleCustomerNameChange}
                    className="w-full bg-white border border-slate-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Search or enter name"
                  />
                  <datalist id="customer-list">
                    {customers.map(c => <option key={c.id} value={c.name} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newOrderForm.customerEmail}
                    onChange={(e) => setNewOrderForm({...newOrderForm, customerEmail: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                 <select
                    value={newOrderForm.paymentMethod}
                    onChange={(e) => setNewOrderForm({...newOrderForm, paymentMethod: e.target.value})}
                    className="w-full bg-white border border-slate-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                 >
                   <option>Credit Card</option>
                   <option>PayPal</option>
                   <option>Stripe</option>
                   <option>Apple Pay</option>
                   <option>Cash on Delivery</option>
                 </select>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Products</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {products.map(product => (
                    <div 
                      key={product.id} 
                      onClick={() => handleProductToggle(product.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
                        newOrderForm.selectedProductIds.includes(product.id) ? 'bg-primary-50 hover:bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
                          newOrderForm.selectedProductIds.includes(product.id) ? 'bg-primary-600 border-primary-600' : 'border-slate-300'
                        }`}>
                          {newOrderForm.selectedProductIds.includes(product.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">₹{product.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right text-sm font-medium text-slate-600">
                   Total: ₹{products.filter(p => newOrderForm.selectedProductIds.includes(p.id)).reduce((s, p) => s + p.price, 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-white">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="px-6 py-2 bg-primary-600 text-white font-medium text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW / EDIT ORDER MODAL */}
      {isViewModalOpen && viewOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                 <h3 className="font-bold text-lg text-slate-800">Order Details</h3>
                 <p className="text-xs text-slate-500">{viewOrderData.id}</p>
               </div>
               <button onClick={() => setViewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-6 h-6" />
               </button>
             </div>

             <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Customer</span>
                    <p className="font-medium text-slate-800">{viewOrderData.customerName}</p>
                    <p className="text-sm text-slate-500">{viewOrderData.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Date</span>
                    <p className="font-medium text-slate-800">{viewOrderData.date}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 uppercase font-semibold mb-2">Order Status</label>
                  <select
                    value={viewOrderData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-slate-600">Items Count</span>
                     <span className="font-medium text-slate-800">{viewOrderData.items}</span>
                   </div>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-slate-600">Payment Method</span>
                     <span className="font-medium text-slate-800">{viewOrderData.paymentMethod}</span>
                   </div>
                   <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                     <span className="text-base font-bold text-slate-800">Total Amount</span>
                     <span className="text-lg font-bold text-primary-600">₹{viewOrderData.total.toFixed(2)}</span>
                   </div>
                </div>
             </div>

             <div className="p-4 border-t border-slate-100 flex justify-end bg-white">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
             </div>
          </div>
        </div>
      )}

      {/* AI Email Modal (Existing Code) */}
      {isEmailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">AI Customer Communication</h3>
                  <p className="text-xs text-slate-500">Drafting email for {selectedOrder.customerName}</p>
                </div>
              </div>
              <button onClick={() => setEmailModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Context / Reason</label>
                  <select
                    value={emailContext}
                    onChange={(e) => setEmailContext(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value="Delay in shipping due to high demand">Shipping Delay</option>
                    <option value="Thank you for your large order">Thank You Note</option>
                    <option value="Issue with payment method, please retry">Payment Issue</option>
                    <option value="Refund has been processed successfully">Refund Confirmation</option>
                    <option value="Order has been shipped with tracking details">Shipping Confirmation</option>
                  </select>
                </div>

                {!generatedEmail ? (
                  <div className="h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <p className="text-sm">Select context and click generate</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Generated Draft</label>
                    <textarea
                      value={generatedEmail}
                      readOnly
                      className="w-full h-64 p-4 text-sm text-slate-700 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono leading-relaxed"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-white">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateEmail}
                disabled={isGenerating}
                className="px-6 py-2 bg-primary-600 text-white font-medium text-sm rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    {generatedEmail ? 'Regenerate' : 'Generate Draft'}
                  </>
                )}
              </button>
              {generatedEmail && (
                 <button
                 onClick={() => setEmailModalOpen(false)}
                 className="px-6 py-2 bg-green-600 text-white font-medium text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
               >
                 <Check className="w-4 h-4 mr-2" />
                 Send Email
               </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};