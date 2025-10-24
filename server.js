import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Back-end do Guia Turístico está funcionando!" });
});

app.get("/api/pontos-turisticos", (req, res) => {
  const pontos = [
    {
      id: 1,
      nome: "Balneário Municipal",
      cidade: "Águas de São Pedro",
      tipo: "Parque Aquático",
      descricao: "Complexo de piscinas termais com águas naturais.",
    },
    {
      id: 2,
      nome: "Cachoeira do Saltinho",
      cidade: "Brotas",
      tipo: "Natureza",
      descricao: "Linda cachoeira com piscina natural para banho.",
    },
  ];
  res.json(pontos);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor back-end rodando: http://localhost:${PORT}`);
});
