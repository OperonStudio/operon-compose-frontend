import { TopProgressBar } from "#/components/top-progress-bar";
import { OnboardingGate } from "#/modules/onboarding";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { AuthGate, AuthProvider, extractTokenFromURL } from "@operonstudio/auth";
import { ThemeProvider, Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Dashboard } from "./dashboard/index";

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
