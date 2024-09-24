import { Router } from "express"
import { changeCurrentPassword, deleteAccount, loginUser, logoutUser, refreshAccessToken, updateAccountDetails, updateProfileImage, userDetails, userRegister } from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from "../middlewares/auth.middleware.js"


const router = Router()

router.route('/register').post(userRegister)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/user-details').post(verifyJwt, userDetails)
router.route('/change-password').post(verifyJwt, changeCurrentPassword)
router.route('/update-account-details').post(verifyJwt, updateAccountDetails)
router.route('/update-profile-image').post(verifyJwt, upload.single('profileImage'), updateProfileImage)
router.route('/delete-account').post(verifyJwt, deleteAccount)


export default router