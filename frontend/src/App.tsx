import Pizza from '@/components/pizzas/Pizza.tsx';

export default function App() {
  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      <h1 className="font-bold text-4xl underline">Hello World!</h1>

      <Pizza />
      <Pizza />
      <Pizza />
      <Pizza />
    </div>
  );
}
