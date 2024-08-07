import { Router } from "express"
import { loginUser, logoutUser, userRegister } from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from "../middlewares/auth.middleware.js"


const router = Router()

router.route('/register').post(userRegister)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt, logoutUser)

export default router