let audioCtx = null

// Phone sounds are synthesized on the fly, so no audio file ships with the site.
// Every function takes a level (0 = silent, 1 = normal) and must run from a user gesture.
function context() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  audioCtx = audioCtx || new AudioCtx()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

// A short burst of filtered noise: the building block of every click here.
function tap(ctx, at, { freq, gain, length = 0.035, q = 1.4 }) {
  const size = Math.floor(ctx.sampleRate * length)
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size) ** 4
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = q
  const amp = ctx.createGain()
  amp.gain.value = gain
  source.connect(filter).connect(amp).connect(ctx.destination)
  source.start(at)
}

function play(level, draw) {
  if (!(level > 0)) return
  try {
    const ctx = context()
    if (ctx) draw(ctx, ctx.currentTime + 0.01)
  } catch {
    // the sound is decoration; never let it break the phone
  }
}

// A soft two-tap "click-clack" like a phone unlocking.
export function playUnlockSound(level = 1) {
  play(level, (ctx, t) => {
    tap(ctx, t, { freq: 1500, gain: 0.5 * level })
    tap(ctx, t + 0.06, { freq: 2600, gain: 0.35 * level })
  })
}

// One lower, firmer click, like the side button locking the screen.
export function playLockSound(level = 1) {
  play(level, (ctx, t) => tap(ctx, t, { freq: 900, gain: 0.6 * level, length: 0.045 }))
}

// A tiny tick for each volume step.
export function playTickSound(level = 1) {
  play(level, (ctx, t) => tap(ctx, t, { freq: 3200, gain: 0.3 * level, length: 0.015, q: 2 }))
}

// A quick rising "whoosh" when a message leaves.
export function playSendSound(level = 1) {
  play(level, (ctx, t) => {
    const length = 0.28
    const size = Math.floor(ctx.sampleRate * length)
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 3
    filter.frequency.setValueAtTime(500, t)
    filter.frequency.exponentialRampToValueAtTime(3500, t + length)
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0.0001, t)
    amp.gain.exponentialRampToValueAtTime(0.35 * level, t + 0.06)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + length)
    source.connect(filter).connect(amp).connect(ctx.destination)
    source.start(t)
  })
}
