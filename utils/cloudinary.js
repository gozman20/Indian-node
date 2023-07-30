const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dvbjipjas",
  api_key: "615357198268121",
  api_secret: "ATDaDjKlHV1ClAPtPS6vxNJVoIs",
});

const cloudinaryUploadImage = async (fileToUpload) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUpload, (result) => {
      console.log(result);
      resolve(
        {
          url: result.secure_url,
          assets_id: result.asset_id,
          public_id: result.public_id,
        },
        { resource_type: "auto" }
      );
    });
  });
};

const cloudinaryDeleteImage = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      console.log(result);

      resolve(
        {
          url: result.secure_url,
          assets_id: result.asset_id,
          public_id: result.public_id,
        },
        { resource_type: "auto" }
      );
    });
  });
};

module.exports = { cloudinaryUploadImage, cloudinaryDeleteImage };
