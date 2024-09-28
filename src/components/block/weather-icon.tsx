import Image from "next/image";
import { ComponentProps } from "react";

interface WeatherIconProps
  extends Omit<ComponentProps<typeof Image>, "src" | "alt"> {
  icon: string;
  name: string;
}

export default function WeatherIcon({
  icon,
  name,
  ...props
}: WeatherIconProps) {
  return (
    <div className="grid place-items-center">
      <Image
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={name}
        width={80}
        height={80}
        {...props}
      />
    </div>
  );
}
