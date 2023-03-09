import Slow from "../index.js";

const app = new Slow();

app.listen(5002, () => {
  console.log("Server started");
});
