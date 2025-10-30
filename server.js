import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "guia.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco de dados SQLite");
  }
});

// Teste de conexão
app.get("/api/test", (req, res) => {
  db.get("SELECT 1 as test", (err, row) => {
    if (err) {
      res.status(500).json({ error: "Erro no banco de dados" });
    } else {
      res.json({
        message: "✅ Back-end do Guia Turístico está funcionando!",
        database: "Conectado com sucesso",
      });
    }
  });
});

app.get("/api/pontos-turisticos", (req, res) => {
  const query = `
    SELECT 
      p."idPont.Turist." as id,
      p."Pont.Turist." as nome,
      p."Horário de Funcionamento" as horario,
      p."Endereço" as endereco,
      p."Breve Descrição" as descricao,
      c."Nome da Cidade" as cidade  -- Pegando o nome da cidade
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

app.get("/api/cidades", (req, res) => {
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
      // Retornar os nomes das cidades
      const cidades = rows.map((row) => row.nome);
      res.json(cidades);
    }
  });
});

app.get("/api/pontos-turisticos/cidade/:cidadeNome", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor back-end rodando: http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Conexão com o banco fechada.");
    process.exit(0);
  });
});
