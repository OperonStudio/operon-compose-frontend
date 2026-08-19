import { getActiveIds } from "#/libs/utils";
import { useAuth } from "@operon/auth";
import { Check, Copy, Mail, Plus, ShieldCheck as Shield, Trash2, User as Users } from "@operon/icons";
import { Box, Button, Chip, Dropdown, Input, Modal, toast } from "@operon/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createInvitationOptions,
  getInvitationsOptions,
  revokeInvitationOptions,
} from "./team/api";

export const SettingsPage = () => {
  const { user } = useAuth();
  const { workspaceId } = getActiveIds();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"team" | "general">("team");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [copiedId, setCopiedId] = useState(false);

  const { data: invitations = [] } = useQuery(getInvitationsOptions());

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

  // Mock workspace team members list (combined with active user)
  const teamMembers = [
    {
      id: user?.id || "u1",
      name: user?.name || "Workspace Owner",
      email: user?.email || "owner@operon.io",
      role: "Owner",
      status: "Active",
      isCurrentUser: true,
    },
    {
      id: "u2",
      name: "Dev Lead",
      email: "dev@company.com",
      role: "Editor",
      status: "Active",
      isCurrentUser: false,
    },
  ];

  return (
    <Box
      style={{
        padding: "32px 40px 64px",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* ── Header ── */}
      <Box display="flex" justify="space-between" align="center">
        <Box display="flex" direction="column" gap="4px">
          <Box
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--operon-color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            Workspace Settings
          </Box>
          <Box
            style={{
              fontSize: "14px",
              color: "var(--operon-color-text-muted)",
            }}
          >
            Manage team members, permissions, and workspace configuration
          </Box>
        </Box>
        {activeTab === "team" && (
          <Button
            variant="primary"
            onClick={() => setIsInviteModalOpen(true)}
            style={{ gap: "6px" }}
          >
            <Plus size={16} /> Invite Member
          </Button>
        )}
      </Box>

      {/* ── Nav Tabs ── */}
      <Box
        display="flex"
        gap="8px"
        style={{
          borderBottom: "1px solid var(--operon-color-border)",
          paddingBottom: "12px",
        }}
      >
        <Button
          variant={activeTab === "team" ? "primary" : "ghost"}
          onClick={() => setActiveTab("team")}
          style={{ gap: "8px", fontWeight: 600 }}
        >
          <Users size={16} /> Team & Access
        </Button>
        <Button
          variant={activeTab === "general" ? "primary" : "ghost"}
          onClick={() => setActiveTab("general")}
          style={{ gap: "8px", fontWeight: 600 }}
        >
          <Shield size={16} /> General Settings
        </Button>
      </Box>

      {/* ── Team Tab Content ── */}
      {activeTab === "team" && (
        <Box display="flex" direction="column" gap="24px">
          {/* Members Table */}
          <Box
            style={{
              background: "var(--operon-color-surface)",
              border: "1px solid var(--operon-color-border)",
              borderRadius: "var(--operon-radius-lg, 8px)",
              overflow: "hidden",
            }}
          >
            <Box
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--operon-color-border)",
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--operon-color-text)",
              }}
            >
              Active Workspace Members ({teamMembers.length})
            </Box>

            <Box display="flex" direction="column">
              {teamMembers.map((member) => (
                <Box
                  key={member.id}
                  display="flex"
                  align="center"
                  justify="space-between"
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--operon-color-border-subtle)",
                  }}
                >
                  <Box display="flex" align="center" gap="14px">
                    <Box
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--operon-color-primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      {member.name.charAt(0)}
                    </Box>
                    <Box display="flex" direction="column" gap="2px">
                      <Box
                        display="flex"
                        align="center"
                        gap="8px"
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "var(--operon-color-text)",
                        }}
                      >
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
                      <Box
                        style={{
                          fontSize: "13px",
                          color: "var(--operon-color-text-muted)",
                        }}
                      >
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
          <Box
            style={{
              background: "var(--operon-color-surface)",
              border: "1px solid var(--operon-color-border)",
              borderRadius: "var(--operon-radius-lg, 8px)",
              overflow: "hidden",
            }}
          >
            <Box
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--operon-color-border)",
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--operon-color-text)",
              }}
            >
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
                  <Box
                    key={inv.id}
                    display="flex"
                    align="center"
                    justify="space-between"
                    style={{
                      padding: "14px 20px",
                      borderBottom:
                        "1px solid var(--operon-color-border-subtle)",
                    }}
                  >
                    <Box display="flex" align="center" gap="12px">
                      <Mail size={18} color="var(--operon-color-text-muted)" />
                      <Box display="flex" direction="column" gap="2px">
                        <Box
                          style={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "var(--operon-color-text)",
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
      )}

      {/* ── General Tab Content ── */}
      {activeTab === "general" && (
        <Box display="flex" direction="column" gap="24px">
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
              <Box display="flex" gap="10px">
                <Input
                  value={workspaceId || "default-workspace"}
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
      )}

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
