const mongoose = require("mongoose");
const {
    readConnection,
    writeConnection
} = require("../config/database");

const bookSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    priceAfterTax: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Cùng collection "books"
// nhưng sử dụng hai connection khác nhau.

const ReadBook = readConnection.model(
    "Book",
    bookSchema,
    "books"
);

const WriteBook = writeConnection.model(
    "Book",
    bookSchema,
    "books"
);

module.exports = {
    ReadBook,
    WriteBook
};
