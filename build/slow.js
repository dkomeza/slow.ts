var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import http from "http";
import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";
class slow {
  constructor() {
    this.router = new Router();
  }
  handle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      yield req.init();
      this.router.handle(req, res);
    });
  }
  listen(port, callback) {
    const hostPort = port || 5000;
    const server = http.createServer(
      {
        IncomingMessage: SlowRequest,
        ServerResponse: SlowResponse,
      },
      this.handle.bind(this)
    );
    return server.listen.apply(server, [hostPort, callback]);
  }
  close(cb) {
    return this.listen().close(cb);
  }
}
export default slow;
export const app = new slow();
