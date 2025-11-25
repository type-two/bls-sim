# Bilateral Stimulation Simulator

Simple browser-based tool with a therapist panel and a full-screen Patient view. The therapist controls everything; the Patient views bilateral stimulus as per therapist settings. 

## User Guide

### Getting Started
- Open the app and stay on the Therapist (Admin) page; the Patient view mirrors whatever you set.
- For one computer with two screens: open the Patient view and move it to the patient-facing display, then go fullscreen.
- For two computers: you can also use Network Mode (details below in Nerd Stuff), but the simple two‑screen setup is usually easiest.
- Audio may need a single click in the Patient view to unlock — this is normal browser behavior.

### Set Up the Visuals
- Shape: choose Circle, Square, or Triangle.
- Size: drag the size slider to make the shape larger or smaller.
- Speed: use the speed slider; the number shows how fast the shape moves.
 - Direction: pick Left↔Right (horizontal), Up↕Down (vertical), or Diagonal.
- Color: pick a shape color and a background color; use the swatches or the color picker.
 - Easing and Edge Pause: choose smoother movement (Ease In‑Out) and optional short pauses at the edges.
 - Vertical Position: set a baseline (0–100%) for where the motion track sits.
 - Vertical Oscillation: toggle gentle up/down motion around the chosen baseline.
 - Extras: enable Glow Pulse, Wiggle, Ramp Speed.

### Sound Options
- Programmatic Sounds: built‑in cues like Pink Noise, Hybrid (noise plus edge hits), Click, Ping, Woodblock, Bell, Bass, Kick, Snare, Hi‑Hat, Sweep, Zap, Bubble.
- Pan Sync: optionally pan sound left/right in time with the movement.
- Volume: set an overall volume; use Test Sound to preview.
#### Tone Mode (ADSR)
- Frequency: pitch of the tone in Hertz (e.g., 440 Hz).
- Duration: how long the tone plays on each hit (milliseconds).
- Attack: time to rise from silence to full volume.
- Decay: time to fall from full volume down to the sustain level.
- Sustain: steady level held during the middle of the tone (0.0–1.0).
- Release: time to fade from the sustain level back to silence.
- Pan per hit: tones pan left/right to match where the shape hits the edges.
- Pan Sync (continuous): for pink noise, enables smooth left/right panning following movement.
- Pan Rate: speed of continuous panning when Pan Sync is on.

### Use Your Own Audio
- Choose Folder: select a folder of audio files (MP3/WAV). Then pick a track from the list.
- Play/Pan: the app can pan the file left/right to match movement.
- Tip: the first time you use audio, click once in the Patient view to unlock sound.

### Patients and Sessions
- Save Patient: enter a name and save. Patients are listed for quick loading later.
- Session History: each session records start/end time and duration automatically for the loaded patient.
- Session Notes: pick a session from the list, edit notes, and save; notes stay with the session.
- Manage: load an existing patient, clear a patient’s sessions, or delete a patient.
- Storage: patient info stays on your computer in the browser (no cloud backend).

### Record Movement Changes (Research/Teaching Tool)
- Start Recording: begin capturing every change you make (speed, size, direction, color, etc.).
- Stop & Save: end recording and name it; it appears in your recording list.
- Replay: select a recording and play it back to reproduce the exact sequence of changes.
- Export: save a recording as a JSON file — handy to share or archive.
- Import: load a previously exported JSON file back into your recording list.
- Clear/Delete: remove one recording or clear the entire list.

### Presets
- Save a Preset: name the current setup (visuals and audio) and save.
- Apply: pick a preset to immediately apply all saved settings.
- Delete: remove a preset you no longer need.
- Import/Export: backup or share all presets as a single JSON file.

### Controllers and Shortcuts
- Keyboard Mapping: map keys to actions like Start/Stop, Speed Up/Down, Volume Up/Down, Toggle Audio, Glow/Wiggle, Lock/Unlock, Record Start/Stop, Replay, and Next Shape/Direction/Easing/Sound.
- MIDI Controllers: connect a MIDI device and map buttons/knobs to the same actions; the mapping panel shows what’s currently assigned.
- HID Dial/Knob: connect a hardware dial via the “Connect HID” button, then turn the dial to change speed; adjust sensitivity if the dial feels too strong or too subtle.
- Lock/Unlock: press `L` to lock the interface (prevents accidental clicks). Hold `U` to unlock; the banner shows the lock status.

### Tips and Safety
- Go gently: start slow and simple. Adjust based on comfort.
- Pause anytime: you can stop motion and sound immediately.
- Everything is local: patients, presets, and recordings are stored on your device.

## Nerd Stuff

## How It Works

- Two pages:
  - Therapist (Admin) page: where you set motion, colors, and sounds
  - Patient page: fullscreen view that mirrors the Admin
- Two ways to show the Patient page:
  - Same computer (extended monitor): plug a second display facing the patient, open the Patient page on that display, go fullscreen — no network setup needed
  - Two computers on the same Wi‑Fi/LAN: start a tiny local server on the therapist’s computer so both can communicate, then the patient joins from their computer
- Audio note: most browsers need you to click on the page once to activate sound
- Go gently — adjust speed, colors, and sounds to what feels comfortable; pause whenever needed

## Super Simple Guide

### Windows
- First‑Time Setup
  - Double‑click `setup.bat`
  - Allow the Windows Defender Firewall prompt (Private networks)
  - Your browser opens at `http://<your‑IP>:8000/`; “Relay” turns green
- Every Session
  - Double‑click `start-relay.bat`
  - Click “Detect Local IP” in the app; the Patient link auto‑copies
- Stop Server
  - Use “Stop Server” in the app, or press `Ctrl + C` in the relay window

### macOS
- First‑Time Setup
  - Press `Cmd + Space` → type `Terminal` → press `Enter`
  - `cd` into the folder where you unzipped the app eg  'cd documents/bls-sim'
  - Copy and paste: `chmod +x ./setup.sh && ./setup.sh`
  - Allow the macOS firewall prompt (Private networks)
  - Your browser opens at `http://<your‑IP>:8000/`; “Relay” turns green
- Every Session
  - Press `Cmd + Space` → type `Terminal` → `Enter`
  - `cd` into the app folder
  - Copy and paste: `chmod +x ./start-relay.sh && ./start-relay.sh`
  - Click “Detect Local IP”; the Patient link auto‑copies
- Stop Server
  - Use “Stop Server” in the app, or press `Ctrl + C` in the relay Terminal

### Linux
- First‑Time Setup
  - Press `Ctrl + Alt + T` to open Terminal
  - `cd` into the app folder
  - Copy and paste: `chmod +x ./setup.sh && ./setup.sh`
  - Your browser opens at `http://<your‑IP>:8000/`; “Relay” turns green
- Every Session
  - Open Terminal → `cd` into the app folder
  - Copy and paste: `chmod +x ./start-relay.sh && ./start-relay.sh`
  - Click “Detect Local IP”; the Patient link auto‑copies
- Stop Server
  - Use “Stop Server” in the app, or press `Ctrl + C` in the relay Terminal

### What You Should See
- “Relay:” shows a green dot and “Running”
- “Detect Local IP” fills `ws://<your‑IP>:8787` and copies the Patient link
- Admin page loads at `http://<your‑IP>:8000/`

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

### Controllers (Tech)
- Keyboard: uses standard keydown events and a mapping registry stored in `localStorage` (`bls_mappings`).
- MIDI: uses Web MIDI (`navigator.requestMIDIAccess`) and maps Notes/CCs to actions.
- HID: uses WebHID (`navigator.hid.requestDevice`) and listens to `inputreport`; example HID dial adjusts speed with sensitivity scaling.
- Gamepad: not implemented.

## Network Mode Setup (Two Computers on the Same Wi‑Fi/LAN)

### Overview
- Therapist runs a lightweight relay (`server.py`) once on their computer.
- Admin connects to the relay with a Session ID and copies the Patient Join Link.
- Patient opens the link on their computer and performs a quick gesture to unlock audio.

### Quick Start (Double‑Click or Copy‑Paste)
- macOS (double‑click): open the folder and double‑click `start-relay.command`.
- macOS (copy‑paste): `chmod +x ./start-relay.sh && ./start-relay.sh`
- Windows (double‑click): open the folder and double‑click `start-relay.bat`.
- Windows (copy‑paste): `start-relay.bat`
- These start scripts auto‑create a local Python virtual environment, install `websockets`, print your LAN relay URL, and run the relay on port `8787`.

### First‑Time Setup (Recommended)
- macOS/Linux:
  - `chmod +x ./setup.sh && ./setup.sh`
- Windows:
  - Double‑click `setup.bat`
- What it does:
  - Creates a local virtual environment and installs `websockets`
  - Starts the static site server on `http://<IP>:8000/`
  - Starts the WebSocket relay on `ws://<IP>:8787`
  - Opens the Admin page in your browser at `http://<IP>:8000/`

### Every Session (Start/Stop)
- Start Server:
  - macOS/Linux: `chmod +x ./start-relay.sh && ./start-relay.sh`
  - Windows: `start-relay.bat`
- Stop Server:
  - Use the Admin page “Stop Server” button, or press `Ctrl + C` in the relay terminal

### One‑Time Install (WebSocket Relay)
- Windows:
  - Press `Windows` key → type `PowerShell` → `Enter`
  - Check Python: `python --version` (or `py --version`)
  - Quick option: double‑click `start-relay.bat` (or run it in PowerShell/CMD)
  - Manual option: `python -m pip install websockets` (or `py -m pip install websockets`), then `python server.py` (or `py server.py`)
  - If prompted by Windows Defender Firewall, click “Allow access”.
- macOS:
  - Press `Cmd+Space` → type `Terminal` → `Enter`
  - Check Python: `python3 --version`
  - Quick option: double‑click `start-relay.command` (or run `chmod +x ./start-relay.sh && ./start-relay.sh`)
  - Manual option: `python3 -m pip install websockets`, then `python3 server.py`
- Linux (Ubuntu/Debian/Fedora etc.):
  - Press `Ctrl+Alt+T` to open Terminal
  - Check Python: `python3 --version`
  - Quick option: `chmod +x ./start-relay.sh && ./start-relay.sh`
  - Manual option: `python3 -m pip install websockets`, then `python3 server.py`

### Find Your Therapist Computer’s IP Address
- Windows: run `ipconfig` → use the `IPv4 Address` on your active adapter (e.g., `192.168.1.5`).
- macOS: run `ipconfig getifaddr en0` (Wi‑Fi) or `ipconfig getifaddr en1` (alternate); or `ifconfig | grep "inet "`.
- Linux: run `hostname -I` and pick the local `192.168.x.x` address; or `ip addr show`.

### Connect Admin (Therapist Computer)
1) Open Admin in a browser: `http://localhost:8000/`
2) In “Network Mode”:
   - Server URL: `ws://<THERAPIST_IP>:8787` (e.g., `ws://192.168.1.5:8787`)
   - Session ID: any label you like (e.g., `room-1`)
   - Click `Connect`
3) Copy the Patient Join Link shown below the connection fields.

### Connect Patient (Second Computer)
1) Open the copied Patient Join Link in a browser
2) Perform a quick gesture (mouse move or key press) to unlock audio (browser policy)
3) The Patient view will mirror Admin changes in real time

### Tips
- If the Patient does not connect, verify both computers are on the same network and can reach `ws://<THERAPIST_IP>:8787`.
- On Windows, allow the relay through the firewall when prompted.
- You can disconnect Network Mode and continue Local Mode at any time.

## Display Options

- Same Computer (Extended Display)
  - Connect a second monitor facing the patient
  - Open `patient.html` in a second browser window
  - Drag the Patient window to the patient‑facing monitor and use browser fullscreen
  - Audio unlock: have the patient do one quick gesture (mouse/key) on the Patient screen
  - Pros: zero network setup, minimal friction

- Separate Computer (LAN WebSocket)
  - Use the Network Mode steps above with the Python relay
  - Share the short Patient link (e.g., `http://<therapist-ip>:8000/patient.html#room-1`)
  - Audio unlock: one quick gesture on the Patient device; Programmatic audio is recommended

## Data Storage

- Presets: `localStorage` key `bls_presets`
- Patients: `localStorage` key `bls_patients`
- App State (current settings): `localStorage` key `bls_state`
- Recordings: IndexedDB database `bls_rec_db`, store `recordings` (legacy `localStorage` key `bls_recordings` may exist and is auto‑migrated)

## Notes

- If Audio is enabled and Programmatic mode is selected, the Patient tab may need one user interaction to unlock audio
- Speed Boost multiplies the slider value for effective motion speed

## ⚠️ Disclaimer

This tool is for research, education, and personal experimentation with bilateral stimulation, or maybe the fancy lightbar broke down and you need a backup option, or maybe you sprained both your index fingers. It is NOT a substitute for professional therapy, diagnosis, or treatment. Use at your own discretion. You can freely copy or share this with blessings. 
