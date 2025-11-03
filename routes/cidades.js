import express from "express";
import { db } from "../database/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = `
    SELECT "idCidade", "Nome da Cidade" as nome
    FROM "Cidade" 
    ORDER BY "Nome da Cidade"
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar cidades:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      const cidades = rows.map((row) => row.nome);
      res.json(cidades);
    }
  });
});

export default router;
