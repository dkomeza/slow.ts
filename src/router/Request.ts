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
    if (url?.split("?").pop()) {
      const params = new URLSearchParams();
      params.forEach((value, key) => {
        this.body[key] = value;
      });
    }
  }

  parsePostRequest() {
    this.body = {};
    const contentType = this.headers["content-type"];
    if (contentType) {
      if (contentType.includes("application/json")) {
        this.body = JSON.parse(this.data);
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(this.data);
        params.forEach((value, key) => {
          this.body[key] = value;
        });
      }
    }
  }
}

export default SlowRequest;
