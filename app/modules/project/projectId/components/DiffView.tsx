import { Box } from "@operonstudio/ui";
import type {
  Diff,
  FieldChange,
  VariantDiff,
} from "#/modules/project/projectId/content-api";
import * as classes from "./style";

interface DiffViewProps {
  diff: Diff;
  /** Column headings, left is what exists now and right is what would replace it. */
  leftLabel: string;
  rightLabel: string;
  emptyMessage?: string;
}

/**
 * A two-column diff, in the shape a code review has trained everyone to read:
 * what is there now on the left, what arrives on the right, one row per changed
 * field.
 *
 * The stacked before-then-after list this replaces made you hold both values in
 * your head to compare them. Side by side, the eye does it.
 */
export const DiffView = ({
  diff,
  leftLabel,
  rightLabel,
  emptyMessage = "No differences.",
}: DiffViewProps) => {
  if (diff.identical || diff.variants.length === 0) {
    return <Box {...classes.panelEmptyStyle}>{emptyMessage}</Box>;
  }

  return (
    <Box {...classes.diffTableStyle}>
      <Box {...classes.diffHeadStyle}>
        <Box {...classes.diffHeadCellStyle}>{leftLabel}</Box>
        <Box {...classes.diffHeadCellStyle}>{rightLabel}</Box>
      </Box>

      {diff.variants.map((variant) => (
        <VariantSection key={variant.key} variant={variant} />
      ))}
    </Box>
  );
};

function VariantSection({ variant }: { variant: VariantDiff }) {
  return (
    <Box>
      <Box {...classes.diffVariantHeaderStyle}>
        <span>{variant.key}</span>
        <span {...classes.diffKindStyle}>{variant.kind}</span>
      </Box>
      {variant.changes.map((change) => (
        <ChangeRow key={change.path} change={change} />
      ))}
    </Box>
  );
}

/**
 * One field, one row. An absent side renders as a muted dash rather than an
 * empty cell, so "this field does not exist here" is visibly different from
 * "this field is empty here".
 */
function ChangeRow({ change }: { change: FieldChange }) {
  return (
    <Box {...classes.diffRowStyle}>
      <Box {...classes.diffPathStyle}>{change.path}</Box>
      <Box {...classes.diffCellsStyle}>
        <Box
          {...classes.diffCellStyle}
          style={
            change.kind === "added"
              ? undefined
              : {
                  backgroundColor: "var(--operon-color-danger-ghost)",
                  color: "var(--operon-color-danger)",
                }
          }
        >
          {change.kind === "added" ? (
            <span {...classes.diffAbsentStyle}>not set</span>
          ) : (
            format(change.before)
          )}
        </Box>

        <Box
          {...classes.diffCellStyle}
          style={
            change.kind === "removed"
              ? undefined
              : {
                  backgroundColor: "var(--operon-color-success-ghost)",
                  color: "var(--operon-color-success)",
                }
          }
        >
          {change.kind === "removed" ? (
            <span {...classes.diffAbsentStyle}>removed</span>
          ) : (
            format(change.after)
          )}
        </Box>
      </Box>
    </Box>
  );
}

function format(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}
