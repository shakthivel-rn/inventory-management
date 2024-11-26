async function categoryRoutes(fastify, options) {
  const collection = fastify.mongo.db.collection("categories");

  //Get all categories
  fastify.get(
    "/categories",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      try {
        const categories = await collection.find({}).toArray();
        response.status(200).send({ categories });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );

  // Add a new category
  fastify.post(
    "/categories",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      const { name, description } = request.body;
      const { _id: userId, name: userName, email: userEmail } = request.user;

      if (!name || !description)
        return response
          .status(400)
          .send({ message: "Category details missing" });

      try {
        const existingCategory = await collection.findOne({
          name: name,
        });
        if (existingCategory)
          return response
            .status(400)
            .send({ message: "Category already exists" });

        await collection.insertOne({
          name: name,
          description,
          createdAt: new Date(),
          createdBy: { userId, userName, userEmail },
        });

        response.status(200).send({ message: "Category created successfully" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );
}

module.exports = categoryRoutes;
