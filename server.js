const express = require("express");
const app = express();
require("colors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { pageNotFound, errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
connectDB();
const morgan = require("morgan");
app.use(morgan("dev"));
//Routes
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const ProdcategoryRoute = require("./routes/ProdcategoryRoute");
const blogcategoryRoute = require("./routes/blogCatRoute");
const brandRoute = require("./routes/brandRoute");
const colorRoute = require("./routes/colorRoute");
const enqRoute = require("./routes/enqRoute");
const couponRoute = require("./routes/couponRoute");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

PORT = 5000;

app.get("/", (req, res) => {
  res.send({ msg: "Hello world" });
});

app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", ProdcategoryRoute);
app.use("/api/blogcategory", blogcategoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/color", colorRoute);
app.use("/api/enquiry", enqRoute);
app.use("/api/coupon", couponRoute);

//Below error handling code must come in this order
app.use(errorHandler);
app.use(pageNotFound);
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
