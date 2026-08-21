import { Bell, ChevronDown, Search } from "@operonstudio/icons";
import { Box, Breadcrumb, Button, Dropdown, Input } from "@operonstudio/ui";
import { useHeader } from "./hooks";
import * as classes from "./style";

export function Header() {
  const {
    breadcrumbItems,
    isSearchable,
    searchBarPlaceholder,
    environments,
    activeEnvironment,
    switchEnvironment,
  } = useHeader();

  return (
    <Box className={classes.topbarStyle.className}>
      <Box className={classes.desktopBreadcrumbStyle.className}>
        <Breadcrumb items={breadcrumbItems} />
      </Box>

      {isSearchable && (
        <Box className={classes.searchContainerStyle.className}>
          <Input
            startIcon={<Search size={16} />}
            placeholder={searchBarPlaceholder}
            fullWidth
            variant="filled"
          />
        </Box>
      )}

      <Box className={classes.rightActionsStyle.className}>
        <Box className={classes.environmentDesktopStyle.className}>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                disabled={environments.length === 0}
                style={{ whiteSpace: "nowrap" }}
              >
                <Box display="flex" align="center" gap={6}>
                  {activeEnvironment ? activeEnvironment.name : "No Environment"}
                  <ChevronDown size={14} />
                </Box>
              </Button>
            }
            onSelect={(val) => switchEnvironment(val)}
            items={environments.map((env) => ({
              value: env.id,
              label: env.name,
            }))}
          />
        </Box>

        <Button variant="ghost" size="sm" {...classes.iconButtonStyle} rounded>
          <Bell size={16} color="var(--operon-color-text-muted)" />
        </Button>
      </Box>
    </Box>
  );
}

export function MobileEnvironmentSelector() {
  const { environments, activeEnvironment, switchEnvironment } = useHeader();
  if (environments.length === 0) return null;

  return (
    <Box className={classes.mobileEnvironmentWrapperStyle.className}>
      <Dropdown
        trigger={
          <Button
            variant="outline"
            size="sm"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Box display="flex" align="center" gap={6}>
              <span>Environment: <strong>{activeEnvironment ? activeEnvironment.name : "Select"}</strong></span>
            </Box>
            <ChevronDown size={14} />
          </Button>
        }
        onSelect={(val) => switchEnvironment(val)}
        items={environments.map((env) => ({
          value: env.id,
          label: env.name,
        }))}
      />
    </Box>
  );
}

export function SubHeaderBreadcrumbs() {
  const { breadcrumbItems } = useHeader();
  return <Breadcrumb items={breadcrumbItems} />;
}
