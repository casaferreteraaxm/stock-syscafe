const express = require("express");

const app = express();

/**
 * IMPORTANTE:
 * Aumentamos el límite del body
 */
app.use(express.json({ limit: "50mb" }));

/**
 * Endpoint exclusivo para Syscafe
 */
app.put("/erp/stock", (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body.length : 1;

    console.log("Stock recibido:", items);

    /**
     * RESPONDER RÁPIDO
     * Syscafe NO debe esperar procesamiento
     */
    res.status(200).json({
      ok: true,
      received: items,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ ok: false });
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Stock Receiver OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stock receiver on port ${PORT}`);
});
