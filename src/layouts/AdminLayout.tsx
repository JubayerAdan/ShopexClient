import { ReactNode } from 'react';
import AdminSidebar from '@/components/navbars/AdminSidebar';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 