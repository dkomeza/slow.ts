import http from "http";
import { Socket } from "net";

interface body {
  [key: string]:
    | string
    | number
    | boolean
    | object
    | undefined
    | null
    | string[]
    | number[]
    | boolean[]
    | object[];
}

class SlowRequest extends http.IncomingMessage {
  body: body = {};
  data = "";
  params: { [key: string]: string | number } = {};
  constructor(socket: Socket) {
    super(socket);
  }

  async init() {
    await this.handleContentType();
    this.parseRequest();
  }

  async handleContentType() {
    const contentType = this.headers["content-type"] || "";
    if (contentType?.includes("application/json")) {
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
    }
  }

  parseRequest() {
    switch (this.method) {
      case "GET":
      case "HEAD":
        this.parseGetRequest();
        break;
      case "POST":
      case "PUT":
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
    const contentType = this.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      this.body = JSON.parse(this.data);
    }
  }
}

export default SlowRequest;
