import { useParams } from "react-router-dom";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { usePostAddFlow } from "@/controllers/API/queries/flows/use-post-add-flow";
import { useFolderStore } from "@/stores/foldersStore";
import type { FlowType } from "@/types/flow";
import { createNewFlow } from "@/utils/reactflowUtils";

type UseDuplicateFlowsParams = {
  flow?: FlowType;
};

const useDuplicateFlow = ({ flow }: UseDuplicateFlowsParams) => {
  const { mutateAsync: postAddFlow } = usePostAddFlow();
  const { folderId } = useParams();
  const navigate = useCustomNavigate();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);

  const handleDuplicate = async () => {
    if (!flow?.data) return undefined;

    const folder_id = folderId ?? myCollectionId ?? "";
    const newFlow = createNewFlow(flow.data, folder_id, flow);

    newFlow.folder_id = folder_id;
    newFlow.name = `Copy of ${flow.name}`;

    const duplicatedFlow = await postAddFlow(newFlow);

    navigate(
      `/flow/${duplicatedFlow.id}${
        duplicatedFlow.folder_id ? `/folder/${duplicatedFlow.folder_id}` : ""
      }`,
    );

    return duplicatedFlow;
  };

  return { handleDuplicate };
};

export default useDuplicateFlow;
