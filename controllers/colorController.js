const { trusted } = require("mongoose");
const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.status(200).json(newColor);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const allColor = await Color.find({});
    res.status(200).json(allColor);
  } catch (err) {
    throw new Error(err);
  }
});
const getSingleColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleColor = await Color.findById(id);
    res.status(200).json(singleColor);
  } catch (err) {
    throw new Error(err);
  }
});
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedColor);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Color.findById(id);
    res.status(200).send("Deleted");
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getSingleColor,
  getAllColor,
};
