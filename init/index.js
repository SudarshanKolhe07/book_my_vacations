const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");

const MongoUrl="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MongoUrl);
}
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

const initDB =async()=>{
    await Listing.deleteMany({}),
    await Listing.insertMany(initData.data);
    console.log("data was initialized.. ");
};

initDB();