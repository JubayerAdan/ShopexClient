const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <nav className="space-y-2">
        <a className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
        <a className="block p-2 hover:bg-gray-100 rounded">Users</a>
        <a className="block p-2 hover:bg-gray-100 rounded">Products</a>
        <a className="block p-2 hover:bg-gray-100 rounded">Settings</a>
      </nav>
    </aside>
  );
}; 