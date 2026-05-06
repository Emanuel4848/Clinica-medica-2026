import { useEffect, useState } from "react";
import api from "../services/api";

type Cita = {
  id_cita: number;
  fecha: string;
  hora: string;
  estado: string;
  id_paciente: number;
  id_doctor: number;
  paciente_nombre: string;
  paciente_apellido: string;
};

type Historial = {
  id_historial: number;
  fecha: string;
  motivo_consulta: string;
  observaciones: string;
  receta: string;
  proxima_cita: string | null;
  paciente_nombre: string;
  paciente_apellido: string;
  doctor_nombre: string;
  doctor_apellido: string;
};

export default function CitasDoctorPage({ user }: any) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [mensaje, setMensaje] = useState("");

  const [idPacienteSeleccionado, setIdPacienteSeleccionado] = useState("");

  const [formData, setFormData] = useState({
    fecha: "",
    motivo_consulta: "",
    observaciones: "",
    receta: "",
    proxima_cita: "",
  });

  const cargarCitas = async () => {
    try {
      const res = await api.get(`/citas/doctor/${user.id}`);
      setCitas(res.data);
    } catch {
      setMensaje("Error al cargar citas");
    }
  };

  const cargarHistorial = async (idPaciente: string) => {
    if (!idPaciente) return;

    try {
      const res = await api.get(`/historial/paciente/${idPaciente}`);
      setHistorial(res.data);
    } catch {
      setMensaje("Error al cargar historial");
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const pacientesUnicos = citas.filter(
    (cita, index, self) =>
      index === self.findIndex((c) => c.id_paciente === cita.id_paciente)
  );

  const handlePacienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idPaciente = e.target.value;
    setIdPacienteSeleccionado(idPaciente);
    cargarHistorial(idPaciente);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const obtenerIdDoctorDesdeCitas = () => {
    const primeraCita = citas[0];
    return primeraCita?.id_doctor;
  };

  const registrarDetalleAtencion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fecha) {
      setMensaje("Seleccione una fecha de atención");
      return;
    }

    if (!formData.motivo_consulta) {
      setMensaje("Ingrese el motivo de consulta");
      return;
    }

    try {
      const res = await api.post("/historial", {
        fecha: formData.fecha,
        motivo_consulta: formData.motivo_consulta,
        observaciones: formData.observaciones,
        receta: formData.receta,
        proxima_cita: formData.proxima_cita || null,
        id_paciente: Number(idPacienteSeleccionado),
        id_doctor: obtenerIdDoctorDesdeCitas(),
      });

      setMensaje(res.data.message);

      setFormData({
        fecha: "",
        motivo_consulta: "",
        observaciones: "",
        receta: "",
        proxima_cita: "",
      });

      cargarHistorial(idPacienteSeleccionado);
    } catch (error: any) {
      setMensaje(error.response?.data?.message || "Error al registrar detalle");
    }
  };

  return (
    <div className="container">
      <h1>Panel del Doctor</h1>
      <p>
        Doctor: <strong>{user.username}</strong>
      </p>

      {mensaje && <p>{mensaje}</p>}

      <h2>Mis citas asignadas</h2>
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
          {citas.map((cita) => (
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

      <h2>Registrar detalles de la atención</h2>

      <select value={idPacienteSeleccionado} onChange={handlePacienteChange}>
        <option value="">Seleccione un paciente</option>
        {pacientesUnicos.map((cita) => (
          <option key={cita.id_paciente} value={cita.id_paciente}>
            {cita.paciente_nombre} {cita.paciente_apellido}
          </option>
        ))}
      </select>

      {idPacienteSeleccionado && (
        <>
          <form onSubmit={registrarDetalleAtencion} className="form">
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />

            <input
              type="text"
              name="motivo_consulta"
              placeholder="Motivo de consulta"
              value={formData.motivo_consulta}
              onChange={handleChange}
            />

            <textarea
              name="observaciones"
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={handleChange}
            />

            <textarea
              name="receta"
              placeholder="Receta / indicaciones"
              value={formData.receta}
              onChange={handleChange}
            />

            <input
              type="date"
              name="proxima_cita"
              value={formData.proxima_cita}
              onChange={handleChange}
            />

            <button type="submit">Guardar atención</button>
          </form>

          <h2>Historial del paciente</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Observaciones</th>
                <th>Receta</th>
                <th>Próxima cita</th>
                <th>Doctor</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h) => (
                <tr key={h.id_historial}>
                  <td>{h.id_historial}</td>
                  <td>{h.fecha.split("T")[0]}</td>
                  <td>{h.motivo_consulta}</td>
                  <td>{h.observaciones}</td>
                  <td>{h.receta}</td>
                  <td>
                    {h.proxima_cita ? h.proxima_cita.split("T")[0] : "No asignada"}
                  </td>
                  <td>
                    {h.doctor_nombre} {h.doctor_apellido}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}