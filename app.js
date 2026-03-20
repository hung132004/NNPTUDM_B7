const express = require("express");
const app = express();

app.use(express.json());

/* ================= DATA ================= */
let products = [];
let inventories = [];

let productId = 1;
let inventoryId = 1;

/* ================= CREATE PRODUCT ================= */
app.post("/product", (req, res) => {
    const { name, price } = req.body;

    const newProduct = {
        id: productId++,
        name,
        price
    };

    products.push(newProduct);

    const newInventory = {
        id: inventoryId++,
        productId: newProduct.id,
        stock: 0,
        reserved: 0,
        soldCount: 0
    };

    inventories.push(newInventory);

    res.json({ product: newProduct, inventory: newInventory });
});

/* ================= GET ALL ================= */
app.get("/inventory", (req, res) => {
    const result = inventories.map(inv => {
        const product = products.find(p => p.id === inv.productId);
        return { ...inv, product };
    });

    res.json(result);
});

/* ================= GET BY ID ================= */
app.get("/inventory/:id", (req, res) => {
    const inv = inventories.find(i => i.id == req.params.id);

    if (!inv) return res.status(404).json({ msg: "Not found" });

    const product = products.find(p => p.id === inv.productId);

    res.json({ ...inv, product });
});

/* ================= ADD STOCK ================= */
app.post("/add-stock", (req, res) => {
    const { productId, quantity } = req.body;

    const inv = inventories.find(i => i.productId == productId);

    if (!inv) return res.status(404).json({ msg: "Not found" });

    inv.stock += quantity;

    res.json(inv);
});

/* ================= REMOVE STOCK ================= */
app.post("/remove-stock", (req, res) => {
    const { productId, quantity } = req.body;

    const inv = inventories.find(i => i.productId == productId);

    if (!inv || inv.stock < quantity)
        return res.status(400).json({ msg: "Not enough stock" });

    inv.stock -= quantity;

    res.json(inv);
});

/* ================= RESERVE ================= */
app.post("/reserve", (req, res) => {
    const { productId, quantity } = req.body;

    const inv = inventories.find(i => i.productId == productId);

    if (!inv || inv.stock < quantity)
        return res.status(400).json({ msg: "Not enough stock" });

    inv.stock -= quantity;
    inv.reserved += quantity;

    res.json(inv);
});

/* ================= SOLD ================= */
app.post("/sold", (req, res) => {
    const { productId, quantity } = req.body;

    const inv = inventories.find(i => i.productId == productId);

    if (!inv || inv.reserved < quantity)
        return res.status(400).json({ msg: "Not enough reserved" });

    inv.reserved -= quantity;
    inv.soldCount += quantity;

    res.json(inv);
});

/* ================= RUN ================= */
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});