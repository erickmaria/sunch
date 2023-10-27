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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrap = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
// const scrap_debug = process.env.SCRAP_DEBUG || true;
class ScrapConfig {
    constructor() {
        this.Init().catch(err => {
            throw new Error(err.toString());
        });
    }
    Init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.browser = yield puppeteer_extra_1.default.launch({
                    headless: false,
                    userDataDir: "./user_data",
                    args: [
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        // '--window-size=400,600'
                    ],
                });
                this.page = yield this.browser.newPage();
                this.page.setCacheEnabled(true);
                yield this.page.setJavaScriptEnabled(true);
            }
            catch (error) {
                yield this.browser.close();
                console.log(error);
                return new Error(error === null || error === void 0 ? void 0 : error.toString());
            }
            return null;
        });
    }
    Login(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            process.stdout.write("Logining, ChatGPT...\n ");
            try {
                yield this.page.goto('https://chat.openai.com', { waitUntil: 'domcontentloaded' });
                if (!this.page.url().includes('auth/login')) {
                    const authenticated = "already authenticated";
                    console.log(authenticated);
                    return "already authenticated";
                }
                yield this.page.waitForTimeout(1000);
                let login = yield this.page.waitForSelector('[data-testid="login-button"]');
                login === null || login === void 0 ? void 0 : login.click();
                yield this.page.waitForTimeout(1000);
                yield this.page.waitForSelector('input[name=username]');
                yield this.page.type('input[name=username]', auth.email);
                yield this.page.waitForTimeout(1000);
                yield this.page.click('[data-action-button-primary="true"]');
                yield this.page.reload();
                yield this.page.waitForTimeout(1000);
                yield this.page.type('input[id=password]', auth.password);
                yield this.page.waitForTimeout(1000);
                yield this.page.click('[data-action-button-primary="true"]');
                yield this.page.waitForTimeout(1000);
                let textSelector = yield this.page.waitForSelector("text/Okay, let’s go");
                textSelector === null || textSelector === void 0 ? void 0 : textSelector.click();
                console.timeEnd("time");
                console.log("Ready to ask questions!");
            }
            catch (error) {
                // await this.browser.close()
                console.log(error);
                return new Error(error === null || error === void 0 ? void 0 : error.toString());
            }
            return null;
        });
    }
    Prompt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                console.time("time");
                process.stdout.write("Prompting, ChatGPT...\n ");
                if (!this.page.url().includes('chat.openai.com/c/')) {
                    yield this.page.goto('https://chat.openai.com/', { waitUntil: 'domcontentloaded' });
                    if (this.page.url().includes('auth/login')) {
                        return new Error("you're not authenticated!");
                    }
                    yield this.page.waitForTimeout(1000);
                    let chatText = yield this.page.waitForSelector('div>ol>li>a>div.text-ellipsis');
                    chatText === null || chatText === void 0 ? void 0 : chatText.click();
                    yield this.page.waitForTimeout(2000);
                }
                console.log("user: " + message);
                yield this.page.waitForTimeout(500);
                yield this.page.waitForSelector('textarea[id=prompt-textarea]');
                yield this.page.type('textarea[id=prompt-textarea]', message);
                yield this.page.waitForTimeout(500);
                let send = yield this.page.waitForSelector('[data-testid="send-button"]');
                send === null || send === void 0 ? void 0 : send.click();
                yield this.page.waitForTimeout(500);
                while (true) {
                    const loading = yield this.page.evaluate(() => {
                        return document.querySelectorAll('button.btn-neutral>div')[0].textContent;
                    });
                    if (loading == "Regenerate") {
                        break;
                    }
                }
                yield this.page.waitForTimeout(500);
                response = yield this.page.evaluate(() => {
                    const elementsWithClass = Array.from(document.querySelectorAll('.markdown'));
                    return elementsWithClass.map(element => element.textContent).pop();
                });
                console.log("assistant: " + response);
            }
            catch (error) {
                // await this.browser.close()
                console.log(error);
                return new Error(error === null || error === void 0 ? void 0 : error.toString());
            }
            return response;
        });
    }
    static getInstance() {
        if (!this.instance) {
            return new ScrapConfig();
        }
        return this.instance;
    }
}
exports.scrap = ScrapConfig.getInstance();
