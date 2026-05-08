import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";

type Paciente = {
  id_paciente: number;
  nombre: string;
  apellido: string;
  telefono: string;
  dpi: string;
  fecha_nacimiento: string;
};

type PacientesPageProps = {
  user: {
    username: string;
    rol: string;
  };
};

export default function PacientesPage({ user }: PacientesPageProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [dpiBusqueda, setDpiBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dpi: "",
    fecha_nacimiento: "",
  });

  const cargarPacientes = async () => {
    try {
      const response = await api.get("/pacientes");
      setPacientes(response.data);
    } catch {
      setMensaje("Error al cargar pacientes");
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      dpi: "",
      fecha_nacimiento: "",
    });
    setEditandoId(null);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editandoId) {
        const response = await api.put(`/pacientes/${editandoId}`, formData);
        setMensaje(response.data.message);
      } else {
        const response = await api.post("/pacientes", formData);
        setMensaje(response.data.message);
      }

      limpiarFormulario();
      cargarPacientes();
    } catch (error: any) {
      setMensaje(error.response?.data?.message || "Error al guardar paciente");
    }
  };

  const handleBuscar = async () => {
    if (!dpiBusqueda) {
      cargarPacientes();
      return;
    }

    try {
      const response = await api.get(`/pacientes/${dpiBusqueda}`);
      setPacientes([response.data]);
      setMensaje("Paciente encontrado");
    } catch (error: any) {
      setPacientes([]);
      setMensaje(error.response?.data?.message || "Error al buscar paciente");
    }
  };

  const handleEditar = (paciente: Paciente) => {
    setFormData({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      telefono: paciente.telefono,
      dpi: paciente.dpi,
      fecha_nacimiento: paciente.fecha_nacimiento.split("T")[0],
    });
    setEditandoId(paciente.id_paciente);
    setMensaje("Editando paciente");
  };

  return (
    <>
      <PageHeader
        title="Pacientes"
        subtitle={`Usuario: ${user.username} | Rol: ${user.rol}`}
      />

      {mensaje && <div className="alert-soft">{mensaje}</div>}

      <div className="content-grid">
        <Panel title={editandoId ? "Actualizar paciente" : "Registrar paciente"}>
          <form onSubmit={handleGuardar} className="modern-form">
            <div className="form-grid">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
              />

              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
              />

              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />

              <input
                type="text"
                name="dpi"
                placeholder="DPI"
                value={formData.dpi}
                onChange={handleChange}
              />

              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="actions-row">
              <button className="btn-primary" type="submit">
                {editandoId ? "Actualizar paciente" : "Registrar paciente"}
              </button>

              {editandoId && (
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </Panel>

        <Panel title="Buscar paciente">
          <div className="modern-form">
            <input
              type="text"
              placeholder="Buscar por DPI"
              value={dpiBusqueda}
              onChange={(e) => setDpiBusqueda(e.target.value)}
            />

            <div className="actions-row">
              <button className="btn-primary" onClick={handleBuscar}>
                Buscar
              </button>
              <button className="btn-secondary" onClick={cargarPacientes}>
                Mostrar todos
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Lista de pacientes">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>DPI</th>
                <th>Fecha nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id_paciente}>
                  <td>{paciente.id_paciente}</td>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.apellido}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.dpi}</td>
                  <td>{paciente.fecha_nacimiento.split("T")[0]}</td>
                  <td>
                    <button
                      className="btn-table"
                      onClick={() => handleEditar(paciente)}
                    >
                      Editar
                    </button>
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