function Home() {
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