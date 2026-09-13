import { useTranslation } from "react-i18next";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import { useFolderStore } from "@/stores/foldersStore";
import { useUtilityStore } from "@/stores/utilityStore";

type EmptyFolderProps = {
  setOpenModal: (open: boolean) => void;
  /** Preferred handler — bypasses the templates modal and starts a fresh
   *  flow with the welcome overlay primed. Falls back to ``setOpenModal``
   *  when omitted to keep legacy callers working. */
  onNewFlow?: () => void;
  /** Starts a new flow with the NodusAI AI-builder welcome enabled. */
  onBuildWithAI?: () => void;
};

export const EmptyFolder = ({
  setOpenModal,
  onNewFlow,
  onBuildWithAI,
}: EmptyFolderProps) => {
  const { t } = useTranslation();
  const folders = useFolderStore((state) => state.folders);
  const hideNewFlowButton = useUtilityStore((state) => state.hideNewFlowButton);

  return (
    <div className="m-0 flex w-full justify-center">
      <div className="absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2">
        <h3
          className="pt-5 font-chivo text-2xl font-semibold"
          data-testid="mainpage_title"
        >
          {folders?.length > 1
            ? t("emptyPage.emptyProject")
            : t("emptyPage.startBuilding")}
        </h3>
        <p className="pb-5 text-sm text-secondary-foreground">
          {t("emptyPage.description")}
        </p>
        {!hideNewFlowButton && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {onBuildWithAI && (
              <Button
                variant="default"
                onClick={onBuildWithAI}
                className="bg-accent-assistant-brand text-white hover:bg-accent-assistant-brand/90"
                data-testid="empty-folder-build-with-ai"
              >
                <ForwardedIconComponent
                  name="Sparkles"
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                <span className="whitespace-nowrap font-semibold">
                  {t("page.buildWithAI")}
                </span>
              </Button>
            )}
            <Button
              variant={onBuildWithAI ? "outline" : "default"}
              onClick={() => (onNewFlow ? onNewFlow() : setOpenModal(true))}
              id="new-project-btn"
              data-testid="new_project_btn_empty_page"
            >
              <ForwardedIconComponent
                name="Plus"
                aria-hidden="true"
                className="h-4 w-4"
              />
              <span className="whitespace-nowrap font-semibold">
                {t("emptyPage.newFlow")}
              </span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpenModal(true)}
              data-testid="empty-folder-browse-templates"
            >
              <ForwardedIconComponent
                name="LayoutPanelTop"
                aria-hidden="true"
                className="h-4 w-4"
              />
              <span className="whitespace-nowrap font-semibold">
                {t("emptyPage.browseTemplates")}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyFolder;
