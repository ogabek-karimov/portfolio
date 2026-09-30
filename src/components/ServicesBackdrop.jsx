import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import './ServicesBackdrop.css'

// Small seeded random, so the circuit looks hand-made but is identical on every visit.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Traces run in from one edge, jog diagonally a few times and end in a node. They are laid
// out in real pixels for the section's current size, so they never stretch or get cropped.
function buildTraces(side, seed, width, height, spacing) {
  const rand = seeded(seed)
  const traces = []
  const dir = side === 'right' ? -1 : 1
  for (let y0 = 30 + rand() * spacing; y0 < height - 30; y0 += spacing * (0.8 + rand() * 0.5)) {
    let y = y0
    let x = side === 'right' ? width : 0
    const length = width * (0.18 + rand() * 0.2)
    let d = `M${x} ${y.toFixed(1)}`
    // every trace on a side bends the same way and by less than the spacing, so neighbours never cross
    const bend = side === 'right' ? -1 : 1
    let travelled = 0
    let jogs = 0
    while (travelled < length) {
      const run = 30 + rand() * 80
      x += dir * run
      travelled += run
      d += ` H${x.toFixed(1)}`
      if (travelled < length && jogs < 2 && rand() > 0.35) {
        const jog = 8 + rand() * 6
        x += dir * jog
        y += bend * jog
        travelled += jog
        jogs += 1
        d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
      }
    }
    traces.push({ d, end: [x, y], pulse: rand() > 0.45, speed: 3.5 + rand() * 4, delay: rand() * 6 })
  }
  return traces
}

const SNIPPETS = [
  'const app = createApp()',
  "await fetch('/api/orders')",
  "bot.on('message', reply)",
  'export default function Landing() {',
  "await deploy({ env: 'production' })",
  '<Hero title="Welcome" />',
  'npm run build  ✓ 214ms',
  'useEffect(() => sync(), [])',
  "git commit -m 'ship it'",
  "grid-template-columns: repeat(3, 1fr);",
  'const total = cart.reduce(sum, 0)',
  "if (!user) return redirect('/login')",
]

// Where the typing lines sit; blur and size give the depth of the reference image.
const SLOTS = [
  { top: '9%', left: '4%', size: 13, blur: 0, delay: 0 },
  { top: '17%', left: '62%', size: 15, blur: 0, delay: 1.4 },
  { top: '34%', left: '1%', size: 18, blur: 2.5, delay: 2.6 },
  { top: '48%', left: '70%', size: 13, blur: 0, delay: 0.7 },
  { top: '63%', left: '6%', size: 13, blur: 0, delay: 3.3 },
  { top: '76%', left: '55%', size: 20, blur: 3, delay: 1.9 },
  { top: '90%', left: '12%', size: 14, blur: 1, delay: 4.1 },
  { top: '4%', left: '38%', size: 12, blur: 0, delay: 5 },
]

// Types a snippet, holds it, deletes it, then moves on to the next one.
function TypingLine({ slot, first }) {
  const [index, setIndex] = useState(first)
  const text = SNIPPETS[index % SNIPPETS.length]
  return (
    <span
      className="sb-line"
      style={{
        top: slot.top,
        left: slot.left,
        fontSize: slot.size,
        filter: slot.blur ? `blur(${slot.blur}px)` : undefined,
        '--n': text.length,
        '--delay': `${slot.delay}s`,
      }}
    >
      <span className="sb-text" onAnimationIteration={(e) => e.animationName === 'sb-type' && setIndex((i) => i + 3)}>
        {text}
      </span>
    </span>
  )
}

function ServicesBackdrop() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((prev) => (Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1 ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const traces = useMemo(() => {
    if (!size.width) return []
    return [...buildTraces('right', 7, size.width, size.height, 36), ...buildTraces('left', 23, size.width, size.height, 50)]
  }, [size])

  return (
    <div className="services-backdrop" ref={ref} aria-hidden="true">
      <svg className="sb-circuit" viewBox={`0 0 ${size.width || 1} ${size.height || 1}`}>
        {traces.map((t, i) => (
          <g key={i}>
            <path className="sb-trace" d={t.d} />
            {t.pulse && (
              <path className="sb-pulse" d={t.d} pathLength="1000" style={{ '--speed': `${t.speed}s`, '--delay': `${t.delay}s` }} />
            )}
            <circle className={`sb-node${t.pulse ? ' is-live' : ''}`} cx={t.end[0]} cy={t.end[1]} r="3.2" style={{ '--delay': `${t.delay}s` }} />
          </g>
        ))}
      </svg>
      {SLOTS.map((slot, i) => (
        <TypingLine slot={slot} first={i * 5} key={i} />
      ))}
    </div>
  )
}

export default ServicesBackdrop
