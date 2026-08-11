import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-inner">
        <p className="hero-kicker">Salom, men</p>
        <h1>
          Og'abek Karimov—<br />
          <span>Frontend Developer</span>
        </h1>
        <p className="hero-text">
          HTML, CSS, JavaScript, React va Node.js yordamida zamonaviy,
          tez va qulay veb-saytlar yarataman.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            Loyihalarni ko'rish
          </a>
          <a href="#contact" className="btn btn-outline">
            Bog'lanish
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
