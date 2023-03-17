import slow from "../index.js";

const app = new slow();

const router = app.router;
console.log(router);

router("get", "/super", (req, res) => {
  res.send("super");
});

app.router("get", "/", (req, res) => {
  res.send("haha");
});

app.listen(5000, () => {
  console.log("Server is running");
});
