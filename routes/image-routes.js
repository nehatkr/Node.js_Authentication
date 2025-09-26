const express = require("express");
const adminMiddleWare = require("../middleware/admin-middleware");
const authMiddleWare = require("../middleware/auth-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImageController,fetchImagesController,deleteImageController } = require("../controllers/image-controller");


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

// 68d4fd7a60c97ad8fb41e963
// delete image route
router.delete('/:id', authMiddleWare, adminMiddleWare, deleteImageController)
module.exports = router;