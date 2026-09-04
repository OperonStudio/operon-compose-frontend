import { queryOptions } from "@tanstack/react-query";
import {
  ApiKeysPage,
  AppConfigData,
  ContextModulePage,
  DashboardPage,
  EnvironmentsPage,
  FlowPage,
  ProjectDetailsPage,
  ProjectsPage,
  RuleEnginePage,
  SettingsStaticPage,
  SidebarData,
} from "#/common/static-data";
import { operonApiClient } from "#/libs/apiClient";
import { ComposeEndpoints } from "./endpoints";
import type { AppConfig, PageContent, SidebarContent } from "./interfaces";

const CONTENT_STALE_TIME = 5 * 60 * 1000;

// Static-data fallbacks keyed by CMS collection id, so the shell always renders
// (sidebar, header, page titles) even if the compose backend is unreachable.
//
// The delivery API returns the payload directly. It used to be wrapped in a
// `{"MetaData": ...}` envelope, which leaked an internal name into the public
// contract and made every consumer destructure past it for nothing.
const STATIC_PAGE_FALLBACKS: Record<string, PageContent> = {
  dashboard: DashboardPage as PageContent,
  projects: ProjectsPage,
  "project-details": ProjectDetailsPage,
  environments: EnvironmentsPage,
  "api-keys": ApiKeysPage,
  context: ContextModulePage,
  "rule-engine": RuleEnginePage,
  flow: FlowPage,
  settings: SettingsStaticPage,
};

const genericPageFallback: PageContent = {
  page: { title: "", subtitle: "" },
  content: {},
};

export const appConfigContentOptions = queryOptions({
  queryKey: ["content", "app-config"],
  queryFn: async () => {
    try {
      const meta = await operonApiClient.get<AppConfig>(
        ComposeEndpoints.CONTENT("app-config"),
      );
      if (meta && Object.keys(meta).length > 0) return meta;
      return AppConfigData;
    } catch {
      return AppConfigData;
    }
  },
  staleTime: CONTENT_STALE_TIME,
});

export const sidebarContentOptions = queryOptions({
  queryKey: ["content", "sidebar"],
  queryFn: async () => {
    try {
      const meta = await operonApiClient.get<SidebarContent>(
        ComposeEndpoints.CONTENT("sidebar"),
      );
      if (meta?.groups && meta.groups.length > 0) return meta;
      return SidebarData;
    } catch {
      return SidebarData;
    }
  },
  staleTime: CONTENT_STALE_TIME,
});

export const getPageContentOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["content", collectionId],
    queryFn: async () => {
      const fallback =
        STATIC_PAGE_FALLBACKS[collectionId] ?? genericPageFallback;
      try {
        const meta = await operonApiClient.get<PageContent>(
          ComposeEndpoints.CONTENT(collectionId),
        );
        if (meta?.page?.title) return meta;
        return fallback;
      } catch {
        return fallback;
      }
    },
    staleTime: CONTENT_STALE_TIME,
    enabled: Boolean(collectionId),
  });
