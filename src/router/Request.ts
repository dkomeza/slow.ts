import http from "http";
import { Socket } from "net";

class SlowRequest extends http.IncomingMessage {
  body: {
    [key: string]: any;
  } = {};
  data: string = "";
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
    // const params = url?.split("?").pop()?.split("&");
    const params = new URLSearchParams(url);
    params?.forEach((param) => {
      const key = param.split("=").shift();
      if (key) {
        this.body[key] = param.split("=").pop();
      }
    });
  }

  parsePostRequest() {}

  parseBody() {
    this.body = {};
  }
}

export default SlowRequest;
