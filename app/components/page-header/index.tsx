import { Box, Button } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { getPageContentOptions } from "#/common/api/content-api";
import type { PageAction } from "#/common/api/interfaces";
import { resolveIcon } from "#/common/icon-map";
import { useHeaderActionHandler } from "#/contexts/header-actions";
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

/**
 * Maps a route to the content collection holding that page's title, subtitle
 * and header actions.
 *
 * Detail routes need their own entry. `/projects/:projectId` lists a project's
 * collections and registers an "Add collection" action, but it was being served
 * the `projects` header, so the page showed a "Create Project" button that the
 * detail page never registers a handler for and that therefore rendered
 * permanently disabled.
 */
function contentKeyForPath(pathname: string): string {
  const [, section, ...rest] = pathname.split("/");
  if (!section) return "dashboard";
  if (section === "projects" && rest.some(Boolean)) return "project-details";
  return section;
}

export function PageHeader() {
  const location = useLocation();
  const collectionId = contentKeyForPath(location.pathname);

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
