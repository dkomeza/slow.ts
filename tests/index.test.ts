import slow from "../index.js";

const app = new slow();

const router = app.router;

router.static("/static");

router.route("get", "/", (req, res) => {
  console.log(req.body);
  res.send("super");
});

router.route("get", "/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  res.send("super");
});

app.listen(5000, () => {
  console.log(router.routes);
  console.log("Server is running");
});
