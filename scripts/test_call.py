# -*- coding: utf-8 -*-
"""End-to-end tests of the KI-Sprechpartner video call (Task 48): Tests A–H of the real-time call spec.

Runs KI_Sprechpartner.html in headless Chromium with a fake microphone (oscillator stream the test switches on/off),
a fake Web Speech recogniser and mocked providers (streamed SSE LLM, OpenAI PCM TTS, ElevenLabs NDJSON with character
timestamps, OpenAI transcription, Simli 401) — see scripts/test_call_mocks.js. No real API is contacted, no key needed.

Run: python3 scripts/test_call.py [A B C …]      (needs: pip install playwright; python -m playwright install chromium)
     SHOTS=/some/dir to keep screenshots.
"""
import functools, glob, http.server, json, os, sys, tempfile, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE = os.environ.get('SHOTS') or tempfile.mkdtemp(prefix='call-test-')
MOCKS = open(os.path.join(ROOT, 'scripts', 'test_call_mocks.js'), encoding='utf-8').read()


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


_srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=ROOT))
threading.Thread(target=_srv.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{_srv.server_address[1]}/KI_Sprechpartner.html'
ARGS = ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']


def launch(p):
    try:
        return p.chromium.launch(args=ARGS)
    except Exception:
        for exe in glob.glob('/opt/pw-browsers/chromium-*/chrome-linux/chrome'):
            return p.chromium.launch(executable_path=exe, args=ARGS)
        raise


RESULTS, ERRORS = [], []

def preset(level='A1', mode='learning', voice='openai', mic_denied=False, extra=None):
    ls = {
        'dc_tutor_v1': {'tutor': 'lena', 'level': level, 'mode': mode, 'profile': {'goal': 'alltag', 'min': 10}, 'done': {}, 'days': {}, 'sessions': 0, 'minutes': 0},
        'dc_call_settings_v1': {'conv': mode if mode != 'guided' else 'learning', 'voice': voice, 'avatar': 'illustrated', 'stt': 'browser', 'captions': True, 'tamil': True, 'selfView': False},
        'dc_call_openai_key': 'sk-test-openai', 'de_ai_provider': 'deepseek', 'de_ai_key_deepseek': 'sk-test-llm'}
    ls.update(extra or {})
    return {'ls': ls, 'micDenied': mic_denied}

def check(test, name, ok, detail=''):
    RESULTS.append((test, name, bool(ok), detail))
    print(('  PASS ' if ok else '  FAIL ') + f'[{test}] {name}' + (f' — {detail}' if detail else ''), flush=True)

def open_page(browser, pre, viewport=None, mobile=False):
    ctx = browser.new_context(viewport=viewport or {'width': 1280, 'height': 860}, is_mobile=mobile, has_touch=mobile)
    ctx.add_init_script(MOCKS.replace('%PRESET%', json.dumps(json.dumps(pre))))
    pg = ctx.new_page()
    pg.on('console', lambda m: ERRORS.append(f'{m.type}: {m.text}') if m.type == 'error' and 'favicon' not in m.text and 'status of 404' not in m.text else None)
    pg.on('pageerror', lambda e: ERRORS.append('PAGEERROR ' + str(e)))
    pg.goto(URL); pg.wait_for_timeout(400)
    return ctx, pg

def state(pg): return pg.evaluate('ENG ? ENG.state : null')
def wait_state(pg, s, timeout=15000):
    t0 = time.time()
    while time.time() - t0 < timeout / 1000:
        if state(pg) in (s if isinstance(s, (list, tuple)) else [s]): return True
        pg.wait_for_timeout(40)
    return False
def start(pg, mission='cafe'):
    pg.click(f'#pathList [data-start="{mission}"]')
    assert wait_state(pg, 'AI_SPEAKING', 20000), 'tutor never started speaking: ' + str(state(pg))
def wait_listening(pg, timeout=30000): return wait_state(pg, 'LISTENING', timeout)
def speak(pg, text, **o): pg.evaluate('([t, o]) => window.__speak(t, o)', [text, o])
def states_since(pg, t): return pg.evaluate('t => ENG.sm.history.filter(s => s.t >= t && !s.rejected).map(s => s.to)', t)
def now(pg): return pg.evaluate('Date.now()')
def pnow(pg): return pg.evaluate('performance.now()')

def test_A(b):
    print('Test A — basic conversation', flush=True)
    ctx, pg = open_page(b, preset())
    t0 = now(pg); start(pg)
    check('A', 'greeting streamed and spoken (CONNECTING→LISTENING→PROCESSING→AI_SPEAKING)', states_since(pg, t0)[:4] == ['CONNECTING', 'LISTENING', 'PROCESSING', 'AI_SPEAKING'], str(states_since(pg, t0)))
    r = pg.evaluate('''() => { const l = __reqs.filter(r => r.kind === 'llm')[0], ts = __reqs.filter(r => r.kind === 'tts');
        return { stream: l.body.stream, firstTTS: ts[0] && ts[0].body.input, firstTTSat: ts[0] && ts[0].t, lastTok: __lastTok, voice: ts[0] && ts[0].body.voice, fmt: ts[0] && ts[0].body.response_format }; }''')
    check('A', 'LLM called with stream:true', r['stream'] is True)
    check('A', 'mood tag not spoken; first sentence sent to TTS before the LLM finished', r['firstTTS'] and not r['firstTTS'].startswith('[') and r['firstTTSat'] < r['lastTok'], f"first TTS '{r['firstTTS']}' {round(r['lastTok'] - r['firstTTSat'])} ms before last token")
    check('A', 'OpenAI TTS with tutor voice + PCM', r['voice'] == 'coral' and r['fmt'] == 'pcm')
    pg.wait_for_timeout(300)
    mouth = pg.evaluate('''() => new Promise(res => { const v = []; const iv = setInterval(() => { const m = document.querySelector('#avatarHost path.minner'); v.push(m ? m.getAttribute('d') : null); if (v.length >= 12) { clearInterval(iv); res(v); } }, 60); })''')
    check('A', 'avatar mouth moves while the tutor speaks (audio-driven)', len(set(mouth)) > 3 and mouth[0] is not None, f'{len(set(mouth))} distinct mouth shapes in 12 frames')
    assert wait_listening(pg)
    check('A', 'no "Speak" button needed: back to LISTENING automatically', state(pg) == 'LISTENING')
    check('A', 'captions + transcript show the greeting', 'willkommen' in pg.inner_text('#log').lower() and pg.inner_text('#capAI') != '')
    t1 = now(pg)
    speak(pg, 'Ich möchte ein Kaffee bitte')
    ok = wait_state(pg, 'PROCESSING', 5000); tp = pnow(pg)
    se = pg.evaluate('window.__speechEnd')
    check('A', 'learner turn detected by silence (USER_SPEAKING → PROCESSING)', ok and 'USER_SPEAKING' in states_since(pg, t1), f'turn ended {round(tp - se)} ms after the learner stopped (A1 hang)')
    wait_state(pg, 'AI_SPEAKING', 8000); assert wait_listening(pg)
    lat = pg.evaluate('ENG.metrics.slice(-1)[0]')
    check('A', 'latency measured (end of turn → first token / first audio)', lat and lat['endToFirstAudio'] > 0, json.dumps(lat) + ' (mocked network: 150 ms TTFT, 120 ms TTS first byte)')
    log = pg.inner_text('#log')
    check('A', 'gentle correction as card (recast in speech, no lecture)', 'Ich möchte einen Kaffee.' in log and 'einen Kaffee' in pg.evaluate('__reqs.filter(r=>r.kind==="tts").map(r=>r.body.input).join(" ")'))
    check('A', 'vocabulary card with save button', pg.locator('#log .card.voc [data-save]').count() >= 1)
    last_llm = pg.evaluate('__reqs.filter(r=>r.kind==="llm").slice(-1)[0].body.messages')
    check('A', 'history + system prompt with level/goals/memory sent', last_llm[0]['role'] == 'system' and 'A1' in last_llm[0]['content'] and last_llm[-1]['content'] == 'Ich möchte ein Kaffee bitte')
    # transcript tools
    pg.locator('#log .tm.ai [data-tr]').first.click(); pg.wait_for_timeout(100)
    check('A', 'translate button shows the English of a tutor turn', 'welcome' in pg.inner_text('#log').lower())
    pg.locator('#log .tm.ai .w[data-word="Kaffee"]').first.click(); pg.wait_for_timeout(1500)
    check('A', 'clickable word → dictionary popup', 'coffee' in pg.inner_text('#wordPop').lower(), pg.inner_text('#wordPop').replace('\n', ' ')[:60])
    pg.locator('#wordPop [data-save]').click(); pg.wait_for_timeout(200)
    check('A', 'save word → review list', any(x['w'] == 'Kaffee' for x in pg.evaluate('JSON.parse(localStorage.dc_review_requests||"[]")')))
    n_tts = pg.evaluate('__reqs.filter(r=>r.kind==="tts").length')
    pg.locator('#log .tm.ai [data-say]').first.click(); pg.wait_for_timeout(300)
    check('A', 'replay a tutor message (🔊 nochmal)', pg.evaluate('__reqs.filter(r=>r.kind==="tts").length') > n_tts)
    wait_listening(pg)
    pg.click('#logBtn'); pg.wait_for_timeout(100); hidden = pg.is_hidden('#drawer'); pg.click('#logBtn')
    check('A', 'transcript panel hide/show', hidden and pg.is_visible('#drawer'))
    pg.fill('#input', 'Ein Brötchen, bitte.'); pg.press('#input', 'Enter')
    check('A', 'typing uses the same turn path', wait_state(pg, ['PROCESSING', 'AI_SPEAKING'], 3000)); wait_listening(pg)
    pg.on('dialog', lambda d: d.accept())
    pg.click('#endBtn'); pg.wait_for_timeout(800)
    rep = pg.inner_text('#report')
    check('A', 'end → SESSION_ENDED + learning report (corrections, words, latency)', state(pg) == 'SESSION_ENDED' and 'einen Kaffee' in rep and 'Antwortzeit' in rep)
    check('A', 'correction saved to Fehler-Tagebuch', len(pg.evaluate('JSON.parse(localStorage.de_coach_vault||"[]")')) >= 1)
    pg.screenshot(path=os.path.join(HERE, 'A_report.png'))
    ctx.close()

def test_B(b):
    print('Test B — interruption (barge-in)', flush=True)
    ctx, pg = open_page(b, preset())
    start(pg); wait_listening(pg)
    speak(pg, 'Erzähl mir etwas über das Café')
    assert wait_state(pg, 'AI_SPEAKING', 8000)
    pg.wait_for_timeout(1200)
    # echo guard: the recogniser hears the tutor's own sentence → must NOT interrupt
    cur = pg.evaluate('ENG.speaking && ENG.speaking.text')
    pg.evaluate('t => __emit(t.split(" ").slice(0, 4).join(" "), false)', cur); pg.wait_for_timeout(300)
    check('B', 'echo guard: tutor\'s own words from the speaker do not interrupt', state(pg) == 'AI_SPEAKING', f'heard "{" ".join(cur.split()[:4])}"')
    # short noise burst (<320 ms) → no barge-in
    pg.evaluate('__setMic(0.35)'); pg.wait_for_timeout(200); pg.evaluate('__setMic(0)'); pg.wait_for_timeout(300)
    check('B', 'short noise does not interrupt', state(pg) == 'AI_SPEAKING')
    t0 = now(pg)
    pg.evaluate('''async () => { __setMic(0.35); await new Promise(r => setTimeout(r, 380)); __emit('Moment mal', false); }''')
    ok = wait_state(pg, ['INTERRUPTED', 'USER_SPEAKING'], 2000); t1 = now(pg)
    info = pg.evaluate('''() => ({ li: ENG.lastInterruption, busy: ENG.avatar.player ? ENG.avatar.player.remaining() : null, abort: ENG.abortReason })''')
    check('B', 'learner speech stops the tutor (AI_SPEAKING → INTERRUPTED → USER_SPEAKING)', ok and 'INTERRUPTED' in states_since(pg, t0), f"reason={info['li']['reason']}, state change {round(t1 - t0 - 380)} ms after the words, audio fade ~{info['li']['stopMs']} ms")
    check('B', 'audio queue flushed + LLM stream aborted', (info['busy'] or 0) < 0.1 and info['abort'] == 'barge')
    check('B', 'transcript marks the tutor message as interrupted', '(unterbrochen)' in pg.inner_text('#log'))
    pg.evaluate("async () => { await new Promise(r => setTimeout(r, 200)); __emit('Moment mal, ich habe eine Frage', true); await new Promise(r => setTimeout(r, 150)); __setMic(0); }")
    assert wait_state(pg, 'AI_SPEAKING', 8000)
    msgs = pg.evaluate('__reqs.filter(r=>r.kind==="llm").slice(-1)[0].body.messages')
    check('B', 'model gets the partial tutor turn + "[unterbricht]" and reacts to the interruption', msgs[-1]['content'].startswith('[unterbricht]') and msgs[-2]['content'].endswith('…'), msgs[-2]['content'][-60:] + ' | ' + msgs[-1]['content'])
    wait_listening(pg); check('B', 'conversation continues (LISTENING)', state(pg) == 'LISTENING')
    ctx.close()

def test_C(b):
    print('Test C — natural pause / hesitation', flush=True)
    ctx, pg = open_page(b, preset())
    start(pg); wait_listening(pg)
    t0 = now(pg)
    speak(pg, 'Ich möchte äh', final=True)
    pg.wait_for_timeout(1900)
    check('C', 'after "Ich möchte äh" + 1.9 s silence the tutor still waits', state(pg) == 'USER_SPEAKING', state(pg))
    speak(pg, 'einen Tee bitte')
    se = pg.evaluate('window.__speechEnd'); assert wait_state(pg, 'PROCESSING', 6000); tp = pnow(pg)
    last = pg.evaluate('__reqs.filter(r=>r.kind==="llm").slice(-1)[0].body.messages.slice(-1)[0].content')
    check('C', 'both parts form ONE learner turn', last == 'Ich möchte äh einen Tee bitte', last)
    check('C', 'complete sentence → turn ends promptly (~level hang)', tp - se < 1700, f'{round(tp - se)} ms after the learner stopped')
    wait_listening(pg)
    # trailing conjunction
    speak(pg, 'Ich trinke Tee weil'); pg.wait_for_timeout(1700)
    check('C', 'trailing "weil" is treated as unfinished', state(pg) == 'USER_SPEAKING', state(pg))
    speak(pg, 'er gesund ist'); wait_state(pg, 'PROCESSING', 6000)
    ctx.close()

def test_D(b):
    print('Test D — pronunciation', flush=True)
    ctx, pg = open_page(b, preset())
    start(pg); wait_listening(pg)
    speak(pg, 'Ich möchte ein Brotchen')
    assert wait_state(pg, 'AI_SPEAKING', 8000)
    pg.wait_for_timeout(2500); wait_listening(pg); pg.wait_for_timeout(200)
    wait_listening(pg)
    log = pg.inner_text('#log')
    check('D', 'hint: heard "Brotchen" → meant "Brötchen" with ö tip (+Tamil)', 'Brötchen' in log and 'ö:' in log and 'உதடுகளை' in log)
    check('D', 'honest label: hint comes from the recogniser', 'erkennt nicht jeden Aussprachefehler' in log)
    spoken = pg.evaluate('__reqs.filter(r=>r.kind==="tts").map(r=>r.body.input).join(" | ")')
    check('D', 'learning mode: tutor asks to repeat the word (spoken)', 'Aussprache: Brötchen' in spoken)
    speak(pg, 'Brötchen'); wait_state(pg, 'AI_SPEAKING', 6000); wait_listening(pg)
    check('D', 'repeat correctly → praise', '🌟' in pg.inner_text('#log') and 'Super, genau so' in pg.evaluate('__reqs.filter(r=>r.kind==="tts").map(r=>r.body.input).join(" | ")'))
    ctx.close()
    # guided lesson: word-by-word score
    ctx, pg = open_page(b, preset(mode='guided'))
    pg.click('#pathList [data-start="cafe"]'); wait_state(pg, 'AI_SPEAKING', 15000); wait_listening(pg)
    opt = pg.evaluate('S.script.turns[0].options[0].de')
    speak(pg, opt.replace('.', '').replace(',', '').replace('!', '').replace('?', ''))
    wait_state(pg, ['PROCESSING', 'AI_SPEAKING'], 6000); pg.wait_for_timeout(800)
    check('D', 'guided: spoken answer scored word by word', '%' in pg.inner_text('#log') and pg.locator('#log .ok-w').count() + pg.locator('#log .card').count() > 0, opt)
    ctx.close()

def test_E(b):
    print('Test E — level adaptation', flush=True)
    out = {}
    for lv in ('A1', 'B2'):
        ctx, pg = open_page(b, preset(level=lv))
        start(pg); wait_listening(pg)
        sysmsg = pg.evaluate('__reqs.filter(r=>r.kind==="llm")[0].body.messages[0].content')
        instr = pg.evaluate('__reqs.filter(r=>r.kind==="tts")[0].body.instructions')
        speak(pg, 'Ich möchte einen Kaffee bitte'); se = pg.evaluate('window.__speechEnd'); wait_state(pg, 'PROCESSING', 6000); tp = pnow(pg)
        out[lv] = {'sys': sysmsg, 'instr': instr, 'hang': tp - se, 'rate': pg.evaluate(f'DCCall.pace("{lv}").rate')}
        wait_listening(pg); ctx.close()
    check('E', 'prompt: A1 very simple (max 8 words) vs B2 native-like', 'max 8 words' in out['A1']['sys'] and 'native-like' in out['B2']['sys'])
    check('E', 'voice pace instruction differs (A1 slower/clearer, B2 natural)', out['A1']['instr'] != out['B2']['instr'], f"A1: …{out['A1']['instr'][-90:]} | B2: …{out['B2']['instr'][-90:]}")
    check('E', 'browser-voice rate A1 < B2', out['A1']['rate'] < out['B2']['rate'], f"{out['A1']['rate']} vs {out['B2']['rate']}")
    check('E', 'A1 learner gets more time before the tutor answers', out['A1']['hang'] > out['B2']['hang'] + 200, f"A1 {round(out['A1']['hang'])} ms, B2 {round(out['B2']['hang'])} ms")

def test_F(b):
    print('Test F — network failure', flush=True)
    ctx, pg = open_page(b, preset())
    start(pg); wait_listening(pg)
    pg.evaluate('window.__llmDelay = 250')
    speak(pg, 'Erzähl mir etwas über das Café')
    wait_state(pg, 'AI_SPEAKING', 8000); pg.wait_for_timeout(500)
    ctx.set_offline(True)
    ok = wait_state(pg, 'RECONNECTING', 3000)
    check('F', 'offline mid-reply → RECONNECTING + "Verbindung wird wiederhergestellt …"', ok and 'wiederhergestellt' in pg.inner_text('#notice') and pg.is_visible('#notice'), pg.inner_text('#statusText'))
    pg.wait_for_timeout(1500)
    check('F', 'stays calm while offline (no crash, no ERROR)', state(pg) == 'RECONNECTING')
    pg.evaluate('window.__llmDelay = 20')
    ctx.set_offline(False)
    ok = wait_state(pg, ['PROCESSING', 'AI_SPEAKING'], 5000)
    check('F', 'back online → turn retried automatically', ok); wait_listening(pg)
    # server error 503 → automatic retry
    pg.evaluate('window.__llmFail = 1'); n = pg.evaluate('__reqs.filter(r=>r.kind==="llm").length')
    t0 = now(pg); speak(pg, 'Ich möchte ein Brötchen'); wait_state(pg, 'AI_SPEAKING', 10000); wait_listening(pg)
    check('F', 'HTTP 503 → RECONNECTING → automatic retry succeeds', 'RECONNECTING' in states_since(pg, t0) and pg.evaluate('__reqs.filter(r=>r.kind==="llm").length') == n + 2)
    # TTS failure → browser voice fallback
    pg.evaluate('window.__ttsFail = true'); t0 = now(pg)
    speak(pg, 'Ich möchte bezahlen'); wait_state(pg, 'AI_SPEAKING', 10000)
    pg.wait_for_timeout(400)
    check('F', 'premium voice fails → browser voice takes over + notice', 'Browser-Stimme' in pg.inner_text('#noticeText'), pg.inner_text('#noticeText'))
    wait_listening(pg, 40000); pg.evaluate('window.__ttsFail = false')
    # invalid key
    pg.evaluate('window.__llmStatus = 401'); speak(pg, 'Hallo'); ok = wait_state(pg, 'ERROR', 6000)
    check('F', '401 → ERROR with key hint (no retry loop)', ok and 'Schlüssel' in pg.inner_text('#noticeText'))
    ctx.close()
    # mic denied
    ctx, pg = open_page(b, preset(mic_denied=True))
    start(pg); wait_listening(pg)
    check('F', 'mic denied → clear message, call continues, typing works', 'Mikrofon nicht erlaubt' in pg.inner_text('#noticeText') or 'Mikrofon' in pg.evaluate('document.getElementById("noticeText").textContent'))
    pg.fill('#input', 'Ich möchte einen Kaffee'); pg.press('#input', 'Enter')
    check('F', 'typed turn answered without microphone', wait_state(pg, 'AI_SPEAKING', 8000))
    ctx.close()

def test_G(b):
    print('Test G — mobile (390×844)', flush=True)
    ctx, pg = open_page(b, preset(), viewport={'width': 390, 'height': 844}, mobile=True)
    pg.screenshot(path=os.path.join(HERE, 'G_home.png'))
    start(pg)
    pg.wait_for_timeout(600)
    pg.screenshot(path=os.path.join(HERE, 'G_call.png'))
    m = pg.evaluate('''() => { const bs = [...document.querySelectorAll('.vc-controls .vcb')].map(b => b.getBoundingClientRect());
      return { n: bs.length, minW: Math.min(...bs.map(r => r.width)), minH: Math.min(...bs.map(r => r.height)), inView: bs.every(r => r.bottom <= innerHeight && r.right <= innerWidth && r.left >= 0),
        hscroll: document.documentElement.scrollWidth > innerWidth, rows: new Set(bs.map(r => Math.round(r.top + r.height / 2))).size, drawerHidden: document.getElementById('drawer').hidden }; }''')
    check('G', 'six thumb-sized controls (≥44 px) inside the screen', m['n'] == 6 and m['minW'] >= 44 and m['minH'] >= 44 and m['inView'] and m['rows'] == 1, json.dumps(m))
    check('G', 'no horizontal scroll; transcript closed by default', not m['hscroll'] and m['drawerHidden'])
    pg.click('#logBtn'); pg.wait_for_timeout(300)
    d = pg.evaluate("(() => { const r = document.getElementById('drawer').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, h: r.height, w: r.width }; })()")
    check('G', 'transcript opens as bottom sheet', abs(d['bottom'] - 844) < 2 and d['w'] >= 380 and d['h'] < 844, json.dumps(d))
    pg.screenshot(path=os.path.join(HERE, 'G_sheet.png'))
    pg.click('#drawerClose'); wait_listening(pg)
    speak(pg, 'Ich möchte einen Kaffee'); check('G', 'voice turn works on mobile', wait_state(pg, 'AI_SPEAKING', 8000))
    pg.click('#pauseBtn'); ok = state(pg) == 'PAUSED'; pg.click('#pauseBtn')
    check('G', 'pause / resume', ok and state(pg) == 'LISTENING')
    ctx.close()

def test_H(b):
    print('Test H — other providers (ElevenLabs timing, OpenAI STT, Simli fallback)', flush=True)
    ctx, pg = open_page(b, preset(voice='elevenlabs', extra={'dc_call_eleven_key': 'test-eleven'}))
    start(pg)
    pg.wait_for_timeout(250)
    tl = pg.evaluate('() => ({ n: ENG.avatar.timeline.length, first: ENG.avatar.timeline[0], now: ENG.avatar.player.ctx.currentTime })')
    check('H', 'ElevenLabs: per-character timestamps → viseme timeline', tl['n'] > 10, json.dumps(tl)[:160])
    shapes = pg.evaluate('() => new Promise(res => { const v = new Set(); const iv = setInterval(() => { v.add(ENG.avatar.m && Math.round(ENG.avatar.m.open * 10) + "/" + Math.round(ENG.avatar.m.round * 10)); }, 40); setTimeout(() => { clearInterval(iv); res([...v]); }, 1200); })')
    check('H', 'mouth follows the timeline (varied open/round shapes)', len(shapes) >= 5, f'{len(shapes)} shapes')
    rq = pg.evaluate('__reqs.filter(r => r.kind === "eleven")[0]')
    check('H', 'ElevenLabs flash model, German, pace from level', rq['body']['model_id'] == 'eleven_flash_v2_5' and rq['body']['language_code'] == 'de' and 'pcm_16000' in rq['url'] and 'EXAVITQu4vr4xnSDxMaL' in rq['url'])
    wait_listening(pg)
    # second sentence of a reply must be timed from its own start
    seg = pg.evaluate("""() => { const a = ENG.avatar; a.newSegment(); const f = new Float32Array(16000);
        a.speakChunk(f, 16000, { chars: ['H','a'], starts: [0, 0.1], ends: [0.1, 0.2] }); const s1 = a.utterStart;
        a.speakChunk(f, 16000, { chars: ['l','o'], starts: [0.2, 0.3], ends: [0.3, 0.4] });            // request-relative
        const tA = a.timeline.slice(-1)[0].t - s1;
        a.newSegment(); a.speakChunk(f, 16000, { chars: ['m','a'], starts: [0, 0.1], ends: [0.1, 0.2] }); const s2 = a.utterStart;
        a.speakChunk(f, 16000, { chars: ['m','a'], starts: [0, 0.1], ends: [0.1, 0.2] });              // chunk-relative
        const tB = a.timeline.slice(-1)[0].t - s2; a.stop(); return { tA, tB, gap: s2 - s1 }; }""")
    check('H', 'timeline base per sentence; request- and chunk-relative timestamps', abs(seg['tA'] - 0.3) < 0.01 and abs(seg['tB'] - 1.1) < 0.01 and seg['gap'] > 1.9, json.dumps(seg))
    ctx.close()
    # OpenAI transcription (no Web Speech): VAD cuts the utterance, WAV + lesson prompt
    ctx, pg = open_page(b, preset(extra={'dc_call_settings_v1': {'conv': 'learning', 'voice': 'openai', 'avatar': 'illustrated', 'stt': 'openai', 'captions': True, 'tamil': True, 'selfView': False}}))
    start(pg); wait_listening(pg)
    pg.evaluate("window.__sttText = 'Ich möchte ein Kaffee bitte'")
    speak(pg, 'x', final=False, lead=1500, wordMs=10)
    ok = wait_state(pg, ['PROCESSING', 'AI_SPEAKING'], 6000)
    st = pg.evaluate('__reqs.filter(r => r.kind === "stt")[0]')
    last = pg.evaluate('__reqs.filter(r=>r.kind==="llm").slice(-1)[0].body.messages.slice(-1)[0].content')
    check('H', 'OpenAI STT: utterance WAV (with pre-roll) → gpt-4o-mini-transcribe → turn', ok and st and st['model'] == 'gpt-4o-mini-transcribe' and st['lang'] == 'de' and st['size'] > 16000 * 2 * 1.4 and last == 'Ich möchte ein Kaffee bitte', json.dumps({k: st[k] for k in ('size', 'model', 'prompt')}) if st else 'no request')
    ctx.close()
    # Simli selected with a bad key → illustrated tutor, call continues
    ctx, pg = open_page(b, preset(extra={'dc_call_simli_key': 'bad', 'dc_call_settings_v1': {'conv': 'learning', 'voice': 'openai', 'avatar': 'simli', 'simliFace': 'face-1', 'stt': 'browser', 'captions': True, 'tamil': True, 'selfView': False}}))
    start(pg)
    check('H', 'Simli failure → notice + illustrated tutor, call continues', pg.evaluate('ENG.avatar.id') == 'illustrated' and 'Fotorealistischer Tutor nicht verfügbar' in pg.evaluate('document.getElementById("noticeText").textContent'), pg.evaluate('document.getElementById("noticeText").textContent')[:120])
    check('H', 'Simli SDK bundle loaded from the repo (no CDN)', pg.evaluate('!!(window.SimliSDK && SimliSDK.SimliClient && SimliSDK.generateSimliSessionToken)'))
    ctx.close()

with sync_playwright() as p:
    b = launch(p)
    for name in (sys.argv[1:] or ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']):
        try: globals()['test_' + name](b)
        except Exception as e: check(name, 'test crashed', False, repr(e)[:300])
    b.close()
_srv.shutdown()
print('\nconsole errors:', len(ERRORS)); [print('  ', e[:200]) for e in ERRORS[:20]]
fails = [r for r in RESULTS if not r[2]]
print(f'\n{len(RESULTS) - len(fails)}/{len(RESULTS)} checks passed · screenshots in {HERE}')
sys.exit(1 if fails or ERRORS else 0)
