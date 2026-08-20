import { Box, Button, Checkbox, Input, Modal } from "@operonstudio/ui";
import type { ContextVariable } from "../../../context-module/api";

interface AttributesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAttributes: ContextVariable[];
  selectedAttributeIds: string[];
  onToggleAttribute: (id: string) => void;
}

export const AttributesModal = ({
  isOpen,
  onClose,
  allAttributes,
  selectedAttributeIds,
  onToggleAttribute,
}: AttributesModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Attributes"
      size="md"
      footer={
        <Box
          display="flex"
          justify="flex-end"
          gap="12px"
          style={{ width: "100%" }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            style={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            style={{ fontWeight: 600 }}
          >
            Confirm
          </Button>
        </Box>
      }
    >
      <Box style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Search Attributes..."
          style={{ width: "100%", fontFamily: "var(--operon-typography-body)" }}
        />
      </Box>
      <Box
        display="flex"
        direction="column"
        style={{
          border: "1px solid var(--operon-color-border)",
          borderRadius: "var(--operon-radius-md, 6px)",
          maxHeight: "400px",
          overflowY: "auto",
          background: "var(--operon-color-surface)",
        }}
      >
        {allAttributes.map((attr, idx) => {
          const isSelected = selectedAttributeIds.includes(attr.id);
          return (
            <Box
              key={attr.id}
              display="flex"
              justify="space-between"
              align="center"
              onClick={() => onToggleAttribute(attr.id)}
              style={{
                padding: "16px 20px",
                borderBottom:
                  idx < allAttributes.length - 1
                    ? "1px solid var(--operon-color-border)"
                    : "none",
                background: isSelected
                  ? "var(--operon-color-surface-raised, #f9fafb)"
                  : "transparent",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
            >
              <Box
                style={{
                  fontSize: "14px",
                  color: "var(--operon-color-text)",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {attr.name}
              </Box>
              <Box>
                <Checkbox checked={isSelected} onChange={() => {}} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Modal>
  );
};
