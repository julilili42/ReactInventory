// customerTable.tsx
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { DataTableProps } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { StateKeys, useStore } from "@/lib/store";
import { Trash2, List, Terminal, Check } from "lucide-react";
import { deleteCustomers } from "@/lib/services/customerServices";

export function CustomerTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedCustomers, setSelectedCustomers] = useState<number[] | null>(
    []
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { customerData, setState, notification } = useStore();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    const selectedCustomers = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.getValue("customer_id") as number);

    setSelectedCustomers(selectedCustomers);
  }, [rowSelection]);

  const deleteRow = async (delete_ids: number[]) => {
    await deleteCustomers(delete_ids);
    const new_data = customerData
      ? customerData.filter(
          (customer) => !delete_ids.includes(customer.customer_id)
        )
      : null;
    setState(StateKeys.CustomerData, new_data);
    setRowSelection({});
  };
  return (
    <>
      <div className="flex items-center justify-between">
        {/* Filter */}
        <Input
          placeholder="Filter Customer ID"
          value={
            (table.getColumn("customer_id")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: any) =>
            table.getColumn("customer_id")?.setFilterValue(event.target.value)
          }
          className="w-fit"
        />
        <div className="flex justify-center gap-2 pl-4 2xl:pl-0">
          {/* Deletion */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive_muted"}>
                <Trash2 /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  customer(s) and all related orders.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteRow(selectedCustomers ?? [])}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <List /> Selected Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const column_name =
                    column.id === "customer_id" ? "Customer ID" : column.id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column_name}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column_name}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Data Table */}
      <div className="mt-4 border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (onRowClick) onRowClick(row.getValue("customer_id"));
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span>Previous</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span>Next</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
      <AnimatePresence>
        {notification.error && (
          <motion.div
            className="fixed z-50 flex justify-end bottom-8 right-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="w-full" variant={"destructive"}>
              <Terminal className="w-4 h-4" />
              <AlertTitle>Error!</AlertTitle>

              <AlertDescription>
                {(notification.error as any).response?.data.error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        {notification.success && (
          <motion.div
            className="fixed z-50 flex justify-end bottom-8 right-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="w-full" variant={"success"}>
              <Check className="w-4 h-4" />
              <AlertTitle>Success!</AlertTitle>

              <AlertDescription>{notification.success}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
