const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

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

//create route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Index route
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let { id } = req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.post("/listings", async (req, res) => {
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
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

app.listen(8080, (req, res) => {
    console.log("server is running on port 8080");
});