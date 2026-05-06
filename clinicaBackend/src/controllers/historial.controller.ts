import { Request, Response } from "express";
import { pool } from "../config/db";

export const registrarHistorial = async (req: Request, res: Response) => {
  try {
    const {
      fecha,
      motivo_consulta,
      observaciones,
      receta,
      proxima_cita,
      id_paciente,
      id_doctor,
    } = req.body;

    if (!fecha || !motivo_consulta || !id_paciente || !id_doctor) {
      return res.status(400).json({
        message: "Fecha, motivo, paciente y doctor son obligatorios",
      });
    }

    const result = await pool.query(
      `INSERT INTO historial_clinico 
       (fecha, motivo_consulta, observaciones, tratamiento, proxima_cita, id_paciente, id_doctor)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        fecha,
        motivo_consulta,
        observaciones || "",
        receta || "",
        proxima_cita || null,
        id_paciente,
        id_doctor,
      ]
    );

    return res.status(201).json({
      message: "Detalle de atención registrado correctamente",
      historial: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al registrar detalle de atención",
    });
  }
};

export const obtenerHistorialPorPaciente = async (
  req: Request,
  res: Response
) => {
  try {
    const { idPaciente } = req.params;

    const result = await pool.query(
      `SELECT 
          h.id_historial,
          h.fecha,
          h.motivo_consulta,
          h.observaciones,
          h.tratamiento AS receta,
          h.proxima_cita,
          p.nombre AS paciente_nombre,
          p.apellido AS paciente_apellido,
          d.nombre AS doctor_nombre,
          d.apellido AS doctor_apellido
       FROM historial_clinico h
       INNER JOIN paciente p ON h.id_paciente = p.id_paciente
       INNER JOIN doctor d ON h.id_doctor = d.id_doctor
       WHERE h.id_paciente = $1
       ORDER BY h.fecha DESC`,
      [idPaciente]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener historial",
    });
  }
};