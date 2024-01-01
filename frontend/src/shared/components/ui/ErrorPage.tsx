import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className="relative mt-8 flex flex-col items-center gap-4 text-slate-950 dark:text-snow">
      <h1 className="text-9xl font-extrabold tracking-widest">400</h1>

      <div className="absolute top-[5.5rem] rotate-12 rounded-sm bg-orange-600 px-2 text-sm text-snow">
        {error.name}
      </div>

      <p className="italic text-red-500 dark:text-red-600">{error.message}</p>
    </div>
  );
}
