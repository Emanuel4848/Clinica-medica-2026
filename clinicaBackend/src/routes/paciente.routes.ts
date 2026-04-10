import { Router } from "express";
import {registrarPaciente, obtenerPacientes, buscarPacientePorDpi, actualizarPaciente} from "../controllers/paciente.controller";

const router = Router();

router.post("/", registrarPaciente);
router.get("/", obtenerPacientes);
router.get("/:dpi", buscarPacientePorDpi);
router.put("/:id", actualizarPaciente);

export default router;