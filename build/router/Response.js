import http from "http";
class SlowResponse extends http.ServerResponse {
    constructor(req) {
        super(req);
    }
    send(data) {
        this.end(data);
        return this;
    }
}
export default SlowResponse;
// Path: src/router/Response.ts
