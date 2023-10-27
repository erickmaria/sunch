"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./router/router");
const body_parser_1 = __importDefault(require("body-parser"));
'';
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middleware();
        this.router();
    }
    middleware() {
        this.server.use(body_parser_1.default.urlencoded({ extended: true }));
        this.server.use(body_parser_1.default.json());
        this.server.use(express_1.default.json());
    }
    router() {
        this.server.use("/api", router_1.router);
    }
}
exports.App = App;
