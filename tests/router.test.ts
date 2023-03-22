import supertest from "supertest";
import { expect, it, test, describe } from "vitest";

import slow from "..";

describe("router", () => {
  const app = new slow();
  const router = app.router;
  test("should have a router", async () => {
    expect(typeof router).toBe("object");
  });
  test("should have a route method", async () => {
    expect(typeof router.route).toBe("function");
  });
  test("should have a handle method", async () => {
    expect(typeof router.handle).toBe("function");
  });
  test("should have a static method", async () => {
    expect(typeof router.static).toBe("function");
  });
  test("should be able to add a route", async () => {
    router.route("get", "/test", (req, res) => {
      // res.send("test");
      res.send(["test"]);
    });
    const res = await supertest(app.server).get("/test");
    expect(res.text).toBe("test");
  });
  test("should send 404 on unknown route", async () => {
    await supertest(app.server).get("/unknown").expect(404);
    app.close();
  });
  test("should be able to add a static route", async () => {
    router.static("static");
  });
});

describe("strict routes", () => {
  const app = new slow();
  const router = app.router;

  test("should prioritise strict routes", async () => {
    router.route("get", "/test_priority/*", (req, res) => {
      res.send("wildcard");
    });
    router.route("get", "/test_priority/strict", (req, res) => {
      res.send("strict");
    });
    const res = await supertest(app.server).get("/test_priority/strict");
    expect(res.text).toBe("strict");
  });

  test("should be able to handle a route", async () => {
    router.route("get", "/test_get", (req, res) => {
      res.send("test");
    });
    const res = await supertest(app.server).get("/test_get");
    expect(res.text).toBe("test");
  });

  test("should be able to handle a post route", async () => {
    router.route("post", "/test_post", (req, res) => {
      res.send(req.body.test);
    });
    const res = await supertest(app.server)
      .post("/test_post")
      .send({ test: "test" });
    expect(res.text).toBe("test");
  });

  test("should be able to handle a get route with params", async () => {
    router.route("get", "/test_get_params", (req, res) => {
      res.end(JSON.stringify(req.body));
    });
    const res = await supertest(app.server).get("/test_get_params?test=test");
    expect(res.text).toBe('{"test":"test"}');
  });

  test("should be able to handle no route", async () => {
    const res = await supertest(app.server).get("");
    expect(res.text).toBe("404");
  });

  test("should be able to hande route with different method", async () => {
    router.route("post", "/test_no_method", (req, res) => {
      res.send(req.body.test);
    });
    const res = await supertest(app.server).get("/test_no_method");
    expect(res.text).toBe("404");
  });
});

describe("placeholder routes", () => {
  const app = new slow();
  const router = app.router;

  test("should be able to handle a placeholder route", async () => {
    router.route("get", "/test_placeholder/:id", (req, res) => {
      res.send(req.params.id);
    });
    const res = await supertest(app.server).get("/test_placeholder/123");
    expect(res.text).toBe("123");
  });

  test("should be able to handle a placeholder route with following strict route", async () => {
    router.route("get", "/test_placeholder_strict/:id/settings", (req, res) => {
      res.send(req.params.id);
    });
    const res = await supertest(app.server).get(
      "/test_placeholder_strict/123/settings"
    );
    expect(res.text).toBe("123");
  });

  test("should be able to handle a route with multiple placeholders", async () => {
    router.route(
      "get",
      "/test_placeholder_multiple/:id/:supcio",
      (req, res) => {
        res.send(req.params.id + "/" + req.params.supcio);
      }
    );
    const res = await supertest(app.server).get(
      "/test_placeholder_multiple/123/124"
    );
    expect(res.text).toBe("123/124");
  });

  test("should not match a route with multiple placeholders without some of them", async () => {
    router.route(
      "get",
      "/test_placeholder_no_match/:id/:supcio",
      (req, res) => {
        res.send(req.params.id + "/" + req.params.supcio);
      }
    );
    const res = await supertest(app.server).get(
      "/test_placeholder_no_match/123"
    );
    expect(res.text).toBe("404");
  });
});

describe("wildcard routes", () => {
  const app = new slow();
  const router = app.router;

  test("should be able to handle a wildcard route", async () => {
    router.route("get", "/test/*", (req, res) => {
      res.send("test");
    });
    const res = await supertest(app.server).get("/test/1");
    expect(res.text).toBe("test");
  });
});

describe("static routes", () => {
  const app = new slow();
  const router = app.router;

  test("should be able to handle a static route", async () => {
    router.static("tests/static");
    const res = await supertest(app.server).get("/index.html");
    expect(res.text).toBe("test");
  });

  test("should be able to handle an index route", async () => {
    router.static("tests/static");
    const res = await supertest(app.server).get("/");
    expect(res.text).toBe("test");
  });

  test("should be able to handle no static file", async () => {
    router.static("tests/static");
    const res = await supertest(app.server).get("/test_empty_directory");
    expect(res.text).toBe("404");
  });
});

// Path: tests/slow.test.ts
