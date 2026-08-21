import { type Workspace } from "#/components/workspace-switcher/api";
import { cx } from "@morph-css/kit";
import { Check, ChevronDown, Plus } from "@operonstudio/icons";
import { Box, Button } from "@operonstudio/ui";
import React from "react";
import { useWorkspaceSwitcher } from "./hooks";
import * as classes from "./style";

interface WorkspaceSwitcherProps {
  compact?: boolean;
}

export const WorkspaceSwitcher = ({
  compact = false,
}: WorkspaceSwitcherProps) => {
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    isOpen,
    setIsOpen,
    isCreating,
    setIsCreating,
    newName,
    setNewName,
    dropdownRef,
    isPending,
    handleCreate,
  } = useWorkspaceSwitcher();

  if (workspaces.length === 0 && !isOpen) {
    return (
      <Box {...classes.containerStyle}>
        <Button
          variant="outline"
          size="sm"
          style={{ width: "100%", fontSize: "13px" }}
          onClick={() => {
            setIsOpen(true);
            setIsCreating(true);
          }}
        >
          <Plus size={14} style={{ marginRight: 6 }} />
          Create Workspace
        </Button>
      </Box>
    );
  }

  return (
    <Box
      ref={dropdownRef}
      className={classes.containerStyle.className}
      style={{
        ...classes.containerStyle.style,
        zIndex: isOpen ? 1001 : 100,
      }}
    >
      {/* Trigger button */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        className={cx(
          classes.triggerBoxStyle.className,
          isOpen ? classes.triggerBoxHoverStyle.className : "",
        )}
        style={{
          ...classes.triggerBoxStyle.style,
          ...(isOpen ? classes.triggerBoxHoverStyle.style : {}),
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isOpen) {
            (e.currentTarget as HTMLDivElement).style.background = classes
              .triggerBoxHoverStyle.style?.background as string;
          }
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isOpen) {
            (e.currentTarget as HTMLDivElement).style.background =
              "transparent";
          }
        }}
      >
        {!compact && (
          <>
            <Box {...classes.textContainerStyle}>
              <Box {...classes.textNameStyle}>
                {activeWorkspace?.name ?? "Select Workspace"}
              </Box>
              <Box {...classes.textSubtitleStyle}>Workspace</Box>
            </Box>
            <ChevronDown
              size={14}
              color="var(--operon-color-text-muted)"
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </>
        )}
      </Box>

      {/* Dropdown panel */}
      {isOpen && (
        <Box {...classes.dropdownPanelStyle}>
          {/* Workspace list */}
          <Box {...classes.listContainerStyle}>
            {workspaces.map((ws: Workspace) => {
              const isActive = activeWorkspace?.id === ws.id;
              return (
                <Box
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setIsOpen(false);
                  }}
                  className={cx(
                    classes.listItemStyle.className,
                    isActive ? classes.listItemActiveStyle.className : "",
                  )}
                  style={{
                    ...classes.listItemStyle.style,
                    ...(isActive ? classes.listItemActiveStyle.style : {}),
                    color: isActive
                      ? "var(--operon-color-primary)"
                      : "var(--operon-color-text)",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background =
                        classes.listItemHoverStyle.style?.background as string;
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  <Box {...classes.listItemIconBoxStyle}>
                    {ws.name.charAt(0).toUpperCase()}
                  </Box>
                  <Box {...classes.listItemTextStyle}>{ws.name}</Box>
                  {isActive && (
                    <Check size={13} color="var(--operon-color-primary)" />
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Divider */}
          <Box {...classes.dividerStyle} />

          {/* Create new workspace */}
          {isCreating ? (
            <Box {...classes.createInputContainerStyle}>
              <input
                autoFocus
                placeholder="Workspace name..."
                value={newName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewName(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewName("");
                  }
                }}
                className={classes.createInputStyle.className}
                style={classes.createInputStyle.style}
              />
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={isPending || !newName.trim()}
              >
                {isPending ? "..." : "Add"}
              </Button>
            </Box>
          ) : (
            <Box
              onClick={() => setIsCreating(true)}
              {...classes.createButtonStyle}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.currentTarget as HTMLDivElement).style.color = classes
                  .createButtonHoverStyle.style?.color as string;
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.currentTarget as HTMLDivElement).style.color =
                  "var(--operon-color-text-muted)";
              }}
            >
              <Plus size={14} />
              New workspace
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
