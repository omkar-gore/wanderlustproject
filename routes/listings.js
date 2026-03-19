const express = require("express");
const listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const {isLogedIn, validlistiing,isOwner}=require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudinary.js");

const upload = multer({ storage });


const ExpressError = require("../utils/ExpressError.js");
const router=express.Router();
const listingController=require("../controller/listings.js");
// const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' });
//funtion for validation



// 🆕 New Listing Form
router.get("/new",isLogedIn,listingController.newlistingform);

// 📄 All Listings
// ➕ Create Listing
// router.route("").get(wrapasync(listingController.alllistings)).post(upload.single('listing[image][url]'), (req, res)=>{
//     res.send(req.file);
// })
router.route("").get(wrapasync(listingController.alllistings)).post( upload.single('listing[image][url]'),validlistiing, wrapasync(listingController.createlisting));;

// 🔍 Show Listing
// 📝 Update Listing
// ❌ Delete Listing
router.route("/:id").get( wrapasync(listingController.showlisting)).put(isLogedIn,upload.single('listing[image][url]'),isOwner,validlistiing, wrapasync(listingController.updatelisting)).delete(wrapasync(listingController.deletelisting));

// ✏️ Edit Form
router.get("/:id/edit", isLogedIn,isOwner,wrapasync(listingController.editlistingform));




// 📝 Update Listing


// ❌ Delete Listing


module.exports=router;