import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminPanelLayout from '../../components/AdminPanelLayout';

const AdminPanel = () => {
  return (
    <AdminPanelLayout>
      <Outlet />
    </AdminPanelLayout>
  );
};

export default AdminPanel;
