const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Auth-client server listening on port ${port}`);
});
