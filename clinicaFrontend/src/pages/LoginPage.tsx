import { useState } from "react";
import { FaUserMd } from "react-icons/fa";
import api from "../services/api";

type LoginPageProps = {
  onLoginSuccess: (user: { id: number; username: string; rol: string }) => void;
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      setMensaje("Login exitoso");
      onLoginSuccess(response.data.user);
    } catch (error: any) {
      setMensaje(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">
            <FaUserMd />
          </div>
          <div>
            <h1>Clínica</h1>
            <p>Sistema de gestión médica</p>
          </div>
        </div>

        <div className="login-illustration">
          <h2>Bienvenido</h2>
          <p>
            Administra pacientes, citas, pagos y reportes desde una plataforma
            sencilla y ordenada.
          </p>
        </div>
      </div>

      <div className="login-card">
        <p className="eyebrow">Acceso al sistema</p>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleLogin} className="modern-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary" type="submit">
            Entrar
          </button>
        </form>

        {mensaje && <div className="alert-soft">{mensaje}</div>}
      </div>
    </div>
  );
}