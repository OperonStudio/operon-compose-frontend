import { getPageContentOptions } from "#/common/api/content-api";
import type { PageAction } from "#/common/api/interfaces";
import { resolveIcon } from "#/common/icon-map";
import { useHeaderActionHandler } from "#/contexts/header-actions";
import { Box, Button } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import * as classes from "./style";

function ActionButton({ action }: { action: PageAction }) {
  const handler = useHeaderActionHandler(action.id);
  const Icon = resolveIcon(action.icon);

  return (
    <Button
      variant={action.variant}
      size="sm"
      onClick={handler}
      disabled={!handler}
      startIcon={<Icon size={16} />}
    >
      {action.label}
    </Button>
  );
}

export function PageHeader() {
  const location = useLocation();
  let collectionId = location.pathname.split("/")[1];

  // if (collectionId === "projects" && location.pathname.split("/").length > 2) {
  //   collectionId = "project-details";
  // }

  const { data: pageData } = useQuery(getPageContentOptions(collectionId));

  if (!pageData) return null;

  const { title = "", subtitle = "", actions = [] } = pageData.page || {};

  return (
    <Box {...classes.pageHeaderContainerStyle}>
      <Box {...classes.titleGroupStyle}>
        <h1 {...classes.titleStyle}>{title}</h1>
        <p {...classes.descriptionStyle}>{subtitle}</p>
      </Box>

      {actions.length > 0 && (
        <Box display="flex" gap={12} align="center">
          {actions.map((action: PageAction) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </Box>
      )}
    </Box>
  );
}
