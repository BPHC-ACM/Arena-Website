const getExpectedToken = () => {
  return process.env.SCORE_UPDATE_TOKEN || process.env.token || process.env.NEXT_PUBLIC_WS_TOKEN;
};

const getAllowedRoles = () => {
  const rawRoles = process.env.SCORE_UPDATE_ROLES || "admin,scorer";
  return rawRoles
    .split(",")
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);
};

const getBearerToken = (authorizationHeader) => {
  if (typeof authorizationHeader !== "string") {
    return "";
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return "";
  }

  return token.trim();
};

const authorizeScoreUpdate = (req, res, next) => {
  const expectedToken = getExpectedToken();
  if (!expectedToken) {
    return res.status(500).json({
      error: "Server score update token is not configured",
    });
  }

  const role = String(req.headers["x-user-role"] || "").toLowerCase().trim();
  const token = getBearerToken(req.headers.authorization);

  if (!token || token !== expectedToken) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  const allowedRoles = getAllowedRoles();
  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({
      error: `Role '${role || "unknown"}' cannot update scores`,
      allowedRoles,
    });
  }

  req.user = { role };
  next();
};

module.exports = {
  authorizeScoreUpdate,
};
