import { useAuth } from '@/app/hooks/useAuth';

const DashboardPage = () => {
  const { currentUserFromBackend } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {currentUserFromBackend?.role === 'admin' && 'Admin Dashboard'}
        {currentUserFromBackend?.role === 'seller' && 'Seller Dashboard'}
        {currentUserFromBackend?.role === 'user' && 'My Account'}
      </h1>
      {/* Role-specific content */}
    </div>
  );
};

export default DashboardPage; 