import express from "express";
import pontosTuristicos from "./pontosTuristicos.js";
import usuarios from "./usuarios.js";
import comentarios from "./comentarios.js";
import cidades from "./cidades.js";

const router = express.Router();

router.use("/pontos-turisticos", pontosTuristicos);
router.use("/usuarios", usuarios);
router.use("/comentarios", comentarios);
router.use("/cidades", cidades);

export default router;
