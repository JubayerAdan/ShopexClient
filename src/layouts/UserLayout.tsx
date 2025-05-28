import { ReactNode } from 'react';
import UserNavbar from '@/components/navbars/UserNavbar';

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default UserLayout; 