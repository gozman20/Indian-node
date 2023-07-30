const { trusted } = require("mongoose");
const Category = require("../models/ProdcategoryModel");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Category.create(req.body);
    res.status(200).json(newBlog);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Category.find({});
    res.status(200).json(allCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleCategory = await Category.findById(id);
    res.status(200).json(singleCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findById(id);
    res.status(200).send("Deleted");
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategory,
};
