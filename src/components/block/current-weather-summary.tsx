"use client";

import React from "react";

import { Card, CardContent, CardFooter } from "../ui/card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/store/location";
import { WeatherData } from "@/types/api";
import WeatherIcon from "./weather-icon";

const dateformatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function CurrentWeatherCondition({
  temp,
  condition,
}: {
  temp: number;
  condition: string;
}) {
  return (
    <div className="grid text-center gap-2">
      <span className="text-5xl font-medium">{temp}°C</span>
      <span className="text-lg font-medium capitalize">{condition}</span>
    </div>
  );
}

function CurrentWeatherIndicator({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="grid gap-2 text-center col-span-1">
      <span className="font-medium text-slate-500">{name}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function CurrentWeatherSummary() {
  const currentDate = React.useMemo(() => dateformatter.format(new Date()), []);

  const { currentLocation } = useLocationStore();

  const { data } = useQuery({
    queryKey: ["currentWeather", currentLocation.lat, currentLocation.lon],
    queryFn: async () => {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      return data as WeatherData;
    },
    enabled: !!currentLocation.lat && !!currentLocation.lon,
    placeholderData: keepPreviousData,
  });

  return (
    <Card className="w-full">
      <CardContent className="grid gap-4 p-4">
        <span>{currentDate}</span>
        <div className="grid grid-cols-2 gap-2">
          <WeatherIcon
            icon={data?.weather[0].icon ?? ""}
            name={data?.weather[0].description ?? ""}
          />
          <CurrentWeatherCondition
            temp={Math.round(data?.main.temp ?? 0)}
            condition={data?.weather[0].description ?? ""}
          />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-4">
        <CurrentWeatherIndicator
          name="Humidity"
          value={`${data?.main.humidity}%`}
        />
        <CurrentWeatherIndicator
          name="Winds"
          value={`${data?.wind.speed} m/s`}
        />
        <CurrentWeatherIndicator
          name="Visibility"
          value={`${Math.round((data?.visibility || 0) / 1000)} km`}
        />
      </CardFooter>
    </Card>
  );
}
