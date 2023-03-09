import http from "http";
export default class slow {
    constructor() { }
    listen(port, callback) {
        const server = http.createServer();
        return server.listen.apply(server, [port, callback]);
    }
}
