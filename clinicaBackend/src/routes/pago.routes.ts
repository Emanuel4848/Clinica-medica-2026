import { Router } from "express";
import {
  registrarPago,
  obtenerPagos,
  obtenerEstadoPagoPorCita,
} from "../controllers/pago.controller";

const router = Router();

router.post("/", registrarPago);
router.get("/", obtenerPagos);
router.get("/cita/:idCita", obtenerEstadoPagoPorCita);

export default router;