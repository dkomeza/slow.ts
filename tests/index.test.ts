import { app } from "../index.js";

// const app = new slow();

app.route("get", "/super", (req, res) => {
  res.send("haha");
});

app.listen(5000, () => {
  console.log("Server is running");
});
