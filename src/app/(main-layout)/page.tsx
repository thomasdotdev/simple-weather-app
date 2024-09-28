import CurrentWeatherSummary from "@/components/block/current-weather-summary";
import Next5DayWeatherForecast from "@/components/block/next-5-days-weather-forecast";

export default function HomePage() {
  return (
    <>
      <CurrentWeatherSummary />
      <Next5DayWeatherForecast />
    </>
  );
}
