# Mandarin Trainer

Mandarin learning web app with:
- Levels 1-20 in left sidebar
- Tabs: Flash Cards, Kumon Repetition, Listening Practice
- 50 slides per level/tab, then 10-question quiz
- Flash cards include image + Chinese + pinyin + Google Translate TTS audio

## Run locally

```powershell
cd C:\Users\Cromos\.openclaw\workspace\projects\mandarin-trainer
py -3 -m http.server 8020 --bind 0.0.0.0
```

Then open:
- `http://127.0.0.1:8020`
- `http://<LAN-IP>:8020`

## Startup service

Scheduled Task name:
- `OpenClaw Mandarin Trainer Service`

Automation script:
- `C:\Users\Cromos\.openclaw\workspace\automations\run_mandarin_trainer_service.ps1`
