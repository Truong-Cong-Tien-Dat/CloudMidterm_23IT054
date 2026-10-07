require("dotenv").config();

require("dotenv").config();

const express = require("express");
const { engine } = require("express-handlebars");

require("./config/database");

const bookRoutes = require("./routes/bookRoutes");

const app = express();


// =============================
// HANDLEBARS
// =============================

app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");

app.set(
    "views",
    "./views"
);


// =============================
// MIDDLEWARE
// =============================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(express.static("public"));


// =============================
// ROUTES
// =============================

app.get("/", (req, res) => {
    res.redirect("/books");
});

app.use(
    "/books",
    bookRoutes
);


// =============================
// SERVER
// =============================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
