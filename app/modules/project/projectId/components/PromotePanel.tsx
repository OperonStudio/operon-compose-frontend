import { ArrowRight, Check } from "@operonstudio/icons";
import { Box, Button, Dropdown } from "@operonstudio/ui";
import { useState } from "react";
import type { Environment } from "#/modules/environments/types";
import type { Diff } from "#/modules/project/projectId/content-api";
import { DiffView } from "./DiffView";
import * as classes from "./style";

interface PromotePanelProps {
  environments: Environment[];
  currentEnvironmentId: string;
  target: string | null;
  onTargetChange: (environmentId: string) => void;
  diff?: Diff;
  isLoadingDiff: boolean;
  isPromoting: boolean;
  onPromote: () => void;
}

/**
 * Choose a target environment, read exactly what would change there, then
 * promote.
 *
 * The diff is the point. Copying content into production is only safe if you
 * can see the eleven fields it touches first, rather than being asked to trust
 * a button.
 */
export const PromotePanel = ({
  environments,
  currentEnvironmentId,
  target,
  onTargetChange,
  diff,
  isLoadingDiff,
  isPromoting,
  onPromote,
}: PromotePanelProps) => {
  const [confirming, setConfirming] = useState(false);

  const targets = environments.filter((e) => e.id !== currentEnvironmentId);
  const targetName = targets.find((e) => e.id === target)?.name ?? "the target";
  const currentName =
    environments.find((e) => e.id === currentEnvironmentId)?.name ?? "here";

  if (targets.length === 0) {
    return (
      <Box {...classes.panelEmptyStyle}>
        There is only one environment in this workspace. Create another to
        promote content into it.
      </Box>
    );
  }

  const changeCount =
    diff?.variants.reduce((sum, v) => sum + v.changes.length, 0) ?? 0;

  return (
    <Box {...classes.promotePaneStyle}>
      <Box {...classes.promoteHeaderStyle}>
        <Box {...classes.promoteTargetStyle}>
          <span>Compare against</span>
          <Dropdown
            onSelect={onTargetChange}
            items={targets.map((e) => ({ value: e.id, label: e.name }))}
            trigger={
              <Button variant="outline" size="sm" style={{ gap: 6 }}>
                {targetName ?? "Pick an environment"}
              </Button>
            }
          />
        </Box>

        {target && diff && !diff.identical && (
          <Button
            size="sm"
            disabled={isPromoting || diff.fromMissing}
            onClick={() => (confirming ? onPromote() : setConfirming(true))}
            style={{ gap: 6 }}
          >
            <ArrowRight size={14} />
            {isPromoting
              ? "Promoting…"
              : confirming
                ? `Confirm, overwrite ${targetName}`
                : `Promote to ${targetName}`}
          </Button>
        )}
      </Box>

      {!target && (
        <Box {...classes.panelEmptyStyle}>
          Pick an environment to see what promoting would change there.
        </Box>
      )}

      {target && isLoadingDiff && (
        <Box {...classes.panelEmptyStyle}>Comparing…</Box>
      )}

      {target && diff && !isLoadingDiff && (
        <>
          <Box {...classes.diffSummaryStyle}>
            {diff.fromMissing ? (
              <span>
                This environment has nothing published, so there is nothing to
                promote.
              </span>
            ) : diff.identical ? (
              <span {...classes.inSyncStyle}>
                <Check size={14} /> {targetName} already matches this
                environment.
              </span>
            ) : (
              <span>
                {diff.toMissing
                  ? `${targetName} has no content yet. Promoting publishes v1 there.`
                  : `${changeCount} field${changeCount === 1 ? "" : "s"} would change in ${targetName}, currently on v${diff.toVersion}.`}
                {diff.rulesChanged ? " Rules differ too." : ""}
              </span>
            )}
          </Box>

          <DiffView
            diff={diff}
            leftLabel={`${targetName} · v${diff.toVersion}`}
            rightLabel={`${currentName} · v${diff.fromVersion}`}
            emptyMessage={`${targetName} already matches this environment.`}
          />
        </>
      )}
    </Box>
  );
};
