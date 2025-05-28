import { Sidebar } from '@/components/admin/sidebar';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-muted/40">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
} 