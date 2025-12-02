import React from 'react';
import { Outlet } from 'react-router-dom';
import TenantPanelLayout from '../../components/TenantPanelLayout';

const TenantPanel = () => {
  return (
    <TenantPanelLayout>
      <Outlet />
    </TenantPanelLayout>
  );
};

export default TenantPanel;
