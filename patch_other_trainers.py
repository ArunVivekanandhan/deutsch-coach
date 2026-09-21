import os
import re

files = [
    "Nomen_Adjektiv_Trainer.html",
    "Satzbau_Trainer.html",
    "Grammatik_Regel_Trainer.html",
    "Hoerverstehen_Diktat_Trainer.html"
]

helper = """function getGenderClass(article) {
  if (article === "der") return "gender-der";
  if (article === "die") return "gender-die";
  if (article === "das") return "gender-das";
  return "";
}"""

for filename in files:
    if not os.path.exists(filename): continue
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "getGenderClass(" not in content:
        # Just inject it before </script>
        content = content.replace("</script>", helper + "\n</script>", 1)
        
        # In Nomen Adjektiv Trainer, highlight the noun
        if filename == "Nomen_Adjektiv_Trainer.html":
            # For "gender" mode prompt
            content = content.replace(
                "___ ${v.sg} <span", 
                "___ <span class=\"${getGenderClass(v.a)}\">${v.sg}</span> <span"
            )
            # For reveal answer
            content = content.replace(
                "<span class=\"en-word\">${v.a} ${v.sg}</span>",
                "<span class=\"en-word ${getGenderClass(v.a)}\">${v.a} ${v.sg}</span>"
            )
            # For general wordline
            content = content.replace(
                "<div class=\"wordline\">",
                "<div class=\"wordline ${v.a ? getGenderClass(v.a) : ''}\">"
            )
            
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filename}")
