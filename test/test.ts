import Slow from "../build/slow";

const app = new Slow();

app.listen(5000, () => {
  console.log("Started on port 5000");
});
