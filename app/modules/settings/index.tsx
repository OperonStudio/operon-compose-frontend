import { useAuth } from "@operonstudio/auth";
import { Check, Copy, Mail, Plus, Trash2 } from "@operonstudio/icons";
import {
  Box,
  Button,
  Chip,
  Dropdown,
  Input,
  Modal,
  Tabs,
  toast,
} from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getActiveScope } from "#/common/active-scope";
import { queryKeys } from "#/common/api/query-keys";
import { useActiveScope } from "#/common/use-active-scope";
import { Field } from "#/components/field";
import {
  InvitationConfirmModal,
  useInvitationToken,
} from "./InvitationConfirmModal";
import * as classes from "./style";
import {
  createInvitationOptions,
  getInvitationsOptions,
  getWorkspaceMembersOptions,
  getWorkspaceOptions,
  revokeInvitationOptions,
} from "./team/api";

export const SettingsPage = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const { user } = useAuth();
  const { workspaceId } = getActiveScope();
  const queryClient = useQueryClient();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [copiedId, setCopiedId] = useState(false);
  const [pendingToken, clearPendingToken] = useInvitationToken();

  const { data: workspace } = useQuery(getWorkspaceOptions(workspaceId));
  const { data: invitations = [] } = useQuery(getInvitationsOptions());
  const { data: members = [] } = useQuery(getWorkspaceMembersOptions());

  const createInviteMutation = useMutation({
    ...createInvitationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invitations(workspaceId),
      });
      toast.success("Invitation sent successfully!");
      setIsInviteModalOpen(false);
      setInviteEmail("");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send invitation.");
    },
  });

  const revokeInviteMutation = useMutation({
    ...revokeInvitationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invitations(workspaceId),
      });
      toast.success("Invitation revoked.");
    },
  });

  const handleSendInvite = () => {
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    // Minimal boundary validation — the backend still performs the
    // authoritative check.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (user?.email && email.toLowerCase() === user.email.toLowerCase()) {
      toast.error("You cannot invite yourself.");
      return;
    }
    createInviteMutation.mutate({
      email,
      role: inviteRole,
    });
  };

  const copyWorkspaceId = () => {
    if (workspaceId) {
      navigator.clipboard.writeText(workspaceId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      toast.success("Workspace ID copied to clipboard!");
    }
  };

  // Prefer the real membership roster from the backend. Fall back to a
  // single-row list for the signed-in user so first-load (before the members
  // query resolves) still renders something meaningful.
  const teamMembers =
    members.length > 0
      ? members.map((m) => ({
          id: m.id || m.userId,
          name: m.name || (m.email ? m.email.split("@")[0] : "Member"),
          email: m.email,
          role: (m.role || "editor").replace(/^\w/, (c) => c.toUpperCase()),
          status: "Active",
          isCurrentUser: user?.id === m.userId,
        }))
      : user
        ? [
            {
              id: user.id || "current-user",
              name:
                user.name ||
                (user.email ? user.email.split("@")[0] : "Workspace Owner"),
              email: user.email || "owner@operon.io",
              role: "Owner",
              status: "Active",
              isCurrentUser: true,
            },
          ]
        : [];

  return (
    <Box {...classes.containerStyle}>
      {/* Invitation acceptance modal — driven by ?token= in the URL. Renders
          nothing when no token is present. */}
      <InvitationConfirmModal
        token={pendingToken}
        onClose={clearPendingToken}
      />

      {/* ── Header ── */}
      <Box {...classes.headerStyle}>
        <Box {...classes.headerTextStyle}>
          <Box {...classes.headerTitleStyle}>Workspace Settings</Box>
          <Box {...classes.headerSubtitleStyle}>
            Manage team members, permissions, and workspace configuration
          </Box>
        </Box>
        <Button
          variant="primary"
          onClick={() => setIsInviteModalOpen(true)}
          style={{ gap: "6px" }}
        >
          <Plus size={16} /> Invite Member
        </Button>
      </Box>

      {/* ── Settings Tabs ── */}
      <Tabs
        style={{ width: "100%" }}
        tabs={[
          {
            label: "Team & Access",
            content: (
              <Box
                style={{ paddingTop: "20px" }}
                display="flex"
                direction="column"
                gap="24px"
              >
                {/* Members Table */}
                <Box {...classes.cardStyle}>
                  <Box {...classes.cardHeaderStyle}>
                    Active Workspace Members ({teamMembers.length})
                  </Box>

                  <Box display="flex" direction="column">
                    {teamMembers.map((member) => (
                      <Box key={member.id} {...classes.memberItemStyle}>
                        <Box {...classes.memberInfoStyle}>
                          <Box {...classes.avatarStyle}>
                            {member.name.charAt(0).toUpperCase()}
                          </Box>
                          <Box {...classes.memberDetailsStyle}>
                            <Box {...classes.memberNameStyle}>
                              {member.name}
                              {member.isCurrentUser && (
                                <Chip
                                  variant="subtle"
                                  style={{
                                    fontSize: "10px",
                                    background: "rgba(51, 214, 166, 0.12)",
                                    color: "var(--operon-color-success)",
                                    fontWeight: 700,
                                  }}
                                >
                                  YOU
                                </Chip>
                              )}
                            </Box>
                            <Box {...classes.memberEmailStyle}>
                              {member.email}
                            </Box>
                          </Box>
                        </Box>

                        <Chip
                          variant="subtle"
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            background: "var(--operon-color-surface-sunken)",
                            color: "var(--operon-color-text)",
                          }}
                        >
                          {member.role}
                        </Chip>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Pending Invitations */}
                <Box {...classes.cardStyle}>
                  <Box {...classes.cardHeaderStyle}>
                    Pending Invitations ({invitations.length})
                  </Box>

                  {invitations.length === 0 ? (
                    <Box
                      style={{
                        padding: "32px 20px",
                        textAlign: "center",
                        color: "var(--operon-color-text-muted)",
                        fontSize: "13px",
                      }}
                    >
                      No pending invitations. Invite colleagues to join this
                      workspace.
                    </Box>
                  ) : (
                    <Box display="flex" direction="column">
                      {invitations.map((inv) => (
                        <Box key={inv.id} {...classes.invitationItemStyle}>
                          <Box
                            display="flex"
                            align="center"
                            gap="12px"
                            style={{ minWidth: 0 }}
                          >
                            <Mail
                              size={18}
                              color="var(--operon-color-text-muted)"
                              style={{ flexShrink: 0 }}
                            />
                            <Box
                              display="flex"
                              direction="column"
                              gap="2px"
                              style={{ minWidth: 0 }}
                            >
                              <Box
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "var(--operon-color-text)",
                                  wordBreak: "break-all",
                                }}
                              >
                                {inv.email}
                              </Box>
                              <Box
                                style={{
                                  fontSize: "11px",
                                  color: "var(--operon-color-text-subtle)",
                                  fontFamily: "var(--operon-typography-mono)",
                                }}
                              >
                                Role: {inv.role} • Status: {inv.status}
                              </Box>
                            </Box>
                          </Box>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeInviteMutation.mutate(inv.id)}
                            style={{ color: "var(--operon-color-danger)", gap: "6px" }}
                          >
                            <Trash2 size={14} /> Revoke
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            ),
          },
          {
            label: "General Settings",
            content: (
              <Box
                style={{ paddingTop: "20px" }}
                display="flex"
                direction="column"
                gap="24px"
              >
                <Box
                  style={{
                    background: "var(--operon-color-surface)",
                    border: "1px solid var(--operon-color-border)",
                    borderRadius: "var(--operon-radius-lg, 14px)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <Box
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--operon-color-text)",
                    }}
                  >
                    Workspace Identification
                  </Box>

                  <Box display="flex" direction="column" gap="16px">
                    <Field label="Workspace name" htmlFor="workspace-name">
                      <Input
                        id="workspace-name"
                        value={workspace?.name || "Workspace"}
                        disabled
                        style={{ width: "100%" }}
                      />
                    </Field>

                    <Field label="Workspace ID" htmlFor="workspace-id">
                      <Box {...classes.workspaceIdRowStyle}>
                        <Input
                          id="workspace-id"
                          value={
                            workspaceId || workspace?.id || "default-workspace"
                          }
                          disabled
                          style={{
                            fontFamily: "var(--operon-typography-mono)",
                            flex: 1,
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={copyWorkspaceId}
                          style={{ gap: "6px" }}
                        >
                          {copiedId ? <Check size={16} /> : <Copy size={16} />}
                          {copiedId ? "Copied" : "Copy ID"}
                        </Button>
                      </Box>
                    </Field>
                  </Box>
                </Box>
              </Box>
            ),
          },
        ]}
      />

      {/* ── Invite Modal ── */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        footer={
          <Box display="flex" justify="flex-end" gap="12px">
            <Button
              variant="outline"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendInvite}>
              Send Invitation
            </Button>
          </Box>
        }
      >
        <Box display="flex" direction="column" gap="16px">
          <Field
            label="Colleague email address"
            htmlFor="invite-email"
            required
          >
            <Input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              autoFocus
            />
          </Field>

          <Field label="Access role" id="invite-role-label">
            <Dropdown
              onSelect={(val) => setInviteRole(val)}
              trigger={
                <Button
                  variant="outline"
                  aria-labelledby="invite-role-label"
                  style={{ width: "100%" }}
                >
                  {inviteRole.toUpperCase()}
                </Button>
              }
              items={[
                { value: "editor", label: "Editor — Edit projects & rules" },
                { value: "viewer", label: "Viewer — Read-only access" },
                {
                  value: "owner",
                  label: "Owner — Full administrative control",
                },
              ]}
            />
          </Field>
        </Box>
      </Modal>
    </Box>
  );
};
