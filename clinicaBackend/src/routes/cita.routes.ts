import { Router } from "express";
import {registrarCita, obtenerCitas, cancelarCita, reprogramarCita, obtenerCitasPorDoctor,
} from "../controllers/cita.controller";
import { marcarComoAtendida } from "../controllers/cita.controller";


const router = Router();

router.post("/", registrarCita);
router.get("/", obtenerCitas);
router.get("/doctor/:id_usuario", obtenerCitasPorDoctor);
router.put("/cancelar/:id", cancelarCita);
router.put("/reprogramar/:id", reprogramarCita);
router.put("/atender/:id", marcarComoAtendida);


export default router;