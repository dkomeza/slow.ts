import http from "http";
import internal from "stream";

class Socket {
  server: http.Server;
  constructor(server: http.Server) {
    this.server = server;
    this.server.on("upgrade", this.upgrade.bind(this));
  }

  upgrade(req: http.IncomingMessage, socket: internal.Duplex, head: Buffer) {
    socket.write(
      "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
        "Upgrade: WebSocket\r\n" +
        "Connection: Upgrade\r\n" +
        "\r\n"
    );
  }
}

export default Socket;

// Path: src/socket/Socket.ts
