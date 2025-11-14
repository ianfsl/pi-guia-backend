import express from "express";
import { db } from "../database/db.js";
import { autenticarToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/ponto/:pontoId", (req, res) => {
  const { pontoId } = req.params;

  const query = `
    SELECT 
      c.*,
      u."Nome do usuario" as usuario_nome
    FROM Comentarios c
    JOIN Usuario u ON c.usuario_id = u.idUsuario
    WHERE c.ponto_turistico_id = ?
    ORDER BY c.data_criacao DESC
  `;

  db.all(query, [pontoId], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar comentários:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    } else {
      res.json(rows);
    }
  });
});

router.post("/", autenticarToken, (req, res) => {
  const { texto, ponto_turistico_id } = req.body;
  const usuario_id = req.usuario.userId;

  if (!texto || !ponto_turistico_id) {
    return res
      .status(400)
      .json({ error: "Texto e ponto turístico são obrigatórios" });
  }

  const data_criacao = new Date().toISOString();

  const query = `
    INSERT INTO Comentarios (texto, usuario_id, ponto_turistico_id, data_criacao)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    query,
    [texto, usuario_id, ponto_turistico_id, data_criacao],
    function (err) {
      if (err) {
        console.error("Erro ao adicionar comentário:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
      } else {
        res.status(201).json({
          message: "Comentário adicionado com sucesso",
          comentarioId: this.lastID,
        });
      }
    }
  );
});

export default router;
