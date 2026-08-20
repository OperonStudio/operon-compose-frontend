import type { IconProps } from "@operonstudio/icons";
import * as OperonIcons from "@operonstudio/icons";
import type { ComponentType } from "react";

const iconMap = OperonIcons as Record<string, any>;

export const resolveIcon = (
  iconName: string | undefined,
): ComponentType<IconProps> => {
  if (!iconName) return OperonIcons.Blocks;
  if (iconMap[iconName]) return iconMap[iconName];

  return OperonIcons.Blocks;
};
