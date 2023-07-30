const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getSingleEnquiry,
  getAllEnquiry,
} = require("../controllers/enqController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
router.get("/", getAllEnquiry);
router.get("/:id", getSingleEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);

module.exports = router;
