const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
    {
        ISBN : String,
        title : String,
        pub_date : String,
        page_num : String,
        language : String,
        authors : [String],
        plublications : String,
        categories : [String]
    }
);

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;