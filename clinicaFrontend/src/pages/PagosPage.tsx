import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";

type Cita = {
  id_cita: number;
  fecha: string;
  hora: string;
  estado: string;
  paciente_nombre: string;
  paciente_apellido: string;
  doctor_nombre: string;
  doctor_apellido: string;
};

type Pago = {
  id_pago: number;
  monto: number;
  estado_pago: string;
  id_cita: number;
  fecha_cita: string;
  hora: string;
  paciente_nombre: string;
  paciente_apellido: string;
  doctor_nombre: string;
  doctor_apellido: string;
};

export default function PagosPage({ user }: any) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    monto: "",
    id_cita: "",
  });

  const cargarCitas = async () => {
    try {
      const res = await api.get("/citas");
      setCitas(res.data);
    } catch {
      setMensaje("Error al cargar citas");
    }
  };

  const cargarPagos = async () => {
    try {
      const res = await api.get("/pagos");
      setPagos(res.data);
    } catch {
      setMensaje("Error al cargar pagos");
    }
  };

  useEffect(() => {
    cargarCitas();
    cargarPagos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const registrarPago = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.monto || !formData.id_cita) {
      setMensaje("Seleccione una cita e ingrese el monto");
      return;
    }

    try {
      const res = await api.post("/pagos", {
        monto: Number(formData.monto),
        id_cita: Number(formData.id_cita),
      });

      setMensaje(res.data.message);

      setFormData({
        monto: "",
        id_cita: "",
      });

      cargarPagos();
    } catch (error: any) {
      setMensaje(error.response?.data?.message || "Error al registrar pago");
    }
  };

  return (
    <>
      <PageHeader
        title="Pagos"
        subtitle={`Usuario: ${user.username} | Rol: ${user.rol}`}
      />

      {mensaje && <div className="alert-soft">{mensaje}</div>}

      <Panel title="Registrar pago">
        <form onSubmit={registrarPago} className="modern-form">
          <div className="form-grid">
            <select
              name="id_cita"
              value={formData.id_cita}
              onChange={handleChange}
            >
              <option value="">Seleccione una cita</option>
              {citas.map((cita) => (
                <option key={cita.id_cita} value={cita.id_cita}>
                  Cita #{cita.id_cita} - {cita.paciente_nombre}{" "}
                  {cita.paciente_apellido} - {cita.fecha.split("T")[0]}{" "}
                  {cita.hora}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              name="monto"
              placeholder="Monto"
              value={formData.monto}
              onChange={handleChange}
            />
          </div>

          <div className="actions-row">
            <button className="btn-primary" type="submit">
              Registrar pago
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Pagos registrados">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Cita</th>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id_pago}>
                  <td>Cita #{pago.id_cita}</td>
                  <td>
                    {pago.paciente_nombre} {pago.paciente_apellido}
                  </td>
                  <td>
                    {pago.doctor_nombre} {pago.doctor_apellido}
                  </td>
                  <td>Q{Number(pago.monto).toFixed(2)}</td>
                  <td>
                    <span className="status-pill status-atendida">
                      {pago.estado_pago}
                    </span>
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