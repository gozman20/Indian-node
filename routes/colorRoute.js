const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getSingleColor,
  getAllColor,
} = require("../controllers/colorController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createColor);
router.get("/", getAllColor);
router.get("/:id", getSingleColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);

module.exports = router;
