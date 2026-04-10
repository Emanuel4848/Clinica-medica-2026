import { useEffect, useState } from "react";
import api from "../services/api";

type User = {
    username: string;
    rol: string;
};

type Paciente = {
    id_paciente: number;
    nombre: string;
    apellido: string;
};

type Doctor = {
    id_doctor: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    estado: string;
};

type Cita = {
    id_cita: number;
    fecha: string;
    hora: string;
    estado: string;
    paciente_nombre: string;
    paciente_apellido: string;
    doctor_nombre: string;
    doctor_apellido: string;
    especialidad: string;
};

type Props = {
    user: User;
};

export default function CitasPage({ user }: Props) {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [doctores, setDoctores] = useState<Doctor[]>([]);
    const [citas, setCitas] = useState<Cita[]>([]);
    const [mensaje, setMensaje] = useState("");

    const [editandoId, setEditandoId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        fecha: "",
        hora: "",
        id_paciente: "",
        id_doctor: "",
    });

    const cargarPacientes = async () => {
        try {
            const res = await api.get("/pacientes");
            setPacientes(res.data);
        } catch {
            setMensaje("Error al cargar pacientes");
        }
    };

    const cargarDoctores = async () => {
        try {
            const res = await api.get("/doctores");
            const activos = res.data.filter((d: Doctor) => d.estado === "activo");
            setDoctores(activos);
        } catch {
            setMensaje("Error al cargar doctores");
        }
    };

    const cargarCitas = async () => {
        try {
            const res = await api.get("/citas");
            setCitas(res.data);
        } catch {
            setMensaje("Error al cargar citas");
        }
    };

    useEffect(() => {
        cargarPacientes();
        cargarDoctores();
        cargarCitas();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editandoId) {
                const res = await api.put(`/citas/reprogramar/${editandoId}`, {
                    fecha: formData.fecha,
                    hora: formData.hora,
                });
                setMensaje(res.data.message);
                setEditandoId(null);
            } else {
                const res = await api.post("/citas", {
                    fecha: formData.fecha,
                    hora: formData.hora,
                    id_paciente: Number(formData.id_paciente),
                    id_doctor: Number(formData.id_doctor),
                });
                setMensaje(res.data.message);
            }

            setFormData({
                fecha: "",
                hora: "",
                id_paciente: "",
                id_doctor: "",
            });

            cargarCitas();
        } catch (error: any) {
            setMensaje(error.response?.data?.message || "Error al guardar cita");
        }
    };

    const handleCancelar = async (id: number) => {
        try {
            const res = await api.put(`/citas/cancelar/${id}`);
            setMensaje(res.data.message);
            cargarCitas();
        } catch (error: any) {
            setMensaje(error.response?.data?.message || "Error al cancelar cita");
        }
    };

    const handleEditar = (cita: Cita) => {
        setFormData({
            fecha: cita.fecha.split("T")[0],
            hora: cita.hora,
            id_paciente: "",
            id_doctor: "",
        });
        setEditandoId(cita.id_cita);
        setMensaje("Reprogramando cita");
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setFormData({
            fecha: "",
            hora: "",
            id_paciente: "",
            id_doctor: "",
        });
        setMensaje("Edición cancelada");
    };

    const handleAtender = async (id: number) => {
        try {
            const res = await api.put(`/citas/atender/${id}`);
            setMensaje(res.data.message);
            cargarCitas();
        } catch (error: any) {
            setMensaje(error.response?.data?.message || "Error al atender cita");
        }
    };




    return (
        <div className="container">
            <h1>Gestión de Citas</h1>
            <p>
                Usuario: <strong>{user.username}</strong> | Rol:{" "}
                <strong>{user.rol}</strong>
            </p>

            <form onSubmit={handleGuardar} className="form">
                <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                />

                <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                />

                {!editandoId && (
                    <>
                        <select
                            name="id_paciente"
                            value={formData.id_paciente}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un paciente</option>
                            {pacientes.map((p) => (
                                <option key={p.id_paciente} value={p.id_paciente}>
                                    {p.nombre} {p.apellido}
                                </option>
                            ))}
                        </select>

                        <select
                            name="id_doctor"
                            value={formData.id_doctor}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un doctor</option>
                            {doctores.map((d) => (
                                <option key={d.id_doctor} value={d.id_doctor}>
                                    {d.nombre} {d.apellido} - {d.especialidad}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <button type="submit">
                    {editandoId ? "Reprogramar cita" : "Registrar cita"}
                </button>

                {editandoId && (
                    <button type="button" onClick={handleCancelarEdicion}>
                        Cancelar edición
                    </button>
                )}
            </form>

            {mensaje && <p>{mensaje}</p>}

            <h2>Lista de citas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Doctor</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
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
                            <td>
                                {cita.doctor_nombre} {cita.doctor_apellido}
                            </td>
                            <td>{cita.especialidad}</td>
                            <td>{cita.estado}</td>
                            <td>
                                {cita.estado !== "atendida" && (
                                    <button onClick={() => handleAtender(cita.id_cita)}>
                                        Atender
                                    </button>
                                )}

                                <button onClick={() => handleEditar(cita)}>Reprogramar</button>

                                {cita.estado !== "cancelada" && (
                                    <button onClick={() => handleCancelar(cita.id_cita)}>
                                        Cancelar
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