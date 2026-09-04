import { useAuth } from "@operonstudio/auth";
import { AlertTriangle, Check, X } from "@operonstudio/icons";
import { Box, Button, Chip, Modal, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "#/common/api/query-keys";
import {
  acceptInvitationOptions,
  getInvitationInfoOptions,
  getWorkspaceOptions,
} from "#/modules/settings/team/api";

const HOMEPAGE_URL =
  import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001";

interface InvitationConfirmModalProps {
  /** The `?token=` value from the URL; when null the modal stays closed. */
  token: string | null;
  /** Fired after the user accepts, dismisses, or resolves a mismatch. */
  onClose: () => void;
}

/**
 * Renders the invitation confirmation modal for the four possible states:
 *
 *   1. Loading — while `/invitations/info` is in flight.
 *   2. Invalid — token unknown, revoked, expired, or already accepted.
 *   3. Match — the signed-in user's email equals the invitation's target
 *      email. Explicit "Accept" button, no silent auto-accept.
 *   4. Mismatch — signed-in user is NOT the invited user. Offers a
 *      "Log out & switch account" action instead of accepting.
 *
 * This replaces the previous `useEffect(() => acceptInviteMutation.mutate(token))`
 * flow, which allowed any logged-in user to silently claim any invitation
 * link they clicked.
 */
export function InvitationConfirmModal({
  token,
  onClose,
}: InvitationConfirmModalProps) {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const {
    data: info,
    isLoading,
    isError,
    error,
  } = useQuery(getInvitationInfoOptions(token));

  const inviteWorkspace = useQuery(
    getWorkspaceOptions(info?.workspaceId ?? ""),
  );

  const acceptMutation = useMutation({
    ...acceptInvitationOptions,
    onSuccess: (res: { message: string; status?: string }) => {
      const alreadyMember = res?.status === "already_member";
      // Joining changes which workspaces the user can see, and the roster of
      // the one they just joined.
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces() });
      if (info?.workspaceId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspace(info.workspaceId),
        });
      }
      toast.success(
        alreadyMember
          ? "You are already a member of this workspace."
          : "Successfully joined workspace!",
      );
      handleDismiss();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to accept invitation.");
    },
  });

  const handleDismiss = () => {
    // Strip `?token=` from the URL so a refresh doesn't re-open the modal.
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search,
      );
    }
    onClose();
  };

  const status = useMemo<
    "loading" | "invalid" | "match" | "mismatch" | "no-user"
  >(() => {
    if (!token) return "invalid";
    if (isLoading) return "loading";
    if (isError || !info) return "invalid";
    if (info.expired || info.status !== "pending") return "invalid";
    if (!user?.email) return "no-user";
    return info.email.toLowerCase() === user.email.toLowerCase()
      ? "match"
      : "mismatch";
  }, [token, isLoading, isError, info, user?.email]);

  if (!token) return null;

  return (
    <Modal
      isOpen
      onClose={handleDismiss}
      title="Accept Workspace Invitation"
      size="md"
      footer={renderFooter({
        status,
        pending: acceptMutation.isPending,
        onAccept: () => acceptMutation.mutate(token),
        onDismiss: handleDismiss,
        onSwitchAccount: async () => {
          try {
            await logout();
          } finally {
            if (typeof window !== "undefined") {
              const next = encodeURIComponent(window.location.href);
              window.location.href = `${HOMEPAGE_URL}/login?next=${next}`;
            }
          }
        },
      })}
    >
      {status === "loading" && (
        <Box
          style={{
            padding: "24px 0",
            textAlign: "center",
            color: "var(--operon-color-text-muted)",
            fontSize: "14px",
          }}
        >
          Verifying invitation…
        </Box>
      )}

      {status === "invalid" && (
        <Box
          display="flex"
          direction="column"
          gap="12px"
          style={{ padding: "8px 0" }}
        >
          <Box
            display="flex"
            align="center"
            gap="10px"
            style={{ color: "var(--operon-color-danger)", fontWeight: 700 }}
          >
            <AlertTriangle size={18} /> Invitation not usable
          </Box>
          <Box
            style={{
              color: "var(--operon-color-text-muted)",
              fontSize: "13px",
            }}
          >
            {(error as { message?: string })?.message ??
              "This invitation link is invalid, has been revoked, expired, or has already been accepted. Ask the workspace owner to send a new one."}
          </Box>
        </Box>
      )}

      {status === "no-user" && (
        <Box
          style={{ color: "var(--operon-color-text-muted)", fontSize: "13px" }}
        >
          Please sign in to accept this invitation.
        </Box>
      )}

      {status === "match" && info && (
        <Box display="flex" direction="column" gap="14px">
          <Box
            style={{
              fontSize: "14px",
              color: "var(--operon-color-text)",
              lineHeight: 1.55,
            }}
          >
            You've been invited to join{" "}
            <strong>{inviteWorkspace.data?.name ?? "this workspace"}</strong> as
            a <Chip variant="subtle">{info.role}</Chip>.
          </Box>
          <Box
            style={{
              fontSize: "12px",
              color: "var(--operon-color-text-muted)",
              fontFamily: "var(--operon-typography-mono)",
              wordBreak: "break-all",
            }}
          >
            Invited email: {info.email}
          </Box>
        </Box>
      )}

      {status === "mismatch" && info && (
        <Box display="flex" direction="column" gap="14px">
          <Box
            display="flex"
            align="center"
            gap="10px"
            style={{
              color: "var(--operon-color-warning)",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            <AlertTriangle size={18} /> Wrong account
          </Box>
          <Box
            style={{
              fontSize: "13px",
              color: "var(--operon-color-text-muted)",
              lineHeight: 1.55,
            }}
          >
            This invite was sent to <strong>{info.email}</strong>, but you're
            signed in as <strong>{user?.email}</strong>. Log out and sign in as
            the invited user to accept.
          </Box>
        </Box>
      )}
    </Modal>
  );
}

function renderFooter({
  status,
  pending,
  onAccept,
  onDismiss,
  onSwitchAccount,
}: {
  status: "loading" | "invalid" | "match" | "mismatch" | "no-user";
  pending: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onSwitchAccount: () => void;
}) {
  return (
    <Box display="flex" justify="flex-end" gap="12px" style={{ width: "100%" }}>
      {status === "match" && (
        <>
          <Button variant="outline" onClick={onDismiss} disabled={pending}>
            <X size={14} style={{ marginRight: 6 }} /> Not now
          </Button>
          <Button variant="primary" onClick={onAccept} disabled={pending}>
            <Check size={14} style={{ marginRight: 6 }} />
            {pending ? "Accepting…" : "Accept & Join"}
          </Button>
        </>
      )}

      {status === "mismatch" && (
        <>
          <Button variant="outline" onClick={onDismiss}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSwitchAccount}>
            Log out & switch account
          </Button>
        </>
      )}

      {(status === "invalid" ||
        status === "loading" ||
        status === "no-user") && (
        <Button variant="outline" onClick={onDismiss}>
          Close
        </Button>
      )}
    </Box>
  );
}

/**
 * Convenience hook: reads the `token` from the current URL search params and
 * keeps it in state so consumers can drive a modal open/close cycle. Returns
 * both the token and a setter that clears it.
 */
export function useInvitationToken(): [string | null, () => void] {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = new URLSearchParams(window.location.search).get("token");
    if (t) setToken(t);
  }, []);

  return [token, () => setToken(null)];
}
