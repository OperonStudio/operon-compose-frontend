import { Box, Tabs } from "@operonstudio/ui";
import { MobileEnvironmentSelector } from "../header";
import { WorkspaceSwitcher } from "../workspace-switcher";
import * as classes from "./style";

export function SidebarHeaderControl() {
  return (
    <Box className={classes.headerControlWrapperStyle.className}>
      <Tabs
        defaultTab={0}
        tabs={[
          {
            label: "Workspace",
            content: <WorkspaceSwitcher />,
          },
          {
            label: "Environment",
            content: <MobileEnvironmentSelector />,
          },
        ]}
      />
    </Box>
  );
}
