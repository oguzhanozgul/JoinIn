import { useCallback, useMemo } from "react";
import { Box } from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPauseFilled,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconPlayerTrackNext,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrev,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";
import classNames from "classnames";

import { ButtonType } from "../../types/ButtonType";

import classes from "./ControlButton.module.css";

interface ControlButtonProps {
  buttonType: ButtonType;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}

const ControlButton = ({
  buttonType,
  active,
  disabled,
  className: classNameProp,
  size: sizeProp = "md",
  onClick,
}: ControlButtonProps) => {
  const className = useMemo(
    () =>
      classNames(classNameProp, classes.root, {
        [classes.disabled]: disabled,
      }),
    [classNameProp, disabled],
  );

  const color = useMemo(() => {
    if (disabled) {
      return "var(--ji-color-text-disabled)";
    }
    if (active) {
      return "var(--ji-color-text-default)";
    }
    return "var(--ji-color-text-subdued)";
  }, [active, disabled]);

  const size = useMemo(() => {
    switch (sizeProp) {
      case "sm":
        return 20;
      case "md":
        return 32;
    }
  }, [sizeProp]);

  const icon = useCallback(() => {
    switch (buttonType) {
      case ButtonType.Play:
        return active ? (
          <IconPlayerPlayFilled className={className} color={color} size={size} />
        ) : (
          <IconPlayerPlay className={className} color={color} size={size} />
        );
      case ButtonType.Pause:
        return active ? (
          <IconPlayerPauseFilled className={className} color={color} size={size} />
        ) : (
          <IconPlayerPause className={className} color={color} size={size} />
        );
      case ButtonType.Previous:
        return active ? (
          <IconPlayerTrackPrevFilled className={className} color={color} size={size} />
        ) : (
          <IconPlayerTrackPrev className={className} color={color} size={size} />
        );
      case ButtonType.Next:
        return active ? (
          <IconPlayerTrackNextFilled className={className} color={color} size={size} />
        ) : (
          <IconPlayerTrackNext className={className} color={color} size={size} />
        );
    }
  }, [active, buttonType, className, color, size]);

  return <Box onClick={onClick}>{icon()}</Box>;
};

export default ControlButton;
