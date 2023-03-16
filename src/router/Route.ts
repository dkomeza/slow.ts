import { IncomingMessage } from "http";
import SlowResponse from "./Response";

interface callback {
  (req: IncomingMessage, res: SlowResponse): void;
}

class Route implements Route {
  path: string;
  methods: {
    [key: string]: callback;
  };
  constructor(path: string) {
    this.path = path;
    this.methods = {};
  }

  handle(req: IncomingMessage, res: SlowResponse) {
    const callback = this.methods["get"];
    if (callback) {
      callback(req, res);
    }
  }

  get(callback: callback) {
    this.methods["get"] = callback;
  }

  post() {}

  put() {}

  delete() {}

  patch() {}
}

export default Route;
