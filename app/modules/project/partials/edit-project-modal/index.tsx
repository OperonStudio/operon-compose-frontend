import { Box, Button, Input, Modal, Textarea } from "@operonstudio/ui";
import { useEffect, useState } from "react";

export const EditProjectModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: { name: string; description: string }) => void;
  initialData: { name: string; description: string } | null;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleEdit = () => {
    if (!name.trim()) return;

    onEdit({
      name,
      description,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      footer={
        <Box display="flex" justify="flex-end" gap={12}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Box>
      }
    >
      <Box display="flex" direction="column" gap={16}>
        <Input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>
    </Modal>
  );
};
