import ReactLogo from "@/assets/react.svg";
import { Input } from "@/components/ui/Input.tsx";

export default function NavBar() {
  return (
    <nav className="py-2 px-4 md:px-6 flex items-center justify-between gap-8 h-full">
      <Logo />
      <Search />
      <Result />
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 min-w-fit">
      <img src={ReactLogo} alt="React Logo" />
      <h1 className="text-2xl font-bold">useBeauty</h1>
    </div>
  );
}

function Search() {
  return (
    <Input type="text" placeholder="Search people..." className="bg-violet-600 max-w-lg border-none" />
  );
}

function Result() {
  return (
    <div>
      <p className="text-md">Found <strong className="font-bold">X</strong> results</p>
    </div>
  );
}
