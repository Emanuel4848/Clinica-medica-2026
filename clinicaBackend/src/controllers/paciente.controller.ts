import { Request, Response } from "express";
import { pool } from "../config/db";

export const registrarPaciente = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, telefono, dpi, fecha_nacimiento } = req.body;

    if (!nombre || !apellido || !telefono || !dpi || !fecha_nacimiento) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const existePaciente = await pool.query(
      "SELECT * FROM paciente WHERE dpi = $1",
      [dpi]
    );

    if (existePaciente.rows.length > 0) {
      return res.status(409).json({
        message: "Ya existe un paciente con ese DPI",
      });
    }

    const result = await pool.query(
      `INSERT INTO paciente (nombre, apellido, telefono, dpi, fecha_nacimiento)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, apellido, telefono, dpi, fecha_nacimiento]
    );

    return res.status(201).json({
      message: "Paciente registrado correctamente",
      paciente: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al registrar paciente",
    });
  }
};





export const obtenerPacientes = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM paciente ORDER BY id_paciente ASC"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener pacientes",
    });
  }
};

export const buscarPacientePorDpi = async (req: Request, res: Response) => {
  try {
    const { dpi } = req.params;

    const result = await pool.query(
      "SELECT * FROM paciente WHERE dpi = $1",
      [dpi]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Paciente no encontrado",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al buscar paciente",
    });
  }
};





export const actualizarPaciente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, dpi, fecha_nacimiento } = req.body;

    if (!nombre || !apellido || !telefono || !dpi || !fecha_nacimiento) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const existePaciente = await pool.query(
      "SELECT * FROM paciente WHERE id_paciente = $1",
      [id]
    );

    if (existePaciente.rows.length === 0) {
      return res.status(404).json({
        message: "Paciente no encontrado",
      });
    }

    const existeDpi = await pool.query(
      "SELECT * FROM paciente WHERE dpi = $1 AND id_paciente <> $2",
      [dpi, id]
    );

    if (existeDpi.rows.length > 0) {
      return res.status(409).json({
        message: "Ya existe otro paciente con ese DPI",
      });
    }

    const result = await pool.query(
      `UPDATE paciente
       SET nombre = $1,
           apellido = $2,
           telefono = $3,
           dpi = $4,
           fecha_nacimiento = $5
       WHERE id_paciente = $6
       RETURNING *`,
      [nombre, apellido, telefono, dpi, fecha_nacimiento, id]
    );

    return res.json({
      message: "Paciente actualizado correctamente",
      paciente: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al actualizar paciente",
    });
  }
};