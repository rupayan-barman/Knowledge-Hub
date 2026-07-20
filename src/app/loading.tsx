export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-accent/10 animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground animate-fade-in">Loading…</p>
      </div>
    </div>
  );
}
