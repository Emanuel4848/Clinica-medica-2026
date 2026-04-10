import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div className="container">
      <h1>Gestión de Doctores</h1>
      <p>
        Usuario: <strong>{user.username}</strong> | Rol:{" "}
        <strong>{user.rol}</strong>
      </p>

      <form onSubmit={handleRegistrar} className="form">
        <input
          name="username"
          placeholder="Username del doctor"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password del doctor"
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
        <button type="submit">Registrar doctor</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {doctores.map((d) => (
            <tr key={d.id_doctor}>
              <td>{d.id_doctor}</td>
              <td>{d.username || "Sin usuario"}</td>
              <td>
                {d.nombre} {d.apellido}
              </td>
              <td>{d.especialidad}</td>
              <td>{d.estado}</td>
              <td>
                {d.estado === "activo" ? (
                  <button onClick={() => desactivar(d.id_doctor)}>
                    Desactivar
                  </button>
                ) : (
                  <button onClick={() => activar(d.id_doctor)}>
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}