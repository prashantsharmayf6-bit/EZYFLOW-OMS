import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Order, Customer, Product } from '../types';
import { useAuth } from './AuthContext';

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

export const DataProvider = ({ children }: React.PropsWithChildren) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load User Data on Login
  useEffect(() => {
    if (user) {
      const storageKey = `nexus_data_${user.email}`;
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setOrders(parsed.orders || []);
          setCustomers(parsed.customers || []);
          setProducts(parsed.products || []);
        } else {
          // Reset for new user
          setOrders([]);
          setCustomers([]);
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setOrders([]);
        setCustomers([]);
        setProducts([]);
      }
      setIsInitialized(true);
    } else {
      setOrders([]);
      setCustomers([]);
      setProducts([]);
      setIsInitialized(false);
    }
  }, [user]);

  // Save Data on Change
  useEffect(() => {
    if (user && isInitialized) {
      const storageKey = `nexus_data_${user.email}`;
      const dataToSave = { orders, customers, products };
      try {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    }
  }, [orders, customers, products, user, isInitialized]);

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
    const newFormatOrders = orders.filter(o => o.id.startsWith('ORDER '));
    if (newFormatOrders.length === 0) return 'ORDER 001';
    
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