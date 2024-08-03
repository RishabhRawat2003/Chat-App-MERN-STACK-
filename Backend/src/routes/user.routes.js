import { Router } from "express"
import { userRegister } from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router.route('/register').post(userRegister)

export default router