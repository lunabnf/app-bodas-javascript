import { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

function MiniMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-pink-500 text-white px-4 py-2 rounded-full"
          >
            ☰ Menú
          </button>

          {menuOpen && (
            <nav className="absolute top-14 left-0 bg-white shadow-xl rounded-2xl p-6 w-80 z-50">
              <div className="flex flex-col gap-4">
                <Link
                  to="/registro"
                  className="bg-white/80 shadow-md rounded-xl px-4 py-4 text-center hover:bg-white transition"
                >
                  Registro de acciones
                </Link>
                <Link
                  to="/checklist"
                  className="bg-white/80 shadow-md rounded-xl px-4 py-4 text-center hover:bg-white transition"
                >
                  Checklist de tareas
                </Link>
                <Link
                  to="/usuarios"
                  className="bg-white/80 shadow-md rounded-xl px-4 py-4 text-center hover:bg-white transition"
                >
                  Gestión de usuarios
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </Router>
  );
}

export default MiniMenu;