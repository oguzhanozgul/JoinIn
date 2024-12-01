import { useMemo } from "react";
import { Image } from "@mantine/core";

import { BORDER_RADIUS_CONSTANT } from "../../constants/designConstants";

interface StationLogoProps {
  name: string;
  imgUrl: string;
  size?: "xs" | "sm" | "md";
}

const StationLogo = ({ name, imgUrl, size: sizeProp = "md" }: StationLogoProps) => {
  const size = useMemo(() => {
    switch (sizeProp) {
      case "xs":
        return 40;
      case "sm":
        return 80;
      case "md":
        return 160;
    }
  }, [sizeProp]);

  const radius = useMemo(() => {
    return Math.floor(size / BORDER_RADIUS_CONSTANT);
  }, [size]);

  return (
    <Image
      src={imgUrl}
      alt={name}
      fallbackSrc="https://placehold.co/160x160?text=Placeholder" // TODO: Add a proper fallback image from design
      w={size}
      h={size}
      radius={radius}
    />
  );
};

export default StationLogo;
