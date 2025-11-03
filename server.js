import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";

import "./database/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ Back-end do Guia Turístico está funcionando!",
    database: "Conectado com sucesso",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor back-end rodando: http://localhost:${PORT}`);
});
