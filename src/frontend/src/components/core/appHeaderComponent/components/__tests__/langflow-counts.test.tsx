import { render, screen } from "@testing-library/react";
import { axe } from "@/utils/a11y-test";
import { LangflowCounts } from "../langflow-counts";

jest.mock("@/components/common/shadTooltipComponent", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LangflowCounts", () => {
  it("should_have_no_axe_violations", async () => {
    const { container } = render(<LangflowCounts />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("exposes accessible names for the NodusAI GitHub and Discord actions", () => {
    render(<LangflowCounts />);

    expect(
      screen.getByRole("button", { name: "Open NodusAI on GitHub" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Copy Discord username ragnar_lothbr17",
      }),
    ).toBeInTheDocument();
  });
});
