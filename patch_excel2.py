with open("Deutsch_Wortschatz_Excel_Sheet.html", "r", encoding="utf-8", errors="surrogateescape") as f:
    content = f.read()

# Fix the tbody part
target_start = "          <!-- G: Sister Verbs -->"
target_end = "          <!-- L: Level -->"

start_idx = content.find(target_start)
end_idx = content.find(target_end)

if start_idx != -1 and end_idx != -1:
    new_chunk = """          <!-- G: Mnemonic -->
          <td class="col-mnemonic" style="font-size:11px; color:var(--ink-muted);" title="${r.mnemonic}">${r.mnemonic}</td>

          <!-- H: Wortart -->
          <td class="col-pos"><span class="badge ${posBadgeClass}">${r.pos}</span></td>

          <!-- I: Sister Verbs -->
          <td class="col-sisters" style="font-size:11px; color:var(--ink-soft);" title="${r.sisters}">
            ${r.sisters || '—'}
          </td>

          <!-- J: Tamil -->
          <td class="col-ta" style="color:var(--gold); font-weight:600;">
            ${r.ta} ${r.ta_translit ? `<small style="font-weight:normal; opacity:0.8;">(${r.ta_translit})</small>` : ''}
          </td>

          <!-- K: Thema -->
          <td class="col-topic" style="font-size:11px; color:var(--ink-muted);">${r.topic}</td>

"""
    # Note: The original file has `—` (em-dash) for `r.sisters || '—'`. I will extract it from the original to perfectly preserve it.
    
    # Just to be completely safe, I'll use the original strings and piece them together.
    
    col_sisters = content[content.find("<!-- G: Sister Verbs -->"):content.find("<!-- H: Tamil -->")]
    col_ta = content[content.find("<!-- H: Tamil -->"):content.find("<!-- I: Thema -->")]
    col_topic = content[content.find("<!-- I: Thema -->"):content.find("<!-- J: Mnemonic -->")]
    col_mnemonic = content[content.find("<!-- J: Mnemonic -->"):content.find("<!-- K: Wortart -->")]
    col_pos = content[content.find("<!-- K: Wortart -->"):content.find("<!-- L: Level -->")]
    
    # Let's change the letters in the comments for cleanliness
    col_mnemonic = col_mnemonic.replace("<!-- J:", "<!-- G:")
    col_pos = col_pos.replace("<!-- K:", "<!-- H:")
    col_sisters = col_sisters.replace("<!-- G:", "<!-- I:")
    col_ta = col_ta.replace("<!-- H:", "<!-- J:")
    col_topic = col_topic.replace("<!-- I:", "<!-- K:")
    
    reordered = col_mnemonic + col_pos + col_sisters + col_ta + col_topic
    
    content = content[:start_idx] + reordered + content[end_idx:]
    
    with open("Deutsch_Wortschatz_Excel_Sheet.html", "w", encoding="utf-8", errors="surrogateescape") as f:
        f.write(content)
    print("Reordered successfully!")
else:
    print("Could not find targets.")
