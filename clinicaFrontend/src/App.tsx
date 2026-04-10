import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import PacientesPage from "./pages/PacientesPage";

type User = {
  username: string;
  rol: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <>
      {user ? (
        <PacientesPage user={user} />
      ) : (
        <LoginPage onLoginSuccess={setUser} />
      )}
    </>
  );
}