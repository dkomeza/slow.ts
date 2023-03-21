import supertest from "supertest";
import { expect, it, test, describe } from "vitest";

import slow from "..";
import { AddressInfo } from "net";

describe("slow", () => {
  test("is an object", async () => {
    const app = new slow();
    expect(typeof app).toBe("object");
  });
  test("should have a listen method", async () => {
    const app = new slow();
    expect(typeof app.listen).toBe("function");
  });
  test("should have a close method", async () => {
    const app = new slow();
    expect(typeof app.close).toBe("function");
  });
});

describe("server", () => {
  test("listen should return a server", async () => {
    const app = new slow();
    const server = app.listen(9000);
    expect(typeof server).toBe("object");
    app.close();
  });
  test("close should close the server", async () => {
    const app = new slow();
    app.listen(9000);
    app.close();
    expect(app.server.listening).toBe(false);
  });
  test("listen should listen on the selected port", async () => {
    const app = new slow();
    const server = app.listen(9000);
    const address = server.address() as AddressInfo;
    expect(address.port).toBe(9000);
    app.close();
  });
  test("should listen on the default port", async () => {
    const app = new slow();
    const server = app.listen();
    expect(server.listening).toBe(true);
    app.close();
  });
  
});
