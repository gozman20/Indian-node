const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { updateBlog } = require("./blogController");
const {
  cloudinaryUploadImage,
  cloudinaryDeleteImage,
} = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  if (req.body) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  res.status(200).json({ newProduct });
});
const updateProduct = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  try {
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(
      id,
      { title: req.body.title },
      {
        new: true,
      }
    );
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    throw new Error("Not found");
  }
});
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    //filtering
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
    // console.log(queryObject, req.query);

    //Sorting
    if (req.query.sort) {
      console.log(req.query.sort);
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exist");
    }
    const products = await query;
    res.status(200).json({ products });
  } catch (err) {
    throw new Error("No product found");
  }
});
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    res.status(200).json({ product });
  } else {
    throw new Error("No product matches the id");
  }
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.send("Deleted");
  } catch (err) {
    throw new Error("Not found");
  }
});
const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { prodId } = req.body;
  try {
    //get the logged-in user
    const user = await User.findById(_id);
    console.log(user);
    //check if the product is already added or not
    const alreadyAdded = user?.wishlist?.find((id) => id.toString() === prodId);

    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (err) {
    throw new Error(err);
  }
});
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );
      // res.json(updateRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: { ratings: { star: star, comment: comment, postedby: _id } },
        },
        { new: true }
      );
      // res.json(rateProduct);
    }
    const getallratings = await Product.findById(prodId);
    // console.log(getallratings);
    let totalRating = getallratings.ratings.length;
    let ratingSum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);

    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      { totalratings: actualRating },
      { new: true }
    );
    res.json(finalProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files);

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
    const img = urls.map((file) => file);
    res.json(img);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  // console.log(req.files);
  const { id } = req.params;
  try {
    const deleted = await cloudinaryDeleteImage(id, "images");

    res.json({ msg: "Deleted" });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  ratings,
  uploadImages,
  deleteImages,
};
