import http from "http";
import Router from "./router/router.js";
class slow {
    constructor() {
        this.router = new Router();
    }
    route(method) { }
    handle(req, res) {
        this.router.handle(req, res);
    }
    listen(port, callback) {
        const hostPort = port || 5000;
        const server = http.createServer(this.handle.bind(this));
        server.on;
        return server.listen.apply(server, [hostPort, callback]);
    }
}
export default slow;
export const app = new slow();
