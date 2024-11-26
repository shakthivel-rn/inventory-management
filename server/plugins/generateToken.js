const fp = require("fastify-plugin");
const jwt = require("jsonwebtoken");

module.exports = fp(async (fastify, options = {}) => {
  const { JWT_SECRET } = options;

  if (!JWT_SECRET)
    throw new Error("JWT_SECRET is required for token generation");

  fastify.decorate("generateToken", (user, options = {}) => {
    if (!user) throw new Error("User data is required to generate token");

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const defaultOptions = { expiresIn: "1h" };
    const jwtTokenOptions = { ...defaultOptions, ...options };

    return jwt.sign(userData, JWT_SECRET, jwtTokenOptions);
  });
});
