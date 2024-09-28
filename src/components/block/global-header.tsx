import { MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import CurrentLocation from "./current-location";

export default function GlobalHeader() {
  return (
    <header className="flex h-16 w-full items-center justify-center px-6 fixed top-0 z-50 bg-background shadow-md">
      <nav className="flex items-center justify-between w-full max-w-screen-xs">
        <Link className="flex items-center gap-2" href="/">
          <MapPin /> <CurrentLocation />
        </Link>
        <Link href="/search">
          <Button variant="ghost">
            <Search />
          </Button>
        </Link>
      </nav>
    </header>
  );
}
