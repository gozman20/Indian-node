const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
// const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImage = require("../utils/cloudinary");
const fs = require("fs");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(200).json(newBlog);
  } catch (err) {
    throw new Error(err);
  }
});
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const newBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(newBlog);
  } catch (err) {
    throw new Error(err);
  }
});
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.status(200).json(getBlog);
    // res.status(200).json(updateViews);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find({});
    res.status(200).json(getBlogs);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).send("Deleted");
  } catch (err) {
    throw new Error(err);
  }
});
const likedBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  //   validateMongoDbId(blogId);
  //find the blog u want to like
  const blog = await Blog.findById(blogId);

  //find the login user
  const loginUserId = req?.user?._id;
  console.log(loginUserId);
  //check if the user has liked the post
  const isLiked = blog?.isLiked;
  //check if the user has already disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
const disLikedBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  //   validateMongoDbId(blogId);
  //find the blog u want to like
  const blog = await Blog.findById(blogId);
  console.log(blog);

  //find the login user
  const loginUserId = req?.user?._id;
  console.log(loginUserId);
  //check if the user has liked the post
  const isDisLiked = blog?.isDisliked;
  //check if the user has already disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files);
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      // fs.unlinkSync(path);
      //remove the last line of code if u want the image to also store in local environs
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => file),
      },
      { new: true }
    );
    res.json(findBlog);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likedBlog,
  disLikedBlog,
  uploadImages,
};
