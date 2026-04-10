import { useState } from "react";
import api from "../services/api";

type LoginPageProps = {
  onLoginSuccess: (user: { username: string; rol: string }) => void;
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
      setMensaje(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="container">
      <h1>Login del sistema</h1>

      <form onSubmit={handleLogin} className="form">
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

        <button type="submit">Iniciar sesión</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}