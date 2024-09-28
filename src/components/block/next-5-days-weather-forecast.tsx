"use client";

import React from "react";

import { useNext5DaysWeatherForecastQuery } from "@/hooks/useNext5DaysWeatherForecastQuery";
import { timeFormatter } from "@/utils/datetime";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import WeatherIcon from "./weather-icon";

function WeatherForcastRow({
  time,
  minTemp,
  maxTemp,
  condition,
  icon,
}: {
  time: string;
  minTemp: string;
  maxTemp: string;
  condition: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center w-full px-4">
      <p className="text-sm font-semibold flex-none w-16">{time}</p>
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          {icon}
          <span className="text-sm text-muted-foreground font-medium">{`${minTemp}/${maxTemp} °C`}</span>
        </div>
        <p className="text-sm font-semibold">{condition}</p>
      </div>
    </div>
  );
}

function LoadingUI() {
  return (
    <div className="flex flex-col">
      <div className="p-4">
        <Skeleton className="h-6 w-20" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center w-full px-4">
          <div className="text-sm font-semibold flex-none w-16">
            <Skeleton className="h-6 w-10" />
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="grid place-content-center size-12">
                <Skeleton className="size-10 rounded-full" />
              </div>
              <Skeleton className="w-20 h-6" />
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Next5DayWeatherForecast() {
  const { data, isLoading } = useNext5DaysWeatherForecastQuery();

  return (
    <section className="flex flex-col w-full pb-4">
      <span className="font-semibold py-2">5-day Forecast (3 Hours)</span>
      <Card>
        <CardContent className="p-0 pb-4">
          {isLoading ? (
            <LoadingUI />
          ) : (
            <div className="flex flex-col">
              {data?.map(({ type, payload }, index) => {
                if (type === "date") {
                  return (
                    <span
                      key={index}
                      className="text-muted-foreground font-medium p-4"
                    >
                      {payload}
                    </span>
                  );
                }
                return (
                  <WeatherForcastRow
                    key={index}
                    time={timeFormatter.format(new Date(payload.dt * 1000))}
                    minTemp={`${payload.main?.temp_min}`}
                    maxTemp={`${payload.main?.temp_max}`}
                    condition={payload.weather[0]?.description ?? ""}
                    icon={
                      <WeatherIcon
                        icon={payload.weather[0]?.icon ?? ""}
                        name={payload.weather[0]?.description ?? ""}
                        width={48}
                        height={48}
                      />
                    }
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
