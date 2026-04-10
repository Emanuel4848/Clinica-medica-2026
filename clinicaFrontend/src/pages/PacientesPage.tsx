import { useEffect, useState } from "react";
import api from "../services/api";

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

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editandoId) {
        const response = await api.put(`/pacientes/${editandoId}`, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          dpi: formData.dpi,
          fecha_nacimiento: formData.fecha_nacimiento,
        });
        setMensaje(response.data.message);
        setEditandoId(null);
      } else {
        const response = await api.post("/pacientes", formData);
        setMensaje(response.data.message);
      }

      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        dpi: "",
        fecha_nacimiento: "",
      });

      cargarPacientes();
    } catch (error: any) {
      setMensaje(
        error.response?.data?.message || "Error al guardar paciente"
      );
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
      setMensaje(
        error.response?.data?.message || "Error al buscar paciente"
      );
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

  const handleCancelarEdicion = () => {
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      dpi: "",
      fecha_nacimiento: "",
    });
    setEditandoId(null);
    setMensaje("Edición cancelada");
  };

  return (
    <div className="container">
      <h1>Módulo de pacientes</h1>
      <p>
        Usuario: <strong>{user.username}</strong> | Rol:{" "}
        <strong>{user.rol}</strong>
      </p>

      <form onSubmit={handleGuardar} className="form">
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

        <button type="submit">
          {editandoId ? "Actualizar paciente" : "Registrar paciente"}
        </button>

        {editandoId && (
          <button type="button" onClick={handleCancelarEdicion}>
            Cancelar edición
          </button>
        )}
      </form>

      <div className="form">
        <input
          type="text"
          placeholder="Buscar por DPI"
          value={dpiBusqueda}
          onChange={(e) => setDpiBusqueda(e.target.value)}
        />
        <button onClick={handleBuscar}>Buscar paciente</button>
        <button onClick={cargarPacientes}>Mostrar todos</button>
      </div>

      {mensaje && <p>{mensaje}</p>}

      <h2>Lista de pacientes</h2>
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
                <button onClick={() => handleEditar(paciente)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}