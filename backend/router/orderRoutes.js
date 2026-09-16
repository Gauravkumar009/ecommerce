import express from "express";
import {
     fetchSingleOrder,
     placeNewOrder,
     verifyPayment,
     fetchMyOrders,
     fetchAllOrders,
     updateOrderStatus,
     deleteOrder,
    deleteMyPendingOrder,
} from "../controllers/orderController.js";
import {
  isAuthenticated,
  authorizedRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/new", isAuthenticated, placeNewOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/me", isAuthenticated, fetchMyOrders);
router.get("/orders/me", isAuthenticated, fetchMyOrders);
router.delete("/me/:orderId", isAuthenticated, deleteMyPendingOrder);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);
router.get(
  "/admin/getall",
  isAuthenticated,
  authorizedRoles("Admin"),
  fetchAllOrders
);
router.put(
  "/admin/update/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderStatus
);
router.delete(
  "/admin/delete/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteOrder
);

export default router;