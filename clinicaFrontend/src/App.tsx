import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DoctoresPage from "./pages/DoctoresPage";
import CitasDoctorPage from "./pages/CitasDoctorPage";
import RecepcionistaPage from "./pages/RecepcionistaPage";


type User = {
  username: string;
  rol: string;
  id?: number;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  if (user.rol === "Recepcionista") {
  return <RecepcionistaPage user={user} />;
  }

  if (user.rol === "Administrador") {
    return <DoctoresPage user={user} />;
  }

  if (user.rol === "Doctor") {
    return <CitasDoctorPage user={user} />;
  }

  return <h1>Rol no reconocido</h1>;
}