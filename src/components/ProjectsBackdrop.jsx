import { useEffect, useRef } from 'react'
import './ProjectsBackdrop.css'

// The rain reads as real code: each column shows consecutive characters of this text.
const CODE =
  "const app = createApp(); export default function Projects() { return items.map((p) => <Card key={p.id} {...p} />) } " +
  "await fetch('/api/projects').then((r) => r.json()); if (!res.ok) throw new Error('retry'); " +
  "const [state, setState] = useState(null); useEffect(() => { sync() }, []); git push origin main; npm run build; " +
  '<div className="grid">{children}</div>; bot.on("message", reply); => { } < / > ; = ( ) [ ] && || ?? '

// Far, middle and near layers: smaller, dimmer and slower columns read as further away.
const LAYERS = [
  { size: 11, alpha: 0.3, speed: [22, 42], gap: 18, trail: [8, 18] },
  { size: 14, alpha: 0.55, speed: [45, 80], gap: 28, trail: [10, 22] },
  { size: 18, alpha: 0.85, speed: [75, 125], gap: 110, trail: [6, 12] },
]

const FPS = 30

const between = ([min, max]) => min + Math.random() * (max - min)

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function makeColumns(width, height) {
  const columns = []
  LAYERS.forEach((layer, li) => {
    for (let x = Math.random() * layer.gap; x < width; x += layer.gap * (0.8 + Math.random() * 0.4)) {
      columns.push({
        layer: li,
        x,
        y: Math.random() * height * 1.5 - height * 0.5,
        speed: between(layer.speed),
        trail: Math.round(between(layer.trail)),
        offset: Math.floor(Math.random() * CODE.length),
      })
    }
  })
  return columns
}

function ProjectsBackdrop() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let columns = []
    let streak = null
    let nextStreak = 1.5
    let rgb = [124, 58, 237]
    let raf = 0
    let last = 0
    let visible = false

    function readColor() {
      const value = getComputedStyle(canvas).getPropertyValue('--accent').trim()
      if (value.startsWith('#')) rgb = hexToRgb(value)
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = makeColumns(width, height)
      draw(0)
    }

    function draw(dt) {
      ctx.clearRect(0, 0, width, height)
      const [r, g, b] = rgb

      for (const col of columns) {
        const layer = LAYERS[col.layer]
        const line = layer.size * 1.25
        col.y += col.speed * dt
        if (col.y - col.trail * line > height) {
          col.y = -Math.random() * height * 0.3
          col.speed = between(layer.speed)
          col.offset = Math.floor(Math.random() * CODE.length)
        }
        ctx.font = `${layer.size}px "IBM Plex Mono", ui-monospace, monospace`
        const head = Math.floor(col.y / line)
        for (let i = 0; i <= col.trail; i++) {
          const row = head - i
          if (row < 0) break
          const ch = CODE[(col.offset + row) % CODE.length]
          if (ch === ' ') continue
          // the leading character is brightest; the tail fades away behind it
          const fade = (1 - i / (col.trail + 1)) ** 1.4
          const alpha = layer.alpha * fade
          ctx.fillStyle = i === 0 ? `rgba(${(r + 255) >> 1}, ${(g + 255) >> 1}, ${(b + 255) >> 1}, ${Math.min(1, alpha * 1.2)})` : `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.fillText(ch, col.x, row * line)
        }
      }

      // now and then a streak of light shoots across, with a flare at its head
      nextStreak -= dt
      if (!streak && nextStreak <= 0) {
        streak = { y: height * (0.15 + Math.random() * 0.7), x: -200, speed: 700 + Math.random() * 500, len: 180 + Math.random() * 160 }
      }
      if (streak) {
        streak.x += streak.speed * dt
        const grad = ctx.createLinearGradient(streak.x - streak.len, 0, streak.x, 0)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.9)`)
        ctx.fillStyle = grad
        ctx.fillRect(streak.x - streak.len, streak.y - 0.75, streak.len, 1.5)
        const flare = ctx.createRadialGradient(streak.x, streak.y, 0, streak.x, streak.y, 14)
        flare.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
        flare.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.6)`)
        flare.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = flare
        ctx.fillRect(streak.x - 14, streak.y - 14, 28, 28)
        if (streak.x - streak.len > width) {
          streak = null
          nextStreak = 2.5 + Math.random() * 4
        }
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (now - last < 1000 / FPS) return
      // a long gap (hidden tab) must not make the rain jump
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      draw(dt)
    }

    function start() {
      if (raf || reduce || !visible) return
      last = 0
      raf = requestAnimationFrame(frame)
    }

    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    readColor()
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)

    // only animate while the section is on screen
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    viewObserver.observe(canvas)

    // the accent colour differs between the light and dark themes
    const themeObserver = new MutationObserver(() => {
      readColor()
      if (!raf) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    const onScheme = () => {
      readColor()
      if (!raf) draw(0)
    }
    scheme.addEventListener('change', onScheme)

    return () => {
      stop()
      sizeObserver.disconnect()
      viewObserver.disconnect()
      themeObserver.disconnect()
      scheme.removeEventListener('change', onScheme)
    }
  }, [])

  return <canvas className="projects-backdrop" ref={canvasRef} aria-hidden="true" />
}

export default ProjectsBackdrop
