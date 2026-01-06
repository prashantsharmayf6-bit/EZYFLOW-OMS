import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Admin } from './pages/Admin';
import { SettingsProvider } from './context/SettingsContext';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <DataProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="customers" element={<Customers />} />
              <Route path="admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </DataProvider>
    </SettingsProvider>
  );
};

export default App;