const mongoose = require("mongoose");

// Kết nối chỉ dùng cho thao tác READ
const readConnection = mongoose.createConnection(
    process.env.MONGO_READ_URI
);

// Kết nối chỉ dùng cho thao tác WRITE
const writeConnection = mongoose.createConnection(
    process.env.MONGO_WRITE_URI
);

readConnection.on("connected", () => {
    console.log("READ Database connected");
});

readConnection.on("error", (err) => {
    console.error("READ Database error:", err.message);
});

writeConnection.on("connected", () => {
    console.log("WRITE Database connected");
});

writeConnection.on("error", (err) => {
    console.error("WRITE Database error:", err.message);
});

module.exports = {
    readConnection,
    writeConnection
};
