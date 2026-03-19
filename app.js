// const express=require("express");
// const Joi = require("joi");
// const mongoose=require ("mongoose");
// const app=express();
// const listing=require("./models/listing.js")
// let path=require("path");
// const ejsmate=require("ejs-mate");
// const wrpaasysc=require("./utils/wrapasync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const methodOverride = require("method-override");
// const wrapasync = require("./utils/wrapasync.js");
// const {listingschema}=require("./schema.js");
// app.engine('ejs',ejsmate);
// app.set("views engine","ejs");
// app.set("views",path.join(__dirname,"/views"));
// app.use(express.static(path.join(__dirname,"/public")));

// app.use(methodOverride("_method"));
// app.use(express.urlencoded({extended:true}));
// // listing.insertOne({title:"maldives",description:"this is nice place to visit",price:1600,location:"maldives betch",country:"india"})
// // .then((res)=>{
// //     console.log(res);
// // }).catch((err)=>{
// //     console.log(err);
// // })
// const port=2005;
// app.get("/",(req,res)=>{
//     res.send("welcome to wanderlust");
// })

// app.get("/listing/:id/edit",wrapasync( async (req,res)=>{
//     let {id}=req.params;
//     let list= await listing.findById(id);

//     res.render("listing/edit.ejs",{list})
// }))
// app.get("/listing/new", wrapasync((req,res)=>{
//     res.render("listing/new.ejs");
// }));
// app.get("/listing/:id",wrapasync(async (req,res)=>{
//     let {id}=req.params;
//     let list= await listing.findById(id);
//     res.render("listing/show.ejs",{list});
// }))
// app.get("/listing", wrapasync(async (req,res)=>{
//     // res.send("working");
//     let  listings = await listing.find();
//     res.render("listing/index.ejs",{ listings })
// }))

// app.post("/listing",wrapasync(async (req,res)=>{
//     // let { title ,description,img,price,location,country}=req.body;
//     if(!req.body.listing)
//     {
//         throw new ExpressError(400,"plese Enter the all info");
//     }

//     let result=listingschema.validate(req.body);
//     if(result.error)
//     {
//         throw new ExpressError(400,result.error);
//     }
//     let newlisting=new listing(req.body.listing);

//     await newlisting.save();
//    // await listing.insertOne({title:title,description:description,img:img,price:price,location:location,country:country})
//     // .then((res)=>{
//     //     console.log(res);
//     // }).catch((err)=>{
//     //     console.log(err);
//     // });
//     res.redirect("/listing");
// }))

// app.put("/listing/:id",wrapasync(async (req,res)=>{

//      let { id }= req.params;
//     await listing.findByIdAndUpdate(id,{...req.body.listing});
//     if(!req.body.listing)
//     {
//         throw new ExpressError(400,"plese Enter the all info");
//     }
//     res.redirect("/listing");
// }))

// app.delete("/listing/:id",wrapasync(async (req,res)=>{
//     let {id}=req.params;
//     await listing.findByIdAndDelete(id)
//     .then((res)=>{
//         console.log(res);
//     }).catch((err)=>{
//         console.log(err);
//     });
//     res.redirect("/listing");
// }))

// app.all(/.*/, (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

// app.use((err, req, res, next) => {
//   let { status = 500, message = "Something went wrong!" } = err;
//   res.status(status).render("listing/error.ejs",{err});
// });
// app.listen(port,()=>{
//     console.log("server listening");
// });


require("dotenv").config();
const express = require("express");

const app = express();
const path = require("path");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const listingroute=require("./routes/listings.js");
const reviewsroute=require("./routes/reviews.js");
const userroute=require("./routes/user.js");
const cookieparser=require("cookie-parser");
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");
const dburl=process.env.ALTAS_KEY;
const secret=process.env.SECRET;



app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
const port = 2005;

app.use(cookieparser("secreate"));


const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: secret,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Mongo session store error:", err);
});

app.use(session({
  store: store,
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}));


app.use(flash());

app.use(require("express-session")({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});

app.use("/new", userroute);
app.use("/listing",listingroute);
app.use("/listing/:id/review",reviewsroute);

app.get("", (req, res) => {
  res.send("Welcome to Wanderlust");
});

// app.get("/register", async (req,res)=>{
//   let fackuser=new User({
//     email:"student123@gmail.com",
//     username:"deltastud",
//   })
//   let res1=await User.register(fackuser,"hello");
//   res.send(res1);
// })
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(status).render("listing/error.ejs", { err });
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});

// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const ejsmate = require("ejs-mate");
// const methodOverride = require("method-override");
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");

// const ExpressError = require("./utils/ExpressError.js");
// const listingroute = require("./routes/listings.js");
// const reviewsroute = require("./routes/reviews.js");
// const userroute = require("./routes/user.js");
// const User = require("./models/user.js");

// const app = express();

// // ------------------ DATABASE ------------------
// mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
// .then(() => {
//   console.log("Database Connected");
// })
// .catch((err) => {
//   console.log(err);
// });

// // ------------------ ENGINE SETUP ------------------
// app.engine("ejs", ejsmate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // ------------------ MIDDLEWARE ------------------
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));

// app.use(session({
//   secret: "topsecret",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true
//   }
// }));

// app.use(flash());

// // ------------------ PASSPORT ------------------
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Flash locals
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

// // ------------------ ROUTES ------------------
// app.use("/", userroute);                 // /signup
// app.use("/listing", listingroute);
// app.use("/listing/:id/review", reviewsroute);

// app.get("", (req, res) => {
//   res.send("Welcome to Wanderlust");
// });

// // ------------------ 404 HANDLER ------------------
// app.all("/.*/", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

// // ------------------ ERROR HANDLER ------------------
// app.use((err, req, res, next) => {
//   let { status = 500, message = "Something went wrong!" } = err;
//   res.status(status).send(message);
// });

// // ------------------ SERVER ------------------
// const port = 2005;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });