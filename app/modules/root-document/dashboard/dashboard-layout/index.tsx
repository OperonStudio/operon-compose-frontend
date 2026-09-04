import { cx } from "@morph-css/kit";
import { useAuth } from "@operonstudio/auth";
import {
  BarChart3,
  Code,
  Database,
  LayoutDashboard,
  Moon,
  Sun,
} from "@operonstudio/icons";
import {
  AppShell,
  type AppShellNavGroup,
  type AppShellProduct,
  Toggle,
  useTheme,
} from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
  appConfigContentOptions,
  sidebarContentOptions,
} from "#/common/api/content-api";
import type {
  SidebarGroupData,
  SidebarItemData,
} from "#/common/api/interfaces";
import { resolveIcon } from "#/common/icon-map";
import { Header, SubHeaderBreadcrumbs } from "#/components/header";
import { SidebarHeaderControl } from "#/components/sidebar-header-control";
import * as classes from "./style";

const isProdDomain =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith("operonstudio.tech");

const HOMEPAGE_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://operonstudio.tech"
    : (import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001");
const COMPOSE_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://compose.operonstudio.tech"
    : (import.meta.env.VITE_COMPOSE_URL ?? "http://localhost:4000");
const CODEBLOCKS_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://codeblocks.operonstudio.tech"
    : (import.meta.env.VITE_CODEBLOCKS_URL ?? "http://localhost:4002");
const ANALYTICS_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://analytics.operonstudio.tech"
    : (import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:4003");

const PRODUCTS: AppShellProduct[] = [
  {
    key: "homepage",
    label: "Studio",
    description: "Workspaces and projects",
    url: HOMEPAGE_URL,
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "compose",
    label: "Compose",
    description: "Dynamic data & rules",
    url: COMPOSE_URL,
    icon: <Database size={18} />,
  },
  {
    key: "codeblocks",
    label: "Codeblocks",
    description: "Backend orchestration",
    url: CODEBLOCKS_URL,
    icon: <Code size={18} />,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Visual event binding",
    url: ANALYTICS_URL,
    icon: <BarChart3 size={18} />,
  },
];

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const { data: sidebarData } = useQuery(sidebarContentOptions);
  const { data: appConfig } = useQuery(appConfigContentOptions);

  const sidebarGroups = sidebarData?.groups ?? [];
  const orgName = appConfig?.orgName ?? "Operon";
  const appName = appConfig?.appName ?? "Compose";

  const navGroups: AppShellNavGroup[] = sidebarGroups.map(
    (group: SidebarGroupData, i: number) => ({
      key: `${group.title ?? "group"}-${i}`,
      title: group.title,
      items: group.items.map((item: SidebarItemData, j: number) => {
        const Icon = resolveIcon(item.icon);
        const isActive =
          item.href === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.href);
        const isExternal = item.external || item.href.startsWith("http");
        return {
          key: `${item.href}-${j}`,
          label: item.label,
          icon: <Icon size={16} />,
          href: item.href,
          isActive,
          render: ({
            href,
            className,
            children: content,
            "aria-current": ac,
          }: {
            href?: string;
            className?: string;
            children?: React.ReactNode;
            "aria-current"?: React.AriaAttributes["aria-current"];
          }) =>
            isExternal ? (
              <a
                href={href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
                aria-current={ac}
              >
                {content}
              </a>
            ) : (
              <Link to={href || "#"} className={className} aria-current={ac}>
                {content}
              </Link>
            ),
        };
      }),
    }),
  );

  return (
    <AppShell
      productKey="compose"
      products={PRODUCTS}
      homepageUrl={HOMEPAGE_URL}
      navGroups={navGroups}
      sidebarHeader={<SidebarHeaderControl />}
      topbarStart={<Header />}
      subHeader={<SubHeaderBreadcrumbs />}
      sidebarFooter={
        <>
          <div>
            <div {...classes.orgLineStyle}>{orgName}</div>
            <div {...classes.appLineStyle}>{appName}</div>
          </div>
          <div {...classes.themeToggleStyle}>
            <Sun
              size={12}
              color={
                !isDark
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-text-subtle)"
              }
            />
            <Toggle size="sm" checked={isDark} onChange={toggleTheme} />
            <Moon
              size={12}
              color={
                isDark
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-text-subtle)"
              }
            />
          </div>
        </>
      }
      user={
        user
          ? { name: user.name || user.email || "Signed in", email: user.email }
          : undefined
      }
      onSignOut={async () => {
        await logout();
        window.location.href = HOMEPAGE_URL;
      }}
      className={cx(classes.rootStyle.className)}
      style={classes.rootStyle.style}
    >
      {children}
    </AppShell>
  );
};
