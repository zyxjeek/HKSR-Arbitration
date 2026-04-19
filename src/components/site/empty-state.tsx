export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-5 py-12 text-center text-sm text-white/55">
      {message}
    </div>
  );
}
