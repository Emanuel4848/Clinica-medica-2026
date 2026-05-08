import { useState } from "react";
import PacientesPage from "./PacientesPage";
import CitasPage from "./CitasPage";
import PagosPage from "./PagosPage";
import ReportesPage from "./ReportesPage";
import Sidebar from "../components/Sidebar";

export default function RecepcionistaPage({ user }: any) {
  const [vista, setVista] = useState<
    "pacientes" | "citas" | "pagos" | "reportes"
  >("pacientes");

  return (
    <div className="dashboard-layout">
      <Sidebar vista={vista} setVista={setVista} />

      <main className="dashboard-main">
        <div className="topbar">
          <div>
            <h1>Panel Recepcionista</h1>
            <p>
              Usuario: <strong>{user.username}</strong> | Rol:{" "}
              <strong>{user.rol}</strong>
            </p>
          </div>
        </div>

        {vista === "pacientes" && <PacientesPage user={user} />}
        {vista === "citas" && <CitasPage user={user} />}
        {vista === "pagos" && <PagosPage user={user} />}
        {vista === "reportes" && <ReportesPage user={user} />}
      </main>
    </div>
  );
}