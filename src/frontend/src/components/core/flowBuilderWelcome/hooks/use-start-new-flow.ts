import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAddFlow from "@/hooks/flows/use-add-flow";
import useFlowBuilderWelcomeStore from "@/stores/flowBuilderWelcomeStore";

type StartNewFlowOptions = {
  showWelcome?: boolean;
};

/**
 * Creates an empty flow, optionally primes the FlowBuilderWelcome overlay,
 * then routes the user to the new flow.
 *
 * The default behavior keeps the existing welcome overlay. Call with
 * `{ showWelcome: false }` for flows that provide their own onboarding
 * surface (for example NodusAI's "Build with AI" path).
 */
export function useStartNewFlow() {
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();
  const openWelcome = useFlowBuilderWelcomeStore((state) => state.open);

  return useCallback(
    async (options: StartNewFlowOptions = {}) => {
      const id = await addFlow();

      if (options.showWelcome !== false) {
        // Open before navigating so the canvas mounts with the welcome flag
        // already true instead of flashing the empty canvas first.
        openWelcome(id);
      }

      navigate(`/flow/${id}${folderId ? `/folder/${folderId}` : ""}`);
      return id;
    },
    [addFlow, navigate, folderId, openWelcome],
  );
}
