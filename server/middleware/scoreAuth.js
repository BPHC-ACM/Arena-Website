const getExpectedToken = () => {
  return process.env.SCORE_UPDATE_TOKEN || process.env.token || process.env.NEXT_PUBLIC_WS_TOKEN;
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

  const token = getBearerToken(req.headers.authorization);

  if (!token || token !== expectedToken) {
    return res.status(401).json({ error: "Invalid or missing password" });
  }

  req.user = { role: "admin" };
  next();
};

module.exports = {
  authorizeScoreUpdate,
};
