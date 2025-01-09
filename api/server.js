const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const filePath = path.resolve("./public/products.xlsx");

const readExcelFile = () => {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(worksheet);
};

const writeExcelFile = (data) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Products");
    xlsx.writeFile(workbook, filePath);
};

module.exports = async (req, res) => {
    try {
        if (req.method === "GET") {
            // Fetch all products
            const data = readExcelFile();
            res.status(200).json(data);
        } else if (req.method === "DELETE") {
            // Delete product
            const id = parseInt(req.query.id, 10);
            const data = readExcelFile();
            const newData = data.filter((item) => item.ID !== id);
            writeExcelFile(newData);
            res.status(200).json({ success: true, message: "Product deleted successfully" });
        } else if (req.method === "POST") {
            // Add new product
            const newProduct = req.body;
            const data = readExcelFile();
            data.push(newProduct);
            writeExcelFile(data);
            res.status(200).json({ success: true, message: "Product added successfully" });
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
