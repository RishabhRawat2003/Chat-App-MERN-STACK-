import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deletePost, likePost, postDetailArr, singlePostDetails, uploadPost } from "../controllers/post.controller.js";

const router = Router()

router.route("/create-post").post(verifyJwt, upload.single('image'), uploadPost)
router.route("/all-posts").post(verifyJwt, postDetailArr)
router.route("/single-post").post(verifyJwt, singlePostDetails)
router.route("/delete-post").post(verifyJwt, deletePost)
router.route("/like-post").post(verifyJwt, likePost)


export default router