import express from "express";
import cors from "cors";
import { pool } from "./config/db";
import authRoutes from "./routes/auth.routes";
import pacienteRoutes from "./routes/paciente.routes";
import doctorRoutes from "./routes/doctor.routes";
import citaRoutes from "./routes/cita.routes";
import historialRoutes from "./routes/historial.routes";



const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (_req, res) => {
  res.json({ message: "API de clínica médica funcionando" });
});

app.get("/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Conexión a PostgreSQL exitosa",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al conectar con la base de datos" });
  }
});


app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacienteRoutes);

app.use("/api/doctores", doctorRoutes);
app.use("/api/citas", citaRoutes);

app.use("/api/historial", historialRoutes);



export default app;