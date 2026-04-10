import { useState } from "react";
import PacientesPage from "./PacientesPage";
import CitasPage from "./CitasPage";

export default function RecepcionistaPage({ user }: any) {
  const [vista, setVista] = useState<"pacientes" | "citas">("pacientes");

  return (
    <div className="container">
      <h1>Panel Recepcionista</h1>
      <p>
        Usuario: <strong>{user.username}</strong> | Rol:{" "}
        <strong>{user.rol}</strong>
      </p>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setVista("pacientes")}>
          Pacientes
        </button>
        <button onClick={() => setVista("citas")}>
          Citas
        </button>
      </div>

      {vista === "pacientes" && <PacientesPage user={user} />}
      {vista === "citas" && <CitasPage user={user} />}
    </div>
  );
}