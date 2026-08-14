import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { queryOptions } from "@tanstack/react-query";
import type { Usage } from "./types";

export const getUsageOptions = () =>
  queryOptions({
    queryKey: ["usage"],
    queryFn: async () => {
      const { workspaceId } = getActiveIds();
      if (!workspaceId) return null;
      return await operonApiClient.get<Usage>(
        Endpoints.composeEndpoints.USAGE(workspaceId),
      );
    },
  });
