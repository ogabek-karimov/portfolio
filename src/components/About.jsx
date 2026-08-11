import profilePhoto from '../assets/profile.jpg'
import './About.css'

function About() {
  return (
    <section id="about" className="about">
      <div className="container about-inner">
        <div className="about-photo">
          <img
            src={profilePhoto}
            alt="Og'abek Karimov"
            className="about-photo-inner"
          />
        </div>
        <div className="about-content">
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            Men haqimda
          </h2>
          <p>
            Men frontend dasturchiman, foydalanuvchi uchun qulay va chiroyli
            interfeyslar yaratishga ixtisoslashganman. HTML, CSS va
            JavaScript asosida boshlab, hozirda React kutubxonasi bilan
            ishlayman va Node.js yordamida loyihalarni yig'ish (build) va
            server tomonini ham o'rganib bormoqdaman.
          </p>
          <p>
            Yangi texnologiyalarni o'rganishni va murakkab muammolarni
            sodda, tushunarli yechimlar bilan hal qilishni yoqtiraman.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
