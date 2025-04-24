import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Workers from './pages/Workers';

/**
 ** OBTIENE TOKEN
 * */
 function RequireAuth({ children }) {
  const stored = sessionStorage.getItem('user')
  if (!stored) {
    return <Navigate to="/login" replace />
  }
  const user = JSON.parse(stored)
  return user.token ? children : <Navigate to="/login" replace />
}

function RedirectIfAuth({ children }) {
  const stored = sessionStorage.getItem('user')
  if (!stored) {
    return children
  }
  const user = JSON.parse(stored)
  return user.token ? <Navigate to="/workers" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/workers"
          element={
            <RequireAuth>
              <Workers />
            </RequireAuth>
          }
        />
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}