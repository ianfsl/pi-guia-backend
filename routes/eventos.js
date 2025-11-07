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

router.get("/debug/tabelas", (req, res) => {
  const query = `
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao listar tabelas:", err);
      res.status(500).json({ error: err.message });
    } else {
      console.log(
        "📊 Tabelas encontradas:",
        rows.map((r) => r.name)
      );
      res.json(rows);
    }
  });
});

router.get("/debug/eventos-estrutura", (req, res) => {
  const query = `PRAGMA table_info(Eventos)`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro na estrutura de eventos:", err);
      res.status(500).json({ error: err.message });
    } else {
      console.log("🔍 Estrutura da tabela Eventos:", rows);
      res.json(rows);
    }
  });
});

router.get("/debug/eventos-dados", (req, res) => {
  const query = `SELECT * FROM "Eventos" LIMIT 5`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao ver dados de eventos:", err);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`📈 Dados de eventos (${rows.length} registros):`, rows);
      res.json(rows);
    }
  });
});

export default router;
