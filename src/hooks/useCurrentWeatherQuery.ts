import { useLocationStore } from "@/store/location";
import { WeatherData } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useCurrentWeatherQuery() {
  const {
    currentLocation: { lat, lon },
  } = useLocationStore();

  return useQuery({
    queryKey: ["currentWeather", lat, lon],
    queryFn: async () => {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      return data as WeatherData;
    },
    enabled: !!lat && !!lon,
    placeholderData: keepPreviousData,
  });
}
