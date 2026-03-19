const listing = require("../models/listing.js");
const review = require ("../models/review.js");
const { reviewschema } = require("../schema.js");

module.exports.createreview=async (req, res) => {
    const list = await listing.findById(req.params.id);

    const newReview = new review(req.body.review);

    // attach logged-in user
    newReview.author = req.user._id;

    list.reviews.push(newReview);

    await newReview.save();
    await list.save();

    req.flash("success", "Review added");
    res.redirect(`/listing/${list._id}`);
  }

  module.exports.deletereview=async (req, res) => {
  const { id, reviewid } = req.params;

  // Remove review reference from listing
  await listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewid }
  });

  // Delete the review document
  await review.findByIdAndDelete(reviewid);
 
  req.flash("success"," review is deleted");
  console.log("Review deleted:", reviewid);

  res.redirect(`/listing/${id}`);
}