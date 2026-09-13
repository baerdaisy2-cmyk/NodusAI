import {
  BASE_URL_API,
  HEALTH_CHECK_URL,
} from "@/customization/config-constants";

export function getBaseUrl(): string {
  return BASE_URL_API || "/api/v1/";
}

export function getHealthCheckUrl(): string {
  return HEALTH_CHECK_URL || "/health";
}

export const NodusAIButtonRedirectTarget = () => {
  return "https://github.com/baerdaisy2-cmyk/NodusAI";
};
