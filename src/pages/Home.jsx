import { useAuth } from '../context/AuthContext';

function Home() {
  const { usuario, iniciarSesion, verificarCodigoManual, codigoManual, setCodigoManual, accesoQRValido } = useAuth();

  if (!usuario && !accesoQRValido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 max-w-sm w-full">
          <h1 className="text-xl font-semibold">Bienvenido a la Boda de Eric & Leticia</h1>
          <button onClick={iniciarSesion} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Iniciar sesión con Google
          </button>
          <div className="text-gray-500">— o —</div>
          <input
            type="text"
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            placeholder="Introduce tu código"
            className="border px-4 py-2 w-full rounded"
          />
          <button onClick={verificarCodigoManual} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Entrar con código
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10">
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-4xl">
        <section className="text-center space-y-4">
          <h2>Bienvenid@</h2>
          <p>Gracias por acompañarnos en este viaje tan especial. 💖</p>
          <div className="mt-8 text-left text-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">📲 ¿Quieres tener esta app como si fuera una aplicación en tu móvil?</h3>
            <div className="mt-6 flex justify-center">
              <img
                src="/images/image.png"
                alt="Instrucciones para agregar la app a la pantalla de inicio"
                className="rounded-xl shadow-xl max-w-[320px] w-full"
              />
            </div>
            <p className="mt-2 italic">Así podrás abrirla como una app más, sin navegador.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;