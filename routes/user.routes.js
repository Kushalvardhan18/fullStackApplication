import express from 'express'
import { registerUser, verifyUser,login, getProfile, logOutUser } from '../controller/user.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'

const router = express.Router()
router.post("/register", registerUser)
router.get("/verify/:token",verifyUser)
router.post("/login",login)
router.get("/profile",isLoggedIn,getProfile)
router.get("/logout",isLoggedIn,logOutUser)

export default router