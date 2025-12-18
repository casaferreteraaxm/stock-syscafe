const express = require("express");

const app = express();

app.use(express.json({ limit: "100mb" }));

app.put("/erp/stock", (req, res) => {
  const items = Array.isArray(req.body) ? req.body.length : 1;
  console.log("📦 Stock recibido:", items);

  res.status(200).json({
    ok: true,
    received: items,
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Stock Receiver OK");
});

// 🔴 CLAVE PARA RAILWAY
const PORT = process.env.PORT;
if (!PORT) {
  console.error("PORT not defined");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
