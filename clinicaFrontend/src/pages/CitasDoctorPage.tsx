import { useEffect, useState } from "react";
import api from "../services/api";

export default function CitasDoctorPage({ user }: any) {
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const cargarCitas = async () => {
    try {
      const res = await api.get(`/citas/doctor/${user.id}`);
      setCitas(res.data);
    } catch {
      setMensaje("Error al cargar citas");
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <div className="container">
      <h1>Mis Citas</h1>
      <p>
        Doctor: <strong>{user.username}</strong>
      </p>

      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita: any) => (
            <tr key={cita.id_cita}>
              <td>{cita.id_cita}</td>
              <td>{cita.fecha.split("T")[0]}</td>
              <td>{cita.hora}</td>
              <td>
                {cita.paciente_nombre} {cita.paciente_apellido}
              </td>
              <td>{cita.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}