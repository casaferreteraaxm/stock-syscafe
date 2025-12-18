const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

/**
 * Logs iniciales (útiles para Railway)
 */
console.log("Iniciando app...");
console.log("PORT desde entorno:", process.env.PORT);

/**
 * Aumentamos límite para payload grande
 */
app.use(express.json({ limit: "100mb" }));

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.status(200).send("Stock Receiver OK");
});

/**
 * RECEPCIÓN DE STOCK DESDE SYSSCAFE
 */
app.put("/SendStock", (req, res) => {
  const data = req.body;
  const items = Array.isArray(data) ? data.length : 1;

  console.log("📦 Stock recibido desde /SendStock:", items);

  /**
   * RESPUESTA INMEDIATA
   * Syscafe no debe esperar procesamiento
   */
  res.status(200).json({
    ok: true,
    received: items,
  });

  /**
   * GUARDADO ASÍNCRONO (SOLO PRUEBAS)
   */
  try {
    const dir = path.join(__dirname, "data");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const fileName = `stock-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`;

    const filePath = path.join(dir, fileName);

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error guardando stock:", err.message);
      } else {
        console.log("Stock guardado en:", fileName);
      }
    });
  } catch (err) {
    console.error("Error general guardado:", err.message);
  }
});

/**
 * DEBUG – listar archivos guardados
 * SOLO PRUEBAS
 */
app.get("/debug/files", (req, res) => {
  const dir = path.join(__dirname, "data");
  if (!fs.existsSync(dir)) {
    return res.json([]);
  }
  const files = fs.readdirSync(dir);
  res.json(files);
});

/**
 * DEBUG – descargar archivo
 * SOLO PRUEBAS
 */
app.get("/debug/file/:name", (req, res) => {
  const filePath = path.join(__dirname, "data", req.params.name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Archivo no existe");
  }
  res.sendFile(filePath);
});

/**
 * ARRANQUE DEL SERVIDOR (Railway)
 */
const PORT = process.env.PORT || 3000;

console.log("Intentando escuchar en puerto:", PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
