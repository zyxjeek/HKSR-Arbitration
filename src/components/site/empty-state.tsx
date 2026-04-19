export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 px-5 py-10 text-center text-sm text-white/55">
      {message}
    </div>
  );
}
