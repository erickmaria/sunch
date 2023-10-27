"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const chatRouter_1 = require("./chat/chatRouter");
const router = (0, express_1.Router)();
exports.router = router;
router.post("/login", chatRouter_1.chatRouter.Login);
router.get("/prompt", chatRouter_1.chatRouter.Prompt);
