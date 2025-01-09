const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Serve the HTML and frontend files

// API to get product data from Excel
app.get("/api/products", (req, res) => {
    const workbook = XLSX.readFile("products.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    res.json(data);
});

// API to delete a product from the Excel file
app.post("/api/delete-product", (req, res) => {
    const { id } = req.body;

    const workbook = XLSX.readFile("products.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(sheet);

    // Filter out the product with the given ID
    data = data.filter((product) => product.ID !== id);

    // Write updated data back to the Excel file
    const newSheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = newSheet;
    XLSX.writeFile(workbook, "products.xlsx");

    res.json({ success: true, message: "Product deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
