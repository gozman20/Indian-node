const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgottenPassword,
  resetPassword,
  adminLogin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.post("/forgot-password-token", forgottenPassword);

router.get("/logout", logout);
router.get("/all-users", getAllUser);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.put("/reset-password/:token", resetPassword);
router.put("/:edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/password", authMiddleware, updatePassword);
router.put("/block-user/:id", isAdmin, blockUser);
router.put("/unblock-user/:id", isAdmin, unblockUser);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

module.exports = router;
