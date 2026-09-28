import { useId } from 'react'

// Flags are drawn as SVG: flag emoji do not render on Windows.
function UzbekistanFlag() {
  // cropped from the left so the crescent and stars stay in view
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
      <rect width="60" height="10" fill="#0099b5" />
      <rect y="9.6" width="60" height="10.8" fill="#ce1126" />
      <rect y="10.4" width="60" height="9.2" fill="#fff" />
      <rect y="20.4" width="60" height="9.6" fill="#1eb53a" />
      <circle cx="7.5" cy="4.8" r="3.6" fill="#fff" />
      <circle cx="8.8" cy="4.8" r="3.1" fill="#0099b5" />
      <g fill="#fff">
        {[
          [18.5, 2.1], [21.5, 2.1], [24.5, 2.1],
          [15.5, 4.9], [18.5, 4.9], [21.5, 4.9], [24.5, 4.9],
          [12.5, 7.7], [15.5, 7.7], [18.5, 7.7], [21.5, 7.7], [24.5, 7.7],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" />
        ))}
      </g>
    </svg>
  )
}

function RussiaFlag() {
  return (
    <svg viewBox="0 0 9 6" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="9" height="2" fill="#fff" />
      <rect y="2" width="9" height="2" fill="#0039a6" />
      <rect y="4" width="9" height="2" fill="#d52b1e" />
    </svg>
  )
}

function UnitedKingdomFlag() {
  // clip-path ids must be unique when the flag appears twice on the page
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <clipPath id={`${id}s`}>
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id={`${id}t`}>
        <path d="M30 15h30v15z v15h-30z h-30v-15z v-15h30z" />
      </clipPath>
      <g clipPath={`url(#${id}s)`}>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${id}t)`} stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  )
}

const FLAGS = { uz: UzbekistanFlag, ru: RussiaFlag, en: UnitedKingdomFlag }

function Flag({ code }) {
  const Drawing = FLAGS[code]
  return (
    <span className="flag">
      <Drawing />
    </span>
  )
}

export default Flag
