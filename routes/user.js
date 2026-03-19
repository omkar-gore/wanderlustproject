const express = require("express");
const router = express.Router();

const passport=require("passport");
const usercontroller=require("../controller/users.js");


router.route("/signup").get(usercontroller.signupform).post(usercontroller.cretesingin);

// router.post("/signup", (req, res) => {
//     let {username,email,pass}=req.body;
//     const newuser=new User({email,username,pass});
    
//      req.flash("success","you singup successfully");
//     res.redirect("/listing");
// });


router.route("/login").get(usercontroller.loginform).post(
  passport.authenticate("local", {
    failureRedirect: "/new/login",
    failureFlash: true,
  }),
 usercontroller.loginverification
);

router.get("/logout", usercontroller.userlogout);
module.exports = router;