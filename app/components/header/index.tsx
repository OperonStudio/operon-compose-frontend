import { cx } from "@morph-css/kit";
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
    <Box {...classes.topbarStyle}>
      <Box display="flex">
        <Breadcrumb items={breadcrumbItems} />
      </Box>

      {isSearchable && (
        <Box
          className={cx(
            classes.searchContainerStyle.className,
            classes.hideOnMobileStyle.className,
          )}
          style={{
            ...classes.searchContainerStyle.style,
            ...classes.hideOnMobileStyle.style,
          }}
        >
          <Input
            startIcon={<Search size={16} />}
            placeholder={searchBarPlaceholder}
            fullWidth
            variant="filled"
          />
        </Box>
      )}

      <Box
        className={classes.hideOnMobileStyle.className}
        style={classes.hideOnMobileStyle.style}
      >
        <Box {...classes.rightActionsStyle}>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                disabled={environments.length === 0}
              >
                <Box display="flex" align="center" gap={8}>
                  {activeEnvironment
                    ? activeEnvironment.name
                    : "No Environment"}
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

          <Button
            variant="ghost"
            size="sm"
            {...classes.iconButtonStyle}
            rounded
          >
            <Bell size={16} color="var(--operon-color-text-muted)" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
