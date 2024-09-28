"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/store/location";
import { LocationData } from "@/types/api";
import { Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

function HistoryItem({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function HistoryItemName({
  className,
  children,
  ...props
}: ComponentProps<"span">) {
  return (
    <span className={cn("", className)} {...props}>
      {children}
    </span>
  );
}

function HistoryItemActions({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {children}
    </div>
  );
}

function HistoryItemAction({
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" className={cn("p-1", className)} {...props}>
      {children}
    </Button>
  );
}

function EmptyUI() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <span className="text-muted-foreground text-sm">History is empty!</span>
    </div>
  );
}

export default function SearchHistory() {
  const { history, removeFromHistory, setCurrentLocation } = useLocationStore();

  const router = useRouter();

  function handleSearch(location: LocationData) {
    router.push("/");
    setCurrentLocation(location);
  }

  const isEmpty = history.length === 0;

  return (
    <section className="flex flex-col w-full">
      <span className="font-medium">Search History</span>
      <Card className="mt-2">
        <CardContent className="p-4 flex flex-col gap-2">
          {isEmpty ? (
            <EmptyUI />
          ) : (
            history.map((item, index) => (
              <HistoryItem key={index} className="justify-between">
                <HistoryItemName>{`${item.name}, ${item.country}`}</HistoryItemName>
                <HistoryItemActions>
                  <HistoryItemAction onClick={() => handleSearch(item)}>
                    <Search className="size-4" />
                  </HistoryItemAction>
                  <HistoryItemAction onClick={() => removeFromHistory(item)}>
                    <Trash className="size-4" />
                  </HistoryItemAction>
                </HistoryItemActions>
              </HistoryItem>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
