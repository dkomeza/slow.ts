class Route {
    path;
    methods;
    placeholder;
    constructor(path) {
        this.path = path;
        this.methods = {};
        this.placeholder = this.parsePlaceholderPath(path);
    }
    parsePlaceholderPath(path) {
        const pathArr = path.split("/");
        for (let i = 0; i < pathArr.length; i++) {
            if (pathArr[i].startsWith(":")) {
                return pathArr[i].substring(1);
            }
        }
    }
}
export default Route;
//# sourceMappingURL=Route.js.map