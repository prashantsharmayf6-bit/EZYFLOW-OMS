import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { MOCK_SALES_DATA } from '../types';
import { 
  TrendingUp, Users, IndianRupee, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Package, AlertCircle, Activity, ChevronRight 
} from 'lucide-react';
import { useData } from '../context/DataContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ title, value, trend, trendValue, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 transition-transform group-hover:scale-110 ${colorClass}`}></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="relative z-10 flex items-center mt-4">
      <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trendValue}
      </span>
      <span className="text-xs text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { orders, customers, products } = useData();

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Status Distribution for Pie Chart
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.keys(statusCounts).map((status, index) => ({
    name: status,
    value: statusCounts[status],
  }));

  // Low Stock Items
  const lowStockItems = products.filter(p => p.stock < 15);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening in your store today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Download Report
          </button>
          <button className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Live Analytics
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          trend="up" 
          trendValue="12.5%" 
          icon={IndianRupee} 
          colorClass="bg-indigo-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          trend="up" 
          trendValue="8.2%" 
          icon={ShoppingBag} 
          colorClass="bg-emerald-500" 
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`₹${avgOrderValue.toFixed(0)}`} 
          trend="down" 
          trendValue="2.1%" 
          icon={TrendingUp} 
          colorClass="bg-amber-500" 
        />
        <StatCard 
          title="Total Customers" 
          value={customers.length} 
          trend="up" 
          trendValue="4.5%" 
          icon={Users} 
          colorClass="bg-pink-500" 
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Revenue Analytics</h3>
              <p className="text-xs text-slate-500">Income over the last 7 days</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Order Status</h3>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{totalOrders}</p>
                  <p className="text-xs text-slate-400">Total</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Recent Orders</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 text-white text-[10px] flex items-center justify-center mr-2 font-bold">
                          {order.customerName.charAt(0)}
                        </div>
                        {order.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                        ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                          order.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                          order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-700">₹{order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 bg-red-50/50">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-lg">Low Stock Alerts</h3>
            </div>
            <p className="text-xs text-red-500 mt-1">Products below 15 units</p>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                All products are well stocked.
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-50 bg-slate-50/30 text-center">
            <button className="text-xs font-semibold text-slate-600 hover:text-primary-600 transition-colors">
              Go to Inventory
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};