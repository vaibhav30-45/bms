import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

export default function Table({
  columns,
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDesc = "Nothing to display here.",
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="w-full overflow-x-auto rounded-2xl border
                    border-gray-100 dark:border-gray-800"
    >
      <table className="w-full text-sm">
        {/* Head */}
        <thead className="bg-gray-50 dark:bg-gray-800/60">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-5 py-3.5 text-left text-xs font-bold
                             text-gray-500 dark:text-gray-400 uppercase
                             tracking-wider whitespace-nowrap"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <Loader text="Loading data..." />
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDesc} />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white dark:bg-gray-900
                           hover:bg-gray-50 dark:hover:bg-gray-800/50
                           transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-5 py-4 text-gray-700 dark:text-gray-300
                               whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
