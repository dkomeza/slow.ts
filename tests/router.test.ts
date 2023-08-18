import supertest from "supertest";
import { expect, it, test, describe } from "vitest";

import blns from "blns";

import slow from "..";

describe("router", () => {
  const app = new slow();
  const router = app.router!;
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
      res.send("test");
    });
    const res = await supertest(app.server).get("/test");
    expect(res.text).toBe("test");
  });
  test("should send 404 on unknown route", async () => {
    await supertest(app.server).get("/unknown").expect(404);
    app.close();
  });
  test("should be able to add a static route", async () => {
    router.static("/", "static");
  });
  test("should be able to handle no route", async () => {
    const res = await supertest(app.server).get("");
    expect(res.text).toBe("404");
  });
});

describe("strict routes", () => {
  const app = new slow();
  const router = app.router!;

  test("should be able to handle / routes", async () => {
    router.route("get", "/", (req, res) => {
      res.send("/");
    });
    const res = await supertest(app.server).get("/");
    expect(res.text).toBe("/");
  });

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

  test("should be able to hande route with different method", async () => {
    router.route("post", "/test_no_method", (req, res) => {
      res.send(req.body.test);
    });
    const res = await supertest(app.server).get("/test_no_method");
    expect(res.text).toBe("404");
  });

  test("should be able to handle post body", async () => {
    router.route("post", "/post_params", (req, res) => {
      res.send(req.body);
    });

    const res = await supertest(app.server)
      .post("/post_params")
      .send({ test: "test" });
    expect(res.text).toBe('{"test":"test"}');
  });

  test("should be able to handle different enctype", async () => {
    router.route("post", "/post_form_data", (req, res) => {
      res.send("ok");
    });
    const formData = new FormData();
    formData.append("image", new Blob([""], { type: "image/png" }));
    formData.append("name", "test");
    const res = await supertest(app.server)
      .post("/post_form_data")
      .field("name", "test")
      .set("Content-Yype", "multipart/form-data");
    expect(res.text).toEqual("ok");
  });
});

describe("placeholder routes", () => {
  const app = new slow();
  const router = app.router!;

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
  const router = app.router!;

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
  const router = app.router!;

  test("should be able to handle a static route", async () => {
    router.static("/", "tests/static");
    const res = await supertest(app.server).get("/index.html");
    expect(res.text).toBe("test");
  });

  test("should be able to handle an index route", async () => {
    router.static("/", "tests/static");
    const res = await supertest(app.server).get("/");
    expect(res.text).toBe("test");
  });

  test("should be able to handle no static file", async () => {
    router.static("/", "tests/static");
    const res = await supertest(app.server).get("/test_empty_directory");
    expect(res.text).toBe("404");
  });

  test("should return correct mime type on html files", async () => {
    const res = await supertest(app.server).get("/index.html");
    expect(res.headers["content-type"]).toBe("text/html");
  });

  test("should return correct mime type on txt files", async () => {
    const res = await supertest(app.server).get("/index.txt");
    expect(res.headers["content-type"]).toBe("text/plain");
  });

  test("should return correct mime type on js files", async () => {
    const res = await supertest(app.server).get("/index.js");
    expect(res.headers["content-type"]).toBe("application/javascript");
  });

  test("should reject routes with .. ", async () => {
    const res = await supertest(app.server).get(
      "/new_folder/../../../keys.html"
    );
    expect(res.text).toBe("403");
  });
});

describe("test", () => {
  const app = new slow();
  const router = app.router!;
  router.route("get", "/tasks", (req, res) => {
    res.send("get");
  });
  router.route("post", "/tasks", (req, res) => {
    res.send("post");
  });
  test("post and get on single route (get)", async () => {
    const res = await supertest(app.server).get("/tasks");
    // expect(router.routes["/tasks"])
    expect(res.text).toBe("get");
  });
  test("post and get on single route (post)", async () => {
    const res = await supertest(app.server).post("/tasks");
    // expect(router.routes["/tasks"])
    expect(res.text).toBe("post");
  });
});

// Path: tests/slow.test.ts
