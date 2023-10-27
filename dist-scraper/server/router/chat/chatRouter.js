"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const config_1 = require("../../../puppeteer/config");
const inprogress = false;
class ChatRouter {
    Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            let result;
            try {
                result = yield config_1.scrap.Login({
                    email: email,
                    password: password
                });
                if (result instanceof Error) {
                    return res.status(500).send({ "errorMessage": result.toString() });
                }
            }
            catch (error) {
                return res.status(500).send({ "errorMessage": error === null || error === void 0 ? void 0 : error.toString() });
            }
            return res.status(200).send({ "result": result });
        });
    }
    Prompt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inprogress) {
                console.log("request discarded, wait until the end of the last request");
                return;
            }
            const { message } = req.body;
            let result;
            try {
                result = yield config_1.scrap.Prompt(message);
                if (result instanceof Error) {
                    console.log(result);
                    return res.status(400).send({ "errorMessage": result.toString() });
                }
            }
            catch (error) {
                return res.status(500).send({ "errorMessage": error === null || error === void 0 ? void 0 : error.toString() });
            }
            return res.status(200).send({ "result": result });
        });
    }
}
exports.chatRouter = new ChatRouter();
