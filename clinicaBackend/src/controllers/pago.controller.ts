import { Request, Response } from "express";
import { pool } from "../config/db";

export const registrarPago = async (req: Request, res: Response) => {
  try {
    const { monto, id_cita } = req.body;

    if (!monto || !id_cita) {
      return res.status(400).json({
        message: "Monto y cita son obligatorios",
      });
    }

    const citaExiste = await pool.query(
      "SELECT * FROM cita WHERE id_cita = $1",
      [id_cita]
    );

    if (citaExiste.rows.length === 0) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    const pagoExiste = await pool.query(
      "SELECT * FROM pago WHERE id_cita = $1",
      [id_cita]
    );

    if (pagoExiste.rows.length > 0) {
      return res.status(409).json({
        message: "Esta cita ya tiene un pago registrado",
      });
    }

    const result = await pool.query(
      `INSERT INTO pago (monto, estado_pago, id_cita)
       VALUES ($1, 'pagado', $2)
       RETURNING *`,
      [monto, id_cita]
    );

    return res.status(201).json({
      message: "Pago registrado correctamente",
      pago: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al registrar pago",
    });
  }
};

export const obtenerPagos = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
          pg.id_pago,
          pg.monto,
          pg.estado_pago,
          c.id_cita,
          c.fecha AS fecha_cita,
          c.hora,
          p.nombre AS paciente_nombre,
          p.apellido AS paciente_apellido,
          d.nombre AS doctor_nombre,
          d.apellido AS doctor_apellido
       FROM pago pg
       INNER JOIN cita c ON pg.id_cita = c.id_cita
       INNER JOIN paciente p ON c.id_paciente = p.id_paciente
       INNER JOIN doctor d ON c.id_doctor = d.id_doctor
       ORDER BY pg.id_pago DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener pagos",
    });
  }
};

export const obtenerEstadoPagoPorCita = async (
  req: Request,
  res: Response
) => {
  try {
    const { idCita } = req.params;

    const result = await pool.query(
      `SELECT 
          c.id_cita,
          c.fecha,
          c.hora,
          COALESCE(pg.estado_pago, 'sin pago') AS estado_pago,
          pg.monto
       FROM cita c
       LEFT JOIN pago pg ON c.id_cita = pg.id_cita
       WHERE c.id_cita = $1`,
      [idCita]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al consultar estado de pago",
    });
  }
};