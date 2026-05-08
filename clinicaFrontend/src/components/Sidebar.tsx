import {
  FaUserInjured,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartBar,
} from "react-icons/fa";

type SidebarProps = {
  vista: string;
  setVista: (vista: any) => void;
};

export default function Sidebar({ vista, setVista }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">Clínica</h2>

      <button
        className={vista === "pacientes" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => setVista("pacientes")}
      >
        <FaUserInjured /> Pacientes
      </button>

      <button
        className={vista === "citas" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => setVista("citas")}
      >
        <FaCalendarAlt /> Citas
      </button>

      <button
        className={vista === "pagos" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => setVista("pagos")}
      >
        <FaMoneyBillWave /> Pagos
      </button>

      <button
        className={vista === "reportes" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => setVista("reportes")}
      >
        <FaChartBar /> Reportes
      </button>
    </aside>
  );
}