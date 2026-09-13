import { useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { Button } from "@/components/ui/button";

export const LangflowCounts = () => {
  const discordUsername = "ragnar_lothbr17";
  const githubUrl = "https://github.com/baerdaisy2-cmyk/NodusAI";
  const [discordCopied, setDiscordCopied] = useState(false);

  const copyDiscordUsername = async () => {
    await navigator.clipboard.writeText(discordUsername);
    setDiscordCopied(true);
    window.setTimeout(() => setDiscordCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-3">
      <ShadTooltip
        content="Open NodusAI on GitHub"
        side="bottom"
        styleClasses="z-10"
        ariaDescribedBy={undefined}
      >
        <Button
          unstyled
          onClick={() =>
            window.open(githubUrl, "_blank", "noopener,noreferrer")
          }
          className="hit-area-hover flex items-center gap-2 rounded-md p-1 text-muted-foreground"
          aria-label="Open NodusAI on GitHub"
        >
          <FaGithub className="h-4 w-4" aria-hidden="true" />
          <span className="hidden text-xs font-semibold sm:inline">
            NodusAI
          </span>
        </Button>
      </ShadTooltip>

      <ShadTooltip
        content={discordCopied ? "Discord username copied" : "Copy Discord username"}
        side="bottom"
        styleClasses="z-10"
        ariaDescribedBy={undefined}
      >
        <Button
          unstyled
          onClick={copyDiscordUsername}
          className="hit-area-hover flex items-center gap-2 rounded-md p-1 text-muted-foreground"
          aria-label={`Copy Discord username ${discordUsername}`}
        >
          <FaDiscord className="h-4 w-4" aria-hidden="true" />
          <span className="hidden text-xs font-semibold sm:inline">
            @{discordUsername}
          </span>
        </Button>
      </ShadTooltip>
    </div>
  );
};
