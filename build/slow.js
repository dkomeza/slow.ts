import http from "http";
import Router from "./router/Router.js";
import SlowResponse from "./router/Response.js";
import SlowRequest from "./router/Request.js";
class slow {
    server;
    router;
    constructor() {
        this.router = new Router();
        this.server = http.createServer({
            IncomingMessage: SlowRequest,
            ServerResponse: SlowResponse,
        }, this.handle.bind(this));
    }
    async handle(req, res) {
        await req.init();
        this.router.handle(req, res);
    }
    listen(port, callback) {
        const hostPort = port || 5000;
        return this.server.listen.apply(this.server, [hostPort, callback]);
    }
    close(cb) {
        return this.server.close(cb);
    }
}
export default slow;
export const app = new slow();
