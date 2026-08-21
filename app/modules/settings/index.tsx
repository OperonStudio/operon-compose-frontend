import { getActiveIds } from "#/libs/utils";
import { useAuth } from "@operonstudio/auth";
import { Check, Copy, Mail, Plus, Trash2 } from "@operonstudio/icons";
import { Box, Button, Chip, Dropdown, Input, Modal, Tabs, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as classes from "./style";
import {
  acceptInvitationOptions,
  createInvitationOptions,
  getInvitationsOptions,
  getWorkspaceOptions,
  revokeInvitationOptions,
} from "./team/api";

export const SettingsPage = () => {
  const { user } = useAuth();
  const { workspaceId } = getActiveIds();
  const queryClient = useQueryClient();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [copiedId, setCopiedId] = useState(false);

  const { data: workspace } = useQuery(getWorkspaceOptions(workspaceId));
  const { data: invitations = [] } = useQuery(getInvitationsOptions());

  const acceptInviteMutation = useMutation({
    ...acceptInvitationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("Successfully joined workspace!");
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to accept invitation.");
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      acceptInviteMutation.mutate(token);
    }
  }, []);

  const createInviteMutation = useMutation({
    ...createInvitationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation sent successfully!");
      setIsInviteModalOpen(false);
      setInviteEmail("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send invitation.");
    },
  });


  const revokeInviteMutation = useMutation({
    ...revokeInvitationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation revoked.");
    },
  });

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    createInviteMutation.mutate({
      email: inviteEmail.trim(),
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

  // Dynamically compute active workspace member list from authenticated user
  const teamMembers = user
    ? [
        {
          id: user.id || "current-user",
          name: user.name || (user.email ? user.email.split("@")[0] : "Workspace Owner"),
          email: user.email || "owner@operon.io",
          role: "Owner",
          status: "Active",
          isCurrentUser: true,
        },
      ]
    : [];

  return (
    <Box {...classes.containerStyle}>
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
              <Box style={{ paddingTop: "20px" }} display="flex" direction="column" gap="24px">
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
                                    color: "#0D9A73",
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
                          <Box display="flex" align="center" gap="12px" style={{ minWidth: 0 }}>
                            <Mail size={18} color="var(--operon-color-text-muted)" style={{ flexShrink: 0 }} />
                            <Box display="flex" direction="column" gap="2px" style={{ minWidth: 0 }}>
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
                            style={{ color: "#DC2626", gap: "6px" }}
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
              <Box style={{ paddingTop: "20px" }} display="flex" direction="column" gap="24px">
                <Box
                  style={{
                    background: "var(--operon-color-surface)",
                    border: "1px solid var(--operon-color-border)",
                    borderRadius: "var(--operon-radius-lg, 8px)",
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
                    <Box>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--operon-color-text-muted)",
                          marginBottom: "6px",
                        }}
                      >
                        Workspace Name
                      </label>
                      <Input
                        value={workspace?.name || "Workspace"}
                        disabled
                        style={{ width: "100%" }}
                      />
                    </Box>

                    <Box>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--operon-color-text-muted)",
                          marginBottom: "6px",
                        }}
                      >
                        Workspace ID
                      </label>
                      <Box {...classes.workspaceIdRowStyle}>
                        <Input
                          value={workspaceId || workspace?.id || "default-workspace"}
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
                    </Box>
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
          <Box>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--operon-color-text)",
                marginBottom: "6px",
              }}
            >
              Colleague Email Address *
            </label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              autoFocus
            />
          </Box>

          <Box>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--operon-color-text)",
                marginBottom: "6px",
              }}
            >
              Access Role
            </label>
            <Dropdown
              onSelect={(val) => setInviteRole(val)}
              trigger={
                <Button variant="outline" style={{ width: "100%" }}>
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
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
