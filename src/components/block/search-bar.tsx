"use client";

import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/location";
import { useDebounce } from "@uidotdev/usehooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { LocationData } from "@/types/api";

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const debounceSearch = useDebounce(search, 500);

  const { data, error } = useQuery({
    queryKey: ["search", debounceSearch],
    queryFn: async () => {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${debounceSearch}&limit=5&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`
      );
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0)
        throw new Error("Invalid country or city");

      return data as LocationData[];
    },
    retry: 1,
    enabled: !!debounceSearch,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setOpen(true);
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
          sideOffset={0}
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
