import React from 'react';
import { Outlet } from 'react-router-dom';
import OwnerPanelLayout from '../../components/OwnerPanelLayout';

const OwnerPanel = () => {
  return (
    <OwnerPanelLayout>
      <Outlet />
    </OwnerPanelLayout>
  );
};

export default OwnerPanel;

