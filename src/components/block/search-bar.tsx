"use client";

import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchLocationQuery } from "@/hooks/useSearchLocationQuery";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/store/location";
import { LocationData } from "@/types/api";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const debounceSearch = useDebounce(search, 200);

  const { data, error } = useSearchLocationQuery(debounceSearch);

  useEffect(() => {
    if (data) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [data]);

  const router = useRouter();

  const { setCurrentLocation, addToHistory } = useLocationStore();

  const handleSearch = (item: LocationData) => {
    setCurrentLocation(item);
    addToHistory(item);
    router.push("/");
  };

  return (
    <section className="flex flex-col w-full gap-2">
      <Input
        name="search"
        placeholder="Search country or city here..."
        className="bg-background w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span
            className={cn(
              "w-full invisible text-sm",
              error?.message && "visible text-destructive"
            )}
          >
            {error?.message || "No error!"}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-[480px] p-2 bg-white outline-none"
          sideOffset={-20}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {data?.map((item, index) => (
            <button
              key={index}
              className="p-2 w-full hover:bg-accent rounded-sm outline-[transparent] flex"
              onClick={() => handleSearch(item)}
            >
              {item.name}, {item.country}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </section>
  );
}
