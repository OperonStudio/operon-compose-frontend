import { TopProgressBar } from "#/components/top-progress-bar";
import { AppThemeProvider } from "#/contexts/theme";
import { OnboardingGate } from "#/modules/onboarding";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { AuthGate, AuthProvider, extractTokenFromURL } from "@operonstudio/auth";
import { Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Dashboard } from "./dashboard/index";

const ENABLE_URL_TOKEN_BRIDGE =
  import.meta.env.VITE_ENABLE_URL_TOKEN_BRIDGE === "true" ||
  import.meta.env.DEV;

const HOMEPAGE_URL =
  import.meta.env.VITE_HOMEPAGE_URL ?? "https://operonstudio.tech";

// Extract token synchronously before TanStack Router mounts and strips it
if (typeof window !== "undefined") {
  extractTokenFromURL();
}

export const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider
          refreshUrl="/api/auth/refresh"
          enableUrlTokenBridge={ENABLE_URL_TOKEN_BRIDGE}
        >
          <AppThemeProvider>
            <AuthGate homepageUrl={HOMEPAGE_URL}>
              <TopProgressBar />
              <Toaster />
              <OnboardingGate>
                <Dashboard>{children}</Dashboard>
              </OnboardingGate>
            </AuthGate>
          </AppThemeProvider>
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
      </body>
    </html>
  );
};
