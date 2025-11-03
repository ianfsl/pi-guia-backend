import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../database/db.js";
import { autenticarToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/registro", async (req, res) => {
  try {
    console.log("📨 Dados recebidos:", req.body);

    const {
      "Nome do usuario": nomeDoUsuario,
      Email: email,
      "Senha de acesso": senha,
    } = req.body;

    console.log("📨 Campos extraídos:", { nomeDoUsuario, email, senha });

    if (!nomeDoUsuario || !email || !senha) {
      console.log("❌ Campos faltando:", {
        nomeDoUsuario: !!nomeDoUsuario,
        email: !!email,
        senha: !!senha,
      });

      return res.status(400).json({
        error: "Nome do usuario, Email e Senha de acesso são obrigatórios",
      });
    }

    const emailExiste = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM Usuario WHERE Email = ?", [email], (err, row) => {
        if (err) reject(err);
        resolve(!!row);
      });
    });

    if (emailExiste) {
      return res.status(409).json({
        error: "Email já cadastrado",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    console.log("🔐 Hash da senha criado");

    const query = `
      INSERT INTO Usuario 
      ("Nome do usuario", "Email", "Senha de acesso") 
      VALUES (?, ?, ?)
    `;

    const result = await new Promise((resolve, reject) => {
      db.run(query, [nomeDoUsuario, email, senhaHash], function (err) {
        if (err) {
          console.error("❌ Erro na inserção:", err.message);
          reject(err);
        } else {
          console.log("✅ Usuário inserido com ID:", this.lastID);
          resolve({ id: this.lastID });
        }
      });
    });

    const token = jwt.sign(
      { userId: result.id, email },
      process.env.JWT_SECRET || "seuSegredoSuperSecreto",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      usuario: {
        id: result.id,
        "Nome do usuario": nomeDoUsuario,
        Email: email,
      },
    });
  } catch (error) {
    console.error("❌ Erro completo no registro:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("📨 Dados login recebidos:", req.body);

    const { Email: email, "Senha de acesso": senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e Senha de acesso são obrigatórios",
      });
    }

    const usuario = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM Usuario WHERE Email = ?", [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario["Senha de acesso"]);
    if (!senhaValida) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
      });
    }

    const token = jwt.sign(
      { userId: usuario.idUsuario, email: usuario.Email },
      process.env.JWT_SECRET || "seuSegredoSuperSecreto",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login bem-sucedido",
      token,
      usuario: {
        id: usuario.idUsuario,
        "Nome do usuario": usuario["Nome do usuario"],
        Email: usuario.Email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});

router.get("/perfil", autenticarToken, (req, res) => {
  res.json({
    message: "Perfil acessado com sucesso!",
    usuario: req.usuario,
  });
});

export default router;
