import { TopProgressBar } from "#/components/top-progress-bar";
import { OnboardingGate } from "#/modules/onboarding";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { AuthGate, AuthProvider, clearToken, extractTokenFromURL } from "@operonstudio/auth";
import { ThemeProvider, Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Dashboard } from "./dashboard/index";

const HOMEPAGE_URL =
  import.meta.env.VITE_HOMEPAGE_URL ?? "https://operonstudio.tech";

// Handle token extraction and cross-domain logout synchronization
if (typeof window !== "undefined") {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("logout") || urlParams.has("clear")) {
    clearToken();
    urlParams.delete("logout");
    urlParams.delete("clear");
    const newSearch = urlParams.toString();
    const newUrl =
      window.location.pathname +
      (newSearch ? `?${newSearch}` : "") +
      window.location.hash;
    window.history.replaceState({}, "", newUrl);
  } else {
    extractTokenFromURL();
  }
}

export const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>{`
          @media (max-width: 900px) {
            aside {
              display: none !important;
            }
          }
        `}</style>
      </head>
      <body>
        <ThemeProvider defaultDark={false}>
          <AuthProvider
            refreshUrl="/api/auth/refresh"
            enableUrlTokenBridge={true}
          >
            <AuthGate homepageUrl={HOMEPAGE_URL}>
              <TopProgressBar />
              <Toaster />
              <OnboardingGate>
                <Dashboard>{children}</Dashboard>
              </OnboardingGate>
            </AuthGate>
          </AuthProvider>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
};
