import { useEffect, useState } from "react";
import api from "../services/api";

type CitaEstado = {
  estado: string;
  total: string;
};

type CitaDoctor = {
  nombre: string;
  apellido: string;
  especialidad: string;
  total_citas: string;
};

type ReportePagos = {
  total_pagos: string;
  total_ingresos: string;
};

type ProximaCita = {
  id_historial: number;
  proxima_cita: string;
  motivo_consulta: string;
  paciente_nombre: string;
  paciente_apellido: string;
  doctor_nombre: string;
  doctor_apellido: string;
};

export default function ReportesPage({ user }: any) {
  const [citasEstado, setCitasEstado] = useState<CitaEstado[]>([]);
  const [citasDoctor, setCitasDoctor] = useState<CitaDoctor[]>([]);
  const [pagos, setPagos] = useState<ReportePagos | null>(null);
  const [proximasCitas, setProximasCitas] = useState<ProximaCita[]>([]);
  const [mensaje, setMensaje] = useState("");

  const cargarReportes = async () => {
    try {
      const resEstado = await api.get("/reportes/citas-estado");
      const resDoctor = await api.get("/reportes/citas-doctor");
      const resPagos = await api.get("/reportes/pagos");
      const resProximas = await api.get("/reportes/proximas-citas");

      setCitasEstado(resEstado.data);
      setCitasDoctor(resDoctor.data);
      setPagos(resPagos.data);
      setProximasCitas(resProximas.data);
    } catch {
      setMensaje("Error al cargar reportes");
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  return (
    <div className="container">
      <h1>Reportes del Sistema</h1>
      <p>
        Usuario: <strong>{user.username}</strong> | Rol:{" "}
        <strong>{user.rol}</strong>
      </p>

      {mensaje && <p>{mensaje}</p>}

      <h2>Resumen de pagos</h2>
      <table>
        <thead>
          <tr>
            <th>Total de pagos</th>
            <th>Total de ingresos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{pagos?.total_pagos || 0}</td>
            <td>Q{Number(pagos?.total_ingresos || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <h2>Citas por estado</h2>
      <table>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {citasEstado.map((item) => (
            <tr key={item.estado}>
              <td>{item.estado}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Citas por doctor</h2>
      <table>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Especialidad</th>
            <th>Total citas</th>
          </tr>
        </thead>
        <tbody>
          {citasDoctor.map((item, index) => (
            <tr key={index}>
              <td>
                {item.nombre} {item.apellido}
              </td>
              <td>{item.especialidad}</td>
              <td>{item.total_citas}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Próximas citas sugeridas</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha sugerida</th>
            <th>Paciente</th>
            <th>Doctor</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {proximasCitas.map((item) => (
            <tr key={item.id_historial}>
              <td>{item.proxima_cita.split("T")[0]}</td>
              <td>
                {item.paciente_nombre} {item.paciente_apellido}
              </td>
              <td>
                {item.doctor_nombre} {item.doctor_apellido}
              </td>
              <td>{item.motivo_consulta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}