import Link from "next/link";

const features = [
  {
    title: "Forløbsbibliotek",
    body: "Saml alle dine forløb ét sted, organiseret efter fag. Opret nye forløb med titel, beskrivelse, varighed og Fælles Mål — klar til at bruge igen år efter år.",
  },
  {
    title: "Træk forløb ind på ugerne",
    body: "Planlæg hele skoleåret ved at trække et forløb direkte ind på den rigtige uge. Vælg start- og slutuge, så genererer Årsplanen automatisk alle uger med datoer.",
  },
  {
    title: "Fælles Mål følger med",
    body: "Når du placerer et forløb, følger de tilknyttede Fælles Mål automatisk med på ugen. Du kan altid tilpasse målene for en enkelt uge uden at ændre forløbet i biblioteket.",
  },
  {
    title: "Eksportér som PDF",
    body: "Få en ren, printklar årsplan, du kan dele med kolleger, ledelse og forældre — eller arkivere som dokumentation for årets undervisning.",
  },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="logo">
          <span className="logo-mark">Årsplanen</span>
          <span className="logo-tag">for lærere</span>
        </div>
        <Link href="/login" className="btn">
          Log ind
        </Link>
      </header>

      <main>
        <section className="hero">
          <span className="hero-eyebrow">Årsplaner uden besværet</span>
          <h1 className="hero-title">
            Planlæg <em>hele skoleåret</em> på en eftermiddag
          </h1>
          <p className="hero-lead">
            Årsplanen er værktøjet til lærere, der vil bygge en overskuelig
            årsplan hurtigt. Træk dine forløb ind på ugerne, lad Fælles Mål
            følge automatisk med, og eksportér en færdig plan, du kan dele og
            printe.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="btn btn-primary btn-lg">
              Log ind og kom i gang
            </Link>
            <a href="#features" className="btn btn-lg">
              Se funktionerne
            </a>
          </div>
          <p className="hero-note">
            Ingen installation — alt foregår i browseren.
          </p>
        </section>

        <section className="features" id="features">
          <div className="features-head">
            <h2 className="serif">Alt du skal bruge til årsplanen</h2>
            <p>Fra tom kalender til færdig, delbar plan — i ét overblik.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature, i) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-num">{i + 1}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        Årsplanen · Bygget til den danske folkeskole · Fælles Mål fra Børne- og
        Undervisningsministeriet
      </footer>
    </>
  );
}
