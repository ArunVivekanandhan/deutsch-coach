import re

with open("Deutsch_Wortschatz_Excel_Sheet.html", "r", encoding="utf-8", errors="surrogateescape") as f:
    content = f.read()

# 1. Update the letters in the first row of thead
target_thead_letters = """
          <th class="col-mnemonic">G</th>
          <th class="col-pos">H</th>
          <th class="col-sisters">I</th>
          <th class="col-ta">J</th>
          <th class="col-topic">K</th>
"""
old_thead_letters = r"""          <th class="col-sisters">G</th>
          <th class="col-ta">H</th>
          <th class="col-topic">I</th>
          <th class="col-mnemonic">J</th>
          <th class="col-pos">K</th>"""
content = content.replace(old_thead_letters, target_thead_letters.strip("\n"))

# 2. Update the columns in the second row of thead
old_thead_names = r"""          <th class="col-sisters" onclick="sortBy\('sisters'\)">Sister Verbs & Bedeutungen <span class="sort-indicator" id="sort_sisters"></span></th>
          <th class="col-ta" onclick="sortBy\('ta'\)">🇮🇳 தமிழ் Meaning <span class="sort-indicator" id="sort_ta"></span></th>
          <th class="col-topic" onclick="sortBy\('topic'\)">Thema <span class="sort-indicator" id="sort_topic"></span></th>
          <th class="col-mnemonic" onclick="sortBy\('mnemonic'\)">Merkhilfe & Punarchi <span class="sort-indicator" id="sort_mnemonic"></span></th>
          <th class="col-pos" onclick="sortBy\('pos'\)">Wortart <span class="sort-indicator" id="sort_pos"></span></th>"""
target_thead_names = """          <th class="col-mnemonic" onclick="sortBy('mnemonic')">Merkhilfe & Punarchi <span class="sort-indicator" id="sort_mnemonic"></span></th>
          <th class="col-pos" onclick="sortBy('pos')">Wortart <span class="sort-indicator" id="sort_pos"></span></th>
          <th class="col-sisters" onclick="sortBy('sisters')">Sister Verbs & Bedeutungen <span class="sort-indicator" id="sort_sisters"></span></th>
          <th class="col-ta" onclick="sortBy('ta')">🇮🇳 தமிழ் Meaning <span class="sort-indicator" id="sort_ta"></span></th>
          <th class="col-topic" onclick="sortBy('topic')">Thema <span class="sort-indicator" id="sort_topic"></span></th>"""
content = re.sub(old_thead_names, target_thead_names, content)

# 3. Update the JavaScript row generation
old_tbody = r"""          <!-- G: Sister Verbs -->
          <td class="col-sisters" style="font-size:11px; color:var\(--ink-soft\);" title="\$\{r\.sisters\}">
            \$\{r\.sisters \|\| '—'\}
          </td>

          <!-- H: Tamil -->
          <td class="col-ta" style="color:var\(--gold\); font-weight:600;">
            \$\{r\.ta\} \$\{r\.ta_translit \? `<small style="font-weight:normal; opacity:0\.8;">\(\$\{r\.ta_translit\}\)</small>` : ''\}
          </td>

          <!-- I: Thema -->
          <td class="col-topic" style="font-size:11px; color:var\(--ink-muted\);">\$\{r\.topic\}</td>

          <!-- J: Mnemonic -->
          <td class="col-mnemonic" style="font-size:11px; color:var\(--ink-muted\);" title="\$\{r\.mnemonic\}">\$\{r\.mnemonic\}</td>

          <!-- K: Wortart -->
          <td class="col-pos"><span class="badge \$\{posBadgeClass\}">\$\{r\.pos\}</span></td>"""

target_tbody = """          <!-- G: Mnemonic -->
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
          <td class="col-topic" style="font-size:11px; color:var(--ink-muted);">${r.topic}</td>"""

content = re.sub(old_tbody, target_tbody, content)

with open("Deutsch_Wortschatz_Excel_Sheet.html", "w", encoding="utf-8", errors="surrogateescape") as f:
    f.write(content)
print("Updated columns!")
