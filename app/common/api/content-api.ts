import { fetchContent } from "@/server/content";
import { queryOptions } from "@tanstack/react-query";
import type { AppConfig, PageContent, SidebarContent } from "./interfaces";

const CONTENT_STALE_TIME = 5 * 60 * 1000;

export const appConfigContentOptions = queryOptions({
  queryKey: ["content", "app-config"],
  queryFn: async () => {
    const res = await fetchContent({ data: "app-config" });
    return (res ?? {}) as AppConfig;
  },
  staleTime: CONTENT_STALE_TIME,
});

export const sidebarContentOptions = queryOptions({
  queryKey: ["content", "sidebar"],
  queryFn: async () => {
    const res = await fetchContent({ data: "sidebar" });
    return (res ?? {}) as SidebarContent;
  },
  staleTime: CONTENT_STALE_TIME,
});

export const getPageContentOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["content", collectionId],
    queryFn: async () => {
      const res = await fetchContent({ data: collectionId });
      return (res ?? { id: collectionId, title: "", description: "", content: {} }) as PageContent;
    },
    enabled: Boolean(collectionId),
  });
