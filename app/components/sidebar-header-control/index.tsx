import { useState } from "react";
import { Box } from "@operonstudio/ui";
import { WorkspaceSwitcher } from "../workspace-switcher";
import { MobileEnvironmentSelector } from "../header";
import * as classes from "./style";

export function SidebarHeaderControl() {
  const [activeTab, setActiveTab] = useState<"workspace" | "environment">("workspace");

  return (
    <Box className={classes.headerControlWrapperStyle.className}>
      <Box className={classes.segmentedTabBarStyle.className}>
        <button
          type="button"
          onClick={() => setActiveTab("workspace")}
          className={classes.tabButtonStyle.className}
          style={{
            background:
              activeTab === "workspace"
                ? "var(--operon-color-surface, #ffffff)"
                : "transparent",
            color:
              activeTab === "workspace"
                ? "var(--operon-color-primary)"
                : "var(--operon-color-text-muted)",
            boxShadow:
              activeTab === "workspace"
                ? "0 1px 3px rgba(0,0,0,0.1)"
                : "none",
          }}
        >
          Workspace
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("environment")}
          className={classes.tabButtonStyle.className}
          style={{
            background:
              activeTab === "environment"
                ? "var(--operon-color-surface, #ffffff)"
                : "transparent",
            color:
              activeTab === "environment"
                ? "var(--operon-color-primary)"
                : "var(--operon-color-text-muted)",
            boxShadow:
              activeTab === "environment"
                ? "0 1px 3px rgba(0,0,0,0.1)"
                : "none",
          }}
        >
          Environment
        </button>
      </Box>

      {activeTab === "workspace" ? (
        <WorkspaceSwitcher />
      ) : (
        <MobileEnvironmentSelector />
      )}
    </Box>
  );
}
