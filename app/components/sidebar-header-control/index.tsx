import { ScopeSwitcher } from "@operonstudio/ui";
import { useHeader } from "../header/hooks";
import { useWorkspaceSwitcher } from "../workspace-switcher/hooks";
import * as classes from "./style";

/**
 * The workspace and environment the console is looking at.
 *
 * This used to be two tabs, each holding its own hand-rolled dropdown, which
 * meant one of the two was always hidden and the same control was written twice
 * here and a third time in the other products. It is the design system's
 * switcher now, showing both at once, and Studio and Analytics render the same
 * one.
 */
export function SidebarHeaderControl() {
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    isPending,
    handleCreate,
  } = useWorkspaceSwitcher();
  const { environments, activeEnvironment, switchEnvironment } = useHeader();

  return (
    <div className={classes.headerControlWrapperStyle.className}>
      <ScopeSwitcher
        levels={[
          {
            label: "Workspace",
            value: activeWorkspace?.id ?? "",
            options: workspaces,
            onChange: switchWorkspace,
            onCreate: handleCreate,
            isCreating: isPending,
          },
          {
            label: "Environment",
            value: activeEnvironment?.id ?? "",
            options: environments,
            onChange: switchEnvironment,
            placeholder: "No environment",
          },
        ]}
      />
    </div>
  );
}
