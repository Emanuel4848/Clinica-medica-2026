import { Request, Response } from "express";
import { pool } from "../config/db";

export const registrarDoctor = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const {
      username,
      password,
      nombre,
      apellido,
      especialidad,
      telefono,
    } = req.body;

    if (
      !username ||
      !password ||
      !nombre ||
      !apellido ||
      !especialidad ||
      !telefono
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    await client.query("BEGIN");

    const rolDoctor = await client.query(
      "SELECT id_rol FROM rol WHERE nombre_rol = $1",
      ["Doctor"]
    );

    if (rolDoctor.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Rol Doctor no encontrado",
      });
    }

    const idRolDoctor = rolDoctor.rows[0].id_rol;

    const usuarioExiste = await client.query(
      "SELECT * FROM usuario WHERE username = $1",
      [username]
    );

    if (usuarioExiste.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Ya existe un usuario con ese username",
      });
    }

    const usuarioInsertado = await client.query(
      `INSERT INTO usuario (username, password, estado, id_rol)
       VALUES ($1, $2, 'activo', $3)
       RETURNING id_usuario`,
      [username, password, idRolDoctor]
    );

    const idUsuario = usuarioInsertado.rows[0].id_usuario;

    const doctorInsertado = await client.query(
      `INSERT INTO doctor (nombre, apellido, especialidad, telefono, estado, id_usuario)
       VALUES ($1, $2, $3, $4, 'activo', $5)
       RETURNING *`,
      [nombre, apellido, especialidad, telefono, idUsuario]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Doctor y usuario registrados correctamente",
      doctor: doctorInsertado.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({
      message: "Error al registrar doctor",
    });
  } finally {
    client.release();
  }
};

export const obtenerDoctores = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.username
       FROM doctor d
       LEFT JOIN usuario u ON d.id_usuario = u.id_usuario
       ORDER BY d.id_doctor ASC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener doctores",
    });
  }
};

export const activarDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existeDoctor = await pool.query(
      "SELECT * FROM doctor WHERE id_doctor = $1",
      [id]
    );

    if (existeDoctor.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor no encontrado",
      });
    }

    const result = await pool.query(
      `UPDATE doctor
       SET estado = 'activo'
       WHERE id_doctor = $1
       RETURNING *`,
      [id]
    );

    return res.json({
      message: "Doctor activado correctamente",
      doctor: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al activar doctor",
    });
  }
};

export const desactivarDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existeDoctor = await pool.query(
      "SELECT * FROM doctor WHERE id_doctor = $1",
      [id]
    );

    if (existeDoctor.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor no encontrado",
      });
    }

    const result = await pool.query(
      `UPDATE doctor
       SET estado = 'inactivo'
       WHERE id_doctor = $1
       RETURNING *`,
      [id]
    );

    return res.json({
      message: "Doctor desactivado correctamente",
      doctor: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al desactivar doctor",
    });
  }
};