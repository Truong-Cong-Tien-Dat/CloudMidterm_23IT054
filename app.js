require("dotenv").config();

const express = require("express");
const { engine } = require("express-handlebars");

const session = require("express-session");
const { MongoStore} = require("connect-mongo");

require("./config/database");

const bookRoutes = require("./routes/bookRoutes");

const app = express();


// =====================================
// HANDLEBARS
// =====================================

app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");
app.set("views", "./views");


// =====================================
// MIDDLEWARE
// =====================================

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static("public"));


// =====================================
// STATELESS SESSION
// Session KHÔNG lưu trong RAM server
// mà lưu trực tiếp trên MongoDB Atlas
// =====================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_SESSION_URI,

            dbName: "DB_23IT054",

            collectionName: "sessions",

            ttl: 60 * 60
        }),

        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,

            // Localhost hiện tại dùng HTTP
            // Khi deploy Render sẽ cấu hình thêm secure
            secure: false
        }
    })
);


// =====================================
// TEST SESSION
// =====================================

app.get("/session-test", (req, res) => {

    if (!req.session.views) {
        req.session.views = 0;
    }

    req.session.views++;

    res.send(`
        <h1>Stateless Session Test</h1>

        <p>Session được lưu trên MongoDB Atlas.</p>

        <p>
            Số lần truy cập:
            <strong>${req.session.views}</strong>
        </p>

        <p>Student: Trương Công Tiến Đạt</p>
        <p>MSSV: 23IT054</p>

        <a href="/session-test">
            Refresh Session
        </a>

        <br><br>

        <a href="/books">
            Quay lại quản lý sách
        </a>
    `);

});


// =====================================
// ROUTES
// =====================================

app.get("/", (req, res) => {
    res.redirect("/books");
});

app.use("/books", bookRoutes);


// =====================================
// SERVER
// =====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
