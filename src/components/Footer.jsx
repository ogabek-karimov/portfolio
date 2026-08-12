import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {year} Karimov Og'abek. Barcha huquqlar himoyalangan.</p>
        <div className="footer-links">
          {/* <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a> */}
          <a href="https://t.me/bek_xacker" target="_blank" rel="noreferrer">
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
