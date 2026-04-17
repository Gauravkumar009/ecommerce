import express from "express";
import { register, login, logout, getUser, forgotPassword , resetPassword, updatePassword , updateProfile} from "../controllers/authController.js";
import { isAuthnticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",isAuthnticated, getUser);
router.get("/logout",isAuthnticated, logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthnticated, updatePassword);
router.put("/profile/update", isAuthnticated, updateProfile);



export default router;