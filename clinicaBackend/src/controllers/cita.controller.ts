import { Request, Response } from "express";
import { pool } from "../config/db";

const esHoraEntera = (hora: string) => {
  const partes = hora.split(":");
  return partes[1] === "00";
};

export const registrarCita = async (req: Request, res: Response) => {
  try {
    const { fecha, hora, id_paciente, id_doctor } = req.body;

    if (!fecha || !hora || !id_paciente || !id_doctor) {
      return res.status(400).json({
        message: "Fecha, hora, paciente y doctor son obligatorios",
      });
    }

    if (!esHoraEntera(hora)) {
      return res.status(400).json({
        message: "Las citas solo pueden registrarse en horas exactas",
      });
    }

    const pacienteExiste = await pool.query(
      "SELECT * FROM paciente WHERE id_paciente = $1",
      [id_paciente]
    );

    if (pacienteExiste.rows.length === 0) {
      return res.status(404).json({
        message: "Paciente no encontrado",
      });
    }

    const doctorExiste = await pool.query(
      "SELECT * FROM doctor WHERE id_doctor = $1",
      [id_doctor]
    );

    if (doctorExiste.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor no encontrado",
      });
    }

    if (doctorExiste.rows[0].estado !== "activo") {
      return res.status(400).json({
        message: "El doctor está inactivo",
      });
    }

    const citaDuplicada = await pool.query(
      `SELECT * FROM cita
       WHERE id_doctor = $1 AND fecha = $2 AND hora = $3`,
      [id_doctor, fecha, hora]
    );

    if (citaDuplicada.rows.length > 0) {
      return res.status(409).json({
        message: "Ya existe una cita para ese doctor en ese horario",
      });
    }

    const result = await pool.query(
      `INSERT INTO cita (fecha, hora, estado, id_paciente, id_doctor)
       VALUES ($1, $2, 'programada', $3, $4)
       RETURNING *`,
      [fecha, hora, id_paciente, id_doctor]
    );

    return res.status(201).json({
      message: "Cita registrada correctamente",
      cita: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al registrar cita",
    });
  }
};

export const obtenerCitas = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
          c.id_cita,
          c.fecha,
          c.hora,
          c.estado,
          p.nombre AS paciente_nombre,
          p.apellido AS paciente_apellido,
          d.nombre AS doctor_nombre,
          d.apellido AS doctor_apellido,
          d.especialidad
       FROM cita c
       INNER JOIN paciente p ON c.id_paciente = p.id_paciente
       INNER JOIN doctor d ON c.id_doctor = d.id_doctor
       ORDER BY c.id_cita DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al obtener citas",
    });
  }
};

export const cancelarCita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existeCita = await pool.query(
      "SELECT * FROM cita WHERE id_cita = $1",
      [id]
    );

    if (existeCita.rows.length === 0) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    const result = await pool.query(
      `UPDATE cita
       SET estado = 'cancelada'
       WHERE id_cita = $1
       RETURNING *`,
      [id]
    );

    return res.json({
      message: "Cita cancelada correctamente",
      cita: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al cancelar cita",
    });
  }
};

export const reprogramarCita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fecha, hora } = req.body;

    if (!fecha || !hora) {
      return res.status(400).json({
        message: "Fecha y hora son obligatorias",
      });
    }

    if (!esHoraEntera(hora)) {
      return res.status(400).json({
        message: "Las citas solo pueden reprogramarse en horas exactas",
      });
    }

    const citaActual = await pool.query(
      "SELECT * FROM cita WHERE id_cita = $1",
      [id]
    );

    if (citaActual.rows.length === 0) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    const { id_doctor } = citaActual.rows[0];

    const citaDuplicada = await pool.query(
      `SELECT * FROM cita
       WHERE id_doctor = $1 
       AND fecha = $2 
       AND hora = $3 
       AND id_cita <> $4`,
      [id_doctor, fecha, hora, id]
    );

    if (citaDuplicada.rows.length > 0) {
      return res.status(409).json({
        message: "Ya existe una cita para ese doctor en ese horario",
      });
    }

    const result = await pool.query(
      `UPDATE cita
       SET fecha = $1,
           hora = $2,
           estado = 'reprogramada'
       WHERE id_cita = $3
       RETURNING *`,
      [fecha, hora, id]
    );

    return res.json({
      message: "Cita reprogramada correctamente",
      cita: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al reprogramar cita",
    });
  }
};

export const obtenerCitasPorDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    const { id_usuario } = req.params;

    const result = await pool.query(
      `SELECT 
          c.*, 
          p.nombre AS paciente_nombre, 
          p.apellido AS paciente_apellido,
          d.nombre AS doctor_nombre, 
          d.apellido AS doctor_apellido,
          d.especialidad
       FROM cita c
       INNER JOIN paciente p ON c.id_paciente = p.id_paciente
       INNER JOIN doctor d ON c.id_doctor = d.id_doctor
       WHERE d.id_usuario = $1
       ORDER BY c.id_cita DESC`,
      [id_usuario]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al obtener citas del doctor",
    });
  }
};

export const marcarComoAtendida = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existeCita = await pool.query(
      "SELECT * FROM cita WHERE id_cita = $1",
      [id]
    );

    if (existeCita.rows.length === 0) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    const result = await pool.query(
      `UPDATE cita
       SET estado = 'atendida'
       WHERE id_cita = $1
       RETURNING *`,
      [id]
    );

    return res.json({
      message: "Cita marcada como atendida",
      cita: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al actualizar estado",
    });
  }
};