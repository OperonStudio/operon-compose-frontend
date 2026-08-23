import { TopProgressBar } from "#/components/top-progress-bar";
import { OnboardingGate } from "#/modules/onboarding";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { RequireAuth, AuthProvider } from "@operonstudio/auth";
import { ThemeProvider, Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Dashboard } from "./dashboard/index";

const HOMEPAGE_URL = import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001";

export const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultDark={false}>
          <AuthProvider>
            <RequireAuth homepageUrl={HOMEPAGE_URL}>
              <TopProgressBar />
              <Toaster />
              <OnboardingGate>
                <Dashboard>{children}</Dashboard>
              </OnboardingGate>
            </RequireAuth>
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
