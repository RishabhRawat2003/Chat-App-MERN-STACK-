import { getConversationUsers, getMessages, readMessage, sendMessage } from "../controllers/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router()

router.route('/:id').get(verifyJwt, getMessages)
router.route('/send/:id').post(verifyJwt, sendMessage)
router.route('/all-conversations').post(verifyJwt, getConversationUsers)
router.route('/read-message/:id').post(verifyJwt, readMessage)

export default router