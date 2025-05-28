import { ReactNode } from 'react';
import SellerDashboard from '@/components/navbars/SellerDashboard';

const SellerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SellerDashboard />
      <div className="flex-1 container mx-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default SellerLayout; 