import { Router } from "express";
import { chatRouter } from "./chat/chatRouter";

const router: Router = Router()

router.post("/login", chatRouter.Login);
router.get("/prompt", chatRouter.Prompt);

export { router };