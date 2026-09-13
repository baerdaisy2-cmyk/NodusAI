import { useTranslation } from "react-i18next";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/contexts/permissionsContext";
import { usePatchUpdateFlow } from "@/controllers/API/queries/flows/use-patch-update-flow";
import CustomFlowShareAction from "@/customization/components/custom-flow-share-action";
import useAlertStore from "@/stores/alertStore";
import type { FlowType } from "@/types/flow";
import { addNodusTemplateTag, isNodusServerTemplate } from "@/utils/nodus-server-templates";
import {
  buildRestoreWorkflowSnapshotData,
  buildWorkflowSnapshotUpdate,
  clearLegacyWorkflowSnapshots,
  getLatestWorkflowSnapshot,
} from "@/utils/nodus-workflow-snapshots";
import useDuplicateFlow from "../../hooks/use-handle-duplicate";
import useSelectOptionsChange from "../../hooks/use-select-options-change";

type DropdownComponentProps = {
  flowData: FlowType;
  setOpenDelete: (open: boolean) => void;
  handleExport: () => void;
  handleEdit: () => void;
  openSnapshotHistory: () => void;
  openWorkflowNotes: () => void;
};

const DropdownComponent = ({
  flowData,
  setOpenDelete,
  handleExport,
  handleEdit,
  openSnapshotHistory,
  openWorkflowNotes,
}: DropdownComponentProps) => {
  const { t } = useTranslation();
  const { can } = usePermissions();
  const canEdit = can(flowData.id, "write");
  const canExport = can(flowData.id, "read");
  const canDuplicate = can(flowData.id, "create");
  const canDelete = can(flowData.id, "delete");
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const { handleDuplicate } = useDuplicateFlow({ flow: flowData });
  const { mutateAsync: updateFlow } = usePatchUpdateFlow();
  const latestSnapshot = getLatestWorkflowSnapshot(flowData);

  const saveAsTemplate = async () => {
    if (isNodusServerTemplate(flowData)) {
      setSuccessData({
        title: t("flow.templateAlreadySaved"),
      });
      return;
    }

    try {
      await updateFlow({
        id: flowData.id,
        tags: addNodusTemplateTag(flowData.tags),
      });

      setSuccessData({
        title: t("flow.templateSaved"),
      });
    } catch {
      setErrorData({
        title: t("flow.templateSaveFailed"),
      });
    }
  };

  const saveSnapshot = async () => {
    try {
      const { data } = buildWorkflowSnapshotUpdate(flowData);

      await updateFlow({
        id: flowData.id,
        data,
      });

      clearLegacyWorkflowSnapshots(flowData.id);
      setSuccessData({
        title: t("flow.snapshotSaved"),
      });
    } catch {
      setErrorData({
        title: t("flow.snapshotSaveFailed"),
      });
    }
  };

  const restoreLatestSnapshot = async () => {
    const snapshot = getLatestWorkflowSnapshot(flowData);
    if (!snapshot) return;

    try {
      await updateFlow({
        id: flowData.id,
        name: snapshot.name,
        description: snapshot.description,
        data: buildRestoreWorkflowSnapshotData(flowData, snapshot),
        endpoint_name: snapshot.endpoint_name,
        flow_type: snapshot.flow_type,
        a2a_enabled: snapshot.a2a_enabled,
        a2a_card_overrides: snapshot.a2a_card_overrides,
      });

      setSuccessData({
        title: t("flow.snapshotRestored"),
      });
    } catch {
      setErrorData({
        title: t("flow.snapshotRestoreFailed"),
      });
    }
  };

  const duplicateFlow = () => {
    void handleDuplicate()
      .then((duplicatedFlow) => {
        if (!duplicatedFlow) return;
        setSuccessData({
          title: t("flow.duplicatedSuccess", {
            type: flowData.is_component ? "Component" : "Flow",
          }),
        });
      })
      .catch(() => {
        setErrorData({ title: t("flow.duplicateFailed") });
      });
  };

  const { handleSelectOptionsChange } = useSelectOptionsChange(
    [flowData.id],
    setErrorData,
    setOpenDelete,
    handleExport,
    duplicateFlow,
    handleEdit,
  );

  return (
    <>
      <DropdownMenuItem
        disabled={!canEdit}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectOptionsChange("edit");
        }}
        className="cursor-pointer"
        data-testid="btn-edit-flow"
      >
        <ForwardedIconComponent
          name="SquarePen"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.editDetails")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!canExport || Boolean(flowData.is_component)}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectOptionsChange("export");
        }}
        className="cursor-pointer"
        data-testid="btn-download-json"
      >
        <ForwardedIconComponent
          name="Download"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.export")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!canDuplicate}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectOptionsChange("duplicate");
        }}
        className="cursor-pointer"
        data-testid="btn-duplicate-flow"
      >
        <ForwardedIconComponent
          name="CopyPlus"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.duplicateAndOpen")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!canEdit || Boolean(flowData.is_component)}
        onClick={(e) => {
          e.stopPropagation();
          void saveAsTemplate();
        }}
        className="cursor-pointer"
        data-testid="btn-save-as-template"
      >
        <ForwardedIconComponent
          name="Save"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.saveAsTemplate")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!canEdit}
        onClick={(e) => {
          e.stopPropagation();
          openWorkflowNotes();
        }}
        className="cursor-pointer"
        data-testid="btn-workflow-notes"
      >
        <ForwardedIconComponent
          name="NotebookPen"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.workflowNotes")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={!canEdit}
        onClick={(e) => {
          e.stopPropagation();
          void saveSnapshot();
        }}
        className="cursor-pointer"
        data-testid="btn-save-snapshot"
      >
        <ForwardedIconComponent
          name="Camera"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.saveSnapshot")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!canEdit || !latestSnapshot}
        onClick={(e) => {
          e.stopPropagation();
          void restoreLatestSnapshot();
        }}
        className="cursor-pointer"
        data-testid="btn-restore-latest-snapshot"
      >
        <ForwardedIconComponent
          name="History"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.restoreLatestSnapshot")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!latestSnapshot}
        onClick={(e) => {
          e.stopPropagation();
          openSnapshotHistory();
        }}
        className="cursor-pointer"
        data-testid="btn-snapshot-history"
      >
        <ForwardedIconComponent
          name="Clock3"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.snapshotHistory")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <CustomFlowShareAction
        resourceId={flowData.id}
        resourceType="flow"
        resourceName={flowData.name}
      />
      <DropdownMenuItem
        disabled={!canDelete}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDelete(true);
        }}
        className="cursor-pointer text-destructive"
        data-testid="btn_delete_dropdown_menu"
      >
        <ForwardedIconComponent
          name="Trash2"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
        />
        {t("flow.menu.delete")}
      </DropdownMenuItem>
    </>
  );
};

export default DropdownComponent;
