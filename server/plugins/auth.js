const fp = require("fastify-plugin");
const jwt = require("jsonwebtoken");

module.exports = fp(async (fastify, options = {}) => {
  const { JWT_SECRET } = options;

  if (!JWT_SECRET) throw new Error("JWT_SECRET is required for authentication");

  fastify.decorate("authenticate", async (request, response) => {
    const authHeader = request.headers.authorization;

    if (!authHeader)
      return response
        .status(401)
        .send({ message: "Missing authorization header" });

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = decoded;
    } catch (error) {
      response.status(401).send({ message: "Invalid or expired token" });
    }
  });
});
