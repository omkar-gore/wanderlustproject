
const express = require("express");


const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const router=express.Router({ mergeParams:true });
const {isLogedIn, validreviews,isOwner,isReviewAuthor}=require("../middleware.js");
const mongoose = require("mongoose");
const reviewcontroller=require("../controller/reviews.js");
//funtion for validation



//review route
// router.post("",isLogedIn, validreviews, wrapasync(async (req,res)=>{

//   if (!req.body.review) {
//     throw new ExpressError(400, "Please enter all info");
//   }
//   newReview.author = req.user._id;
//   const newreview = new review(req.body.review);

//   let res1=await newreview.save();
//   const { id } = req.params;
//   let l1=await listing.findById(id)
//   l1.reviews.push(newreview);
//   let res2=await l1.save();
//   if(newreview)
//   {
//      req.flash("success","new review is created");
//   }
//   res.redirect(`/listing/${id}`);
// }));
router.post(
  "",
  isLogedIn, validreviews,
  wrapasync(reviewcontroller.createreview)
);

//review delete route

router.delete("/:reviewid",isLogedIn,
  isReviewAuthor, wrapasync(reviewcontroller.deletereview));
module.exports = router;