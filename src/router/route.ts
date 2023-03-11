import { IncomingMessage, ServerResponse } from "http";

interface callback {
  (req: IncomingMessage, res: ServerResponse): void;
}

interface middleware {
  (req: IncomingMessage, res: ServerResponse, next: callback): void;
}

class Route implements Route {
  path: string;
  methods: {
    [key: string]: {
      middleware?: middleware;
      callback?: callback;
    };
  }
  constructor(path: string) {
    this.path = path;
    this.methods = {};
  }

  handle(req: IncomingMessage, res: ServerResponse) {
    console.log(req.method);
  }

  get(middleware?: middleware, callback?: callback) {
    if (middleware) {
      this.methods["get"]["middleware"] = middleware;
    }
    if (callback) {
      this.methods["get"]["callback"] = callback;
    }
  }

  post() {}

  put() {}

  delete() {}

  patch() {}
}

export default Route;
