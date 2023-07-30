const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { sendMail } = require("./emailController");
const crypto = require("crypto");
const validateMongoDbId = require("../utils/validateMongodbId");
const uniqid = require("uniqid");

//Function that receives user id and Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

const getAllUser = asyncHandler(async (req, res) => {
  const AllUser = await User.find({});
  if (AllUser) {
    res.status(200).json({ AllUser });
  } else {
    throw new Error("No user found");
  }
});
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const SingleUser = await User.findById(id);
  if (SingleUser) {
    res.status(200).json(SingleUser);
  } else {
    throw new Error("No user found");
  }
});
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Update = await User.findByIdAndUpdate(
    id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
    },
    { new: true }
  );
  if (Update) {
    res.status(200).json("Successfully Updated");
  } else {
    throw new Error("No user found");
  }
});

//Save user address

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      { address: req.body.address },
      { new: true }
    );
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const SingleUser = await User.findByIdAndDelete(id);
  if (SingleUser) {
    res.status(200).json(SingleUser);
  } else {
    throw new Error(`No user with ${id} found`);
  }
});

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    res.status(400);
    throw new Error("User already created");
  } else {
    const newUser = await User.create(req.body);

    res.status(200).json(newUser);
  }
});
const login = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //This will check for user email in the db
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const refreshToken = await generateToken(user._id);
    const updateUser = await User.findByIdAndUpdate(
      user.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      // secure: true,
      // maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    // res.json("Invalid credentials");
    throw new Error("Invalid credentials");
  }
});

//Admin login
const adminLogin = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //This will check for user email in the db
  const findAdmin = await User.findOne({ email });
  console.log(findAdmin);
  if (findAdmin.role !== "admin") throw new Error("Not authorised");
  if (findAdmin && (await bcrypt.compare(password, findAdmin.password))) {
    const refreshToken = await generateToken(findAdmin._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      // maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin.id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      mobile: findAdmin.mobile,
      email: findAdmin.email,
      token: generateToken(findAdmin._id),
    });
  } else {
    // res.json("Invalid credentials");
    throw new Error("Invalid credentials");
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const block = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  if (block) {
    res.status(200).send("User has been blocked");
  } else {
    throw new Error("Not successful");
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const unblock = await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  if (unblock) {
    res.status(200).send("User has been unblocked");
  } else {
    throw new Error("Not successful");
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie.refresh_token) throw new Error("No refresh Token in cookies");
  const refreshToken = cookie.refresh_token;
  console.log(refreshToken);
  //Get the user that has that refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token in db");

  //verify the token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err) => {
    if (err) {
      console.log(err);
      throw new Error("Something wrong with refresh token");
    }

    //Issue new access token
    const accessToken = generateToken(user.id);
    res.json({ accessToken });
  });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie.refresh_token) throw new Error("No refresh Token in cookies");
  const refreshToken = cookie.refresh_token;
  //Get the user that has that refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refresh_token", { httpOnly: true, secure: true });
    return res.status(403); //Forbidden
  }

  await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refresh_token", { httpOnly: true, secure: true });
  // res.status(200).send("Succesfully logged out");
  //dont add this in production
  res.send("logout succesful");
});
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  console.log(user);

  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});
const forgottenPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new Error("No user Found");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi pls follow this  link to reset your password. This link is valid for 10mins from now. <a href='https://localhost:5000/api/user/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Fortget password link",
      html: resetUrl,
    };
    sendMail(data);
    res.json({ token });
  } catch (err) {
    throw new Error(err);
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedtoken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedtoken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, pls try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  console.log("yes");
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (err) {
    throw new Error(err);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;

  const { _id } = req.user;
  try {
    let products = [];
    const user = await User.findById(_id);
    //Check if user already have products in cart
    const alreadyExist = await Cart.findOne({ orderby: user._id });
    if (alreadyExist) {
      alreadyExist.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      console.log(object);
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      console.log(getPrice);
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    // console.log(products, cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user._id,
    }).save();
    res.json(newCart);
  } catch (err) {
    throw new Error(err);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    //find the user
    const user = await User.findOne({ _id });
    //find the cart
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;

  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { products, cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on delivery",
    }).save();
    //Decrease the amount of available products and increase  the number of sold products
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: -item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ msg: "Success" });
  } catch (err) {
    throw new Error(err);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const userOrder = await Order.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(userOrder);
  } catch (err) {
    throw new Error(err);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const findOrder = await Order.findByIdAndUpdate(id, {
      orderStatus: status,
      paymentIntent: { status: status },
    });
    res.json(findOrder);
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  getAllUser,
  register,
  login,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgottenPassword,
  resetPassword,
  adminLogin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
