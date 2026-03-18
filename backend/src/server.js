const app = require("./app");
const { connectDb } = require("./config/db");
const { port } = require("./config/env");

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Auth server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

start();
