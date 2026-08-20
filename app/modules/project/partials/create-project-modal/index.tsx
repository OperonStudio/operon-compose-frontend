import { Box, Button, Input, Modal, Textarea } from "@operonstudio/ui";
import { useState } from "react";

export const CreateProjectModal = ({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: { name: string; description: string }) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate({
      name,
      description,
    });

    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      footer={
        <Box display="flex" justify="flex-end" gap={12}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleCreate}>
            Create Project
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
