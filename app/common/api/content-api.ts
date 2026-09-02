import { operonApiClient } from "#/libs/apiClient";
import { queryOptions } from "@tanstack/react-query";
import { ComposeEndpoints } from "./endpoints";
import type { AppConfig, PageContent, SidebarContent } from "./interfaces";

const CONTENT_STALE_TIME = 5 * 60 * 1000;

export const appConfigContentOptions = queryOptions({
  queryKey: ["content", "app-config"],
  queryFn: async () => {
    try {
      const res = await operonApiClient.get<AppConfig>(
        ComposeEndpoints.CONTENT("app-config"),
      );
      return (res ?? {}) as AppConfig;
    } catch {
      return {} as AppConfig;
    }
  },
  staleTime: CONTENT_STALE_TIME,
});

export const sidebarContentOptions = queryOptions({
  queryKey: ["content", "sidebar"],
  queryFn: async () => {
    try {
      const res = await operonApiClient.get<SidebarContent>(
        ComposeEndpoints.CONTENT("sidebar"),
      );
      return (res ?? {}) as SidebarContent;
    } catch {
      return {} as SidebarContent;
    }
  },
  staleTime: CONTENT_STALE_TIME,
});

export const getPageContentOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["content", collectionId],
    queryFn: async () => {
      try {
        const res = await operonApiClient.get<PageContent>(
          ComposeEndpoints.CONTENT(collectionId),
        );
        return (
          res ?? {
            page: { title: "", subtitle: "" },
            content: {},
          }
        );
      } catch {
        return {
          page: { title: "", subtitle: "" },
          content: {},
        } as PageContent;
      }
    },
    enabled: Boolean(collectionId),
  });
