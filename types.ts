export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  paymentMethod: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export interface SalesData {
  name: string;
  sales: number;
  orders: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
}

// Mock Data
export const MOCK_ORDERS: Order[] = [
  { id: '#ORD-7829', customerName: 'Alice Freeman', customerEmail: 'alice@example.com', date: '2023-10-24', total: 124.50, status: 'Delivered', items: 3, paymentMethod: 'Credit Card' },
  { id: '#ORD-7830', customerName: 'Bob Smith', customerEmail: 'bob@example.com', date: '2023-10-25', total: 89.00, status: 'Processing', items: 1, paymentMethod: 'PayPal' },
  { id: '#ORD-7831', customerName: 'Charlie Davis', customerEmail: 'charlie@example.com', date: '2023-10-25', total: 450.20, status: 'Shipped', items: 5, paymentMethod: 'Credit Card' },
  { id: '#ORD-7832', customerName: 'Diana Prince', customerEmail: 'diana@example.com', date: '2023-10-26', total: 65.00, status: 'Pending', items: 2, paymentMethod: 'Stripe' },
  { id: '#ORD-7833', customerName: 'Evan Wright', customerEmail: 'evan@example.com', date: '2023-10-26', total: 210.00, status: 'Cancelled', items: 4, paymentMethod: 'Credit Card' },
  { id: '#ORD-7834', customerName: 'Fiona Gallagher', customerEmail: 'fiona@example.com', date: '2023-10-27', total: 34.99, status: 'Processing', items: 1, paymentMethod: 'Apple Pay' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P-101', name: 'Ergonomic Office Chair', sku: 'FUR-CH-01', category: 'Furniture', price: 199.99, stock: 45, description: 'Comfortable office chair with lumbar support.' },
  { id: 'P-102', name: 'Wireless Mechanical Keyboard', sku: 'TEC-KB-22', category: 'Electronics', price: 129.50, stock: 12, description: 'Tactile switches and RGB lighting.' },
  { id: 'P-103', name: 'Noise Cancelling Headphones', sku: 'TEC-AD-55', category: 'Electronics', price: 249.99, stock: 8, description: 'Immersive sound with active noise cancellation.' },
  { id: 'P-104', name: 'Ceramic Coffee Mug Set', sku: 'KIT-MG-04', category: 'Kitchen', price: 24.99, stock: 150, description: 'Set of 4 minimalist ceramic mugs.' },
];

export const MOCK_SALES_DATA: SalesData[] = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 19 },
  { name: 'Sun', sales: 3490, orders: 28 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C-001', name: 'Alice Freeman', email: 'alice@example.com', phone: '+1 (555) 123-4567', location: 'New York, NY', joinDate: '2023-01-15', status: 'Active' },
  { id: 'C-002', name: 'Bob Smith', email: 'bob@example.com', phone: '+1 (555) 234-5678', location: 'San Francisco, CA', joinDate: '2023-02-20', status: 'Active' },
  { id: 'C-003', name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 (555) 345-6789', location: 'Austin, TX', joinDate: '2023-03-10', status: 'Active' },
  { id: 'C-004', name: 'Diana Prince', email: 'diana@example.com', phone: '+1 (555) 456-7890', location: 'Chicago, IL', joinDate: '2023-04-05', status: 'Active' },
  { id: 'C-005', name: 'Evan Wright', email: 'evan@example.com', phone: '+1 (555) 567-8901', location: 'Seattle, WA', joinDate: '2023-05-12', status: 'Inactive' },
  { id: 'C-006', name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '+1 (555) 678-9012', location: 'Boston, MA', joinDate: '2023-06-18', status: 'Active' },
];