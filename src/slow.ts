import http from "http";

export default class slow {
  constructor() {}

  listen(port: number, callback: () => void) {
    const server = http.createServer();
    return server.listen.apply(server, [port, callback]);
  }
}
