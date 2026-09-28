import { useLanguage } from '../i18n/LanguageContext'
import { brandIcons } from '../data/brandIcons'
import './Footer.css'

const SOCIALS = [
  { label: 'Telegram', href: 'https://t.me/Uzswlu_rttm', icon: brandIcons.telegram },
  { label: 'GitHub', href: 'https://github.com/ogabek-karimov', icon: brandIcons.github },
  { label: 'Email', href: 'mailto:bek8896ok@gmail.com', icon: brandIcons.gmail },
]

function Footer() {
  const year = new Date().getFullYear()
  const { dict } = useLanguage()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {year} Karimov Og'abek. {dict.footer.rights}
        </p>
        <div className="footer-socials">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d={s.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
