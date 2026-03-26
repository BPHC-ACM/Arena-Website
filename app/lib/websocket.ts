export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : undefined;

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_URL || "";

export const getWebSocketUrl = () => {
  const baseUrl = DEFAULT_WS_URL;
  const token = process.env.WS_AUTH_TOKEN;

  if (!baseUrl) {
    return "";
  }

  if (!token) {
    return baseUrl;
  }

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("token", token);
    return url.toString();
  } catch {
    return `${baseUrl}?token=${encodeURIComponent(token)}`;
  }
};

export const getWebSocketUrlForDisplay = () => {
  const rawUrl = getWebSocketUrl();

  if (!rawUrl) return "";

  try {
    const parsed = new URL(rawUrl);
    if (parsed.searchParams.has("token")) {
      parsed.searchParams.set("token", "***");
    }
    return parsed.toString();
  } catch {
    return rawUrl.replace(/token=[^&]+/, "token=***");
  }
};
