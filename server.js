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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://localhost:5173",
      "http://127.0.0.1:5173",
      "https://seusite.netlify.app",
      process.env.FRONTEND_URL,
    ];

    if (process.env.NODE_ENV !== "production") {
      allowedOrigins.push("http://localhost:5173");
      allowedOrigins.push("http://127.0.0.1:5173");
    }

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Bloqueado por CORS:", origin);
      callback(new Error("Não permitido por CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
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
