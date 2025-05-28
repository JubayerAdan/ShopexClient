import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/data/products";
import { DataTableRowActions } from "@/components/admin/row-actions";

export const ProductColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price}`,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions 
      onEdit={`/admin/products/${row.original.id}/edit`}
      onDelete={() => console.log('Delete', row.original.id)}
    />,
  },
]; 