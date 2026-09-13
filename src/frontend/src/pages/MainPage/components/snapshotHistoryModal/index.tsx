import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePermissions } from "@/contexts/permissionsContext";
import { usePatchUpdateFlow } from "@/controllers/API/queries/flows/use-patch-update-flow";
import useAlertStore from "@/stores/alertStore";
import type { FlowType } from "@/types/flow";
import {
  buildDeleteWorkflowSnapshotUpdate,
  buildRestoreWorkflowSnapshotData,
  clearLegacyWorkflowSnapshots,
  getWorkflowSnapshots,
  type NodusWorkflowSnapshot,
} from "@/utils/nodus-workflow-snapshots";

type SnapshotHistoryModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  flowData: FlowType;
};

export default function SnapshotHistoryModal({
  open,
  setOpen,
  flowData,
}: SnapshotHistoryModalProps) {
  const { t } = useTranslation();
  const [snapshots, setSnapshots] = useState<NodusWorkflowSnapshot[]>([]);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const { mutateAsync: updateFlow } = usePatchUpdateFlow();
  const { can } = usePermissions();
  const canEdit = can(flowData.id, "write");
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const setErrorData = useAlertStore((state) => state.setErrorData);

  useEffect(() => {
    if (open) {
      setSnapshots(getWorkflowSnapshots(flowData));
    }
  }, [open, flowData.id]);

  const restoreSnapshot = async (snapshot: NodusWorkflowSnapshot) => {
    setRestoringId(snapshot.id);

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

      setSuccessData({ title: t("flow.snapshotRestored") });
      setOpen(false);
    } catch {
      setErrorData({ title: t("flow.snapshotRestoreFailed") });
    } finally {
      setRestoringId(null);
    }
  };

  const removeSnapshot = async (snapshotId: string) => {
    try {
      const { snapshots: nextSnapshots, data } =
        buildDeleteWorkflowSnapshotUpdate(flowData, snapshotId);

      await updateFlow({
        id: flowData.id,
        data,
      });

      clearLegacyWorkflowSnapshots(flowData.id);
      setSnapshots(nextSnapshots);
    } catch {
      setErrorData({ title: t("flow.snapshotDeleteFailed") });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("flow.snapshotHistoryTitle")}</DialogTitle>
          <DialogDescription>
            {t("flow.snapshotHistoryDescription", { name: flowData.name })}
          </DialogDescription>
        </DialogHeader>

        {snapshots.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <ForwardedIconComponent
              name="History"
              className="h-10 w-10 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <div className="font-semibold">
                {t("flow.noSnapshots")}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("flow.noSnapshotsDescription")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex max-h-[58vh] flex-col gap-2 overflow-y-auto pr-1">
            {snapshots.map((snapshot, index) => (
              <div
                key={snapshot.id}
                className="flex items-center justify-between gap-4 rounded-lg border bg-background p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">
                      {snapshot.name}
                    </span>
                    {index === 0 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {t("flow.latestSnapshot")}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(snapshot.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => void restoreSnapshot(snapshot)}
                    disabled={!canEdit || restoringId !== null}
                  >
                    {restoringId === snapshot.id
                      ? t("flow.restoringSnapshot")
                      : t("flow.restoreSnapshot")}
                  </Button>
                  <Button
                    size="iconSm"
                    variant="ghost"
                    aria-label={t("flow.deleteSnapshot")}
                    onClick={() => void removeSnapshot(snapshot.id)}
                    disabled={!canEdit || restoringId !== null}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
