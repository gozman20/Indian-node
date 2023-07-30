const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + "jpeg");
  },
});

//filters files to be uploaded
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ msg: "Unsupported file format" }, false);
  }
};
//Another way of flitering files to be uploaded
// const multerFilter2 = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: "20000000" }, //limit of 2MB
});
//Resizing image with sharp
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      //   fs.unlinkSync(`public/images/products/${file.filename}`);

      //The last line of code will make the image to store only on cloudinary and not in the(locals) vscode public/images/product folder
    })
  );
  next();
};

//Resizing image with sharp
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .toFile(`public/images/blogs/${file.filename}`);
      //   fs.unlinkSync(`public/images/blogs/${file.filename}`);

      //The last line of code  will make the image to store only on cloudinary and not in the(locals) vscode public/images/product folder
    })
  );
  next();
};
module.exports = { uploadPhoto, productImgResize, blogImgResize };
