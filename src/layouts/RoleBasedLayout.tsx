import { ReactNode } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import SellerLayout from './SellerLayout';
import PublicLayout from './PublicLayout';

type Role = 'user' | 'admin' | 'seller';

const RoleBasedLayout = ({ children }: { children: ReactNode }) => {
  const { currentUserFromBackend, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  const getLayout = () => {
    if (!currentUserFromBackend) return <PublicLayout>{children}</PublicLayout>;
    
    switch(currentUserFromBackend.role as Role) {
      case 'admin':
        return <AdminLayout>{children}</AdminLayout>;
      case 'seller':
        return <SellerLayout>{children}</SellerLayout>;
      default:
        return <UserLayout>{children}</UserLayout>;
    }
  };

  return getLayout();
};

export default RoleBasedLayout; 