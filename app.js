const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingScema}=require("./Scema.js");
const Review = require("./models/review.js");

const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MongoUrl);
}
main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const validateListing = (req,res,next)=>{
    let error=listingScema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Index route
app.get("/listings", wrapAsync (async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

//show route
app.get("/listings/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update route
app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid listing");
    }
    const hello=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//create route
app.post("/listings",wrapAsync( async (req,res,next) => {
    const result=listingScema.validate(req.body);
    console.log(result);
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Reviews Route
app.post("/listings/:id/reviews",async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review Saved");
    res.send("Review added");
});


// app.use("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"This is a beautiful villa with a pool",
//         price:5000,
//         location:"Paris",
//     });
//     await sampleListing.save().then(()=>{
//         console.log("sample was saved..");
//         res.send("Successfull testing..");
//     });
// });

// app.use((err,res,req,next)=>{
//     res.send("Something was wrong..!");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(500,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.render("Error.ejs",{err});
});

app.listen(8080, (req, res) => {
    console.log("server is running on port 8080");
});