import { app } from "../index.js";

// const app = new slow();

app.route("get", "/", (req, res) => {
  // console.log(req);
  res.end("Hello World");
});

app.listen(5000, () => {
  console.log("Server is running");
});
