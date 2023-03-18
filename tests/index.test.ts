import slow from "../index.js";

const app = new slow();

const router = app.router;

router("get", "/", (req, res) => {
  console.log(req.body);
  res.send("super");
});

app.listen(5000, () => {
  console.log("Server is running");
});
