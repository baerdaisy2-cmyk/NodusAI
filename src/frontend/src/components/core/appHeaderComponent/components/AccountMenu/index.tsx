import { useTranslation } from "react-i18next";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { DATASTAX_DOCS_URL, DOCS_URL } from "@/constants/constants";
import { useLogout } from "@/controllers/API/queries/auth";
import { CustomAdminPageMenuItem } from "@/customization/components/custom-admin-page-menu-item";
import { CustomHeaderMenuItemsTitle } from "@/customization/components/custom-header-menu-items-title";
import { CustomProfileIcon } from "@/customization/components/custom-profile-icon";
import { ENABLE_DATASTAX_LANGFLOW } from "@/customization/feature-flags";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAuthStore from "@/stores/authStore";
import { useDarkStore } from "@/stores/darkStore";
import { useUtilityStore } from "@/stores/utilityStore";
import {
  HeaderMenu,
  HeaderMenuItemButton,
  HeaderMenuItemLink,
  HeaderMenuItems,
  HeaderMenuToggle,
} from "../HeaderMenu";
import ThemeButtons from "../ThemeButtons";

export const AccountMenu = () => {
  const { t } = useTranslation();
  const githubUrl = "https://github.com/baerdaisy2-cmyk/NodusAI";
  const discordUsername = "ragnar_lothbr17";
  const version = useDarkStore((state) => state.version);
  const navigate = useCustomNavigate();
  const { mutate: mutationLogout } = useLogout();
  const hideLogoutButton = useUtilityStore((state) => state.hideLogoutButton);
  const autoLogin = useAuthStore((state) => state.autoLogin);

  const handleLogout = () => {
    mutationLogout();
  };

  return (
    <HeaderMenu>
      <HeaderMenuToggle>
        <div
          className="h-6 w-6 rounded-lg focus-visible:outline-0"
          data-testid="user-profile-settings"
        >
          <CustomProfileIcon />
        </div>
      </HeaderMenuToggle>
      <HeaderMenuItems position="right" classNameSize="w-[272px]">
        <div className="divide-y divide-foreground/10">
          <CustomHeaderMenuItemsTitle />
          <div>
            <div className="h-[44px] items-center px-4 pt-3">
              <div className="flex items-center justify-between">
                <span
                  data-testid="menu_version_button"
                  id="menu_version_button"
                  className="text-sm"
                >
                  {t("account.version")}
                </span>
                <div className="float-right text-xs text-muted-foreground">
                  {version || "—"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <HeaderMenuItemButton
              onClick={() => {
                navigate("/settings");
              }}
            >
              <span
                data-testid="menu_settings_button"
                id="menu_settings_button"
              >
                {t("account.settings")}
              </span>
            </HeaderMenuItemButton>
            <HeaderMenuItemButton
              onClick={() => {
                navigate("/settings/model-providers");
              }}
            >
              <span data-testid="menu_model_providers_button">
                {t("account.modelProviders")}
              </span>
            </HeaderMenuItemButton>
            <HeaderMenuItemButton
              onClick={() => {
                navigate("/settings/api-keys");
              }}
            >
              <span data-testid="menu_api_keys_button">
                {t("account.apiKeys")}
              </span>
            </HeaderMenuItemButton>

            <CustomAdminPageMenuItem onNavigate={(path) => navigate(path)} />
            <HeaderMenuItemLink
              newPage
              href={ENABLE_DATASTAX_LANGFLOW ? DATASTAX_DOCS_URL : DOCS_URL}
            >
              <span data-testid="menu_docs_button" id="menu_docs_button">
                {t("account.docs")}
              </span>
            </HeaderMenuItemLink>
          </div>

          <div>
            <HeaderMenuItemLink newPage href={githubUrl}>
              <span
                data-testid="menu_github_button"
                id="menu_github_button"
                className="flex items-center gap-2"
              >
                <FaGithub className="h-4 w-4" aria-hidden="true" />
                {t("account.github")}
              </span>
            </HeaderMenuItemLink>
            <HeaderMenuItemButton
              onClick={() => navigator.clipboard.writeText(discordUsername)}
            >
              <span
                data-testid="menu_discord_button"
                id="menu_discord_button"
                className="flex items-center gap-2"
              >
                <FaDiscord
                  className="h-4 w-4 text-[#5865F2]"
                  aria-hidden="true"
                />
                @{discordUsername}
              </span>
            </HeaderMenuItemButton>
          </div>

          <div className="flex items-center justify-between px-4 py-[6.5px] text-sm">
            <span className="">{t("account.theme")}</span>
            <div className="relative top-[1px] float-right">
              <ThemeButtons />
            </div>
          </div>

          {!autoLogin && !hideLogoutButton && (
            <div>
              <HeaderMenuItemButton onClick={handleLogout} icon="log-out">
                {t("account.logout")}
              </HeaderMenuItemButton>
            </div>
          )}
        </div>
      </HeaderMenuItems>
    </HeaderMenu>
  );
};
