const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrand,
} = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.get("/", getAllBrand);
router.get("/:id", getSingleBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;
