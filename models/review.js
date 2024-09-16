const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchma=new Schema({
    Comment:String,
    Rating:{
        type:Number,
        min:1,
        max:5,
    },
    cratedAt:{
        type:Date,
        default:Date.now(),
    },
});

const Review = mongoose.model("Review", reviewSchma);
module.exports = Review;

