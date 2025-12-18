const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Aumentar límite de JSON
app.use(express.json({ limit: "200mb" }));

app.put("/SendStock", (req, res) => {
  const data = req.body;
  const items = Array.isArray(data) ? data.length : 1;

  console.log(`📦 Stock recibido: ${items}`);

  // 🔥 RESPONDER DE INMEDIATO A SYSCAFE
  res.status(200).json({
    ok: true,
    received: items,
  });

  // 🔁 PROCESAR EN BACKGROUND (NO BLOQUEA)
  setImmediate(() => {
    try {
      const dir = path.join(__dirname, "data");

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const fileName = `stock-${Date.now()}.json`;
      const filePath = path.join(dir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(data));

      console.log(`💾 Stock guardado en ${fileName}`);
    } catch (err) {
      console.error("❌ Error guardando stock:", err.message);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Stock Receiver OK");
});

// Puerto Railway
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Listening on port ${PORT}`);
});

// ⏱️ Aumentar tolerancia de conexión
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
