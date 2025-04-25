import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Workers from './pages/Workers';
import Register from './pages/Register'; // Agregar la ruta para el registro

/**
 * Requiere autenticación: Si no hay un token en el sessionStorage, redirige a login.
 */
function RequireAuth({ children }) {
  const stored = sessionStorage.getItem('user');
  if (!stored) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(stored);
  return user.token ? children : <Navigate to="/login" replace />;
}

/**
 * Redirige si ya está autenticado: Si ya tiene un token, redirige al área de trabajadores.
 */
function RedirectIfAuth({ children }) {
  const stored = sessionStorage.getItem('user');
  if (!stored) {
    return children;
  }
  const user = JSON.parse(stored);
  return user.token ? <Navigate to="/workers" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de Login */}
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />
        
        {/* Ruta de Registro */}
        <Route
          path="/register"
          element={
            <RedirectIfAuth>
              <Register />
            </RedirectIfAuth>
          }
        />

        {/* Ruta de Workers, requiere autenticación */}
        <Route
          path="/workers"
          element={
            <RequireAuth>
              <Workers />
            </RequireAuth>
          }
        />
        
        {/* Ruta por defecto (redirige a login si la ruta no existe) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
