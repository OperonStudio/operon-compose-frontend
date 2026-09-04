import { RefreshCw } from "@operonstudio/icons";
import { Box, Button } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getVersionDiffOptions,
  type VersionKind,
  type VersionSummary,
} from "#/modules/project/projectId/content-api";
import { DiffView } from "./DiffView";
import * as classes from "./style";

interface HistoryPanelProps {
  projectId: string;
  collectionId: string;
  versions: VersionSummary[];
  isLoading: boolean;
  isRollingBack: boolean;
  onRollback: (version: number) => void;
}

/** How each kind of version reads in the rail. */
const KIND_LABEL: Record<VersionKind, string> = {
  created: "Created",
  modified: "Modified",
  promoted: "Promoted",
  restored: "Restored",
};

/**
 * Version history, laid out so the question "which version has what" is
 * answerable at a glance: the rail lists versions, and selecting one shows the
 * fields that version changed.
 *
 * A list of timestamps alone tells you when something happened, never what,
 * which is why the previous flat list was unreadable a day later.
 */
export const HistoryPanel = ({
  projectId,
  collectionId,
  versions,
  isLoading,
  isRollingBack,
  onRollback,
}: HistoryPanelProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const current = versions[0];
  const active = selected ?? current?.version ?? null;

  // Follow the newest version when the history grows, unless the reader has
  // deliberately selected an older one that still exists.
  useEffect(() => {
    setSelected((chosen) =>
      chosen && versions.some((v) => v.version === chosen) ? chosen : null,
    );
  }, [versions]);

  const { data: diff, isLoading: diffLoading } = useQuery(
    getVersionDiffOptions(projectId, collectionId, active),
  );

  if (isLoading) {
    return <Box {...classes.panelEmptyStyle}>Loading history…</Box>;
  }

  if (versions.length === 0) {
    return (
      <Box {...classes.panelEmptyStyle}>
        Nothing published in this environment yet. The first publish starts the
        history.
      </Box>
    );
  }

  const activeEntry = versions.find((v) => v.version === active);
  const isCurrent = activeEntry?.version === current?.version;

  return (
    <Box {...classes.historyLayoutStyle}>
      <Box {...classes.historyDetailStyle}>
        <Box {...classes.historyDetailHeaderStyle}>
          <Box>
            <Box {...classes.historyDetailTitleStyle}>
              v{activeEntry?.version} · {activeEntry?.note || "Content updated"}
            </Box>
            <Box {...classes.historyDetailMetaStyle}>
              {activeEntry ? describe(activeEntry) : ""}
            </Box>
          </Box>

          {!isCurrent && activeEntry && (
            <Button
              size="sm"
              variant="outline"
              disabled={isRollingBack}
              onClick={() => onRollback(activeEntry.version)}
              style={{ gap: 6, flexShrink: 0 }}
            >
              <RefreshCw size={14} />
              {isRollingBack ? "Restoring…" : "Restore this version"}
            </Button>
          )}
        </Box>

        {diffLoading ? (
          <Box {...classes.panelEmptyStyle}>Comparing…</Box>
        ) : diff ? (
          <DiffView
            diff={diff}
            leftLabel={
              diff.toMissing ? "Nothing before it" : `v${diff.toVersion}`
            }
            rightLabel={`v${diff.fromVersion}`}
            emptyMessage="This version changed the rules only, not the content."
          />
        ) : null}
      </Box>

      <Box {...classes.historyRailStyle}>
        <Box {...classes.historyRailHeaderStyle}>
          <span>Versions</span>
          <span {...classes.historyCountStyle}>{versions.length}</span>
        </Box>

        {versions.map((entry) => {
          const isActive = entry.version === active;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelected(entry.version)}
              {...classes.versionCardStyle}
              style={{
                borderColor: isActive
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-border)",
                backgroundColor: isActive
                  ? "var(--operon-color-primary-ghost)"
                  : "var(--operon-color-surface)",
              }}
            >
              <Box {...classes.versionCardTopStyle}>
                <span {...classes.versionCardNumberStyle}>
                  v{entry.version}
                </span>
                <span {...classes.versionCardTimeStyle}>
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </Box>

              <Box {...classes.versionCardWhoStyle}>
                {relativeTime(entry.createdAt)} by{" "}
                {entry.createdByName || entry.createdBy || "unknown"}
                {entry.version === current?.version && (
                  <span {...classes.currentMarkerStyle}>(current)</span>
                )}
              </Box>

              <Box {...classes.kindBadgeStyle} style={badgeColours(entry.kind)}>
                {KIND_LABEL[entry.kind] ?? entry.kind}
              </Box>
            </button>
          );
        })}
      </Box>
    </Box>
  );
};

function describe(entry: VersionSummary): string {
  const parts = [
    `${relativeTime(entry.createdAt)} by ${entry.createdByName || entry.createdBy || "unknown"}`,
  ];
  if (entry.sourceVersion) parts.push(`from v${entry.sourceVersion}`);
  if (entry.ruleCount > 0) {
    parts.push(`${entry.ruleCount} rule${entry.ruleCount === 1 ? "" : "s"}`);
  }
  if (entry.variantKeys.length > 1) {
    parts.push(`${entry.variantKeys.length} variants`);
  }
  return parts.join(" · ");
}

/**
 * "7 minutes ago" answers "is this recent" faster than a timestamp does. The
 * absolute time sits above it for when the exact moment matters.
 */
function relativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${Math.max(seconds, 0)} seconds ago`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function badgeColours(kind: VersionKind) {
  switch (kind) {
    case "promoted":
      return {
        color: "var(--operon-color-success)",
        backgroundColor: "var(--operon-color-success-ghost)",
      };
    case "restored":
      return {
        color: "var(--operon-color-warning)",
        backgroundColor: "var(--operon-color-warning-ghost)",
      };
    default:
      return {
        color: "var(--operon-color-primary)",
        backgroundColor: "var(--operon-color-primary-ghost)",
      };
  }
}
