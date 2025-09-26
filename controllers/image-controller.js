const Image = require('../models/image')
const { uploadToCloudinary}= require("../helpers/cloudinaryHelper")
const { image } = require('../config/cloudinary')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')


const uploadImageController = async(req, res)=>{
    try{
        // check if file is missing in request object
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : 'File is required ! Please upload an image'
            })
        }
        //  upload to cloudinary 
        const {url, publicId} = await uploadToCloudinary(req.file.path) 

        // store the image url and public id along with the uploaded user id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })
        await newlyUploadedImage.save();

        // delete the file grom local storage
        // fs.unlinkSync(req.file.path)

        res.status(201).json({
            success:true,
            massage : 'Image uploaded successfully',
            image : newlyUploadedImage
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again'
        })
}
}

// get all the uploaded image 
const fetchImagesController = async(req, res)=>{
    try{
        const images = await Image.find({});
        if(images){
            res.status(200).json({
                success: true,
                data: images
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong ! Please try again',
        })
    }
}

// delete image 
const deleteImageController = async(req,res)=>{
    try{
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;
        
        const image = await Image .findById(getCurrentIdOfImageToBeDeleted);

        if(!image){
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            })
        }

        // check if this image is uploaded by the current user who is trying to delete this image
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : `You are not authorized to delete this image`
            })
        }

        // delete this image first from cloudinary image
        await cloudinary.uploader.destroy(image.publicId)

        // now delete the image from the mongodb database
        await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            massage: 'Image deleted successfully',
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong ! Please try again',
        })
    }
}
module.exports={
    uploadImageController,
    fetchImagesController,
    deleteImageController,
}