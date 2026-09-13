import type { CSSProperties } from "react";
import logoDarkPng from "@/assets/logo_dark.png";
import logoLightPng from "@/assets/logo_light.png";
import { cn } from "@/utils/utils";

type NodusLogoProps = {
  className?: string;
  title?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

/** Theme-aware NodusAI brand mark used across auth, loading, chat and assistant surfaces. */
export default function NodusLogo({
  className,
  title = "NodusAI",
  style,
  "aria-hidden": ariaHidden,
}: NodusLogoProps) {
  const hidden = ariaHidden === true || ariaHidden === "true";

  return (
    <span
      className={cn("inline-flex h-5 w-5 shrink-0 items-center justify-center", className)}
      style={style}
      role={hidden ? undefined : "img"}
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : title}
      title={hidden ? undefined : title}
    >
      <img
        src={logoLightPng}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain dark:hidden"
      />
      <img
        src={logoDarkPng}
        alt=""
        aria-hidden="true"
        className="hidden h-full w-full object-contain dark:block"
      />
    </span>
  );
}
