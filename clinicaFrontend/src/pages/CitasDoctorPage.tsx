import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";

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
  doctor_nombre: string;
  doctor_apellido: string;
};

export default function CitasDoctorPage({ user }: any) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [idCitaSeleccionada, setIdCitaSeleccionada] = useState("");
  const [busquedaHistorial, setBusquedaHistorial] = useState("");

  const [formData, setFormData] = useState({
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

  const cargarHistorial = async (idPaciente: number) => {
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

  const citaSeleccionada = citas.find(
    (cita) => cita.id_cita === Number(idCitaSeleccionada)
  );

  const seleccionarCita = (cita: Cita) => {
    setIdCitaSeleccionada(String(cita.id_cita));
    cargarHistorial(cita.id_paciente);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      motivo_consulta: "",
      observaciones: "",
      receta: "",
      proxima_cita: "",
    });
  };

  const registrarDetalleAtencion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!citaSeleccionada) {
      setMensaje("Seleccione una cita");
      return;
    }

    if (!formData.motivo_consulta) {
      setMensaje("Ingrese el motivo de consulta");
      return;
    }

    try {
      const res = await api.post("/historial", {
        fecha: citaSeleccionada.fecha.split("T")[0],
        motivo_consulta: formData.motivo_consulta,
        observaciones: formData.observaciones,
        receta: formData.receta,
        proxima_cita: formData.proxima_cita || null,
        id_paciente: citaSeleccionada.id_paciente,
        id_doctor: citaSeleccionada.id_doctor,
      });

      setMensaje(res.data.message);
      limpiarFormulario();
      cargarHistorial(citaSeleccionada.id_paciente);
    } catch (error: any) {
      setMensaje(error.response?.data?.message || "Error al registrar detalle");
    }
  };

  const historialFiltrado = historial.filter((h) => {
    const texto = `${h.fecha} ${h.motivo_consulta} ${h.observaciones} ${h.receta} ${h.doctor_nombre} ${h.doctor_apellido}`.toLowerCase();
    return texto.includes(busquedaHistorial.toLowerCase());
  });

  return (
    <>
      <PageHeader
        title="Panel del doctor"
        subtitle={`Bienvenido, ${user.username}`}
      />

      {mensaje && <div className="alert-soft">{mensaje}</div>}

      <div className="doctor-dashboard">
        <section className="doctor-left">
          <Panel title="Citas asignadas">
            <div className="doctor-cards">
              {citas.map((cita) => (
                <button
                  key={cita.id_cita}
                  type="button"
                  className={
                    idCitaSeleccionada === String(cita.id_cita)
                      ? "appointment-card selected"
                      : "appointment-card"
                  }
                  onClick={() => seleccionarCita(cita)}
                >
                  <div className="appointment-top">
                    <span>Cita #{cita.id_cita}</span>
                    <span className={`status-pill status-${cita.estado}`}>
                      {cita.estado}
                    </span>
                  </div>

                  <h3>
                    {cita.paciente_nombre} {cita.paciente_apellido}
                  </h3>

                  <p>{cita.fecha.split("T")[0]} · {cita.hora}</p>
                </button>
              ))}
            </div>
          </Panel>

          {citaSeleccionada && (
            <Panel title="Historial del paciente">
              <div className="modern-form" style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Buscar por motivo, receta u observaciones"
                  value={busquedaHistorial}
                  onChange={(e) => setBusquedaHistorial(e.target.value)}
                />
              </div>

              <div className="timeline-list">
                {historialFiltrado.map((h) => (
                  <div className="timeline-item" key={h.id_historial}>
                    <div className="timeline-date">
                      {h.fecha.split("T")[0]}
                    </div>

                    <div className="timeline-content">
                      <h3>{h.motivo_consulta}</h3>
                      <p>
                        <strong>Observaciones:</strong> {h.observaciones}
                      </p>
                      <p>
                        <strong>Receta:</strong> {h.receta}
                      </p>
                      <p>
                        <strong>Próxima cita:</strong>{" "}
                        {h.proxima_cita
                          ? h.proxima_cita.split("T")[0]
                          : "No asignada"}
                      </p>
                      <span>
                        Dr. {h.doctor_nombre} {h.doctor_apellido}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </section>

        <section className="doctor-right">
          <Panel title="Registrar atención">
            {!citaSeleccionada ? (
              <div className="empty-state">
                <h3>Selecciona una cita</h3>
                <p>
                  Elige una cita asignada para registrar la atención médica del
                  paciente.
                </p>
              </div>
            ) : (
              <>
                <div className="patient-summary">
                  <p className="eyebrow">Paciente seleccionado</p>
                  <h2>
                    {citaSeleccionada.paciente_nombre}{" "}
                    {citaSeleccionada.paciente_apellido}
                  </h2>
                  <p>
                    Cita #{citaSeleccionada.id_cita} ·{" "}
                    {citaSeleccionada.fecha.split("T")[0]} ·{" "}
                    {citaSeleccionada.hora}
                  </p>
                </div>

                <form
                  onSubmit={registrarDetalleAtencion}
                  className="modern-form"
                >
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

                  <div>
                    <label className="field-label">
                      Próxima cita sugerida
                    </label>
                    <input
                      type="date"
                      name="proxima_cita"
                      value={formData.proxima_cita}
                      onChange={handleChange}
                    />
                  </div>

                  <button className="btn-primary" type="submit">
                    Guardar atención
                  </button>
                </form>
              </>
            )}
          </Panel>
        </section>
      </div>
    </>
  );
}