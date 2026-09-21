import re
import sys

def process_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Reorder headers
    old_headers = """        <tr>
          <th class="col-row-num">#</th>
          <th class="col-word">A</th>
          <th class="col-pos">B</th>
          <th class="col-level">C</th>
          <th class="col-gender">D</th>
          <th class="col-noun">E</th>
          <th class="col-verb">F</th>
          <th class="col-praesens">G</th>
          <th class="col-praet">H</th>
          <th class="col-perfekt">I</th>
          <th class="col-adj">J</th>
          <th class="col-sisters">K</th>
          <th class="col-en">L</th>
          <th class="col-ta">M</th>
          <th class="col-topic">N</th>
          <th class="col-mnemonic">O</th>
        </tr>
        <!-- Actual Column Headers with Sort Actions -->
        <tr>
          <th class="col-row-num">#</th>
          <th class="col-word" onclick="sortBy('word')">Deutsches Wort <span class="sort-indicator" id="sort_word"></span></th>
          <th class="col-pos" onclick="sortBy('pos')">Wortart <span class="sort-indicator" id="sort_pos"></span></th>
          <th class="col-level" onclick="sortBy('level')">Level <span class="sort-indicator" id="sort_level"></span></th>
          <th class="col-gender" onclick="sortBy('gender')">Artikel <span class="sort-indicator" id="sort_gender"></span></th>
          <th class="col-noun" onclick="sortBy('noun')">Nomen (Sg. & Pl.) <span class="sort-indicator" id="sort_noun"></span></th>
          <th class="col-verb" onclick="sortBy('verb')">Verb (Infinitiv) <span class="sort-indicator" id="sort_verb"></span></th>
          <th class="col-praesens" onclick="sortBy('praesens')">Präsens (3. P.) <span class="sort-indicator" id="sort_praesens"></span></th>
          <th class="col-praet" onclick="sortBy('praet')">Präteritum <span class="sort-indicator" id="sort_praet"></span></th>
          <th class="col-perfekt" onclick="sortBy('perfekt')">Perfekt <span class="sort-indicator" id="sort_perfekt"></span></th>
          <th class="col-adj" onclick="sortBy('adj')">Adjektiv (-bar / -end) <span class="sort-indicator" id="sort_adj"></span></th>
          <th class="col-sisters" onclick="sortBy('sisters')">Sister Verbs & Bedeutungen <span class="sort-indicator" id="sort_sisters"></span></th>
          <th class="col-en" onclick="sortBy('en')">🇬🇧 English Meaning <span class="sort-indicator" id="sort_en"></span></th>
          <th class="col-ta" onclick="sortBy('ta')">🇮🇳 தமிழ் Meaning <span class="sort-indicator" id="sort_ta"></span></th>
          <th class="col-topic" onclick="sortBy('topic')">Thema <span class="sort-indicator" id="sort_topic"></span></th>
          <th class="col-mnemonic" onclick="sortBy('mnemonic')">Merkhilfe & Punarchi <span class="sort-indicator" id="sort_mnemonic"></span></th>
        </tr>"""

    new_headers = """        <tr>
          <th class="col-row-num">#</th>
          <th class="col-en">A</th>
          <th class="col-word">B</th>
          <th class="col-noun">C</th>
          <th class="col-praet">D</th>
          <th class="col-perfekt">E</th>
          <th class="col-adj">F</th>
          <th class="col-sisters">G</th>
          <th class="col-ta">H</th>
          <th class="col-topic">I</th>
          <th class="col-mnemonic">J</th>
          <th class="col-pos">K</th>
          <th class="col-level">L</th>
          <th class="col-gender">M</th>
          <th class="col-verb">N</th>
          <th class="col-praesens">O</th>
        </tr>
        <!-- Actual Column Headers with Sort Actions -->
        <tr>
          <th class="col-row-num">#</th>
          <th class="col-en" onclick="sortBy('en')">🇬🇧 English Meaning <span class="sort-indicator" id="sort_en"></span></th>
          <th class="col-word" onclick="sortBy('word')">Deutsches Wort <span class="sort-indicator" id="sort_word"></span></th>
          <th class="col-noun" onclick="sortBy('noun')">Nomen (Sg. & Pl.) <span class="sort-indicator" id="sort_noun"></span></th>
          <th class="col-praet" onclick="sortBy('praet')">Präteritum <span class="sort-indicator" id="sort_praet"></span></th>
          <th class="col-perfekt" onclick="sortBy('perfekt')">Perfekt <span class="sort-indicator" id="sort_perfekt"></span></th>
          <th class="col-adj" onclick="sortBy('adj')">Adjektiv (-bar / -end) <span class="sort-indicator" id="sort_adj"></span></th>
          <th class="col-sisters" onclick="sortBy('sisters')">Sister Verbs & Bedeutungen <span class="sort-indicator" id="sort_sisters"></span></th>
          <th class="col-ta" onclick="sortBy('ta')">🇮🇳 தமிழ் Meaning <span class="sort-indicator" id="sort_ta"></span></th>
          <th class="col-topic" onclick="sortBy('topic')">Thema <span class="sort-indicator" id="sort_topic"></span></th>
          <th class="col-mnemonic" onclick="sortBy('mnemonic')">Merkhilfe & Punarchi <span class="sort-indicator" id="sort_mnemonic"></span></th>
          <th class="col-pos" onclick="sortBy('pos')">Wortart <span class="sort-indicator" id="sort_pos"></span></th>
          <th class="col-level" onclick="sortBy('level')">Level <span class="sort-indicator" id="sort_level"></span></th>
          <th class="col-gender" onclick="sortBy('gender')">Artikel <span class="sort-indicator" id="sort_gender"></span></th>
          <th class="col-verb" onclick="sortBy('verb')">Verb (Infinitiv) <span class="sort-indicator" id="sort_verb"></span></th>
          <th class="col-praesens" onclick="sortBy('praesens')">Präsens (3. P.) <span class="sort-indicator" id="sort_praesens"></span></th>
        </tr>"""

    content = content.replace(old_headers, new_headers)

    # Reorder table row template
    old_tr = '''      html += `
        <tr id="${r.id}" onclick="selectRow(this, '${r.word}')">
          <td class="row-hdr-cell col-row-num">${idx + 1}</td>
          
          <!-- Wort + Audio -->
          <td class="col-word" style="font-weight:700;">
            ${r.word}
            <button class="audio-btn-mini" onclick="event.stopPropagation(); speakWord('${r.word}')" title="Aussprache">🔊</button>
          </td>

          <!-- Wortart -->
          <td class="col-pos"><span class="badge ${posBadgeClass}">${r.pos}</span></td>

          <!-- Level -->
          <td class="col-level" style="font-family:'IBM Plex Mono',monospace; font-weight:600;">${r.level}</td>

          <!-- Gender -->
          <td class="col-gender">${genderHTML}</td>

          <!-- Noun Details -->
          <td class="col-noun">${r.noun ? r.noun : '-'}</td>

          <!-- Verb -->
          <td class="col-verb">${r.verb ? r.verb : '-'}</td>

          <!-- Präsens -->
          <td class="col-praesens">${r.praesens ? r.praesens : '-'}</td>

          <!-- Präteritum -->
          <td class="col-praet">${r.praet ? r.praet : '-'}</td>

          <!-- Perfekt -->
          <td class="col-perfekt">${r.perfekt ? r.perfekt : '-'}</td>

          <!-- Adjektiv -->
          <td class="col-adj">${r.adj ? r.adj : '-'}</td>

          <!-- Sisters -->
          <td class="col-sisters" style="font-size:12px; color:var(--ink-soft); max-width:200px;">
            <div class="truncate-multi">${r.sisters ? r.sisters : '-'}</div>
          </td>

          <!-- English -->
          <td class="col-en" style="font-weight:600;">${r.en ? r.en : '-'}</td>

          <!-- Tamil -->
          <td class="col-ta">${r.ta ? r.ta : '-'}</td>

          <!-- Topic -->
          <td class="col-topic"><span class="badge" style="background:var(--paper); border:1px solid var(--line); color:var(--ink-soft);">${r.topic}</span></td>

          <!-- Mnemonic -->
          <td class="col-mnemonic" style="font-size:12px; font-style:italic;">${r.mnemonic ? r.mnemonic : '-'}</td>
        </tr>`;'''

    new_tr = '''      html += `
        <tr id="${r.id}" onclick="selectRow(this, '${r.word}')">
          <td class="row-hdr-cell col-row-num">${idx + 1}</td>
          
          <!-- English -->
          <td class="col-en" style="font-weight:600;">${r.en ? r.en : '-'}</td>

          <!-- Wort + Audio -->
          <td class="col-word" style="font-weight:700;">
            ${r.word}
            <button class="audio-btn-mini" onclick="event.stopPropagation(); speakWord('${r.word}')" title="Aussprache">🔊</button>
          </td>

          <!-- Noun Details -->
          <td class="col-noun">${r.noun ? r.noun : '-'}</td>

          <!-- Präteritum -->
          <td class="col-praet">${r.praet ? r.praet : '-'}</td>

          <!-- Perfekt -->
          <td class="col-perfekt">${r.perfekt ? r.perfekt : '-'}</td>

          <!-- Adjektiv -->
          <td class="col-adj">${r.adj ? r.adj : '-'}</td>

          <!-- Sisters -->
          <td class="col-sisters" style="font-size:12px; color:var(--ink-soft); max-width:200px;">
            <div class="truncate-multi">${r.sisters ? r.sisters : '-'}</div>
          </td>

          <!-- Tamil -->
          <td class="col-ta">${r.ta ? r.ta : '-'}</td>

          <!-- Topic -->
          <td class="col-topic"><span class="badge" style="background:var(--paper); border:1px solid var(--line); color:var(--ink-soft);">${r.topic}</span></td>

          <!-- Mnemonic -->
          <td class="col-mnemonic" style="font-size:12px; font-style:italic;">${r.mnemonic ? r.mnemonic : '-'}</td>

          <!-- Wortart -->
          <td class="col-pos"><span class="badge ${posBadgeClass}">${r.pos}</span></td>

          <!-- Level -->
          <td class="col-level" style="font-family:'IBM Plex Mono',monospace; font-weight:600;">${r.level}</td>

          <!-- Gender -->
          <td class="col-gender">${genderHTML}</td>

          <!-- Verb -->
          <td class="col-verb">${r.verb ? r.verb : '-'}</td>

          <!-- Präsens -->
          <td class="col-praesens">${r.praesens ? r.praesens : '-'}</td>
        </tr>`;'''

    content = content.replace(old_tr, new_tr)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Done")

process_html('Deutsch_Wortschatz_Excel_Sheet.html')
