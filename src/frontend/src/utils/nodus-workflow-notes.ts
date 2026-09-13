import type { FlowType } from "@/types/flow";
import {
  getNodusFlowMetadata,
  withNodusFlowMetadata,
} from "@/utils/nodus-flow-metadata";

const LEGACY_WORKFLOW_NOTES_PREFIX = "nodusai:workflow-notes:";

export type NodusWorkflowNotes = {
  purpose: string;
  inputs: string;
  outputs: string;
  assumptions: string;
  usage: string;
  updatedAt: string;
};

const emptyNotes = (): NodusWorkflowNotes => ({
  purpose: "",
  inputs: "",
  outputs: "",
  assumptions: "",
  usage: "",
  updatedAt: "",
});

const readLegacyNotes = (flowId: string): NodusWorkflowNotes | undefined => {
  try {
    const raw = window.localStorage.getItem(
      `${LEGACY_WORKFLOW_NOTES_PREFIX}${flowId}`,
    );
    if (!raw) return undefined;

    return {
      ...emptyNotes(),
      ...JSON.parse(raw),
    };
  } catch {
    return undefined;
  }
};

export const getWorkflowNotes = (
  flow: Pick<FlowType, "id" | "data">,
): NodusWorkflowNotes => {
  const metadata = getNodusFlowMetadata(flow.data);
  const persisted = metadata.notes as NodusWorkflowNotes | undefined;

  if (persisted) {
    return {
      ...emptyNotes(),
      ...persisted,
    };
  }

  return readLegacyNotes(flow.id) ?? emptyNotes();
};

export const buildWorkflowNotesUpdate = (
  flow: Pick<FlowType, "id" | "data">,
  notes: Omit<NodusWorkflowNotes, "updatedAt">,
) => {
  const saved: NodusWorkflowNotes = {
    ...notes,
    updatedAt: new Date().toISOString(),
  };
  const metadata = getNodusFlowMetadata(flow.data);

  const data = withNodusFlowMetadata(flow.data, {
    ...metadata,
    notes: saved,
  });

  return { saved, data };
};

export const clearLegacyWorkflowNotes = (flowId: string) => {
  try {
    window.localStorage.removeItem(`${LEGACY_WORKFLOW_NOTES_PREFIX}${flowId}`);
  } catch {
    // Legacy cleanup is best-effort only.
  }
};

export const hasWorkflowNotes = (
  flow: Pick<FlowType, "id" | "data">,
): boolean => {
  const notes = getWorkflowNotes(flow);
  return Boolean(
    notes.purpose.trim() ||
      notes.inputs.trim() ||
      notes.outputs.trim() ||
      notes.assumptions.trim() ||
      notes.usage.trim(),
  );
};
