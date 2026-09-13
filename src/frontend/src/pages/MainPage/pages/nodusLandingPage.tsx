import { useState } from "react";
import CustomEmptyPageCommunity from "@/customization/components/custom-empty-page";
import TemplatesModal from "@/modals/templatesModal";

export default function NodusLandingPage(): JSX.Element {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="h-full w-full overflow-hidden">
      <CustomEmptyPageCommunity setOpenModal={setOpenModal} />
      {openModal && (
        <TemplatesModal open={openModal} setOpen={setOpenModal} />
      )}
    </div>
  );
}
