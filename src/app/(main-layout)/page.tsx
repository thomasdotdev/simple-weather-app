import CurrentWeatherSummary from "@/components/block/current-weather-summary";
import Next5DayWeatherForecast from "@/components/block/next-5-days-weather-forecast";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 pt-4 max-w-screen-xs w-full items-center justify-start">
      <CurrentWeatherSummary />
      <Next5DayWeatherForecast />
    </div>
  );
}
