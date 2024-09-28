import { useLocationStore } from "@/store/location";
import { Next5DayWeatherForecastData, WeatherData } from "@/types/api";
import { shortDateFormatter } from "@/utils/datetime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useNext5DaysWeatherForecastQuery() {
  const {
    currentLocation: { lat, lon },
  } = useLocationStore();

  return useQuery({
    queryKey: ["next5DayWeatherForecast", lat, lon],
    queryFn: async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      return data as Next5DayWeatherForecastData;
    },
    enabled: !!lat && !!lon,
    placeholderData: keepPreviousData,
    select: (data) => {
      if (!data?.list) return [];

      const listWithDateSeparated: Array<
        | { type: "forcast"; payload: WeatherData }
        | { type: "date"; payload: string }
      > = [];

      let lastDate = "";

      data.list.forEach((item) => {
        try {
          let itemDate = shortDateFormatter.format(new Date(item.dt * 1000));

          if (itemDate === shortDateFormatter.format(new Date())) {
            itemDate = "Today";
          }

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
    },
  });
}
