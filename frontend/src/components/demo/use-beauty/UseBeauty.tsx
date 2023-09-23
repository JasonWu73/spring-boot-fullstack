import NavBar from "@/components/demo/use-beauty/NavBar.tsx";
import LeftSide from "@/components/demo/use-beauty/LeftSide.tsx";
import RightSide from "@/components/demo/use-beauty/RightSide.tsx";

export default function UseBeauty() {
  return (
    <div className="grid grid-rows-[64px_1fr_1fr] md:grid-rows-[64px_1fr] md:grid-cols-2 gap-4 md:gap-8 h-screen px-3 md:p-4 bg-night-1 text-snow-1">
      <div className="md:row-span-1 md:col-span-2 bg-violet-700 h-16 rounded md:rounded-lg">
        <NavBar />
      </div>

      <div className="md:row-span-1 md:col-span-1 bg-night-2">
        <LeftSide />
      </div>

      <div className="md:row-span-1 md:col-span-1 bg-night-2">
        <RightSide />
      </div>
    </div>
  );
}
