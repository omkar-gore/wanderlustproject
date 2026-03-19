const listing = require("./models/listing.js");
const { reviewschema } = require("./schema.js");
const review = require ("./models/review.js");
const { listingschema } = require("./schema.js");


module.exports.isLogedIn=((req,res,next)=>{
     if(!req.isAuthenticated())
  {
    req.flash("error","please login first");
    return res.redirect("/new/login");
  }
  next();
})

module.exports.validlistiing=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error)
     {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }  
}
module.exports.validreviews=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error)
     {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }  
}

module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params;

    const list = await listing.findById(id);

    if(!list.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const review1 = await review.findById(reviewid);

    // check if review exists
    if (!review1) {
        req.flash("error", "Review not found");
        return res.redirect(`/listing/${id}`);
    }

    // check author
    if (!review1.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }

    next();
};