import { AuthProvider, RequireAuth, useAuth } from "@operonstudio/auth";
import { ThemeProvider, Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { TopProgressBar } from "#/components/top-progress-bar";
import { OnboardingGate } from "#/modules/onboarding";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { Dashboard } from "./dashboard/index";

const HOMEPAGE_URL =
  import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001";

/**
 * The Operon Analytics SDK, tracking this console with our own product.
 *
 * This is the only code change tracking ever needs. Which elements are tracked,
 * what the events are called and what they carry are decided in the Analytics
 * console and fetched at runtime, so none of that requires a release.
 *
 * Elements opt in by carrying `data-operon-id`. Nothing without one can be
 * bound, which is deliberate: a generated selector would let anything be
 * tracked with no code change, but it also breaks silently the first time
 * someone reorders the markup.
 */
type OperonGlobal = {
  init(config: { uniqueId: string; apiKey: string; baseUrl: string }): void;
  setContext(values: Record<string, unknown>): void;
};

const operonGlobal = () =>
  (window as unknown as { operon?: OperonGlobal }).operon;

// Read once at module scope: it comes from the build, so it cannot change
// while the app is running and does not belong in a dependency list.
const API_KEY = import.meta.env.VITE_OPERON_KEY;
const ANALYTICS_BASE_URL =
  import.meta.env.VITE_OPERON_ANALYTICS_BACKEND_URL ?? "http://localhost:8083";

/**
 * Loads the script once per page, whatever calls this.
 *
 * React invokes effects twice in development, and the guard used to be "is the
 * global there yet", which is still false while the first script is in flight.
 * Two scripts meant two runtimes, both listening, and every click was recorded
 * twice. The promise is the guard: everyone after the first waits on it.
 */
let loading: Promise<void> | null = null;

function loadOperon(): Promise<void> {
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    if (operonGlobal()) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "/operon.js";
    script.async = true;
    script.onload = () => {
      operonGlobal()?.init({
        uniqueId: "data-operon-id",
        apiKey: API_KEY,
        baseUrl: ANALYTICS_BASE_URL,
      });
      resolve();
    };
    // Measurement failing must never look like the product failing, so this
    // resolves nothing and the console carries on without tracking.
    script.onerror = () => reject(new Error("operon.js failed to load"));
    document.head.appendChild(script);
  });

  return loading;
}

const AnalyticsSdk = () => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;

    let cancelled = false;
    loadOperon().then(
      () => {
        if (!cancelled) setIsReady(true);
      },
      () => {
        // Already logged by the browser. Nothing here should surface it.
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Waits on both, because either can arrive first: the session is restored
  // from a cookie while the script is still downloading on a cold load, and
  // the script is already there when someone signs in later in the session.
  useEffect(() => {
    if (!isReady || !user) return;
    operonGlobal()?.setContext({
      userId: user.id,
      // The name is what makes an event legible in the stream. The email is
      // not registered: it identifies a person, and nothing here needs that.
      userName: user.name,
    });
  }, [isReady, user]);

  return null;
};

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
              <AnalyticsSdk />
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
