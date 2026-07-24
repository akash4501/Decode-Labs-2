export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200">
      <div className="skeleton h-3 w-20 mb-3" />
      <div className="skeleton h-7 w-14" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-4 px-4">
        <div className="skeleton h-4 w-40" />
      </td>
      <td className="py-4 px-4">
        <div className="skeleton h-5 w-20 rounded-full" />
      </td>
      <td className="py-4 px-4">
        <div className="skeleton h-5 w-16 rounded-full" />
      </td>
      <td className="py-4 px-4">
        <div className="skeleton h-4 w-24" />
      </td>
      <td className="py-4 px-4">
        <div className="skeleton h-4 w-16" />
      </td>
    </tr>
  );
}
