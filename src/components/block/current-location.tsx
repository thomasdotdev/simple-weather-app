"use client";

import { useLocationStore } from "@/store/location";
import { ComponentProps } from "react";

export default function CurrentLocation(props: ComponentProps<"span">) {
  const { currentLocation } = useLocationStore();
  return (
    <span {...props}>
      {currentLocation.name}, {currentLocation.country}
    </span>
  );
}
