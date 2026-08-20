import { usePhone } from "#/libs/utils";
import { FileEdit, X } from "@operonstudio/icons";
import { Box, Button, Card, Chip } from "@operonstudio/ui";
import { Link } from "@tanstack/react-router";
import * as classes from "./style";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  apiCount?: number;
  environments?: string[];
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string, title: string) => void;
}

export const ProjectCard = ({
  id,
  title,
  description,
  apiCount = 0,
  environments = [],
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  const isPhone = usePhone();

  return (
    <Card shadow="sm">
      <Box
        display="flex"
        direction="row"
        align={isPhone ? "flex-start" : "center"}
        justify="space-between"
        gap={16}
        style={{ padding: "24px" }}
      >
        <Link
          to="/projects/$projectId"
          params={{ projectId: id }}
          {...classes.linkStyle}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: isPhone ? "flex-start" : "center",
            justifyContent: "space-between",
            flexWrap: isPhone ? "wrap" : "nowrap",
            gap: "16px",
            minWidth: 0,
          }}
        >
          <Box
            {...classes.textGroupStyle}
            style={{ flex: isPhone ? 1 : "0 1 auto", minWidth: 0 }}
          >
            <h2
              {...classes.titleStyle}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </h2>
            <p
              {...classes.descriptionStyle}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {description}
            </p>
          </Box>

          <Box
            {...classes.chipsRowStyle}
            style={{
              width: isPhone ? "100%" : "auto",
            }}
          >
            <Chip variant="outline" color="secondary">
              {apiCount} APIs
            </Chip>
            {environments.map((env) => (
              <Chip key={env} variant="outline" color="secondary">
                {env}
              </Chip>
            ))}
          </Box>
        </Link>
        <Box display="flex">
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
};
