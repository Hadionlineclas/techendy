export default function Placeholder({ name }: { name: string }) {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">{name} Page</h1>
      <p className="text-muted-foreground italic">Coming soon: Full implementation of {name}.</p>
    </div>
  );
}
