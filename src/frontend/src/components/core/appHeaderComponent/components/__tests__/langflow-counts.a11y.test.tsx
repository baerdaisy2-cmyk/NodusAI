import { render, screen } from "@testing-library/react";
import { LangflowCounts } from "../langflow-counts";

jest.mock("@/components/common/shadTooltipComponent", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LangflowCounts accessibility", () => {
  beforeEach(() => {
    render(<LangflowCounts />);
  });

  it("should_expose_github_button_with_accessible_name", () => {
    expect(
      screen.getByRole("button", { name: "Open NodusAI on GitHub" }),
    ).toBeInTheDocument();
  });

  it("should_expose_discord_button_with_accessible_name", () => {
    expect(
      screen.getByRole("button", {
        name: "Copy Discord username ragnar_lothbr17",
      }),
    ).toBeInTheDocument();
  });

  it("should_hide_icons_from_assistive_technology", () => {
    const githubButton = screen.getByRole("button", {
      name: "Open NodusAI on GitHub",
    });
    const discordButton = screen.getByRole("button", {
      name: "Copy Discord username ragnar_lothbr17",
    });

    expect(githubButton.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(discordButton.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
