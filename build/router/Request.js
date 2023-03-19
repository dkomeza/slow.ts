var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "http";
class SlowRequest extends http.IncomingMessage {
    constructor(socket) {
        super(socket);
        this.body = {};
        this.data = "";
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const onData = new Promise((resolve) => {
                this.on("data", (data) => {
                    this.data += data.toString();
                });
                this.on("end", resolve);
            });
            const onClose = new Promise((resolve) => {
                this.on("close", resolve);
            });
            yield Promise.all([onData, onClose]);
            this.parseRequest();
        });
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
        const params = new URLSearchParams(url === null || url === void 0 ? void 0 : url.split("?").pop());
        params.forEach((value, key) => {
            this.body[key] = value;
        });
    }
    parsePostRequest() {
        this.body = {};
        const contentType = this.headers["content-type"];
        if (contentType) {
            if (contentType.includes("application/json")) {
                this.body = JSON.parse(this.data);
            }
            else if (contentType.includes("application/x-www-form-urlencoded")) {
                const params = new URLSearchParams(this.data);
                params.forEach((value, key) => {
                    this.body[key] = value;
                });
            }
        }
    }
}
export default SlowRequest;
