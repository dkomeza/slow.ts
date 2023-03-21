import slow, { app } from "../index.js";
import supertest from "supertest";

describe("slow", () => {
  const app = new slow();
  it("is an object", async () => {
    const app = new slow();
    expect(typeof app).toBe("object");
  });
  it("should have a listen method", async () => {
    const app = new slow();
    expect(typeof app.listen).toBe("function");
  });
  it("should send 404 on unknown route", (done) => {
    supertest(app.server).get("/").expect(404).end(done);
  });
});
