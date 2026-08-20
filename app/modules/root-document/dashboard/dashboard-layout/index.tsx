import {
  appConfigContentOptions,
  sidebarContentOptions,
} from "#/common/api/content-api";
import { resolveIcon } from "#/common/icon-map";
import { Header } from "#/components/header";
import { WorkspaceSwitcher } from "#/components/workspace-switcher";
import { useAppTheme } from "#/contexts/theme";
import { cx } from "@morph-css/kit";
import { getToken, useAuth } from "@operonstudio/auth";
import { BarChart3, Code, Database, Moon, Sun } from "@operonstudio/icons";
import {
  AppShell,
  type AppShellNavGroup,
  type AppShellProduct,
  Toggle,
} from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import * as classes from "./style";

const HOMEPAGE_URL =
  import.meta.env.VITE_HOMEPAGE_URL ?? "https://operonstudio.tech";
const COMPOSE_URL =
  import.meta.env.VITE_COMPOSE_URL ?? "https://compose.operonstudio.tech";
const CODEBLOCKS_URL =
  import.meta.env.VITE_CODEBLOCKS_URL ?? "http://localhost:4002";
const ANALYTICS_URL =
  import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:4003";

const PRODUCTS: AppShellProduct[] = [
  {
    key: "compose",
    label: "Compose",
    description: "Dynamic data & rules",
    url: COMPOSE_URL,
    icon: <Database size={16} />,
  },
  {
    key: "codeblocks",
    label: "Codeblocks",
    description: "Backend orchestration",
    url: CODEBLOCKS_URL,
    icon: <Code size={16} />,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Visual event binding",
    url: ANALYTICS_URL,
    icon: <BarChart3 size={16} />,
  },
];

/**
 * Attaches the current auth token to a cross-app URL for dev SSO.
 * The dev URL bridge is documented in `operon-ai-context/DEVELOPMENT_GUIDELINES.md`.
 * In prod this should be replaced with a shared cookie domain — see the auth notes.
 */
function bridgeToken(baseUrl: string): string {
  const token = getToken();
  if (!token) return baseUrl;
  const url = new URL(baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();

  const { data: sidebarData } = useQuery(sidebarContentOptions);
  const { data: appConfig } = useQuery(appConfigContentOptions);

  const sidebarGroups = sidebarData?.groups ?? [];
  const orgName = appConfig?.orgName ?? "Operon";
  const appName = appConfig?.appName ?? "Compose";

  const navGroups: AppShellNavGroup[] = sidebarGroups.map(
    (group: any, i: number) => ({
      key: `${group.title ?? "group"}-${i}`,
      title: group.title,
      items: group.items.map((item: any, j: number) => {
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
            "aria-current"?: any;
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
      navGroups={navGroups}
      sidebarHeader={<WorkspaceSwitcher />}
      topbarStart={<Header />}
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
      onSignOut={() =>
        logout("/api/auth/logout").then(() => {
          window.location.href = HOMEPAGE_URL;
        })
      }
      onSwitchProduct={(product: AppShellProduct) => {
        window.location.href = bridgeToken(product.url);
        return true;
      }}
      className={cx(classes.rootStyle.className)}
      style={classes.rootStyle.style}
    >
      {children}
    </AppShell>
  );
};
