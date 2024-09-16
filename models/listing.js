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
        default: "https://plus.unsplash.com/premium_photo-1681422570054-9ae5b8b03e46?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>
            v === ""
                ? "https://plus.unsplash.com/premium_photo-1681422570054-9ae5b8b03e46?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,
    },
    price: Number,
    location: [String],
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;