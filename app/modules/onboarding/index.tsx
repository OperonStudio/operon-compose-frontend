import { Box, Button, Input } from "@operonstudio/ui";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "./hooks";
import * as classes from "./style";

const WORKSPACE_SUGGESTIONS = ["Personal", "My Team", "Playground"];
const ENV_SUGGESTIONS = ["development", "staging", "production"];

interface OnboardingGateProps {
  children: ReactNode;
}

/**
 * Blocks compose product access until the signed-in user has at least one
 * workspace AND at least one environment inside it. Consumes `useAuth` outer
 * context via localStorage-backed active IDs.
 */
export const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const {
    step,
    isLoading,
    isErrored,
    createWorkspace,
    isCreatingWorkspace,
    createEnvironment,
    isCreatingEnvironment,
  } = useOnboarding();

  if (isLoading) {
    return <Box {...classes.centeredLoaderStyle}>Loading your workspace…</Box>;
  }

  if (isErrored) {
    return (
      <Box {...classes.backdropStyle}>
        <Box {...classes.errorPanelStyle}>
          <Box {...classes.titleStyle}>Something went wrong</Box>
          <Box {...classes.bodyStyle}>
            We couldn&apos;t reach the Compose backend. Check that
            `operon-compose-backend` is running on port 8080, then reload.
          </Box>
          <Box {...classes.actionsStyle}>
            <Button size="sm" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (step === "workspace") {
    return (
      <WorkspaceStep
        onSubmit={createWorkspace}
        isSubmitting={isCreatingWorkspace}
      />
    );
  }

  if (step === "environment") {
    return (
      <EnvironmentStep
        onSubmit={createEnvironment}
        isSubmitting={isCreatingEnvironment}
      />
    );
  }

  return <>{children}</>;
};

// ─── Workspace step ─────────────────────────────────────────────────────────

function WorkspaceStep({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (name: string) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("Personal");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trimmed = name.trim();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed || isSubmitting) return;
    onSubmit(trimmed);
  };

  return (
    <Box {...classes.backdropStyle}>
      <form onSubmit={handleSubmit} {...classes.cardStyle}>
        <Box {...classes.eyebrowStyle}>Step 1 of 2</Box>
        <Box {...classes.titleStyle}>Create your first workspace</Box>
        <Box {...classes.bodyStyle}>
          A workspace is the top-level container for your Compose projects, API
          keys, and rules. You can add more later.
        </Box>
        <Box {...classes.fieldGroupStyle}>
          <label {...classes.labelStyle} htmlFor="ob-ws-name">
            Workspace name
          </label>
          <Input
            id="ob-ws-name"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Personal"
            required
            autoComplete="off"
          />
          <Box {...classes.suggestionsRowStyle}>
            {WORKSPACE_SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setName(s)}
                {...classes.suggestionChipStyle}
              >
                {s}
              </button>
            ))}
          </Box>
          <Box {...classes.helpStyle}>
            Tip: use “Personal” if you&apos;re just exploring.
          </Box>
        </Box>
        <Box {...classes.actionsStyle}>
          <Button
            type="submit"
            size="md"
            disabled={!trimmed || isSubmitting}
            aria-label="Create workspace"
          >
            {isSubmitting ? "Creating…" : "Create workspace"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

// ─── Environment step ───────────────────────────────────────────────────────

function EnvironmentStep({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (name: string, description?: string) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("development");
  const [description, setDescription] = useState("Local development");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trimmed = name.trim();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed || isSubmitting) return;
    onSubmit(trimmed, description.trim() || undefined);
  };

  return (
    <Box {...classes.backdropStyle}>
      <form onSubmit={handleSubmit} {...classes.cardStyle}>
        <Box {...classes.eyebrowStyle}>Step 2 of 2</Box>
        <Box {...classes.titleStyle}>Add an environment</Box>
        <Box {...classes.bodyStyle}>
          Environments let you serve different content and rules to different
          audiences (dev, staging, prod). Every project lives inside an
          environment.
        </Box>
        <Box {...classes.fieldGroupStyle}>
          <label {...classes.labelStyle} htmlFor="ob-env-name">
            Environment name
          </label>
          <Input
            id="ob-env-name"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="development"
            required
            autoComplete="off"
          />
          <Box {...classes.suggestionsRowStyle}>
            {ENV_SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setName(s)}
                {...classes.suggestionChipStyle}
              >
                {s}
              </button>
            ))}
          </Box>
        </Box>
        <Box {...classes.fieldGroupStyle}>
          <label {...classes.labelStyle} htmlFor="ob-env-desc">
            Description <span {...classes.helpStyle}>(optional)</span>
          </label>
          <Input
            id="ob-env-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Local development"
            autoComplete="off"
          />
        </Box>
        <Box {...classes.actionsStyle}>
          <Button
            type="submit"
            size="md"
            disabled={!trimmed || isSubmitting}
            aria-label="Create environment"
          >
            {isSubmitting ? "Creating…" : "Create environment"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
