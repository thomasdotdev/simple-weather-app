"use client";

import React from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { useLocationStore } from "@/store/location";
import { Next5DayWeatherForecastData, WeatherData } from "@/types/api";
import WeatherIcon from "./weather-icon";

const dateformatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

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

export default function Next5DayWeatherForecast() {
  const {
    currentLocation: { lat, lon },
  } = useLocationStore();

  const { data } = useQuery({
    queryKey: ["next5DayWeatherForecast", lat, lon],
    queryFn: async () => {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      return data as Next5DayWeatherForecastData;
    },
    enabled: !!lat && !!lon,
    placeholderData: keepPreviousData,
  });

  const list = React.useMemo(() => {
    if (!data?.list) return [];

    const listWithDateSeparated: Array<
      | { type: "forcast"; payload: WeatherData }
      | { type: "date"; payload: string }
    > = [];

    let lastDate = "";

    data.list.forEach((item) => {
      try {
        const itemDate = dateformatter.format(new Date(item.dt * 1000));

        if (lastDate !== itemDate) {
          listWithDateSeparated.push({ type: "date", payload: itemDate });
          lastDate = itemDate;
        }

        listWithDateSeparated.push({ type: "forcast", payload: item });
      } catch (error) {
        console.log("[DEBUG] Error parsing date", error);
      }
    });

    return listWithDateSeparated;
  }, [data]);

  return (
    <section className="flex flex-col w-full pb-4">
      <span className="font-semibold py-2">5-day Forecast (3 Hours)</span>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {list.map(({ type, payload }, index) => {
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
        </CardContent>
      </Card>
    </section>
  );
}
