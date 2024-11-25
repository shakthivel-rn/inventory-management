async function userRoutes(fastify, options) {
  const collection = fastify.mongo.db.collection("users");

  // Get all users
  fastify.get(
    "/users",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      try {
        const users = await collection
          .find({}, { projection: { password: 0 } })
          .toArray();
        response.status(200).send({ users });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );

  // Get a user
  fastify.get(
    "/users/:id",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      const { id } = request.params;

      try {
        const user = await collection.findOne(
          {
            _id: new fastify.mongo.ObjectId(id),
          },
          { projection: { password: 0 } }
        );

        if (!user)
          return response.status(404).send({ message: "User not found" });

        response.status(200).send({ user });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );

  // Update a user
  fastify.put(
    "/users/:id",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      const { id } = request.params;
      const { name, email } = request.body;

      if (!name || !email)
        return response
          .status(400)
          .send({ message: "Field to be updated missing" });

      try {
        const result = await collection.updateOne(
          {
            _id: new fastify.mongo.ObjectId(id),
          },
          { $set: { name, email } }
        );

        if (result.matchedCount === 0)
          return response.status(404).send({ message: "User not found" });

        response.status(200).send({ message: "User updated successfully" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );
}

module.exports = userRoutes;
