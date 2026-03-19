const User = require("../models/user.js")

module.exports.signupform=(req, res) => {
    res.render("listing/signup.ejs");
}

module.exports.loginform=(req, res) => {
    res.render("listing/login.ejs");
}

module.exports.cretesingin=async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome! Account created successfully.");
      res.redirect("/listing");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

 module.exports.loginverification=async (req, res) => {
    req.flash("success", "You logged in successfully!");
    res.redirect("/listing");
  }

  module.exports.userlogout=async(req,res,next)=>{
     if (!req.isAuthenticated()) {
    req.flash("error", "You are already logged out!");
    return res.redirect("/new/login");
  }
    req.logOut((err)=>{
        if(err)
        {
            return next(err); 
        }
        req.flash("success", "You loggout successfully!");
    res.redirect("/listing");
    });
     
}