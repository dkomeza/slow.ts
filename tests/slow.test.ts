import { request } from "http";
import slow, { app } from "../index.js";

describe("slow", () => {
  it("is an object", async () => {
    const app = new slow();
    expect(typeof app).toBe("object");
  });
  it("should have a listen method", async () => {
    const app = new slow();
    expect(typeof app.listen).toBe("function");
  });
  it("should send 404 on unknown route", (done) => {
    app.listen(9000);
    fetch("http://localhost:9000/unknown").then((res) => {
      app.close();
      expect(res.status).toBe(404);
      done();
    });
  });
});
