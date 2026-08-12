import { useState } from 'react'
import './Navbar.css'

const links = [
  { href: '#about', label: 'Men haqimda' },
  { href: '#skills', label: "Ko'nikmalar" },
  { href: '#projects', label: 'Loyihalar' },
  { href: '#contact', label: 'Aloqa' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#" className="logo">
          Og'abek <span> Karimov</span>
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Menyuni ochish"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Navbar
