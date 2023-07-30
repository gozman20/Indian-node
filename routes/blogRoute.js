const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likedBlog,
  disLikedBlog,
  uploadImages,
} = require("../controllers/blogController");
const { uploadPhoto, blogImgResize } = require("../middleware/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, likedBlog);
router.put("/dislikes", authMiddleware, disLikedBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
