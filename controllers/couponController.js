const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.find({});
    res.json(coupon);
  } catch (err) {
    throw new Error(err);
  }
});
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.json(coupon);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Coupon.findByIdAndDelete(id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
