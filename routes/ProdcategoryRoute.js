const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategory,
} = require("../controllers/ProdcategoryContoller");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", getAllCategory);
router.get("/:id", getSingleCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
