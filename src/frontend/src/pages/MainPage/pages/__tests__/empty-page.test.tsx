import { fireEvent, render, screen } from "@testing-library/react";
import { EmptyPageCommunity } from "../empty-page";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  "data-testid"?: string;
  [key: string]: unknown;
}

interface IconProps {
  name: string;
  [key: string]: unknown;
}

interface WrapperProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

// startNewFlow mock shared across the suite so assertions can inspect it.
const startNewFlowMock = jest.fn();

jest.mock(
  "@/components/core/flowBuilderWelcome/hooks/use-start-new-flow",
  () => ({
    useStartNewFlow: () => startNewFlowMock,
  }),
);

jest.mock("@/assets/logo_dark.png", () => "logo_dark.png");
jest.mock("@/assets/logo_light.png", () => "logo_light.png");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: "3rdParty", init: jest.fn() },
}));

jest.mock("@/components/common/genericIconComponent", () => ({
  ForwardedIconComponent: ({ name }: IconProps) => (
    <div data-testid={`icon-${name}`}>{name}</div>
  ),
}));

jest.mock("@/components/core/cardsWrapComponent", () => ({
  __esModule: true,
  default: ({ children }: WrapperProps) => <div>{children}</div>,
}));

jest.mock("@/components/ui/dot-background", () => ({
  DotBackgroundDemo: ({ children }: WrapperProps) => <div>{children}</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    "data-testid": testId,
    ...props
  }: ButtonProps) => (
    <button onClick={onClick} data-testid={testId} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/stores/foldersStore", () => ({
  useFolderStore: (selector: (s: { folders: unknown[] }) => unknown) =>
    selector({ folders: [] }),
}));

jest.mock("../../hooks/use-on-file-drop", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));


const navigateMock = jest.fn();

jest.mock("@/customization/hooks/use-custom-navigate", () => ({
  useCustomNavigate: () => navigateMock,
}));

describe("EmptyPageCommunity actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
  });

  it("creates a normal blank workflow from the primary button", () => {
    const setOpenModal = jest.fn();
    render(<EmptyPageCommunity setOpenModal={setOpenModal} />);

    fireEvent.click(screen.getByTestId("new_project_btn_empty_page"));

    expect(startNewFlowMock).toHaveBeenCalledWith();
    expect(setOpenModal).not.toHaveBeenCalled();
  });

  it("opens the templates modal from Start from Template", () => {
    const setOpenModal = jest.fn();
    render(<EmptyPageCommunity setOpenModal={setOpenModal} />);

    fireEvent.click(screen.getByTestId("empty_page_start_from_template"));

    expect(setOpenModal).toHaveBeenCalledWith(true);
    expect(startNewFlowMock).not.toHaveBeenCalled();
  });

  it("creates an AI-assisted flow without the standard welcome overlay", () => {
    const setOpenModal = jest.fn();
    render(<EmptyPageCommunity setOpenModal={setOpenModal} />);

    fireEvent.click(screen.getByTestId("empty_page_build_with_ai"));

    expect(startNewFlowMock).toHaveBeenCalledWith({ showWelcome: false });
    expect(window.sessionStorage.getItem("nodusai:open-assistant-on-next-flow")).toBe(
      "1",
    );
  });

  it("navigates to the flows workspace", () => {
    const setOpenModal = jest.fn();
    render(<EmptyPageCommunity setOpenModal={setOpenModal} />);

    fireEvent.click(screen.getByTestId("view_existing_workflows"));

    expect(navigateMock).toHaveBeenCalledWith("/flows");
  });
});
