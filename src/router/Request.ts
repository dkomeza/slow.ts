import http from "http";
import { Socket } from "net";

class SlowRequest extends http.IncomingMessage {
  body: {
    [key: string]: any;
  } = {};
  data: string = "";
  params: { [key: string]: any } = {};
  constructor(socket: Socket) {
    super(socket);
  }

  async init() {
    const onData = new Promise((resolve) => {
      this.on("data", (data: Buffer) => {
        this.data += data.toString();
      });
      this.on("end", resolve);
    });
    const onClose = new Promise((resolve) => {
      this.on("close", resolve);
    });

    await Promise.all([onData, onClose]);
    this.parseRequest();
  }

  parseRequest() {
    switch (this.method) {
      case "GET":
        this.parseGetRequest();
        break;
      case "POST":
        this.parsePostRequest();
        break;
    }
  }

  parseGetRequest() {
    const url = this.url;

    if (url?.split("?") && url?.split("?").length > 1) {
      const params = new URLSearchParams(url?.split("?").pop());
      params.forEach((value, key) => {
        this.body[key] = value;
      });
    } else {
      this.body = {};
    }
  }

  parsePostRequest() {
    this.body = {};
    const contentType = this.headers["content-type"]!;
    if (contentType.includes("application/json")) {
      this.body = JSON.parse(this.data);
    } else {
      this.body = {};
    }
  }
}

export default SlowRequest;
