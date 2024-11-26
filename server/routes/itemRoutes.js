async function itemRoutes(fastify, options) {
  const collection = fastify.mongo.db.collection("items");
  const transactions = fastify.mongo.db.collection("transactions");

  // Get all items
  fastify.get(
    "/items",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      try {
        const items = await collection.find({}).toArray();
        response.status(200).send({ items });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );

  // Add a new item
  fastify.post(
    "/items",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      const {
        name,
        description,
        category,
        quantity,
        minQuantity,
        unit,
        location,
      } = request.body;
      const { _id: userId, name: userName, email: userEmail } = request.user;

      if (
        !name ||
        !description ||
        !category ||
        !quantity ||
        !minQuantity ||
        !unit ||
        !location
      )
        return response.status(400).send({ message: "Item details missing" });

      try {
        const existingItem = await collection.findOne({
          name: name,
          "category.name": category.name,
          location: location,
        });

        if (existingItem)
          return response.status(200).send({
            message: "Item already exists",
          });

        await collection.insertOne({
          name,
          description,
          category,
          quantity,
          minQuantity,
          unit,
          location,
          createdAt: new Date(),
          createdBy: { userId, userName, userEmail },
        });

        response.status(200).send({ message: "Item created successfully" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );

  // Modify item count
  fastify.put(
    "/items",
    { preHandler: [fastify.authenticate] },
    async (request, response) => {
      const { id, newQuantity } = request.body;
      const { _id: userId, name: userName, email: userEmail } = request.user;

      if (!newQuantity)
        return response
          .status(400)
          .send({ message: "New Quantity is missing" });

      try {
        const item = await collection.findOne(
          {
            _id: new fastify.mongo.ObjectId(id),
          },
          {
            projection: {
              name: 1,
              category: 1,
              location: 1,
              quantity: 1,
              unit: 1,
            },
          }
        );

        const result = await collection.updateOne(
          {
            _id: new fastify.mongo.ObjectId(id),
          },
          {
            $set: {
              quantity: newQuantity,
              updatedAt: new Date(),
              updatedBy: { userId, userName, userEmail },
            },
          }
        );

        if (result.matchedCount === 0)
          return response.status(404).send({ message: "Item not found" });

        await transactions.insertOne({
          item: item.name,
          category: item.category,
          location: item.location,
          oldQuantity: item.quantity,
          newQuantity,
          createdAt: new Date(),
          createdBy: { userId, userName, userEmail },
        });

        response
          .status(200)
          .send({ message: "Item quantity updated successfully" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ error: error.message });
      }
    }
  );
}

module.exports = itemRoutes;
