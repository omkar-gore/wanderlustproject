const listing = require("../models/listing.js");
const { listingschema } = require("../schema.js");

//alllistings
module.exports.alllistings=async (req, res) => {
  const listings = await listing.find();
  res.render("listing/index.ejs", { listings });
};

//new listing from
module.exports.newlistingform=(req, res) => {
  res.render("listing/new.ejs");
};

//show listings
module.exports.showlisting=async (req, res) => {
  const { id } = req.params;

 const list = await listing
  .findById(id)
  .populate({path:"reviews",populate:{path:"author"}})
  .populate("owner");
  if(!list)
  {
    req.flash("error","listing is not exits");
    console.log("deill")
     return res.redirect("/listing"); 
  }

  res.render("listing/show.ejs", { list });
}

//edit listing from
module.exports.editlistingform=async (req, res) => {
  const { id } = req.params;
  const list = await listing.findById(id);
   if(!list)
  {
    req.flash("error","listing is not exits");
      return res.redirect("/listing"); 
  }
  res.render("listing/edit.ejs", { list });
}

//saving listing
module.exports.createlisting=async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Please enter all info");
    
  }

  const newlisting = new listing(req.body.listing);
  newlisting.owner=req.user._id;
  newlisting.image = {
  url: req.file.path,
  filename: req.file.filename
  };

  await newlisting.save();
  if(newlisting)
  {
    req.flash("success","new listing is created");
  }
  res.redirect("/listing");
}

//update listings
module.exports.updatelisting = async (req, res) => {
  const { id } = req.params;

  if (!req.body.listing) {
    throw new ExpressError(400, "Please enter all info");
  }

  const result = listingschema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }

  // get updated document
  let updatedListing = await listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  // if new image uploaded
  if (req.file) {
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await updatedListing.save();
  }

  req.flash("success", "Listing updated successfully");

  res.redirect(`/listing/${id}`);
};

//delete listing
module.exports.deletelisting=async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success","new listing is deleted");
  console.log("Listing deleted:", id);
  res.redirect("/listing");
}