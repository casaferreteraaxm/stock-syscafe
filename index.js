const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

/* ===========================
   RECEPCIÓN DE STOCK (STREAM)
=========================== */
app.put("/SendStock", (req, res) => {
  console.log("📥 Conexión entrante de Syscafe");

  const fileName = `stock-${Date.now()}.json`;
  const filePath = path.join(DATA_DIR, fileName);

  const writeStream = fs.createWriteStream(filePath);
  let bytes = 0;

  req.on("data", chunk => {
    bytes += chunk.length;
    writeStream.write(chunk);
  });

  req.on("end", () => {
    writeStream.end();
    console.log(`✅ Stock recibido y guardado: ${fileName}`);
    console.log(`📦 Tamaño recibido: ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  });

  req.on("error", err => {
    console.error("❌ Error recibiendo stream:", err);
  });

  // 🚀 RESPONDER DE INMEDIATO
  res.status(200).json({
    ok: true,
    message: "Stock recibido",
  });
});

/* ===========================
   LISTAR ARCHIVOS
=========================== */
app.get("/files", (req, res) => {
  const files = fs.readdirSync(DATA_DIR);
  res.json(files);
});

/* ===========================
   DESCARGAR ARCHIVO
=========================== */
app.get("/files/:name", (req, res) => {
  const filePath = path.join(DATA_DIR, req.params.name);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  res.download(filePath);
});

app.get("/", (_, res) => {
  res.send("Stock Receiver OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
