const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(200).json(newEnquiry);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const allEnquiry = await Enquiry.find({});
    res.status(200).json(allEnquiry);
  } catch (err) {
    throw new Error(err);
  }
});
const getSingleEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleEnquiry = await Enquiry.findById(id);
    res.status(200).json(singleEnquiry);
  } catch (err) {
    throw new Error(err);
  }
});
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedEnquiry);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Enquiry.findById(id);
    res.status(200).send("Deleted");
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getSingleEnquiry,
  getAllEnquiry,
};
