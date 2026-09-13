import { useTranslation } from "react-i18next";
import BaseModal from "../../../modals/baseModal";
import type { fetchErrorComponentType } from "../../../types/components";
import IconComponent from "../genericIconComponent";

export default function FetchErrorComponent({
  message,
  description,
  openModal,
  setRetry,
  isLoadingHealth,
}: fetchErrorComponentType) {
  const { t } = useTranslation();
  return (
    <>
      <BaseModal
        size="small-h-full"
        open={openModal}
        type="modal"
        onSubmit={() => {
          setRetry();
        }}
      >
        <BaseModal.Content>
          <div
            role="status"
            className="m-auto flex max-w-md flex-col items-center gap-3 text-center"
          >
            <div className="rounded-full bg-muted p-4">
              <IconComponent
                className="h-10 w-10 text-muted-foreground"
                name="Unplug"
              />
            </div>
            <span className="text-lg font-semibold text-foreground">
              {message}
            </span>
            <span className="text-sm leading-6 text-muted-foreground">
              {description}
            </span>
          </div>
        </BaseModal.Content>

        <BaseModal.Footer
          submit={{
            label: t("common.retry"),
            loading: isLoadingHealth,
            onClick: () => {
              setRetry();
            },
          }}
        />
      </BaseModal>
    </>
  );
}
