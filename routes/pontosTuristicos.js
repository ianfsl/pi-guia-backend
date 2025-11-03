import express from "express";
import { db } from "../database/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = `
    SELECT 
      p."idPont.Turist." as id,
      p."Pont.Turist." as nome,
      p."Horário de Funcionamento" as horario,
      p."Endereço" as endereco,
      p."Breve Descrição" as descricao,
      c."Nome da Cidade" as cidade
    FROM "Pontos Turisticos" p
    JOIN "Cidade" c ON p."Cidade" = c.idCidade
    WHERE p."Pont.Turist." IS NOT NULL 
    ORDER BY p."Pont.Turist."
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar pontos turísticos:", err);
      res.status(500).json({
        error: "Erro interno do servidor",
        details: err.message,
      });
    } else {
      console.log(`✅ Retornados ${rows.length} pontos turísticos do banco`);

      const pontosFormatados = rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        cidade: row.cidade,
        tipo: "Ponto Turístico",
        descricao: row.descricao || "Descrição não disponível",
        horario: row.horario,
        endereco: row.endereco,
      }));

      res.json(pontosFormatados);
    }
  });
});

router.get("/cidade/:cidadeNome", (req, res) => {
  const { cidadeNome } = req.params;

  const query = `
    SELECT 
      p."idPont.Turist." as id,
      p."Pont.Turist." as nome,
      p."Horário de Funcionamento" as horario,
      p."Endereço" as endereco,
      p."Breve Descrição" as descricao,
      c."Nome da Cidade" as cidade
    FROM "Pontos Turisticos" p
    JOIN "Cidade" c ON p."Cidade" = c.idCidade
    WHERE c."Nome da Cidade" = ? 
    ORDER BY p."Pont.Turist."
  `;

  db.all(query, [cidadeNome], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar pontos por cidade:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      const pontosFormatados = rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        cidade: row.cidade,
        tipo: "Ponto Turístico",
        descricao: row.descricao || "Descrição não disponível",
        horario: row.horario,
        endereco: row.endereco,
      }));

      res.json(pontosFormatados);
    }
  });
});

export default router;
