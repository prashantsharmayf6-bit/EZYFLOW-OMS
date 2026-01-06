import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Order, Customer, Product, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_PRODUCTS } from '../types';

interface DataContextType {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCustomer: (customer: Customer) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  getNextOrderId: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const getNextOrderId = () => {
    // Check if we have orders using the new format "ORDER XXX"
    const newFormatOrders = orders.filter(o => o.id.startsWith('ORDER '));
    
    if (newFormatOrders.length === 0) {
      return 'ORDER 001';
    }

    // Extract the highest number
    const maxId = newFormatOrders.reduce((max, order) => {
      const numPart = parseInt(order.id.split(' ')[1]);
      return isNaN(numPart) ? max : Math.max(max, numPart);
    }, 0);

    return `ORDER ${String(maxId + 1).padStart(3, '0')}`;
  };

  return (
    <DataContext.Provider value={{ 
      orders, 
      customers, 
      products, 
      addOrder, 
      updateOrderStatus,
      addCustomer, 
      addProduct,
      updateProduct,
      getNextOrderId
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};