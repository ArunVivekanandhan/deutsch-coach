import re

files = ["Nomen_Adjektiv_Trainer.html", "Verb_Transformation_Trainer.html"]
for fname in files:
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the end of renderCard() where it assigns stage.innerHTML
    if "stage.innerHTML = `" in content:
        hook = """
  if (localStorage.getItem('de_auto_audio') === 'true') {
      setTimeout(() => { if (typeof playTTS === 'function') playTTS(v.w || v.inf || v.base || v.sg); }, 300);
  }
"""
        # Append the hook right after `document.getElementById('revealBtn').onclick` starts, or right after `stage.innerHTML = ...`
        # Because stage.innerHTML is a multiline template string, it's easier to inject before `document.getElementById('revealBtn').onclick = `
        content = content.replace("document.getElementById('revealBtn').onclick =", hook + "\n  document.getElementById('revealBtn').onclick =")
        
        with open(fname, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched audio into {fname}")
