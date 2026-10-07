const express = require("express");
const router = express.Router();

const {
    ReadBook,
    WriteBook
} = require("../models/Book");

const STUDENT_ID = "23IT054";
const PRODUCT_PREFIX = "054";

// Chữ số cuối MSSV = 4
// VAT = (4 + 4)% = 8%
const VAT_RATE = 8;


// =============================
// GET - DANH SÁCH SÁCH
// Sử dụng tài khoản READ
// =============================
router.get("/", async (req, res) => {
    try {
        const books = await ReadBook.find().lean();

        res.render("books/index", {
            books,
            vat: VAT_RATE
        });

    } catch (error) {
        console.error("READ ERROR:", error.message);

        res.status(500).send(
            "Không thể đọc danh sách sách."
        );
    }
});


// =============================
// GET - FORM THÊM SÁCH
// =============================
router.get("/add", (req, res) => {

    res.render("books/add", {
        vat: VAT_RATE
    });

});


// =============================
// POST - THÊM SÁCH
// Sử dụng tài khoản WRITE
// =============================
router.post("/add", async (req, res) => {

    try {

        const {
            productCode,
            title,
            author,
            price
        } = req.body;


        // Kiểm tra mã sản phẩm
        if (
            !productCode ||
            !productCode.startsWith(PRODUCT_PREFIX)
        ) {

            return res.status(400).render(
                "books/add",
                {
                    error:
                        `Mã sản phẩm bắt buộc phải bắt đầu bằng ${PRODUCT_PREFIX}`,
                    vat: VAT_RATE
                }
            );
        }


        // Kiểm tra giá
        const originalPrice = Number(price);

        if (
            !Number.isFinite(originalPrice) ||
            originalPrice < 0
        ) {

            return res.status(400).render(
                "books/add",
                {
                    error: "Giá sách không hợp lệ.",
                    vat: VAT_RATE
                }
            );
        }


        // Tính giá sau VAT
        const priceAfterTax =
            originalPrice * (1 + VAT_RATE / 100);


        // WRITE connection
        await WriteBook.create({

            productCode,

            title,

            author,

            price: originalPrice,

            priceAfterTax:
                Math.round(priceAfterTax)

        });


        res.redirect("/books");

    } catch (error) {

        console.error(
            "WRITE ERROR:",
            error.message
        );

        res.status(500).send(
            "Không thể thêm sách."
        );
    }

});


module.exports = router;
