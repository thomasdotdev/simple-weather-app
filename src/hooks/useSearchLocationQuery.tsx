import { LocationData } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useSearchLocationQuery(debounceSearch: string) {
  return useQuery({
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
}
