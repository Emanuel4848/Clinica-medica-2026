import { Request, Response } from "express";
import { pool } from "../config/db";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username y password son obligatorios",
      });
    }

    const result = await pool.query(
      `SELECT u.id_usuario, u.username, u.password, u.estado, r.nombre_rol
       FROM usuario u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    if (user.estado !== "activo") {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    return res.json({
      message: "Login exitoso",
      user: {
        id: user.id_usuario,
        username: user.username,
        rol: user.nombre_rol,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el login" });
  }
};