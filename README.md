# Bilateral Stimulation Simulator

Simple browser-based tool with an Admin panel and a full-screen Patient view. The Admin controls everything; the Patient view mirrors motion and audio.

## Admin Options

- Shape
  - Options: Circle, Square, Triangle
- Shape Color
  - Picker + presets: Green, Blue, Yellow, Red, White
- Background Color
  - Picker + presets: Green, Blue, Yellow, Red, White
- Direction
  - Left↔Right, Up↕Down, Diagonal ↘, Diagonal ↗
- Speed
  - Range: 50–600 px/s
  - Speed Boost: 1×, 2×, 3×, 4× multiplier
- Size
  - Range: 10–100 px
- Vertical Position
  - Range: 0–100% (Reset to 50%)
- Glow Pulse
  - Enable/Disable
  - Glow Radius: 0–200%
  - Glow Rate: 0.1–3.0 Hz
- Ramp Speed
  - Enable/Disable, Seconds: 1–60
  - When disabled, motion uses constant speed (Linear)
- Smoothness / Easing
  - Linear (constant speed)
  - Ease In-Out (slows at edges)
- Edge Pause
  - Range: 0–150 ms
- Wiggle
  - Enable/Disable, Amplitude: 0–10 px

### Audio

- Audio Mode
  - Programmatic, From Files, Off
- Programmatic Presets
  - Pink Noise, Hybrid (noise + edge cues), Click, Ping, Woodblock
  - Bell, Bass, Kick, Snare, Hi-Hat, Sweep, Zap, Bubble
- Pan Sync to Movement
  - Toggle on/off
- Pan Rate (for continuous panning)
  - Range: 0.1–2.0 Hz
- Cue Rate (Hybrid)
  - Range: 0.1–3.0 Hz
- Volume
  - Range: 0–100%
- Test Sound
  - Plays the selected programmatic preset briefly

### File Audio

- Choose Folder, select track from dropdown (MP3/WAV)

### Presets (Admin)

- Save: Enter name and save current state
- Apply: Select from list and apply
- Delete: Remove a preset
- Import/Export: JSON of all presets

### Patient Management

- Patient Name: Save patient
- Load Patient: Select from list
- Clear Sessions: Reset history for loaded patient
- Delete Patient: Remove patient record
- Session History: Auto-listed with start/end time and duration

### Session Controls (Preview Panel)

- Timer (minutes)
- Start Session / End Session
- Status + Elapsed time

## Patient View

- Full-screen canvas with motion synced to Admin
- Audio unlock: most browsers require a user gesture (e.g., click or key press) before audio can play

## How to Run

- Open `index.html` and use the Admin panel
- Click “Open Patient View” to launch `patient.html` in a separate tab/window

## Data Storage

- Presets: `localStorage` key `bls_presets`
- Patients: `localStorage` key `bls_patients`

## Notes

- If Audio is enabled and Programmatic mode is selected, the Patient tab may need one user interaction to unlock audio
- Speed Boost multiplies the slider value for effective motion speed

## ⚠️ Disclaimer

This tool is for research, education, and personal experimentation with bilateral stimulation. It is NOT a substitute for professional therapy, diagnosis, or treatment. Use at your own discretion.
