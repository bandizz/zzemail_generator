export function EditorHeader() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          BandiZZ
        </div>
        <h1
          style={{
            margin: "4px 0 2px",
            fontSize: 20,
            letterSpacing: 0.4,
          }}
        >
          Générateur d’email ZZ hyper custom
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            opacity: 0.8,
            maxWidth: 420,
          }}
        >
          Remplis les champs, ajuste les couleurs et les P$, puis copie /
          télécharge le HTML en un clic.
        </p>
      </div>
    </header>
  );
}
