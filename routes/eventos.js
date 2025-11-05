import express from "express";
import { db } from "../database/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = `
    SELECT 
      e."idEventos" as id,
      e."Eventos" as titulo,
      e."Data dos eventos" as data,
      e."Endereço" as endereco,
      e."Breve Descrição" as descricao,
      c."Nome da Cidade" as cidade
    FROM "Eventos" e
    JOIN "Cidade" c ON e."Cidade" = c.idCidade
    WHERE e."Eventos" IS NOT NULL 
    ORDER BY e."Data dos eventos"
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar eventos:", err);
      res.status(500).json({
        error: "Erro interno do servidor",
        details: err.message,
      });
    } else {
      console.log(`✅ Retornados ${rows.length} eventos do banco`);
      res.json(rows);
    }
  });
});

router.get("/cidade/:cidadeNome", (req, res) => {
  const { cidadeNome } = req.params;

  const query = `
    SELECT 
      e."idEventos" as id,
      e."Eventos" as titulo,
      e."Data dos eventos" as data,
      e."Endereço" as endereco,
      e."Breve Descrição" as descricao,
      c."Nome da Cidade" as cidade
    FROM "Eventos" e
    JOIN "Cidade" c ON e."Cidade" = c.idCidade
    WHERE c."Nome da Cidade" = ? 
    ORDER BY e."Data dos eventos"
  `;

  db.all(query, [cidadeNome], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar eventos por cidade:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(rows);
    }
  });
});

export default router;
