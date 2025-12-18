const express = require("express");

const app = express();

// Aumentar límite del body
app.use(express.json({ limit: "50mb" }));

app.put("/erp/stock", (req, res) => {
  const items = Array.isArray(req.body) ? req.body.length : 1;
  console.log("📦 Stock recibido:", items);

  res.status(200).json({
    ok: true,
    received: items,
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Stock Receiver OK");
});

// 🔴 CAMBIO CLAVE AQUÍ
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
