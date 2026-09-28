let audioCtx = null

// A soft two-tap "click-clack" like a phone unlocking. It is synthesized on the fly,
// so no audio file ships with the site. Must be called from a user gesture.
export function playUnlockSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  try {
    audioCtx = audioCtx || new AudioCtx()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const start = audioCtx.currentTime + 0.01
    const taps = [
      { at: 0, freq: 1500, gain: 0.5 },
      { at: 0.06, freq: 2600, gain: 0.35 },
    ]
    for (const tap of taps) {
      const length = Math.floor(audioCtx.sampleRate * 0.035)
      const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4
      const source = audioCtx.createBufferSource()
      source.buffer = buffer
      const filter = audioCtx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = tap.freq
      filter.Q.value = 1.4
      const amp = audioCtx.createGain()
      amp.gain.value = tap.gain
      source.connect(filter).connect(amp).connect(audioCtx.destination)
      source.start(start + tap.at)
    }
  } catch {
    // the sound is decoration; never let it break opening the chat
  }
}
