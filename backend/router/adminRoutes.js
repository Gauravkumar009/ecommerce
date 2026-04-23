import express from "express";
import {getAllUsers,deleteUser,deshboardStats} from "../controllers/adminController.js";
import {
    authorizedRoles,
    isAuthenticated
} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get(
    "/getallusers",
    isAuthenticated,
    authorizedRoles("Admin"),
    getAllUsers
); //DESHBOARD

router.delete("/delete/:id",
    isAuthenticated,
    authorizedRoles("Admin"),
    deleteUser
);

router.get(
    "/fetch/dashboard-stats",
    isAuthenticated,
    authorizedRoles("Admin"),
    deshboardStats
);

export default router;