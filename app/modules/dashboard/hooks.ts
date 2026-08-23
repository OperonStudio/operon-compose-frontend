import { getPageContentOptions } from "#/common/api/content-api";
import { resolveIcon } from "#/common/icon-map";
import { formatBytes } from "#/libs/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsageOptions } from "./api";

export const useDashboard = () => {
  const { data: usage } = useQuery({
    ...getUsageOptions(),
  });

  const { data: pageData } = useQuery(getPageContentOptions("dashboard"));
  const statCardConfigs = (pageData?.content?.statCards as any[]) ?? [];
  const labels = pageData?.content?.labels;

  const statCards =
    usage && statCardConfigs
      ? statCardConfigs.map((config: any) => {
          const rawValue = (usage as Record<string, any>)[config.key] ?? 0;
          let value = rawValue.toLocaleString();
          let unit = undefined;

          if (config.format === "bytes") {
            const formatted = formatBytes(rawValue);
            const parts = formatted.split(" ");
            value = parts[0];
            unit = parts[1];
          }

          const IconComponent = resolveIcon(config.icon);

          return {
            title: config.title,
            value,
            unit,
            icon: React.createElement(IconComponent, {
              size: 24,
              color: config.color,
            }),
            bg: config.bg,
          };
        })
      : [];

  return {
    usage,
    statCards,
    labels,
  };
};
