import profilePhoto from "../assets/profile.jpg";
import { useLanguage } from "../i18n/LanguageContext";
import "./About.css";

function About() {
  const { dict } = useLanguage();

  return (
    <section id='about' className='about'>
      <div className='container about-inner'>
        <div className='about-photo'>
          <img
            src={profilePhoto}
            alt="Og'abek Karimov"
            className='about-photo-inner'
          />
        </div>
        <div className='about-content'>
          <h2 className='section-title' style={{ textAlign: "left" }}>
            {dict.about.title}
          </h2>
          <p>{dict.about.p1}</p>
          <p>{dict.about.p2}</p>
        </div>
      </div>
    </section>
  );
}

export default About;
