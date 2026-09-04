import { useQuery } from "@tanstack/react-query";
import { useActiveScope } from "#/common/use-active-scope";
import { getUsageDailyOptions, getUsageOptions } from "./api";

const TREND_DAYS = 7;

/**
 * Workspace usage plus the recent daily trend.
 *
 * This used to also map a CMS-driven `statCards` array into React elements on
 * every render. Nothing consumed it — the page has always laid its own figures
 * out — so it has been dropped rather than left as a second, silently unused
 * source of truth for the same numbers.
 */
export const useDashboard = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const usageQuery = useQuery(getUsageOptions());
  const dailyQuery = useQuery(getUsageDailyOptions(TREND_DAYS));

  return {
    usage: usageQuery.data,
    daily: dailyQuery.data ?? [],
    isLoading: usageQuery.isLoading || dailyQuery.isLoading,
    isError: usageQuery.isError || dailyQuery.isError,
    refetch: () => {
      usageQuery.refetch();
      dailyQuery.refetch();
    },
  };
};
