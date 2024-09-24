import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { allCommentsDetails, sendComment, deleteComment } from "../controllers/comment.controller.js";

const router = Router()

router.route('/send-comment').post(verifyJwt, sendComment)
router.route('/all-comments').post(verifyJwt, allCommentsDetails)
router.route('/delete-comment').post(verifyJwt, deleteComment)


export default router