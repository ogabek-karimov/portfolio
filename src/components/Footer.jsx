import { useLanguage } from '../i18n/LanguageContext'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()
  const { dict } = useLanguage()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {year} Karimov Og'abek. {dict.footer.rights}</p>
        <div className="footer-links">
          {/* <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a> */}
          <a href="https://t.me/bek_xacker" target="_blank" rel="noreferrer" className="footer-link-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M21.05 2.93a1.5 1.5 0 0 0-1.53-.24L2.4 9.6a1.5 1.5 0 0 0 .1 2.82l4.53 1.48 1.74 5.6a1.5 1.5 0 0 0 2.6.55l2.4-2.7 4.4 3.25a1.5 1.5 0 0 0 2.37-.9l2.5-14.5a1.5 1.5 0 0 0-.99-1.67ZM9.6 14.36l-.6 3.36-1.3-4.2 10.3-6.9-8.4 7.74Zm1.4 1.55 1.4-1.28 1.7 1.26-1.9 2.14-1.2-2.12Z" />
            </svg>
            Telegram
          </a>
          {/* <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
