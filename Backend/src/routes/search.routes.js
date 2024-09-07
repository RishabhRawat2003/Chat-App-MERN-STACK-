import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { searchedUserDetails, searchedUserFollow, searchedUserUnfollow, searchUsers } from "../controllers/search.controller.js"


const router = Router()


router.route('/search-username').post(verifyJwt, searchUsers)
router.route('/searched-user-details').post(verifyJwt, searchedUserDetails)
router.route('/follow-user').post(verifyJwt, searchedUserFollow)
router.route('/unfollow-user').post(verifyJwt, searchedUserUnfollow)

export default router
