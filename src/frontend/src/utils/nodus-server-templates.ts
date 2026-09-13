import type { FlowType } from "@/types/flow";

export const NODUSAI_TEMPLATE_TAG = "__nodusai_template__";

export const isNodusServerTemplate = (
  flow: Pick<FlowType, "tags" | "is_component">,
): boolean =>
  !flow.is_component && Boolean(flow.tags?.includes(NODUSAI_TEMPLATE_TAG));

export const addNodusTemplateTag = (
  tags: string[] | null | undefined,
): string[] =>
  Array.from(new Set([...(tags ?? []), NODUSAI_TEMPLATE_TAG]));

export const removeNodusTemplateTag = (
  tags: string[] | null | undefined,
): string[] => (tags ?? []).filter((tag) => tag !== NODUSAI_TEMPLATE_TAG);
