import { useTranslation } from "react-i18next";
import logoDarkPng from "@/assets/logo_dark.png";
import logoLightPng from "@/assets/logo_light.png";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import CardsWrapComponent from "@/components/core/cardsWrapComponent";
import { useStartNewFlow } from "@/components/core/flowBuilderWelcome/hooks/use-start-new-flow";
import { Button } from "@/components/ui/button";
import { DotBackgroundDemo } from "@/components/ui/dot-background";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { useFolderStore } from "@/stores/foldersStore";
import useFileDrop from "../hooks/use-on-file-drop";


export const EmptyPageCommunity = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const handleFileDrop = useFileDrop(undefined);
  const folders = useFolderStore((state) => state.folders);
  const startNewFlow = useStartNewFlow();
  const navigate = useCustomNavigate();

  const handleBuildWithAI = async () => {
    // Create the flow with NodusAI's AI-builder welcome surface enabled.
    // The welcome accepts the user's natural-language request, then hands it
    // to the Assistant once the user submits it.
    await startNewFlow({ showWelcome: true });
  };

  return (
    <DotBackgroundDemo>
      <CardsWrapComponent
        dragMessage={t("home.dragFlowsOrComponents")}
        onFileDrop={handleFileDrop}
      >
        <div className="m-0 h-full w-full bg-background p-0">
          <div className="z-50 flex h-full w-full flex-col items-center justify-center gap-5">
            <div className="z-50 flex flex-col items-center gap-2">
              <div className="z-50 dark:hidden">
                <img
                  src={logoLightPng}
                  alt={t("common.langflowLogoLight")}
                  data-testid="empty_page_logo_light"
                  className="pointer-events-none relative top-8 h-40 select-none"
                />
              </div>
              <div className="z-50 hidden dark:block">
                <img
                  src={logoDarkPng}
                  alt={t("common.langflowLogoDark")}
                  data-testid="empty_page_logo_dark"
                  className="pointer-events-none relative top-8 h-40 select-none"
                />
              </div>

              <span
                data-testid="mainpage_title"
                className="z-50 text-center font-chivo text-2xl font-medium text-foreground"
              >
                {t("page.welcomeTitle")}
              </span>

              <span
                data-testid="empty_page_description"
                className="z-50 text-center text-base text-secondary-foreground"
              >
                {folders?.length > 1
                  ? t("page.emptyFolder")
                  : t("page.welcomeDescription")}
              </span>
            </div>

            <div className="flex w-full max-w-[510px] flex-col gap-7 sm:gap-[29px]">
              <div className="relative z-50 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleBuildWithAI}
                  data-testid="empty_page_build_with_ai"
                  className="rounded-xl border border-border bg-background p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-accent-assistant-brand hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <ForwardedIconComponent
                      name="Sparkles"
                      className="h-5 w-5 text-accent-assistant-brand"
                    />
                    <span>{t("page.buildWithAI")}</span>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    {t("page.buildWithAIDescription")}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  data-testid="empty_page_start_from_template"
                  className="rounded-xl border border-border bg-background p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-accent-assistant-brand hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <ForwardedIconComponent
                      name="LayoutGrid"
                      className="h-5 w-5 text-accent-assistant-brand"
                    />
                    <span>{t("page.startFromTemplate")}</span>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    {t("page.startFromTemplateDescription")}
                  </div>
                </button>
              </div>

              <Button
                variant="default"
                className="z-10 m-auto mt-3 h-auto min-h-10 w-auto whitespace-normal rounded-lg bg-accent-assistant-brand font-bold text-white transition-all duration-300 hover:bg-accent-assistant-brand/90"
                onClick={() => startNewFlow({ showWelcome: false })}
                id="new-project-btn"
                data-testid="new_project_btn_empty_page"
              >
                <ForwardedIconComponent
                  name="Plus"
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                <span>{t("page.createFirstFlow")}</span>
              </Button>

              <Button
                variant="ghost"
                className="z-10 m-auto -mt-4 h-auto w-auto text-sm text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/flows")}
                data-testid="view_existing_workflows"
              >
                <ForwardedIconComponent
                  name="LayoutGrid"
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                <span>{t("page.viewWorkflows")}</span>
              </Button>
            </div>
          </div>
        </div>

        <p
          data-testid="empty_page_drag_and_drop_text"
          className="absolute bottom-5 left-0 right-0 mt-4 cursor-default text-center text-xxs text-muted-foreground"
        >
          {t("page.dragAndDropText")}
        </p>
      </CardsWrapComponent>
    </DotBackgroundDemo>
  );
};

export default EmptyPageCommunity;
