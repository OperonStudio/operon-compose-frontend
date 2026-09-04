import { X } from "@operonstudio/icons";
import { Box, Button, Chip } from "@operonstudio/ui";
import type { ContextVariable } from "../../../context-module/api";

interface AttributesSectionProps {
  selectedAttributes: ContextVariable[];
  onRemoveAttribute: (id: string) => void;
  onAddClick: () => void;
}

export const AttributesSection = ({
  selectedAttributes,
  onRemoveAttribute,
  onAddClick,
}: AttributesSectionProps) => {
  return (
    <Box
      style={{
        border: "1px solid var(--operon-color-border)",
        borderRadius: "var(--operon-radius-lg, 14px)",
        background: "var(--operon-color-surface)",
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        justify="space-between"
        align="center"
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--operon-color-border)",
        }}
      >
        <Box
          style={{
            fontWeight: 600,
            fontSize: "16px",
            color: "var(--operon-color-text)",
          }}
        >
          Add Attributes
        </Box>
        <Button variant="primary" onClick={onAddClick}>
          Add Attribute
        </Button>
      </Box>
      <Box
        style={{
          padding: "24px",
          background: "var(--operon-color-surface-sunken)",
          minHeight: "100px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {selectedAttributes.length === 0 ? (
          <Box
            style={{
              color: "var(--operon-color-text-muted)",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: "60px",
              fontStyle: "italic",
            }}
          >
            No attributes selected yet. Click "Add Attribute" to get started.
          </Box>
        ) : (
          selectedAttributes.map((attr) => (
            <Chip
              key={attr.id}
              variant="solid"
              style={{
                background: "var(--operon-color-surface)",
                padding: "8px 14px",
                border: "1px solid var(--operon-color-border)",
                fontWeight: 600,
                color: "var(--operon-color-primary)",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {attr.name}
              <Box
                onClick={() => onRemoveAttribute(attr.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "var(--operon-color-surface-raised)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={14} color="var(--operon-color-primary)" />
              </Box>
            </Chip>
          ))
        )}
      </Box>
    </Box>
  );
};
