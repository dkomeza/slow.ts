import http, { IncomingMessage } from "http";
import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
class slow {
    constructor() {
        this.router = new Router();
    }
    route(method, path, callback) {
        const route = this.router.route(path);
        route.get(callback);
    }
    handle(req, res) {
        this.router.handle(req, res);
    }
    listen(port, callback) {
        const hostPort = port || 5000;
        const server = http.createServer({
            IncomingMessage: IncomingMessage,
            ServerResponse: SlowResponse,
        }, this.handle.bind(this));
        return server.listen.apply(server, [hostPort, callback]);
    }
}
export default slow;
export const app = new slow();
