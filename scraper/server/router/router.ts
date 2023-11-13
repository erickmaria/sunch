import { Router } from "express";
import { chatRouter } from "./chat/chatRouter";

const router: Router = Router()

router.post("/login", chatRouter.Login);
router.post("/prompt", chatRouter.Prompt);

export { router };