export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

const DEFAULT_WS_URL = "ws://localhost:3001";

export const getWebSocketUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_WS_URL || DEFAULT_WS_URL;
  const token = process.env.NEXT_PUBLIC_WS_TOKEN;

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
