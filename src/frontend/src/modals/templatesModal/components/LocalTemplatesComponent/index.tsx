import { cloneDeep } from "lodash";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import { useGetFlow } from "@/controllers/API/queries/flows/use-get-flow";
import { usePatchUpdateFlow } from "@/controllers/API/queries/flows/use-patch-update-flow";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAddFlow from "@/hooks/flows/use-add-flow";
import useFlowBuilderWelcomeStore from "@/stores/flowBuilderWelcomeStore";
import { useFolderStore } from "@/stores/foldersStore";
import type { FlowType } from "@/types/flow";
import { removeNodusTemplateTag } from "@/utils/nodus-server-templates";
import { updateIds } from "@/utils/reactflowUtils";

type LocalTemplatesComponentProps = {
  templates: FlowType[];
  setTemplates: (templates: FlowType[]) => void;
  loading: boolean;
  onFlowCreating: (loading: boolean) => void;
};

export default function LocalTemplatesComponent({
  templates,
  setTemplates,
  loading,
  onFlowCreating,
}: LocalTemplatesComponentProps) {
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);
  const dismissWelcomeForNavigation = useFlowBuilderWelcomeStore(
    (state) => state.dismissForNavigation,
  );
  const { mutateAsync: getFlow } = useGetFlow();
  const { mutateAsync: updateFlow } = usePatchUpdateFlow();
  const [busyId, setBusyId] = useState<string | null>(null);

  const folderIdUrl = folderId ?? myCollectionId ?? "";

  const useTemplate = async (template: FlowType) => {
    if (loading || busyId) return;

    setBusyId(template.id);
    onFlowCreating(true);

    try {
      const fullTemplate = await getFlow({ id: template.id });
      const flow = cloneDeep(fullTemplate);

      flow.tags = removeNodusTemplateTag(flow.tags);

      if (flow.data) updateIds(flow.data);

      const id = await addFlow({ flow });
      dismissWelcomeForNavigation();
      navigate(`/flow/${id}${folderIdUrl ? `/folder/${folderIdUrl}` : ""}`);
    } finally {
      setBusyId(null);
      onFlowCreating(false);
    }
  };

  const removeTemplate = async (template: FlowType) => {
    if (busyId) return;

    setBusyId(template.id);

    try {
      await updateFlow({
        id: template.id,
        tags: removeNodusTemplateTag(template.tags),
      });

      setTemplates(
        templates.filter((savedTemplate) => savedTemplate.id !== template.id),
      );
    } finally {
      setBusyId(null);
    }
  };

  if (templates.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
        <ForwardedIconComponent
          name="Bookmark"
          className="h-10 w-10 text-muted-foreground"
          aria-hidden="true"
        />
        <div>
          <div className="font-semibold">No saved templates yet</div>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Save a workflow as a template from its workflow menu. Templates are
            synced with your NodusAI server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto">
      <div>
        <h2 className="text-lg font-semibold">My Templates</h2>
        <p className="text-sm text-muted-foreground">
          Server-backed workflow templates available across your NodusAI
          sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-start justify-between gap-4 rounded-lg border bg-background p-4"
          >
            <div className="min-w-0">
              <div className="truncate font-semibold">{template.name}</div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {template.description || `Reusable template from ${template.name}.`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                size="sm"
                onClick={() => void useTemplate(template)}
                disabled={loading || busyId !== null}
              >
                {busyId === template.id ? "Working…" : "Use Template"}
              </Button>
              <Button
                size="iconSm"
                variant="ghost"
                onClick={() => void removeTemplate(template)}
                disabled={busyId !== null}
                aria-label={`Remove ${template.name} from templates`}
              >
                <ForwardedIconComponent
                  name="Trash2"
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
