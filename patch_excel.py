import re

with open("Deutsch_Wortschatz_Excel_Sheet.html", "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace the `html += \` block inside `renderTable()`
# The target is:
"""
      html += `
        <tr id="${r.id}" onclick="selectRow(this, '${r.word}')">
          <td class="row-hdr-cell col-row-num">${idx + 1}</td>
          
          <!-- Wort + Audio -->
          <td class="col-word" style="font-weight:700;">
...
          <!-- Mnemonic -->
          <td class="col-mnemonic" style="font-size:11px; color:var(--ink-muted);" title="${r.mnemonic}">${r.mnemonic}</td>
        </tr>`;
"""

new_row = """      html += `
        <tr id="${r.id}" onclick="selectRow(this, '${r.word}')">
          <td class="row-hdr-cell col-row-num">${idx + 1}</td>
          
          <!-- A: English -->
          <td class="col-en" style="font-weight:600;">${r.en}</td>
          
          <!-- B: Wort + Audio -->
          <td class="col-word" style="font-weight:700;">
            ${r.word}
            <button class="audio-btn-mini" onclick="event.stopPropagation(); speakWord('${r.word}')" title="Aussprache">🔊</button>
          </td>

          <!-- C: Nomen -->
          <td class="col-noun">
            ${r.noun}
            <button class="audio-btn-mini" onclick="event.stopPropagation(); speakWord('${r.noun}')" title="Aussprache">🔊</button>
          </td>

          <!-- D: Präteritum -->
          <td class="col-praet" style="font-family:'IBM Plex Mono',monospace; font-weight:600; color:var(--excel-green);">${r.praet || '---'}</td>

          <!-- E: Perfekt -->
          <td class="col-perfekt" style="font-family:'IBM Plex Mono',monospace; font-weight:600; color:var(--purple);">${r.perfekt || '---'}</td>

          <!-- F: Adjektiv -->
          <td class="col-adj">${r.adj || '---'}</td>

          <!-- G: Sister Verbs -->
          <td class="col-sisters" style="font-size:11px; color:var(--ink-soft);" title="${r.sisters}">
            ${r.sisters || '---'}
          </td>

          <!-- H: Tamil -->
          <td class="col-ta" style="color:var(--gold); font-weight:600;">
            ${r.ta} ${r.ta_translit ? `<small style="font-weight:normal; opacity:0.8;">(${r.ta_translit})</small>` : ''}
          </td>

          <!-- I: Thema -->
          <td class="col-topic" style="font-size:11px; color:var(--ink-muted);">${r.topic}</td>

          <!-- J: Mnemonic -->
          <td class="col-mnemonic" style="font-size:11px; color:var(--ink-muted);" title="${r.mnemonic}">${r.mnemonic}</td>

          <!-- K: Wortart -->
          <td class="col-pos"><span class="badge ${posBadgeClass}">${r.pos}</span></td>

          <!-- L: Level -->
          <td class="col-level" style="font-family:'IBM Plex Mono',monospace; font-weight:600;">${r.level}</td>

          <!-- M: Artikel -->
          <td class="col-gender">${genderHTML}</td>

          <!-- N: Verb -->
          <td class="col-verb">
            ${r.verb}
            <button class="audio-btn-mini" onclick="event.stopPropagation(); speakWord('${r.verb}')" title="Aussprache">🔊</button>
          </td>

          <!-- O: Präsens -->
          <td class="col-praesens" style="font-family:'IBM Plex Mono',monospace;">${r.praesens}</td>
        </tr>`;"""

pattern = r'      html \+= `\n        <tr id="\$\{r\.id\}".*?</tr>`;'
new_content = re.sub(pattern, new_row, content, flags=re.DOTALL)

with open("Deutsch_Wortschatz_Excel_Sheet.html", "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated HTML with correct column mapping")
