import { Router } from "express";
import {
  reporteCitasPorEstado,
  reporteCitasPorDoctor,
  reportePagos,
  reporteProximasCitas,
} from "../controllers/reporte.controller";

const router = Router();

router.get("/citas-estado", reporteCitasPorEstado);
router.get("/citas-doctor", reporteCitasPorDoctor);
router.get("/pagos", reportePagos);
router.get("/proximas-citas", reporteProximasCitas);

export default router;