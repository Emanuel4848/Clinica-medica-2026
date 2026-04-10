import { Router } from "express";
import {
  registrarDoctor,
  obtenerDoctores,
  activarDoctor,
  desactivarDoctor,
} from "../controllers/doctor.controller";

const router = Router();

router.post("/", registrarDoctor);
router.get("/", obtenerDoctores);
router.put("/activar/:id", activarDoctor);
router.put("/desactivar/:id", desactivarDoctor);

export default router;