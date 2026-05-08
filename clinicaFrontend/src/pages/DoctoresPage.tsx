import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Card from "../components/Card";

type Doctor = {
  id_doctor: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  estado: string;
  username?: string | null;
};

export default function DoctoresPage({ user }: any) {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
  });

  const cargarDoctores = async () => {
    try {
      const res = await api.get("/doctores");
      setDoctores(res.data);
    } catch {
      setMensaje("Error al cargar doctores");
    }
  };

  useEffect(() => {
    cargarDoctores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/doctores", form);

      setMensaje(res.data.message);

      setForm({
        username: "",
        password: "",
        nombre: "",
        apellido: "",
        especialidad: "",
        telefono: "",
      });

      cargarDoctores();
    } catch (err: any) {
      setMensaje(err.response?.data?.message || "Error al registrar doctor");
    }
  };

  const desactivar = async (id: number) => {
    try {
      await api.put(`/doctores/desactivar/${id}`);
      setMensaje("Doctor desactivado correctamente");
      cargarDoctores();
    } catch {
      setMensaje("Error al desactivar doctor");
    }
  };

  const activar = async (id: number) => {
    try {
      await api.put(`/doctores/activar/${id}`);
      setMensaje("Doctor activado correctamente");
      cargarDoctores();
    } catch {
      setMensaje("Error al activar doctor");
    }
  };

  return (
    <>
      <PageHeader
        title="Gestión de doctores"
        subtitle={`Usuario: ${user.username} | Rol: ${user.rol}`}
      />

      {mensaje && <div className="alert-soft">{mensaje}</div>}

      <div className="cards-grid">
        <Card title="Total doctores" value={doctores.length} />

        <Card
          title="Doctores activos"
          value={doctores.filter((d) => d.estado === "activo").length}
        />

        <Card
          title="Doctores inactivos"
          value={doctores.filter((d) => d.estado === "inactivo").length}
        />
      </div>

      <Panel title="Registrar doctor">
        <form onSubmit={handleRegistrar} className="modern-form">
          <div className="form-grid">
            <input
              name="username"
              placeholder="Usuario"
              value={form.username}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
            />

            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
            />

            <input
              name="especialidad"
              placeholder="Especialidad"
              value={form.especialidad}
              onChange={handleChange}
            />

            <input
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="actions-row">
            <button className="btn-primary" type="submit">
              Registrar doctor
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Lista de doctores">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Doctor</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {doctores.map((d) => (
                <tr key={d.id_doctor}>
                  <td>{d.username || "Sin usuario"}</td>

                  <td>
                    {d.nombre} {d.apellido}
                  </td>

                  <td>{d.especialidad}</td>

                  <td>
                    <span
                      className={`status-pill ${
                        d.estado === "activo"
                          ? "status-atendida"
                          : "status-cancelada"
                      }`}
                    >
                      {d.estado}
                    </span>
                  </td>

                  <td>
                    {d.estado === "activo" ? (
                      <button
                        className="btn-table danger"
                        onClick={() => desactivar(d.id_doctor)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="btn-table"
                        onClick={() => activar(d.id_doctor)}
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}