import { fetchContent } from "@/server/content";
import { queryOptions } from "@tanstack/react-query";
import type { AppConfig, PageContent, SidebarContent } from "./interfaces";

const CONTENT_STALE_TIME = 5 * 60 * 1000;

export const appConfigContentOptions = queryOptions({
  queryKey: ["content", "app-config"],
  queryFn: () => fetchContent({ data: "app-config" }) as Promise<AppConfig>,
  staleTime: CONTENT_STALE_TIME,
});

export const sidebarContentOptions = queryOptions({
  queryKey: ["content", "sidebar"],
  queryFn: () => fetchContent({ data: "sidebar" }) as Promise<SidebarContent>,
  staleTime: CONTENT_STALE_TIME,
});

export const getPageContentOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["content", collectionId],
    queryFn: async () => {
      // if (collectionId === "project-details") {
      //   const { ProjectDetailsPage } = await import("../static-data");
      //   return ProjectDetailsPage;
      // }
      return fetchContent({ data: collectionId }) as Promise<PageContent>;
    },
    // staleTime: CONTENT_STALE_TIME,
    enabled: Boolean(collectionId),
  });
