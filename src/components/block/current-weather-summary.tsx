"use client";

import React from "react";

import { useCurrentWeatherQuery } from "@/hooks/useCurrentWeatherQuery";
import { longDateFormatter } from "@/utils/datetime";
import { ArrowDown } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import WeatherIcon from "./weather-icon";
import { Skeleton } from "../ui/skeleton";

function CurrentWeatherCondition({
  temp,
  condition,
}: {
  temp: React.ReactNode;
  condition: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-5xl font-medium">{temp}</span>
      <span className="text-lg font-medium capitalize">{condition}</span>
    </div>
  );
}

function CurrentWeatherIndicator({
  name,
  value,
}: {
  name: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 items-center col-span-1">
      <span className="font-medium text-slate-500">{name}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function CurrentWeatherSummary() {
  const currentDate = React.useMemo(
    () => longDateFormatter.format(new Date()),
    []
  );

  const { data, isLoading } = useCurrentWeatherQuery();

  return (
    <Card className="w-full">
      <CardContent className="grid gap-4 p-4">
        <span>{currentDate}</span>
        <div className="grid grid-cols-2 gap-2">
          {isLoading ? (
            <div className="grid place-content-center">
              <Skeleton className="size-16 rounded-full" />
            </div>
          ) : (
            <WeatherIcon
              icon={data?.weather[0].icon ?? ""}
              name={data?.weather[0].description ?? ""}
            />
          )}
          <CurrentWeatherCondition
            temp={
              isLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                `${Math.round(data?.main.temp ?? 0)}°C`
              )
            }
            condition={
              isLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                data?.weather[0].description ?? ""
              )
            }
          />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-4">
        <CurrentWeatherIndicator
          name="Humidity"
          value={
            isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              `${data?.main.humidity}%`
            )
          }
        />
        <CurrentWeatherIndicator
          name="Winds"
          value={
            isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <>
                <ArrowDown
                  className="inline-block w-4 h-4"
                  style={{ transform: `rotate(${data?.wind.deg ?? 0}deg)` }}
                />{" "}
                <span className="text-sm">{`${data?.wind.speed} m/s`}</span>
              </>
            )
          }
        />
        <CurrentWeatherIndicator
          name="Visibility"
          value={
            isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              `${Math.round((data?.visibility || 0) / 1000)} km`
            )
          }
        />
      </CardFooter>
    </Card>
  );
}
