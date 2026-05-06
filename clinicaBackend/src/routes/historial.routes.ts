import { Router } from "express";
import {
  registrarHistorial,
  obtenerHistorialPorPaciente,
} from "../controllers/historial.controller";

const router = Router();

router.post("/", registrarHistorial);
router.get("/paciente/:idPaciente", obtenerHistorialPorPaciente);

export default router;