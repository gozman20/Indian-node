const { trusted } = require("mongoose");
const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(200).json(newBrand);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const allBrand = await Brand.find({});
    res.status(200).json(allBrand);
  } catch (err) {
    throw new Error(err);
  }
});
const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleBrand = await Brand.findById(id);
    res.status(200).json(singleBrand);
  } catch (err) {
    throw new Error(err);
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBrand);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Brand.findById(id);
    res.status(200).send("Deleted");
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrand,
};
