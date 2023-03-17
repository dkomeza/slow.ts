import http, { IncomingMessage } from "http";
import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
class slow {
    constructor() {
        this.router = (method, path, callback) => {
            const route = this._router.route(path);
            route.methods[method] = callback;
        };
        this._router = new Router();
    }
    handle(req, res) {
        this._router.handle(req, res);
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
