import {
  AlertTriangle,
  Check,
  Copy,
  Plus,
  RefreshCw,
} from "@operonstudio/icons";
import { Box, Button, Modal, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPageContentOptions } from "#/common/api/content-api";
import { useActiveScope } from "#/common/use-active-scope";
import { ConfirmModal } from "#/components/confirm-modal";
import { useActiveEnvironment } from "#/modules/environments/hooks";
import {
  getApiKeysOptions,
  type RegenerateKeyResult,
  regenerateApiKeyOptions,
} from "./api";
import * as classes from "./style";

export const ApiKeysPage = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const [copied, setCopied] = useState(false);
  const [keyToRegenerate, setKeyToRegenerate] = useState<{
    projectId: string;
    projectName: string;
    hasExistingKey: boolean;
  } | null>(null);
  const [revealed, setRevealed] = useState<RegenerateKeyResult | null>(null);

  const queryClient = useQueryClient();
  const { activeEnvironment } = useActiveEnvironment();

  const {
    data: projectsWithKeys,
    isLoading,
    isError,
    refetch,
  } = useQuery(getApiKeysOptions());
  const { data: pageData } = useQuery(getPageContentOptions("api-keys"));
  const labels = pageData?.content?.labels;
  const modals = pageData?.modals;

  const { mutate: regenerateApiKey, isPending } = useMutation({
    ...regenerateApiKeyOptions,
    onSuccess: (data) => {
      // API keys are hashed at rest; this is the only time the user will see
      // the plaintext value. Show it in a modal and force an explicit dismiss.
      setRevealed(data);
      queryClient.invalidateQueries({ queryKey: getApiKeysOptions().queryKey });
    },
    onError: () => {
      toast.error(labels?.regenerateError ?? "Failed to regenerate API key");
    },
  });

  const handleCopyKey = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(labels?.copySuccess ?? "Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateClick = (
    projectId: string,
    projectName: string,
    hasExistingKey: boolean,
  ) => {
    setKeyToRegenerate({ projectId, projectName, hasExistingKey });
  };

  const confirmRegenerate = () => {
    if (!keyToRegenerate || !activeEnvironment) return;
    regenerateApiKey({
      projectId: keyToRegenerate.projectId,
      req: { environmentId: activeEnvironment.id },
    });
    setKeyToRegenerate(null);
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted || isLoading) {
    return (
      <Box {...classes.pageContainerStyle}>
        <Box
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--operon-color-text-muted)",
          }}
        >
          Loading API keys…
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box {...classes.pageContainerStyle}>
        <Box
          style={{
            padding: "32px",
            textAlign: "center",
            border: "1px solid var(--operon-color-border)",
            borderRadius: "12px",
          }}
        >
          <Box
            style={{
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: 8,
              color: "var(--operon-color-text)",
            }}
          >
            Could not load API keys
          </Box>
          <Box
            style={{
              fontSize: "13px",
              color: "var(--operon-color-text-muted)",
              marginBottom: 16,
            }}
          >
            The Compose backend didn't respond.
          </Box>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  const hasAnyProject = (projectsWithKeys ?? []).length > 0;

  return (
    <Box {...classes.pageContainerStyle}>
      {!hasAnyProject && (
        <Box
          style={{
            padding: "40px 24px",
            textAlign: "center",
            border: "1px dashed var(--operon-color-border)",
            borderRadius: "12px",
            color: "var(--operon-color-text-muted)",
          }}
        >
          No projects yet. Create a project in this environment to generate API
          keys.
        </Box>
      )}

      <Box display="flex" direction="column" gap={32}>
        {projectsWithKeys?.map((project) => (
          <Box key={project.id} {...classes.projectSectionStyle}>
            <Box display="flex" justify="space-between" align="center">
              <Box {...classes.projectTitleStyle}>{project.name}</Box>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleRegenerateClick(
                    project.id,
                    project.name,
                    Boolean(project.keys?.length),
                  )
                }
                disabled={isPending || !activeEnvironment}
                style={{ gap: 6 }}
              >
                {project.keys?.length ? (
                  <>
                    <RefreshCw size={14} /> Regenerate
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Generate key
                  </>
                )}
              </Button>
            </Box>

            <Box display="flex" direction="column" gap={12}>
              {project.keys?.length ? (
                project.keys.map((apiKey) => (
                  <Box key={apiKey.id} {...classes.keyContainerStyle}>
                    <Box {...classes.keyInfoStyle}>
                      <Box {...classes.keyNameStyle}>
                        {apiKey.name || `${apiKey.environment} key`}
                      </Box>
                      <Box {...classes.keyDateStyle}>
                        {labels?.createdOn ?? "Created on"}{" "}
                        {new Date(apiKey.createdAt).toLocaleDateString()}
                      </Box>
                    </Box>

                    <Box {...classes.keyValueStyle} title="Key prefix">
                      {apiKey.prefix || "opc_…"}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "var(--operon-color-text-muted)",
                    fontSize: "13px",
                  }}
                >
                  No key for this project in{" "}
                  {activeEnvironment?.name ?? "this environment"} yet. Generate
                  one to start calling the delivery API.
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <ConfirmModal
        isOpen={!!keyToRegenerate}
        onClose={() => setKeyToRegenerate(null)}
        onConfirm={confirmRegenerate}
        title={
          keyToRegenerate?.hasExistingKey
            ? (modals?.regenerate?.title ?? "Regenerate API key")
            : "Generate API key"
        }
        message={
          keyToRegenerate?.hasExistingKey
            ? (modals?.regenerate?.message ??
              `Any application using the current ${keyToRegenerate?.projectName} key will lose access the moment you regenerate. You will see the new key exactly once, so copy it before dismissing the dialog.`)
            : `This creates the first key for ${keyToRegenerate?.projectName} in ${activeEnvironment?.name ?? "this environment"}. You will see it exactly once, so copy it before dismissing the dialog.`
        }
        confirmText={
          keyToRegenerate?.hasExistingKey
            ? (modals?.regenerate?.confirmLabel ?? "Regenerate")
            : "Generate"
        }
        isDestructive={keyToRegenerate?.hasExistingKey ?? false}
      />

      {/* One-shot reveal modal. The plaintext value is never returned again. */}
      <Modal
        isOpen={!!revealed}
        onClose={() => setRevealed(null)}
        title="Your new API key"
        size="md"
        footer={
          <Box
            display="flex"
            justify="flex-end"
            gap="12px"
            style={{ width: "100%" }}
          >
            <Button variant="outline" onClick={() => setRevealed(null)}>
              I've saved it
            </Button>
            <Button
              variant="primary"
              onClick={() => revealed && handleCopyKey(revealed.plaintextValue)}
              style={{ gap: 6 }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              Copy key
            </Button>
          </Box>
        }
      >
        {revealed && (
          <Box display="flex" direction="column" gap="12px">
            <Box
              display="flex"
              align="center"
              gap="8px"
              style={{
                background: "rgba(255, 176, 32, 0.10)",
                border: "1px solid rgba(255, 176, 32, 0.35)",
                color: "var(--operon-color-warning)",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13px",
              }}
            >
              <AlertTriangle size={16} />
              This is the only time you'll see this key. Store it in a secret
              manager before dismissing this dialog.
            </Box>
            <Box
              style={{
                fontFamily: "var(--operon-typography-mono)",
                fontSize: "13px",
                padding: "12px 14px",
                background: "var(--operon-color-surface-sunken)",
                borderRadius: "8px",
                wordBreak: "break-all",
                userSelect: "all",
              }}
            >
              {revealed.plaintextValue}
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
};
