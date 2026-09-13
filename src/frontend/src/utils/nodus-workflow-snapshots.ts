import type { ReactFlowJsonObject } from "@xyflow/react";
import type { FlowType } from "@/types/flow";
import {
  getNodusFlowMetadata,
  stripNodusFlowMetadata,
  withNodusFlowMetadata,
} from "@/utils/nodus-flow-metadata";

const LEGACY_SNAPSHOT_PREFIX = "nodusai:workflow-snapshots:";
const MAX_SNAPSHOTS_PER_FLOW = 10;

export type NodusWorkflowSnapshot = {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  endpoint_name?: string | null;
  flow_type?: "workflow" | "agent";
  a2a_enabled?: boolean;
  a2a_card_overrides?: Record<string, unknown> | null;
  data: ReactFlowJsonObject | null;
};

const readLegacySnapshots = (flowId: string): NodusWorkflowSnapshot[] => {
  try {
    const raw = window.localStorage.getItem(
      `${LEGACY_SNAPSHOT_PREFIX}${flowId}`,
    );
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getWorkflowSnapshots = (
  flow: Pick<FlowType, "id" | "data">,
): NodusWorkflowSnapshot[] => {
  const metadata = getNodusFlowMetadata(flow.data);
  const persisted = metadata.snapshots;

  if (Array.isArray(persisted)) {
    return persisted as NodusWorkflowSnapshot[];
  }

  return readLegacySnapshots(flow.id);
};

export const buildWorkflowSnapshotUpdate = (flow: FlowType) => {
  const snapshot: NodusWorkflowSnapshot = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    name: flow.name,
    description: flow.description ?? "",
    endpoint_name: flow.endpoint_name,
    flow_type: flow.flow_type,
    a2a_enabled: flow.a2a_enabled,
    a2a_card_overrides: flow.a2a_card_overrides
      ? JSON.parse(JSON.stringify(flow.a2a_card_overrides))
      : flow.a2a_card_overrides,
    // Never store metadata inside a snapshot of the graph, otherwise snapshots
    // recursively contain snapshots.
    data: stripNodusFlowMetadata(flow.data),
  };

  const existing = getWorkflowSnapshots(flow);
  const snapshots = [snapshot, ...existing].slice(
    0,
    MAX_SNAPSHOTS_PER_FLOW,
  );
  const metadata = getNodusFlowMetadata(flow.data);

  return {
    snapshot,
    snapshots,
    data: withNodusFlowMetadata(flow.data, {
      ...metadata,
      snapshots,
    }),
  };
};

export const getLatestWorkflowSnapshot = (
  flow: Pick<FlowType, "id" | "data">,
): NodusWorkflowSnapshot | undefined => getWorkflowSnapshots(flow)[0];

export const buildDeleteWorkflowSnapshotUpdate = (
  flow: Pick<FlowType, "id" | "data">,
  snapshotId: string,
) => {
  const snapshots = getWorkflowSnapshots(flow).filter(
    (snapshot) => snapshot.id !== snapshotId,
  );
  const metadata = getNodusFlowMetadata(flow.data);

  return {
    snapshots,
    data: withNodusFlowMetadata(flow.data, {
      ...metadata,
      snapshots,
    }),
  };
};

export const buildRestoreWorkflowSnapshotData = (
  flow: Pick<FlowType, "id" | "data">,
  snapshot: NodusWorkflowSnapshot,
): ReactFlowJsonObject => {
  const metadata = getNodusFlowMetadata(flow.data);

  return withNodusFlowMetadata(snapshot.data, metadata);
};

export const clearLegacyWorkflowSnapshots = (flowId: string) => {
  try {
    window.localStorage.removeItem(`${LEGACY_SNAPSHOT_PREFIX}${flowId}`);
  } catch {
    // Legacy cleanup is best-effort only.
  }
};
