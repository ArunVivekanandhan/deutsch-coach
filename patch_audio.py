import re

with open("deutsch-coach.html", "r", encoding="utf-8") as f:
    content = f.read()

# Add auto-audio to all card renderers in deutsch-coach.html
def add_audio(match):
    original = match.group(0)
    audio_hook = """
      if (localStorage.getItem('de_auto_audio') === 'true') {
         setTimeout(() => { if (window.playTTS) window.playTTS(card.w); }, 300);
      }
      const skipBtn"""
    return original.replace("const skipBtn", audio_hook.strip() + "\n      const skipBtn")

content = re.sub(r'afterRender\(\)\{[\s\S]*?const skipBtn', add_audio, content)

with open("deutsch-coach.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Injected auto-audio into all deutsch-coach.html card renderers.")
