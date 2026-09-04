import { Bell, Search } from "@operonstudio/icons";
import { Box, Breadcrumb, Button, Input } from "@operonstudio/ui";
import { useHeader } from "./hooks";
import * as classes from "./style";

export function Header() {
  const { breadcrumbItems, isSearchable, searchBarPlaceholder } = useHeader();

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
        <Button variant="ghost" size="sm" {...classes.iconButtonStyle} rounded>
          <Bell size={16} color="var(--operon-color-text-muted)" />
        </Button>
      </Box>
    </Box>
  );
}

export function SubHeaderBreadcrumbs() {
  const { breadcrumbItems } = useHeader();
  return <Breadcrumb items={breadcrumbItems} />;
}
