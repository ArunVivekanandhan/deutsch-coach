import re

with open("README.md", "r", encoding="utf-8") as f:
    content = f.read()

new_rows = """| 📝 **Brief Schreiben Trainer** | [Open Brief Schreiben](https://arunvivekanandhan.github.io/deutsch-coach/Brief_Schreiben_Trainer.html) | Interactive letter and email writing simulator for A1-B1 exams. |
| 🗣️ **Dialog Schatten Trainer** | [Open Dialog Schatten](https://arunvivekanandhan.github.io/deutsch-coach/Dialog_Schatten_Trainer.html) | Shadowing practice for conversations and pronunciation. |
| 🎧 **Hörverstehen & Diktat** | [Open Hörverstehen](https://arunvivekanandhan.github.io/deutsch-coach/Hoerverstehen_Diktat_Trainer.html) | Listening comprehension and dictation exercises. |
| ⚙️ **AI Config & Setup** | [Open AI Setup](https://arunvivekanandhan.github.io/deutsch-coach/Einstellungen_Setup.html) | Centralized API key management and application settings. |
| 📊 **Wortschatz Master Grid** | [Open Master Grid](https://arunvivekanandhan.github.io/deutsch-coach/Wortschatz_Master_Grid.html) | Comprehensive vocabulary grid view. |
| 📗 **Excel Master Sheet** | [Open Excel Sheet](https://arunvivekanandhan.github.io/deutsch-coach/Deutsch_Wortschatz_Excel_Sheet.html) | Complete vocabulary dataset in a familiar spreadsheet interface. |
"""

if "Brief Schreiben Trainer" not in content:
    content = content.replace("---", new_rows + "\n---", 1) # wait, replacing first --- will break the top. Let's find the table end.
    
    # find the last row of the table
    m = re.search(r'(\|\s*ðŸ“‹.*?)\n\n---', content, re.DOTALL)
    if m:
        # replace the match with itself + new_rows + \n\n---
        content = content.replace(m.group(0), m.group(1) + "\n" + new_rows + "\n---")
    else:
        # fallback string replacement
        content = content.replace("| ðŸ“‹ **Konnektoren-Referenz** | [Open Connector Reference](https://arunvivekanandhan.github.io/deutsch-coach/konnektoren_referenz.html) | Quick grammar lookup table for *weil, dass, obwohl, trotzdem, deshalb, denn*, etc. |", "| ðŸ“‹ **Konnektoren-Referenz** | [Open Connector Reference](https://arunvivekanandhan.github.io/deutsch-coach/konnektoren_referenz.html) | Quick grammar lookup table for *weil, dass, obwohl, trotzdem, deshalb, denn*, etc. |\n" + new_rows)

with open("README.md", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated README.md")
