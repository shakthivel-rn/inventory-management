const fastify = require("fastify")();
const authPlugin = require("./plugins/auth");
const generateTokenPlugin = require("./plugins/generateToken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

fastify.register(require("@fastify/mongodb"), {
  forceClose: true,
  url: process.env.MONGO_URI,
});

// Register plugins
fastify.register(authPlugin, { JWT_SECRET });
fastify.register(generateTokenPlugin, { JWT_SECRET });

// Register routes
fastify.register(require("./routes/authenticationRoutes"));
fastify.register(require("./routes/userRoutes"));
fastify.register(require("./routes/categoryRoutes"));
fastify.register(require("./routes/itemRoutes"));

const startServer = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log(`Server Started at Port 3001`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
