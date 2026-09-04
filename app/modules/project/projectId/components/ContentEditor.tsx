import { Plus, Trash2 } from "@operonstudio/icons";
import { Box, Button, Input, Modal, Textarea, toast } from "@operonstudio/ui";
import { useEffect, useState } from "react";
import {
  DEFAULT_VARIANT,
  type Variant,
} from "#/modules/project/projectId/content-api";
import * as classes from "./style";

interface ContentEditorProps {
  variants: Variant[];
  /** 0 means nothing has been published in this environment yet. */
  version: number;
  isSaving: boolean;
  onSave: (variants: Variant[], note: string) => void;
}

/**
 * Edits the payloads a rule can choose between.
 *
 * A collection used to hold exactly one blob, so serving different copy to
 * different visitors meant a second collection at a second URL, which the
 * client had to pick between itself. Variants let one URL answer differently.
 */
export const ContentEditor = ({
  variants,
  version,
  isSaving,
  onSave,
}: ContentEditorProps) => {
  const [drafts, setDrafts] = useState<Variant[]>(variants);
  const [activeKey, setActiveKey] = useState(DEFAULT_VARIANT);
  const [text, setText] = useState("{}");
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");

  // Re-seed whenever the server hands back a different version, which happens
  // after a save, a rollback, or switching environment.
  useEffect(() => {
    setDrafts(variants);
    setActiveKey((current) =>
      variants.some((v) => v.key === current) ? current : DEFAULT_VARIANT,
    );
  }, [variants]);

  const active = drafts.find((v) => v.key === activeKey) ?? drafts[0];

  useEffect(() => {
    setText(JSON.stringify(active?.data ?? {}, null, 2));
  }, [active]);

  const commitText = (): Variant[] | null => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      toast.error(`The JSON in "${activeKey}" is not valid`);
      return null;
    }
    return drafts.map((v) =>
      v.key === activeKey ? { ...v, data: parsed } : v,
    );
  };

  const switchTo = (key: string) => {
    const committed = commitText();
    if (!committed) return;
    setDrafts(committed);
    setActiveKey(key);
  };

  const addVariant = () => {
    const key = newKey.trim();
    if (!key) return;
    if (drafts.some((v) => v.key === key)) {
      toast.error(`There is already a variant called "${key}"`);
      return;
    }
    const committed = commitText();
    if (!committed) return;

    // A new variant starts from the default so it is a copy to edit down,
    // rather than an empty object that silently serves nothing.
    const base = committed.find((v) => v.key === DEFAULT_VARIANT)?.data ?? {};
    setDrafts([...committed, { key, data: structuredClone(base) }]);
    setActiveKey(key);
    setNewKey("");
    setIsAdding(false);
  };

  const removeVariant = (key: string) => {
    setDrafts((current) => current.filter((v) => v.key !== key));
    setActiveKey(DEFAULT_VARIANT);
  };

  const save = () => {
    const committed = commitText();
    if (!committed) return;
    onSave(committed, "");
  };

  return (
    <Box {...classes.editorPaneStyle}>
      <Box {...classes.variantBarStyle}>
        {drafts.map((variant) => {
          const isActive = variant.key === activeKey;
          return (
            <button
              key={variant.key}
              type="button"
              onClick={() => switchTo(variant.key)}
              {...classes.variantTabStyle}
              style={{
                borderColor: isActive
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-border)",
                color: isActive
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-text-muted)",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {variant.key}
              {variant.key === DEFAULT_VARIANT && (
                <span {...classes.variantHintStyle}>fallback</span>
              )}
            </button>
          );
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(true)}
          style={{ gap: 4 }}
        >
          <Plus size={14} /> Variant
        </Button>

        {activeKey !== DEFAULT_VARIANT && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeVariant(activeKey)}
            aria-label={`Remove the ${activeKey} variant`}
            style={{ color: "var(--operon-color-danger)" }}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </Box>

      <Box {...classes.editorStyle}>
        <Textarea
          fullHeight
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          placeholder='{"title": "Hello"}'
          style={{
            resize: "none",
            minHeight: "280px",
            fontFamily: "var(--operon-typography-mono)",
            fontSize: "13px",
          }}
        />
      </Box>

      <Box {...classes.editorFooterStyle}>
        <Box {...classes.versionNoteStyle}>
          {version === 0
            ? "Not published in this environment yet"
            : `Editing on top of v${version}`}
        </Box>
        <Button size="sm" onClick={save} disabled={isSaving}>
          {isSaving ? "Publishing…" : "Publish"}
        </Button>
      </Box>

      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="Add a variant"
        size="sm"
        footer={
          <Box display="flex" gap="8px">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={addVariant} disabled={!newKey.trim()}>
              Add
            </Button>
          </Box>
        }
      >
        <Box display="flex" direction="column" gap="10px">
          <Box {...classes.modalHintStyle}>
            A rule can serve this payload instead of the default. Name it after
            what selects it, such as a locale or a plan.
          </Box>
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addVariant();
            }}
            placeholder="es"
            autoFocus
          />
        </Box>
      </Modal>
    </Box>
  );
};
