import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { followersFollowingsDetails } from "../controllers/followersFollowing.controller.js"
import { fetchUserDetailsForFollowersFollowing } from "../controllers/user.controller.js"


const router = Router()

router.route("/user-details-followers-following").post(verifyJwt, fetchUserDetailsForFollowersFollowing)
router.route("/followers-followings-details").post(verifyJwt, followersFollowingsDetails)

export default router
