const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "300mb" }));

const DATA_DIR = path.join(__dirname, "data");

// Crear carpeta una sola vez
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

/* ===========================
   RECEPCIÓN DE STOCK
=========================== */
app.put("/SendStock", (req, res) => {
  const data = req.body;
  const items = Array.isArray(data) ? data.length : 1;

  console.log(`📦 Stock recibido: ${items}`);

  // ✅ RESPONDER INMEDIATAMENTE
  res.status(200).json({
    ok: true,
    received: items,
  });

  // ✅ PROCESO EN BACKGROUND REAL
  process.nextTick(() => {
    try {
      const file = `stock-${Date.now()}.json`;
      const filePath = path.join(DATA_DIR, file);

      const stream = fs.createWriteStream(filePath);
      stream.write(JSON.stringify(data));
      stream.end();

      stream.on("finish", () => {
        console.log(`💾 Guardado correctamente: ${file}`);
      });

      stream.on("error", (err) => {
        console.error("❌ Error al guardar archivo:", err);
      });

    } catch (err) {
      console.error("❌ Error general:", err);
    }
  });
});

/* ===========================
   LISTAR ARCHIVOS
=========================== */
app.get("/files", (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR);
    res.json(files);
  } catch {
    res.json([]);
  }
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
