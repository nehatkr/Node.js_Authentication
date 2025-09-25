const express = require("express");
const adminMiddleWare = require("../middleware/admin-middleware");
const authMiddleWare = require("../middleware/auth-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImageController,fetchImagesController } = require("../controllers/image-controller");


const router = express.Router();

// upload the image
router.post(
  "/upload",
  authMiddleWare, //check user is authenticated or not
  adminMiddleWare, //check admin
  uploadMiddleware.single("image"), //upload single image
  uploadImageController //storing the image in our database
);


// to get all the images
router.get("/get", authMiddleWare, fetchImagesController)
module.exports = router;