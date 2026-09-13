import type { ReactFlowJsonObject } from "@xyflow/react";

export type NodusFlowMetadata = {
  version: 1;
  notes?: unknown;
  snapshots?: unknown[];
};

type FlowDataWithNodusMetadata = ReactFlowJsonObject & {
  __nodusai?: NodusFlowMetadata;
};

export const getNodusFlowMetadata = (
  data: ReactFlowJsonObject | null | undefined,
): NodusFlowMetadata => {
  const metadata = (data as FlowDataWithNodusMetadata | null | undefined)
    ?.__nodusai;

  return metadata && metadata.version === 1
    ? metadata
    : { version: 1 };
};

export const withNodusFlowMetadata = (
  data: ReactFlowJsonObject | null | undefined,
  metadata: NodusFlowMetadata,
): ReactFlowJsonObject => {
  const base = data ?? {
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  };

  return {
    ...base,
    __nodusai: {
      ...metadata,
      version: 1,
    },
  } as ReactFlowJsonObject;
};

export const stripNodusFlowMetadata = (
  data: ReactFlowJsonObject | null | undefined,
): ReactFlowJsonObject | null => {
  if (!data) return null;

  const clone = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
  delete clone.__nodusai;
  return clone as ReactFlowJsonObject;
};
