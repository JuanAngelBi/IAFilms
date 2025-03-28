import React from "react";
import { signInWithPopup, signOut } from "firebase/auth";

export default function Auth({ user, setUser, auth, provider }) {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="body">
        <header className="header">
          <div className="logo">
            <div>
              <h1 className="logo-ia">IA</h1>
              <h1 className="logo-films">Films</h1>
            </div>
          </div>
          <div className="auth-button">
            {user ? (
              <button onClick={handleSignOut}>Cerrar sesión</button>
            ) : (
              <button onClick={handleSignIn}>Iniciar sesión</button>
            )}
          </div>
        </header>
      </div>
  );
}
