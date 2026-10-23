// Tiny 8-bit sound effects made with square waves; no audio files needed.

export type SoundName = 'blip' | 'coin' | 'unlock' | 'start' | 'fanfare'

let ctx: AudioContext | null = null

function getContext() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(audio: AudioContext, freq: number, start: number, duration: number, volume = 0.05) {
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, audio.currentTime + start)
  gain.gain.setValueAtTime(volume, audio.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration)
  osc.connect(gain).connect(audio.destination)
  osc.start(audio.currentTime + start)
  osc.stop(audio.currentTime + start + duration + 0.02)
}

const sequences: Record<SoundName, [number, number, number][]> = {
  blip: [[660, 0, 0.06]],
  coin: [
    [988, 0, 0.08],
    [1319, 0.08, 0.22],
  ],
  unlock: [
    [523, 0, 0.08],
    [659, 0.08, 0.08],
    [784, 0.16, 0.08],
    [1047, 0.24, 0.2],
  ],
  start: [
    [392, 0, 0.1],
    [523, 0.1, 0.1],
    [659, 0.2, 0.18],
  ],
  fanfare: [
    [523, 0, 0.12],
    [523, 0.13, 0.12],
    [523, 0.26, 0.12],
    [659, 0.4, 0.3],
    [784, 0.72, 0.4],
  ],
}

export function playSound(name: SoundName) {
  const audio = getContext()
  if (!audio) return
  for (const [freq, start, duration] of sequences[name]) tone(audio, freq, start, duration)
}
