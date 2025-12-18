const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "200mb" }));

const DATA_DIR = path.join(__dirname, "data");

/* ===========================
   RECEPCIÓN DE STOCK
=========================== */
app.put("/SendStock", (req, res) => {
  const data = req.body;
  const items = Array.isArray(data) ? data.length : 1;

  console.log(`📦 Stock recibido: ${items}`);

  res.status(200).json({ ok: true, received: items });

  setImmediate(() => {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR);
    }

    const file = `stock-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(DATA_DIR, file),
      JSON.stringify(data)
    );

    console.log(`💾 Guardado ${file}`);
  });
});

/* ===========================
   LISTAR ARCHIVOS
=========================== */
app.get("/files", (req, res) => {
  if (!fs.existsSync(DATA_DIR)) return res.json([]);

  const files = fs.readdirSync(DATA_DIR);
  res.json(files);
});

/* ===========================
   DESCARGAR ARCHIVO
=========================== */
app.get("/files/:name", (req, res) => {
  const filePath = path.join(DATA_DIR, req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Archivo no encontrado");
  }

  res.download(filePath);
});

app.get("/", (req, res) => {
  res.send("Stock Receiver OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
