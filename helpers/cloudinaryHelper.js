const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
  } catch (error) {
    console.log("Error while uploading to cloudinary", error);
    throw new Error('Error while uploading to cloudinary')
  }
};


module.exports = {
    uploadToCloudinary
}