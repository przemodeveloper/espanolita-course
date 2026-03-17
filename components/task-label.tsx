export function TaskLabel({ label }: { label: string }) {
  return (
    <div className="bg-orange-200 px-2 py-1 rounded-md mb-2 w-fit">
      <p className="font-semibold text-sm text-orange-700">{label}</p>
    </div>
  );
}
