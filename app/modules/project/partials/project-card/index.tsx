import { FileEdit, X } from "@operonstudio/icons";
import { Box, Button, Card } from "@operonstudio/ui";
import { Link } from "@tanstack/react-router";
import * as classes from "./style";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string, title: string) => void;
}

export const ProjectCard = ({
  id,
  title,
  description,

  onEdit,
  onDelete,
}: ProjectCardProps) => (
  <Card shadow="sm">
    <Box {...classes.cardRowStyle}>
      <Link
        to="/projects/$projectId"
        params={{ projectId: id }}
        data-operon-id="project-card-open"
        {...classes.linkStyle}
      >
        <Box {...classes.textGroupStyle}>
          <h2 {...classes.titleStyle}>{title}</h2>
          {description && <p {...classes.descriptionStyle}>{description}</p>}
        </Box>
      </Link>

      <Box {...classes.actionsStyle}>
        <Button
          variant="ghost"
          size="sm"
          title="Edit"
          aria-label={`Edit ${title}`}
          style={{ padding: "8px", minWidth: 0 }}
          onClick={(e) => {
            e.preventDefault();
            onEdit(id, title, description);
          }}
        >
          <FileEdit size={18} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Delete"
          aria-label={`Delete ${title}`}
          style={{ padding: "8px", minWidth: 0 }}
          onClick={(e) => {
            e.preventDefault();
            onDelete(id, title);
          }}
        >
          <X size={18} />
        </Button>
      </Box>
    </Box>
  </Card>
);
