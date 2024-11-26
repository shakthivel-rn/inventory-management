const bcrypt = require("bcrypt");

async function authenticationRoutes(fastify) {
  const collection = fastify.mongo.db.collection("users");

  //Signup
  fastify.post("/signup", async (request, response) => {
    const { name, email, password } = request.body;

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser)
      return response.status(400).send({ message: "Account already exists" });

    //Encrypt the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await collection.insertOne({
        name,
        email,
        password: hashedPassword,
      });

      response.status(201).send({ message: "User registered successfully" });
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ error: error.message });
    }
  });

  // Login
  fastify.post("/login", async (request, response) => {
    const { email, password } = request.body;

    //Find the user
    try {
      const user = await collection.findOne({ email });
      if (!user)
        return response
          .status(401)
          .send({ message: "Invalid email or password" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return response
          .status(401)
          .send({ message: "Invalid email or password" });

      const token = fastify.generateToken(user);
      response.status(200).send({ token, message: "Login successful" });
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ error: error.message });
    }
  });
}

module.exports = authenticationRoutes;
