import math
import os
import random
import struct
import wave


ROOT = os.path.dirname(os.path.dirname(__file__))
AUDIO_DIR = os.path.join(ROOT, "audio")
SAMPLE_RATE = 22050
DURATION = 18


def clamp(value: float) -> int:
    return max(-32767, min(32767, int(value * 32767)))


def tone(freq: float, t: float, phase: float = 0.0) -> float:
    return math.sin(2.0 * math.pi * freq * t + phase)


def envelope(t: float, attack: float, decay: float, sustain: float, release: float, total: float) -> float:
    if t < attack:
      return t / max(attack, 1e-6)
    if t < attack + decay:
      return 1.0 - (1.0 - sustain) * ((t - attack) / max(decay, 1e-6))
    if t < total - release:
      return sustain
    return max(0.0, sustain * (1.0 - ((t - (total - release)) / max(release, 1e-6))))


def render_track(name: str, seed: int, root_note: float) -> None:
    random.seed(seed)
    path = os.path.join(AUDIO_DIR, name)
    total_frames = SAMPLE_RATE * DURATION
    beat = 60.0 / 76.0
    chords = [
        [root_note, root_note * 1.25, root_note * 1.5],
        [root_note * 1.122, root_note * 1.414, root_note * 1.681],
        [root_note * 0.944, root_note * 1.189, root_note * 1.498],
        [root_note * 1.059, root_note * 1.334, root_note * 1.587],
    ]

    with wave.open(path, "w") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)

        frames = bytearray()
        for i in range(total_frames):
            t = i / SAMPLE_RATE
            chord_index = int(t / (beat * 4)) % len(chords)
            local = t % (beat * 4)
            chord = chords[chord_index]

            pad = 0.0
            for idx, freq in enumerate(chord):
                wobble = 0.003 * math.sin(2.0 * math.pi * (0.12 + idx * 0.03) * t + idx)
                pad += 0.18 * tone(freq * (1.0 + wobble), t, idx * 0.4)
                pad += 0.08 * tone(freq * 0.5, t, idx * 0.6)

            vinyl = (random.random() - 0.5) * 0.022
            wow = 1.0 + 0.004 * math.sin(2.0 * math.pi * 0.18 * t)

            kick_pos = t % (beat * 2)
            kick = 0.0
            if kick_pos < 0.18:
                kick_env = envelope(kick_pos, 0.001, 0.12, 0.0, 0.06, 0.18)
                kick = 0.6 * tone(58 - 24 * kick_pos, t * wow) * kick_env

            snare_pos = (t + beat) % (beat * 2)
            snare = 0.0
            if snare_pos < 0.14:
                snare_env = envelope(snare_pos, 0.001, 0.05, 0.0, 0.05, 0.14)
                snare = ((random.random() - 0.5) * 0.55 + 0.12 * tone(210, t)) * snare_env

            hat_pos = t % beat
            hat = 0.0
            if hat_pos < 0.045:
                hat_env = envelope(hat_pos, 0.001, 0.018, 0.0, 0.01, 0.045)
                hat = ((random.random() - 0.5) * 0.24) * hat_env

            melody = 0.0
            if local > beat:
                step = int((local - beat) / (beat / 2)) % 4
                note = chord[step % len(chord)] * (2.0 if step != 1 else 1.0)
                note_time = (local - beat) % (beat / 2)
                note_env = envelope(note_time, 0.01, 0.08, 0.26, 0.06, beat / 2)
                melody = 0.18 * tone(note * wow, t, 0.2) * note_env

            left = pad + kick + snare + hat + melody + vinyl + 0.02 * tone(0.23, t)
            right = pad * 0.96 + kick + snare * 0.9 + hat * 1.1 + melody * 0.92 + vinyl - 0.02 * tone(0.21, t)

            frames.extend(struct.pack("<hh", clamp(left * 0.58), clamp(right * 0.58)))

        wav.writeframes(frames)


def main() -> None:
    os.makedirs(AUDIO_DIR, exist_ok=True)
    render_track("maggie_lofi_01.wav", 12, 220.0)
    render_track("maggie_lofi_02.wav", 27, 196.0)
    render_track("maggie_lofi_03.wav", 41, 246.94)


if __name__ == "__main__":
    main()
