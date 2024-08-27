const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: false,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-group-of-people-standing-around-a-gazebo-in-the-desert-63FGF7bLQjY",
        set: (v) =>
            v === ""
                ? "https://unsplash.com/photos/a-group-of-people-standing-around-a-gazebo-in-the-desert-63FGF7bLQjY"
                : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;