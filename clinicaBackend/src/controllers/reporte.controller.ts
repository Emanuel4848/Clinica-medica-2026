import { Request, Response } from "express";
import { pool } from "../config/db";

export const reporteCitasPorEstado = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT estado, COUNT(*) AS total
       FROM cita
       GROUP BY estado
       ORDER BY total DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte" });
  }
};

export const reporteCitasPorDoctor = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
          d.nombre,
          d.apellido,
          d.especialidad,
          COUNT(c.id_cita) AS total_citas
       FROM doctor d
       LEFT JOIN cita c ON d.id_doctor = c.id_doctor
       GROUP BY d.id_doctor
       ORDER BY total_citas DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte" });
  }
};

export const reportePagos = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
          COUNT(*) AS total_pagos,
          COALESCE(SUM(monto), 0) AS total_ingresos
       FROM pago`
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte" });
  }
};

export const reporteProximasCitas = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
          h.id_historial,
          h.proxima_cita,
          h.motivo_consulta,
          p.nombre AS paciente_nombre,
          p.apellido AS paciente_apellido,
          d.nombre AS doctor_nombre,
          d.apellido AS doctor_apellido
       FROM historial_clinico h
       INNER JOIN paciente p ON h.id_paciente = p.id_paciente
       INNER JOIN doctor d ON h.id_doctor = d.id_doctor
       WHERE h.proxima_cita IS NOT NULL
       ORDER BY h.proxima_cita ASC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al generar reporte" });
  }
};