import { queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";
import type { Usage } from "./types";

export interface DailyPoint {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
}

export const getUsageOptions = () => {
  const { workspaceId, hasWorkspace } = activeScope();
  return queryOptions({
    queryKey: queryKeys.usage(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Usage>(
        Endpoints.composeEndpoints.USAGE(workspaceId),
      ),
    enabled: hasWorkspace,
    staleTime: 60_000,
  });
};

export const getUsageDailyOptions = (days = 7) => {
  const { workspaceId, hasWorkspace } = activeScope();
  return queryOptions({
    queryKey: queryKeys.usageDaily(workspaceId, days),
    queryFn: async () =>
      await operonApiClient.get<DailyPoint[]>(
        Endpoints.composeEndpoints.USAGE_DAILY(workspaceId, days),
      ),
    enabled: hasWorkspace,
    staleTime: 60_000,
  });
};
