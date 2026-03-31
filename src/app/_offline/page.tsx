export default function OfflinePage() {
  return (
    <main className="home-shell">
      <div className="home-frame">
        <section className="content-card">
          <div className="content-badge">Sin conexion</div>
          <h1 className="content-title">La app esta sin internet</h1>
          <p className="content-description">
            Si ya abriste esta app antes, tus datos guardados en este dispositivo siguen estando disponibles cuando
            vuelvas a tener conexion o cuando el contenido cacheado termine de cargarse.
          </p>

          <div className="placeholder-grid">
            <article className="placeholder-card">
              <p className="placeholder-label">Que hacer ahora</p>
              <p className="placeholder-text">
                Volve a conectarte y abri la app una vez para que el navegador guarde mejor los archivos offline.
              </p>
            </article>

            <article className="placeholder-card">
              <p className="placeholder-label">Consejo</p>
              <p className="placeholder-text">
                Instalar la app en la pantalla de inicio suele mejorar el comportamiento offline en el celular.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
