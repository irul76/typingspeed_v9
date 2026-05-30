// ================================================================
// INTERACTIVE CODING TYPING LEARNING SYSTEM — coding-trainer.js
// TypeCraft Add-on Module
//
// FEATURES:
//   • Multi-language: HTML, CSS, JavaScript, Python
//   • 4 Modes: Practice, Memory, Typing Speed, Exam
//   • Procedural challenge generation (no repeated patterns)
//   • Split-screen: editor LEFT + live preview / console RIGHT
//   • Memory mode: view code → hidden → recall from memory
//   • Exam mode: no hints, accuracy grading, mastery score
//   • Smart mastery tracking + spaced repetition
//   • Syntax highlight display (color-coded chars)
//   • WPM / Accuracy / Memory Score / Mastery tracking
//   • Anti-monotony: random vars, functions, layouts, data
//
// HOW TO INTEGRATE:
//   1. Add nav item:
//      <div class="nav-item" onclick="navigate('codetyper')">
//        <span class="nav-icon">⌨️</span>
//        <span class="nav-label">Code Typer</span></div>
//
//   2. This script auto-patches sidebar, dashboard, PAGE_TITLES.
//
//   3. Load AFTER main scripts:
//      <script src="coding-trainer.js"></script>
// ================================================================
'use strict';

// ================================================================
// INJECT PAGE HTML
// ================================================================
(function injectCodeTyperPage() {
  const main = document.querySelector('.main');
  if (!main) { console.error('CodeTyper: .main not found'); return; }
  if (document.getElementById('page-codetyper')) return;

  const page = document.createElement('div');
  page.className = 'page';
  page.id = 'page-codetyper';
  page.innerHTML = `
<!-- ═══ CODE TYPER PAGE ═══ -->
<div class="ct-header">
  <div class="ct-title-row">
    <div>
      <h2 class="section-title" style="margin-bottom:4px">⌨️ Interactive Coding Trainer</h2>
      <div style="font-size:13px;color:var(--text3)">Typing · Memory · Speed · Exam — HTML, CSS, JavaScript, Python</div>
    </div>
    <div class="ct-header-stats">
      <div class="ct-stat-pill" id="ct-lang-pill">🌐 HTML</div>
      <div class="ct-stat-pill"><span id="ct-xp-val">0</span> XP</div>
      <div class="ct-stat-pill">🔥 <span id="ct-streak-val">0</span></div>
      <div class="ct-stat-pill">Lv <span id="ct-level-val">1</span></div>
    </div>
  </div>
  <div class="ct-xp-bar-wrap"><div class="ct-xp-bar" id="ct-xp-bar" style="width:0%"></div></div>
  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
    <span id="ct-rank-label">Novice Coder</span>
    <span><span id="ct-xp-cur">0</span> / <span id="ct-xp-nxt">300</span> XP to next level</span>
  </div>
</div>

<!-- Top Controls -->
<div class="ct-controls-row">
  <!-- Language Selector -->
  <div class="ct-seg-group" id="ct-lang-tabs">
    <button class="ct-seg active" data-lang="html" onclick="ctSetLang('html',this)">🌐 HTML</button>
    <button class="ct-seg" data-lang="css" onclick="ctSetLang('css',this)">🎨 CSS</button>
    <button class="ct-seg" data-lang="js" onclick="ctSetLang('js',this)">⚡ JS</button>
    <button class="ct-seg" data-lang="python" onclick="ctSetLang('python',this)">🐍 Python</button>
  </div>
  <!-- Level Selector -->
  <div class="ct-seg-group" id="ct-level-tabs">
    <button class="ct-seg active" data-level="beginner" onclick="ctSetLevel('beginner',this)">Beginner</button>
    <button class="ct-seg" data-level="intermediate" onclick="ctSetLevel('intermediate',this)">Inter.</button>
    <button class="ct-seg" data-level="advanced" onclick="ctSetLevel('advanced',this)">Advanced</button>
    <button class="ct-seg" data-level="expert" onclick="ctSetLevel('expert',this)">Expert</button>
    <button class="ct-seg" data-level="professional" onclick="ctSetLevel('professional',this)">Pro</button>
  </div>
  <!-- Mode Selector -->
  <div class="ct-seg-group" id="ct-mode-tabs">
    <button class="ct-seg active" data-mode="practice" onclick="ctSetMode('practice',this)" title="Ketik sambil lihat contoh">📖 Practice</button>
    <button class="ct-seg" data-mode="memory" onclick="ctSetMode('memory',this)" title="Hafalkan lalu ketik tanpa lihat">🧠 Memory</button>
    <button class="ct-seg" data-mode="speed" onclick="ctSetMode('speed',this)" title="Ketik secepat mungkin">⚡ Speed</button>
    <button class="ct-seg" data-mode="exam" onclick="ctSetMode('exam',this)" title="Tanpa hint, nilai kemampuanmu">🏆 Exam</button>
  </div>
  <button class="btn btn-primary btn-sm" onclick="ctNewChallenge()" style="flex-shrink:0">↺ New Challenge</button>
</div>

<!-- Mode Description Banner -->
<div class="ct-mode-banner" id="ct-mode-banner">
  <span id="ct-mode-icon">📖</span>
  <div>
    <div style="font-weight:700;font-size:13px" id="ct-mode-title">Practice Mode</div>
    <div style="font-size:12px;color:var(--text2)" id="ct-mode-desc">Ketik syntax sambil melihat contoh. Pelajari pola dan struktur kode.</div>
  </div>
  <div style="margin-left:auto;display:flex;gap:10px;align-items:center">
    <div class="ct-mini-stat"><span id="ct-stat-wpm">0</span><span class="ct-mini-label">WPM</span></div>
    <div class="ct-mini-stat"><span id="ct-stat-acc">100%</span><span class="ct-mini-label">Accuracy</span></div>
    <div class="ct-mini-stat"><span id="ct-stat-mem">—</span><span class="ct-mini-label">Memory</span></div>
    <div class="ct-mini-stat"><span id="ct-stat-prog">0%</span><span class="ct-mini-label">Progress</span></div>
  </div>
</div>

<!-- Memory Mode: Memorize Phase -->
<div class="ct-memorize-phase" id="ct-memorize-phase" style="display:none">
  <div class="ct-memorize-card">
    <div class="ct-mem-header">
      <span style="font-size:20px">🧠</span>
      <div>
        <div style="font-weight:700;font-size:14px">PHASE 1 — Pelajari Kode Ini</div>
        <div style="font-size:12px;color:var(--text2)">Baca dan hafalkan. Kode akan disembunyikan dalam <span id="ct-mem-countdown">10</span>s</div>
      </div>
      <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="ctStartMemoryRecall()">Siap! Sembunyikan →</button>
    </div>
    <div class="ct-mem-code-display" id="ct-mem-code-display"></div>
    <div class="ct-mem-progress-bar"><div class="ct-mem-progress-fill" id="ct-mem-progress-fill" style="width:100%"></div></div>
  </div>
</div>

<!-- MAIN SPLIT SCREEN -->
<div class="ct-split-screen" id="ct-split-screen">

  <!-- LEFT: Editor Panel -->
  <div class="ct-left-panel">

    <!-- Challenge Info -->
    <div class="ct-challenge-info" id="ct-challenge-info">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span class="ct-lang-badge" id="ct-lang-badge">HTML</span>
        <span class="ct-diff-badge" id="ct-diff-badge">Beginner</span>
        <span class="ct-topic-tag" id="ct-topic-tag">Structure</span>
        <span style="margin-left:auto;font-size:11px;color:var(--text3)" id="ct-challenge-num">#1</span>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px" id="ct-challenge-title">Loading challenge...</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6" id="ct-challenge-desc"></div>
    </div>

    <!-- Reference Code (Practice/Speed mode: visible; Memory/Exam: hidden) -->
    <div class="ct-reference-wrap" id="ct-reference-wrap">
      <div class="ct-ref-header">
        <span style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Reference Code</span>
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" id="ct-hint-btn" onclick="ctToggleHint()" title="Toggle hint">💡 Hint</button>
          <button class="btn btn-ghost btn-sm" onclick="ctCopyRef()">📋</button>
        </div>
      </div>
      <div class="ct-ref-code" id="ct-ref-code"></div>
      <!-- Syntax Explanation Panel (hover/active) -->
      <div class="ct-syntax-panel" id="ct-syntax-panel" style="display:none">
        <div style="font-size:11px;font-weight:700;color:var(--accent);margin-bottom:6px">📖 Syntax Explanation</div>
        <div id="ct-syntax-explain-content" style="font-size:12px;color:var(--text2);line-height:1.7"></div>
      </div>
    </div>

    <!-- Typing Area -->
    <div class="ct-typing-area">
      <div class="ct-typing-header">
        <span style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em" id="ct-typing-label">Type Here</span>
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="ctClearInput()">✕ Clear</button>
          <button class="btn btn-ghost btn-sm" onclick="ctCheckAnswer()" id="ct-check-btn">✓ Check</button>
        </div>
      </div>

      <!-- Typing Display (character-by-character highlight) -->
      <div class="ct-typing-display" id="ct-typing-display">
        <div style="color:var(--text3);font-size:13px;padding:12px">Mulai mengetik di bawah...</div>
      </div>

      <!-- Actual Input -->
      <textarea
        id="ct-input"
        class="ct-input"
        placeholder="Ketik kode di sini..."
        spellcheck="false"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        oninput="ctHandleInput()"
        onkeydown="ctHandleKeydown(event)"
      ></textarea>

      <!-- Result Bar -->
      <div class="ct-result-bar" id="ct-result-bar" style="display:none">
        <div class="ct-result-item good"><span id="ct-res-score">100%</span><span class="ct-res-label">Score</span></div>
        <div class="ct-result-item"><span id="ct-res-wpm">0</span><span class="ct-res-label">WPM</span></div>
        <div class="ct-result-item"><span id="ct-res-acc">100%</span><span class="ct-res-label">Accuracy</span></div>
        <div class="ct-result-item" id="ct-res-mem-wrap"><span id="ct-res-mem">—</span><span class="ct-res-label">Memory</span></div>
        <div class="ct-result-item"><span id="ct-res-time">0s</span><span class="ct-res-label">Time</span></div>
        <button class="btn btn-primary btn-sm" onclick="ctNewChallenge()" style="margin-left:auto">Next →</button>
      </div>
    </div>

    <!-- Mastery / Mistake Analysis -->
    <div class="ct-mastery-row" id="ct-mastery-row">
      <div class="ct-mastery-item" onclick="ctShowMasteryPanel()">
        <div style="font-size:11px;color:var(--text3);margin-bottom:4px">Mastery Tracker</div>
        <div class="ct-mastery-bar-wrap"><div class="ct-mastery-bar" id="ct-mastery-bar-fill" style="width:0%"></div></div>
        <div style="font-size:10px;color:var(--text3);margin-top:2px"><span id="ct-mastery-pct">0</span>% overall mastery</div>
      </div>
      <div style="font-size:12px;color:var(--text3)">
        Mistakes: <span id="ct-mistake-count" style="color:var(--red)">0</span> &nbsp;|&nbsp;
        Best WPM: <span id="ct-best-wpm" style="color:var(--accent2)">0</span> &nbsp;|&nbsp;
        Challenges: <span id="ct-challenges-done" style="color:var(--green)">0</span>
      </div>
    </div>

  </div><!-- /ct-left-panel -->

  <!-- DIVIDER (resizable) -->
  <div class="ct-divider" id="ct-divider" title="Drag to resize"></div>

  <!-- RIGHT: Preview / Output Panel -->
  <div class="ct-right-panel" id="ct-right-panel">
    <div class="ct-preview-header">
      <span class="panel-dot red"></span>
      <span class="panel-dot yellow"></span>
      <span class="panel-dot green"></span>
      <span style="margin-left:8px;font-size:12px;color:var(--text3)" id="ct-preview-label">Live Preview</span>
      <div style="margin-left:auto;display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="ctRefreshPreview()" title="Refresh">↺</button>
        <button class="btn btn-ghost btn-sm" onclick="ctToggleFullPreview()" title="Fullscreen">⛶</button>
      </div>
    </div>

    <!-- HTML/CSS Preview -->
    <iframe id="ct-preview-iframe" class="ct-preview-iframe" sandbox="allow-scripts" style="display:block"></iframe>

    <!-- JS/Python Console Output -->
    <div id="ct-console-output" class="ct-console-output" style="display:none">
      <div class="ct-console-header">
        <span style="font-size:11px;color:var(--text3)">Console Output</span>
        <button class="btn btn-ghost btn-sm" style="margin-left:auto;font-size:10px" onclick="ctClearConsole()">Clear</button>
      </div>
      <div id="ct-console-lines" class="ct-console-lines"></div>
    </div>

    <!-- Syntax Helper Panel (right side) -->
    <div class="ct-syntax-helper" id="ct-syntax-helper">
      <div style="font-size:11px;font-weight:700;color:var(--text3);padding:10px 14px 6px;text-transform:uppercase;letter-spacing:.08em">Syntax Helper</div>
      <div id="ct-syntax-helper-content" class="ct-syntax-helper-content"></div>
    </div>

  </div><!-- /ct-right-panel -->

</div><!-- /ct-split-screen -->

<!-- Mastery Panel (overlay) -->
<div class="ct-mastery-overlay" id="ct-mastery-overlay" style="display:none" onclick="ctHideMasteryPanel()">
  <div class="ct-mastery-panel" onclick="event.stopPropagation()">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:700">📊 Mastery Tracker</h3>
      <button class="btn btn-ghost btn-sm" onclick="ctHideMasteryPanel()">✕</button>
    </div>
    <div id="ct-mastery-grid" class="ct-mastery-grid"></div>
  </div>
</div>

<!-- Toast container (fallback) -->
<div id="ct-toast" class="ct-toast" style="display:none"></div>
`;
  main.appendChild(page);
  console.log('CodeTyper: Page injected ✓');
})();

// ================================================================
// INJECT CSS
// ================================================================
(function injectCodeTyperCSS() {
  const style = document.createElement('style');
  style.id = 'ct-styles';
  if (document.getElementById('ct-styles')) return;
  style.textContent = `
/* ── CODE TYPER STYLES ── */
#page-codetyper { display:none; flex-direction:column; gap:14px; }
#page-codetyper.active { display:flex; }

.ct-header{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 22px}
.ct-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap}
.ct-header-stats{display:flex;gap:8px;flex-wrap:wrap}
.ct-stat-pill{background:var(--bg3);border:1px solid var(--border);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:var(--font-data)}
.ct-xp-bar-wrap{background:var(--bg3);border-radius:4px;height:5px;overflow:hidden}
.ct-xp-bar{height:100%;background:linear-gradient(90deg,#7c6af7,#5de0c5);transition:width .5s}

/* Controls */
.ct-controls-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px}
.ct-seg-group{display:flex;gap:2px;background:var(--bg3);border-radius:8px;padding:3px}
.ct-seg{padding:5px 11px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;border:none;color:var(--text2);font-family:var(--font-ui);transition:all .15s;white-space:nowrap}
.ct-seg:hover{background:var(--bg2);color:var(--text)}
.ct-seg.active{background:var(--accent);color:#fff}

/* Mode Banner */
.ct-mode-banner{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.ct-mini-stat{display:flex;flex-direction:column;align-items:center;min-width:44px}
.ct-mini-stat span:first-child{font-size:18px;font-weight:700;font-family:var(--font-data);color:var(--accent)}
.ct-mini-label{font-size:10px;color:var(--text3);margin-top:1px}

/* Memory Phase */
.ct-memorize-phase{background:linear-gradient(135deg,rgba(124,106,247,.08),rgba(93,224,197,.05));border:1px solid rgba(124,106,247,.25);border-radius:var(--radius-lg);padding:20px}
.ct-memorize-card{}
.ct-mem-header{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap}
.ct-mem-code-display{font-family:var(--font-mono);font-size:13px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:16px;white-space:pre;overflow-x:auto;line-height:1.75;color:var(--text2);max-height:280px;overflow-y:auto}
.ct-mem-progress-bar{background:var(--bg3);border-radius:3px;height:4px;overflow:hidden;margin-top:10px}
.ct-mem-progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .1s linear}

/* Split Screen */
.ct-split-screen{display:grid;grid-template-columns:1fr 4px 1fr;gap:0;align-items:start;min-height:520px}
@media(max-width:900px){.ct-split-screen{grid-template-columns:1fr;}.ct-divider{display:none}.ct-right-panel{border-radius:var(--radius);margin-top:12px}}

.ct-left-panel{display:flex;flex-direction:column;gap:10px;padding-right:8px}
.ct-right-panel{display:flex;flex-direction:column;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;min-height:480px}

.ct-divider{width:4px;cursor:col-resize;background:var(--border);border-radius:2px;align-self:stretch;transition:background .15s;margin:0 4px}
.ct-divider:hover{background:var(--accent)}

/* Challenge Info */
.ct-challenge-info{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px}
.ct-lang-badge{background:rgba(124,106,247,.15);color:var(--accent);border:1px solid rgba(124,106,247,.25);padding:2px 9px;border-radius:12px;font-size:10px;font-weight:700;font-family:var(--font-mono)}
.ct-diff-badge{padding:2px 9px;border-radius:12px;font-size:10px;font-weight:700;font-family:var(--font-mono)}
.ct-diff-badge[data-d="beginner"]{background:rgba(93,224,160,.12);color:var(--green);border:1px solid rgba(93,224,160,.2)}
.ct-diff-badge[data-d="intermediate"]{background:rgba(247,185,106,.1);color:#f7b96a;border:1px solid rgba(247,185,106,.2)}
.ct-diff-badge[data-d="advanced"]{background:rgba(247,106,106,.1);color:var(--red);border:1px solid rgba(247,106,106,.2)}
.ct-diff-badge[data-d="expert"]{background:rgba(124,106,247,.12);color:var(--accent);border:1px solid rgba(124,106,247,.2)}
.ct-diff-badge[data-d="professional"]{background:linear-gradient(135deg,rgba(124,106,247,.15),rgba(93,224,197,.1));color:var(--accent2);border:1px solid rgba(93,224,197,.2)}
.ct-topic-tag{background:var(--bg3);color:var(--text3);border:1px solid var(--border);padding:2px 8px;border-radius:12px;font-size:10px;font-family:var(--font-mono)}

/* Reference Code */
.ct-reference-wrap{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.ct-ref-header{padding:8px 12px;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.ct-ref-code{font-family:var(--font-mono);font-size:13px;padding:14px;white-space:pre;overflow-x:auto;line-height:1.75;color:var(--text2);max-height:260px;overflow-y:auto;background:var(--bg)}

/* Syntax tokens */
.ct-ref-code .t-tag{color:#f28779}
.ct-ref-code .t-attr{color:#ffd580}
.ct-ref-code .t-val{color:#d5ff80}
.ct-ref-code .t-sel{color:#73d0ff}
.ct-ref-code .t-prop{color:#ffd580}
.ct-ref-code .t-num{color:#dfbfff}
.ct-ref-code .t-kw{color:#ff8f40}
.ct-ref-code .t-fn{color:#73d0ff}
.ct-ref-code .t-str{color:#d5ff80}
.ct-ref-code .t-cmt{color:#5c6773;font-style:italic}
.ct-ref-code .t-punct{color:#ccd7da}
.ct-ref-code .t-py-kw{color:#ff8f40}
.ct-ref-code .t-py-fn{color:#73d0ff}
.ct-ref-code .t-py-str{color:#d5ff80}
.ct-ref-code .t-py-num{color:#dfbfff}
.ct-ref-code .t-py-cmt{color:#5c6773;font-style:italic}

/* Syntax Panel */
.ct-syntax-panel{padding:10px 14px;background:rgba(124,106,247,.05);border-top:1px solid var(--border)}

/* Typing Area */
.ct-typing-area{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.ct-typing-header{padding:8px 12px;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.ct-typing-display{font-family:var(--font-mono);font-size:13px;padding:12px 14px;line-height:1.85;white-space:pre-wrap;word-break:break-all;min-height:100px;background:var(--bg);border-bottom:1px solid var(--border);overflow-y:auto;max-height:240px;user-select:none;cursor:text}
.ct-typing-display .ct-char{position:relative}
.ct-typing-display .ct-char.correct{color:var(--green)}
.ct-typing-display .ct-char.wrong{color:var(--red);background:rgba(247,106,106,.15);border-radius:2px}
.ct-typing-display .ct-char.current{border-left:2px solid var(--accent);animation:ct-blink .7s step-end infinite;color:var(--text)}
.ct-typing-display .ct-char.pending{color:var(--text3)}
.ct-typing-display .ct-char.newline::after{content:'↵';opacity:.3;font-size:10px}
@keyframes ct-blink{50%{border-color:transparent}}

.ct-input{width:100%;padding:12px 14px;font-family:var(--font-mono);font-size:13px;background:var(--bg2);border:none;color:var(--text);outline:none;resize:vertical;min-height:120px;line-height:1.75;caret-color:var(--accent);tab-size:2;border-top:1px solid var(--border)}
.ct-input:focus{background:var(--bg)}

/* Result Bar */
.ct-result-bar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(93,224,160,.06);border-top:1px solid rgba(93,224,160,.15);flex-wrap:wrap}
.ct-result-item{display:flex;flex-direction:column;align-items:center;min-width:48px}
.ct-result-item span:first-child{font-size:18px;font-weight:700;font-family:var(--font-data);color:var(--accent)}
.ct-result-item.good span:first-child{color:var(--green)}
.ct-res-label{font-size:10px;color:var(--text3);margin-top:1px}

/* Mastery Row */
.ct-mastery-row{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;cursor:pointer;transition:border-color .15s}
.ct-mastery-row:hover{border-color:rgba(124,106,247,.35)}
.ct-mastery-item{flex:1;min-width:140px}
.ct-mastery-bar-wrap{background:var(--bg3);border-radius:3px;height:5px;overflow:hidden;margin:4px 0}
.ct-mastery-bar{height:100%;background:linear-gradient(90deg,#7c6af7,#5de0c5);transition:width .6s}

/* Preview Panel */
.ct-preview-header{padding:8px 14px;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;flex-shrink:0}
.ct-preview-iframe{flex:1;background:#fff;border:none;width:100%;min-height:300px}
.ct-console-output{flex:1;display:flex;flex-direction:column;min-height:300px}
.ct-console-header{padding:8px 12px;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center}
.ct-console-lines{flex:1;padding:10px 12px;font-family:var(--font-mono);font-size:12px;line-height:1.7;overflow-y:auto;background:var(--bg)}
.ct-console-line{margin-bottom:3px;display:flex;gap:8px}
.ct-console-line.output{color:var(--text2)}
.ct-console-line.error{color:var(--red)}
.ct-console-line.info{color:var(--accent2)}
.ct-console-prefix{color:var(--text3);flex-shrink:0;font-size:10px;padding-top:2px}

/* Syntax Helper */
.ct-syntax-helper{border-top:1px solid var(--border);flex-shrink:0}
.ct-syntax-helper-content{padding:0 14px 12px;max-height:180px;overflow-y:auto}
.ct-sh-item{margin-bottom:8px;padding:6px 10px;background:var(--bg3);border-radius:6px;border-left:2px solid var(--accent)}
.ct-sh-token{font-family:var(--font-mono);font-size:11px;color:var(--accent2);font-weight:700;margin-bottom:2px}
.ct-sh-desc{font-size:11px;color:var(--text2);line-height:1.5}

/* Mastery Overlay */
.ct-mastery-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px}
.ct-mastery-panel{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;max-width:640px;width:100%;max-height:80vh;overflow-y:auto}
.ct-mastery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
.ct-mastery-card{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
.ct-mastery-card .mc-lang{font-size:10px;color:var(--text3);margin-bottom:2px}
.ct-mastery-card .mc-topic{font-size:12px;font-weight:600;color:var(--text);margin-bottom:6px}
.ct-mastery-card .mc-bar-w{background:var(--bg2);border-radius:3px;height:4px;overflow:hidden}
.ct-mastery-card .mc-bar-f{height:100%;border-radius:3px;transition:width .5s}
.ct-mastery-card .mc-pct{font-size:10px;color:var(--text3);margin-top:3px}

/* Toast */
.ct-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;padding:10px 22px;border-radius:12px;font-size:13px;font-weight:700;z-index:999;animation:ct-toast-in .3s ease;box-shadow:0 4px 20px rgba(124,106,247,.4);pointer-events:none;white-space:nowrap}
@keyframes ct-toast-in{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
`;
  document.head.appendChild(style);
})();

// ================================================================
// STATE
// ================================================================
const CT_STATE = {
  lang: 'html',
  level: 'beginner',
  mode: 'practice',           // practice | memory | speed | exam
  phase: 'typing',            // memorize | typing | result
  currentChallenge: null,
  typingStartTime: null,
  typingFinished: false,
  memCountdown: null,
  inputText: '',
  mistakes: 0,
  xp: 0,
  streak: 0,
  gameLevel: 1,
  bestWPM: 0,
  challengesDone: 0,
  // Mastery: { 'html-structure': { attempts:0, correct:0, avgAcc:0, avgMem:0, lastSeen: timestamp } }
  mastery: {},
  // Recent challenge hashes to avoid repetition
  recentHashes: [],
  livePreviewTimeout: null,
};

// XP thresholds
const CT_XP_LEVELS = [0, 300, 700, 1300, 2200, 3500, 5200, 7500, 10500, 15000, 20000];
const CT_RANKS = ['Novice Coder','Junior Dev','Code Apprentice','Syntax Learner','Code Explorer','Dev Craftsman','Senior Coder','Code Architect','Master Developer','Grand Code Master'];

// ================================================================
// PROCEDURAL CHALLENGE GENERATORS
// ================================================================

// ── Random data pools ──
const CT_NAMES    = ['Alice','Bob','Citra','Dian','Eko','Fatima','Gilang','Hana','Ivan','Julia','Kevin','Laila','Miko','Nadia','Oscar'];
const CT_ANIMALS  = ['cat','dog','rabbit','penguin','tiger','eagle','dolphin','wolf','fox','bear','deer','lion'];
const CT_COLORS   = ['crimson','teal','indigo','amber','slate','violet','emerald','rose','cyan','fuchsia','lime'];
const CT_PAGES    = ['Dashboard','Profile','Settings','Analytics','Reports','Notifications','Messages','Calendar','Tasks','Projects','Billing'];
const CT_SKILLS   = ['Python','JavaScript','TypeScript','React','Vue','Node.js','Docker','Git','SQL','MongoDB','AWS','Linux'];
const CT_PRODUCTS = ['Laptop','Headphones','Monitor','Keyboard','Mouse','Speaker','Camera','Tablet','Smartwatch','Charger'];
const CT_FOODS    = ['Nasi Goreng','Mie Ayam','Soto','Rendang','Bakso','Gado-gado','Pempek','Sate','Rawon','Nasi Padang'];
const CT_CSS_VALS = ['16px','1.5rem','bold','center','flex','grid','block','inline-flex','relative','absolute'];
const CT_VARS     = ['userData','itemList','totalCount','isActive','pageTitle','currentUser','apiResult','formData','buttonEl','navMenu'];
const CT_FN_NAMES = ['handleClick','fetchData','renderList','updateState','validateForm','toggleMenu','loadUsers','saveProfile','filterItems','sortArray'];
const CT_PY_VARS  = ['data','result','items','count','total','user','name','value','output','response'];
const CT_PY_FNS   = ['calculate','process','display','filter_list','get_data','update','create_user','sort_items','validate','format_output'];

function ctRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function ctRandN(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function ctRandItems(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ── Generate a challenge hash (to detect repetition) ──
function ctHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

// ================================================================
// HTML CHALLENGE GENERATORS
// ================================================================
const CT_HTML_GENERATORS = {
  beginner: [
    () => {
      const name = ctRand(CT_NAMES), hobby = ctRand(['coding','reading','gaming','cooking','hiking','drawing']);
      return {
        topic: 'Basic Structure', title: `Halaman Profil — ${name}`,
        desc: `Buat halaman HTML dasar untuk profil ${name} dengan nama, hobby, dan foto placeholder.`,
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>Profil ${name}</title>\n</head>\n<body>\n  <h1>${name}</h1>\n  <p>Hobby: ${hobby}</p>\n  <img src="https://picsum.photos/100/100" alt="Foto ${name}">\n</body>\n</html>`,
        preview: 'html', xp: 30,
      };
    },
    () => {
      const items = ctRandItems(CT_FOODS, 4);
      return {
        topic: 'Lists', title: 'Menu Makanan',
        desc: 'Buat halaman HTML dengan unordered list berisi menu makanan.',
        code: `<!DOCTYPE html>\n<html>\n<head><title>Menu</title></head>\n<body>\n  <h2>Menu Hari Ini</h2>\n  <ul>\n${items.map(f => `    <li>${f}</li>`).join('\n')}\n  </ul>\n</body>\n</html>`,
        preview: 'html', xp: 25,
      };
    },
    () => {
      const n = ctRandN(2, 4);
      const items = ctRandItems(CT_PAGES, n);
      return {
        topic: 'Navigation Links', title: 'Navbar Sederhana',
        desc: 'Buat navigasi HTML dengan link ke beberapa halaman.',
        code: `<!DOCTYPE html>\n<html>\n<head><title>Navbar</title></head>\n<body>\n  <nav>\n${items.map(p => `    <a href="${p.toLowerCase()}.html">${p}</a>`).join('\n')}\n  </nav>\n  <main>\n    <h1>Selamat Datang</h1>\n  </main>\n</body>\n</html>`,
        preview: 'html', xp: 30,
      };
    },
    () => {
      const page = ctRand(CT_PAGES), color = ctRand(CT_COLORS);
      return {
        topic: 'Semantic HTML', title: `Halaman ${page}`,
        desc: 'Gunakan elemen semantik HTML5: header, main, footer.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>${page}</title>\n</head>\n<body>\n  <header>\n    <h1>${page}</h1>\n    <nav><a href="#">Home</a> | <a href="#">About</a></nav>\n  </header>\n  <main>\n    <article>\n      <h2>Selamat Datang</h2>\n      <p>Ini halaman ${page.toLowerCase()} kami.</p>\n    </article>\n  </main>\n  <footer>\n    <p>&copy; 2024 MyApp</p>\n  </footer>\n</body>\n</html>`,
        preview: 'html', xp: 35,
      };
    },
    () => {
      const headers = ctRandItems(CT_SKILLS, 3);
      return {
        topic: 'Table', title: 'Tabel Skill Level',
        desc: 'Buat tabel HTML yang menampilkan skill dan level.',
        code: `<!DOCTYPE html>\n<html>\n<head><title>Skills</title></head>\n<body>\n  <table border="1">\n    <thead>\n      <tr><th>Skill</th><th>Level</th><th>Tahun</th></tr>\n    </thead>\n    <tbody>\n${headers.map((s,i) => `      <tr><td>${s}</td><td>${['Beginner','Intermediate','Advanced'][i%3]}</td><td>${2022+i}</td></tr>`).join('\n')}\n    </tbody>\n  </table>\n</body>\n</html>`,
        preview: 'html', xp: 40,
      };
    },
  ],
  intermediate: [
    () => {
      const name = ctRand(CT_NAMES), page = ctRand(CT_PAGES), color = ctRand(CT_COLORS);
      return {
        topic: 'HTML Form', title: `Form Login — ${page}`,
        desc: 'Buat form login lengkap dengan username, password, dan tombol submit.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>Login ${page}</title>\n</head>\n<body>\n  <main>\n    <h2>Login ke ${page}</h2>\n    <form action="/login" method="post">\n      <div>\n        <label for="username">Username:</label>\n        <input type="text" id="username" name="username" required placeholder="Masukkan username">\n      </div>\n      <div>\n        <label for="password">Password:</label>\n        <input type="password" id="password" name="password" required>\n      </div>\n      <div>\n        <input type="checkbox" id="remember" name="remember">\n        <label for="remember">Ingat saya</label>\n      </div>\n      <button type="submit">Login</button>\n    </form>\n  </main>\n</body>\n</html>`,
        preview: 'html', xp: 55,
      };
    },
    () => {
      const products = ctRandItems(CT_PRODUCTS, 3);
      const prices = products.map(() => ctRandN(100, 999) * 1000);
      return {
        topic: 'Product Card', title: 'Daftar Produk',
        desc: 'Buat layout produk dengan gambar, nama, dan harga.',
        code: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Produk</title>\n  <style>\n    .card-grid { display:flex; gap:16px; flex-wrap:wrap; }\n    .card { border:1px solid #ddd; padding:16px; border-radius:8px; width:200px; }\n    img { width:100%; border-radius:4px; }\n  </style>\n</head>\n<body>\n  <h1>Produk Kami</h1>\n  <div class="card-grid">\n${products.map((p,i) => `    <div class="card">\n      <img src="https://picsum.photos/200/150?random=${i+10}" alt="${p}">\n      <h3>${p}</h3>\n      <p>Rp ${prices[i].toLocaleString('id')}</p>\n      <button>Beli</button>\n    </div>`).join('\n')}\n  </div>\n</body>\n</html>`,
        preview: 'html', xp: 60,
      };
    },
    () => {
      const name = ctRand(CT_NAMES), skills = ctRandItems(CT_SKILLS, 4);
      return {
        topic: 'Profile Card', title: `CV ${name}`,
        desc: 'Buat halaman CV dengan info, skill list, dan section pengalaman.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>CV ${name}</title>\n</head>\n<body>\n  <header>\n    <img src="https://picsum.photos/80/80?random=5" alt="Foto ${name}" style="border-radius:50%">\n    <h1>${name}</h1>\n    <p>Full Stack Developer</p>\n  </header>\n  <section>\n    <h2>Keahlian</h2>\n    <ul>\n${skills.map(s => `      <li>${s}</li>`).join('\n')}\n    </ul>\n  </section>\n  <section>\n    <h2>Pengalaman</h2>\n    <article>\n      <h3>Senior Developer — TechCorp</h3>\n      <time>2021 – Sekarang</time>\n      <p>Mengembangkan aplikasi web dengan teknologi modern.</p>\n    </article>\n  </section>\n</body>\n</html>`,
        preview: 'html', xp: 60,
      };
    },
  ],
  advanced: [
    () => {
      const page = ctRand(CT_PAGES), color = ctRand(CT_COLORS);
      return {
        topic: 'Accessible Form', title: `Form ${page} — Accessible`,
        desc: 'Buat form HTML dengan aria labels, fieldset, legend, dan atribut aksesibilitas.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>${page} Form</title>\n</head>\n<body>\n  <main>\n    <h1>${page}</h1>\n    <form aria-label="Form ${page}" novalidate>\n      <fieldset>\n        <legend>Informasi Pribadi</legend>\n        <div role="group">\n          <label for="fname">Nama Depan <span aria-hidden="true">*</span></label>\n          <input\n            type="text"\n            id="fname"\n            name="fname"\n            required\n            aria-required="true"\n            aria-describedby="fname-hint"\n          >\n          <span id="fname-hint" class="hint">Minimal 2 karakter</span>\n        </div>\n        <div role="group">\n          <label for="email">Email</label>\n          <input type="email" id="email" name="email" autocomplete="email">\n        </div>\n      </fieldset>\n      <button type="submit" aria-label="Kirim form ${page.toLowerCase()}">Kirim</button>\n    </form>\n  </main>\n</body>\n</html>`,
        preview: 'html', xp: 80,
      };
    },
    () => {
      const cols = ctRandItems(CT_SKILLS, 4);
      return {
        topic: 'Complex Table', title: 'Tabel Perbandingan Skill',
        desc: 'Buat tabel dengan thead, tbody, tfoot, colspan, dan scope.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>Skill Matrix</title>\n</head>\n<body>\n  <table>\n    <caption>Skill Comparison Matrix</caption>\n    <thead>\n      <tr>\n        <th scope="col">Kategori</th>\n${cols.map(c => `        <th scope="col">${c}</th>`).join('\n')}\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <th scope="row">Syntax</th>\n${cols.map(() => `        <td>${ctRand(['★★★★★','★★★★','★★★','★★'])}</td>`).join('\n')}\n      </tr>\n      <tr>\n        <th scope="row">Libraries</th>\n${cols.map(() => `        <td>${ctRandN(10,200)}+</td>`).join('\n')}\n      </tr>\n    </tbody>\n    <tfoot>\n      <tr>\n        <td colspan="${cols.length + 1}" style="text-align:right">Data per Q4 2024</td>\n      </tr>\n    </tfoot>\n  </table>\n</body>\n</html>`,
        preview: 'html', xp: 85,
      };
    },
  ],
  expert: [
    () => {
      const page = ctRand(CT_PAGES);
      return {
        topic: 'Dashboard Skeleton', title: `Dashboard ${page} — Full Structure`,
        desc: 'Buat struktur HTML dashboard lengkap dengan sidebar, header, dan main content area.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>${page} Dashboard</title>\n</head>\n<body>\n  <div class="app-shell">\n    <aside class="sidebar" aria-label="Navigasi utama">\n      <div class="sidebar-logo">\n        <span aria-hidden="true">⚡</span>\n        <strong>AppName</strong>\n      </div>\n      <nav role="navigation">\n        <ul>\n          <li><a href="#" aria-current="page" class="active">Dashboard</a></li>\n          <li><a href="#">${page}</a></li>\n          <li><a href="#">Settings</a></li>\n          <li><a href="#">Logout</a></li>\n        </ul>\n      </nav>\n    </aside>\n    <div class="main-area">\n      <header role="banner">\n        <h1>${page} Overview</h1>\n        <div class="header-actions">\n          <button aria-label="Notifikasi (3 baru)" data-count="3">🔔</button>\n          <img src="https://picsum.photos/32/32?random=99" alt="Avatar pengguna" class="avatar">\n        </div>\n      </header>\n      <main id="main-content" tabindex="-1">\n        <section aria-labelledby="stats-heading">\n          <h2 id="stats-heading">Statistik</h2>\n          <div class="stats-grid">\n            <div class="stat-card"><span>Total Users</span><strong>12,450</strong></div>\n            <div class="stat-card"><span>Revenue</span><strong>Rp 48.5M</strong></div>\n            <div class="stat-card"><span>Growth</span><strong>+23%</strong></div>\n          </div>\n        </section>\n      </main>\n    </div>\n  </div>\n</body>\n</html>`,
        preview: 'html', xp: 120,
      };
    },
  ],
  professional: [
    () => {
      const page = ctRand(CT_PAGES);
      return {
        topic: 'SaaS Landing Page', title: `${page} SaaS — Landing Page`,
        desc: 'Buat struktur HTML lengkap SaaS landing page dengan hero, features, pricing, dan CTA.',
        code: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <meta name="description" content="${page} — Platform terbaik untuk tim modern">\n  <title>${page} — Solusi Terbaik</title>\n  <link rel="canonical" href="https://example.com">\n</head>\n<body>\n  <!-- Skip link for accessibility -->\n  <a href="#main" class="skip-link">Skip to content</a>\n\n  <header role="banner">\n    <nav role="navigation" aria-label="Main navigation">\n      <a href="/" class="logo" aria-label="${page} home">${page}</a>\n      <ul role="list">\n        <li><a href="#features">Features</a></li>\n        <li><a href="#pricing">Pricing</a></li>\n        <li><a href="#about">About</a></li>\n      </ul>\n      <a href="/signup" class="btn-cta">Get Started Free</a>\n    </nav>\n  </header>\n\n  <main id="main" tabindex="-1">\n    <section class="hero" aria-labelledby="hero-title">\n      <h1 id="hero-title">${page} untuk Tim Modern</h1>\n      <p class="hero-sub">Tingkatkan produktivitas tim hingga 10x.</p>\n      <div class="cta-group">\n        <a href="/signup" class="btn-primary">Coba Gratis 14 Hari</a>\n        <a href="/demo" class="btn-secondary">Lihat Demo</a>\n      </div>\n    </section>\n\n    <section id="features" aria-labelledby="features-title">\n      <h2 id="features-title">Fitur Unggulan</h2>\n      <div class="features-grid" role="list">\n        <article role="listitem">\n          <span aria-hidden="true">🚀</span>\n          <h3>Performa Tinggi</h3>\n          <p>99.9% uptime dengan infrastruktur cloud terdistribusi.</p>\n        </article>\n        <article role="listitem">\n          <span aria-hidden="true">🔒</span>\n          <h3>Keamanan Enterprise</h3>\n          <p>Enkripsi end-to-end dan compliance SOC2 Type II.</p>\n        </article>\n      </div>\n    </section>\n  </main>\n\n  <footer role="contentinfo">\n    <p>&copy; 2024 ${page}. All rights reserved.</p>\n    <nav aria-label="Footer navigation">\n      <a href="/privacy">Privacy</a>\n      <a href="/terms">Terms</a>\n    </nav>\n  </footer>\n</body>\n</html>`,
        preview: 'html', xp: 160,
      };
    },
  ],
};

// ================================================================
// CSS CHALLENGE GENERATORS
// ================================================================
const CT_CSS_GENERATORS = {
  beginner: [
    () => {
      const color = ctRand(CT_COLORS), size = ctRandN(14, 20);
      return {
        topic: 'Selectors & Properties', title: 'Styling Dasar',
        desc: 'Buat CSS untuk body, heading, dan paragraf dengan font, color, dan spacing.',
        code: `/* Global Reset */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: 'Segoe UI', system-ui, sans-serif;\n  font-size: ${size}px;\n  line-height: 1.6;\n  color: #333;\n  background: #f9f9f9;\n  padding: 24px;\n}\n\nh1 {\n  font-size: 2em;\n  color: ${color};\n  margin-bottom: 0.5em;\n  border-bottom: 2px solid ${color};\n  padding-bottom: 8px;\n}\n\np {\n  margin-bottom: 1em;\n  color: #555;\n}`,
        preview: 'css', xp: 30,
      };
    },
    () => {
      const bg = ctRand(['#4f46e5','#0ea5e9','#10b981','#f59e0b','#ef4444']);
      return {
        topic: 'Box Model', title: 'Card Component',
        desc: 'Buat CSS card dengan padding, border, border-radius, dan box-shadow.',
        code: `.card {\n  background: white;\n  padding: 24px;\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);\n  max-width: 360px;\n  margin: 20px auto;\n}\n\n.card-title {\n  font-size: 1.25rem;\n  font-weight: 700;\n  color: #1a202c;\n  margin-bottom: 8px;\n}\n\n.card-body {\n  font-size: 0.9rem;\n  color: #718096;\n  line-height: 1.6;\n}\n\n.card-btn {\n  display: inline-block;\n  margin-top: 16px;\n  padding: 10px 20px;\n  background: ${bg};\n  color: white;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  border: none;\n}`,
        preview: 'css', xp: 35,
      };
    },
  ],
  intermediate: [
    () => {
      const cols = ctRandN(2, 4);
      return {
        topic: 'Flexbox', title: `Flexbox — ${cols}-Column Layout`,
        desc: `Buat layout ${cols} kolom menggunakan flexbox dengan gap, wrapping, dan alignment.`,
        code: `.flex-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  padding: 20px;\n  align-items: stretch;\n  justify-content: space-between;\n}\n\n.flex-item {\n  flex: 1;\n  min-width: calc(${100/cols}% - 12px);\n  background: white;\n  border-radius: 10px;\n  padding: 20px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n}\n\n.flex-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(0,0,0,0.12);\n  transition: all 0.2s ease;\n}\n\n.flex-item h3 {\n  font-size: 1rem;\n  margin-bottom: 8px;\n  color: #1a202c;\n}`,
        preview: 'css', xp: 55,
      };
    },
    () => {
      const rows = ctRandN(2, 3), cols = ctRandN(2, 4);
      return {
        topic: 'CSS Grid', title: `Grid Layout ${rows}×${cols}`,
        desc: `Buat CSS Grid layout ${rows} baris × ${cols} kolom dengan template areas.`,
        code: `.grid-layout {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: auto;\n  gap: 16px;\n  padding: 20px;\n}\n\n.grid-header {\n  grid-column: 1 / -1;\n  background: #667eea;\n  color: white;\n  padding: 20px;\n  border-radius: 10px;\n  text-align: center;\n}\n\n.grid-sidebar {\n  grid-column: 1 / 2;\n  grid-row: 2 / ${rows + 2};\n  background: #f7fafc;\n  padding: 16px;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n}\n\n.grid-main {\n  grid-column: 2 / -1;\n  padding: 16px;\n  background: white;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n}\n\n.grid-footer {\n  grid-column: 1 / -1;\n  padding: 12px 20px;\n  text-align: center;\n  color: #718096;\n  font-size: 0.875rem;\n}`,
        preview: 'css', xp: 65,
      };
    },
    () => {
      const color = ctRand(['#4f46e5','#0ea5e9','#10b981','#f59e0b']);
      return {
        topic: 'CSS Animation', title: 'Animated Button',
        desc: 'Buat CSS tombol dengan hover effect, transition, dan keyframe animation.',
        code: `.btn-animated {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 28px;\n  background: ${color};\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  transition: all 0.3s ease;\n}\n\n.btn-animated::before {\n  content: '';\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  background: rgba(255,255,255,0.2);\n  border-radius: 50%;\n  transform: translate(-50%,-50%);\n  transition: width 0.5s, height 0.5s;\n}\n\n.btn-animated:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(0,0,0,0.2);\n}\n\n.btn-animated:hover::before {\n  width: 300px;\n  height: 300px;\n}\n\n@keyframes pulse {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }\n  50% { box-shadow: 0 0 0 8px rgba(0,0,0,0); }\n}`,
        preview: 'css', xp: 70,
      };
    },
  ],
  advanced: [
    () => {
      const accent = ctRand(['#6366f1','#8b5cf6','#ec4899','#14b8a6']);
      return {
        topic: 'Glassmorphism', title: 'Glass Card UI',
        desc: 'Buat komponen dengan efek glassmorphism: backdrop-filter, transparency, dan blur.',
        code: `body {\n  min-height: 100vh;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: system-ui, sans-serif;\n}\n\n.glass-card {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  border: 1px solid rgba(255, 255, 255, 0.25);\n  border-radius: 20px;\n  padding: 32px;\n  max-width: 400px;\n  width: 100%;\n  color: white;\n  box-shadow:\n    0 8px 32px rgba(31, 38, 135, 0.37),\n    inset 0 1px 0 rgba(255,255,255,0.3);\n}\n\n.glass-card h2 {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n  text-shadow: 0 1px 3px rgba(0,0,0,0.2);\n}\n\n.glass-input {\n  width: 100%;\n  padding: 12px 16px;\n  background: rgba(255,255,255,0.2);\n  border: 1px solid rgba(255,255,255,0.3);\n  border-radius: 10px;\n  color: white;\n  font-size: 0.9rem;\n  outline: none;\n  margin-bottom: 12px;\n  transition: background 0.2s;\n}\n\n.glass-input:focus {\n  background: rgba(255,255,255,0.3);\n}`,
        preview: 'css', xp: 90,
      };
    },
    () => {
      return {
        topic: 'CSS Variables', title: 'Design System Tokens',
        desc: 'Buat sistem CSS variables untuk design tokens: colors, spacing, typography, shadows.',
        code: `:root {\n  /* Colors */\n  --color-primary: #6366f1;\n  --color-primary-dark: #4f46e5;\n  --color-success: #10b981;\n  --color-warning: #f59e0b;\n  --color-danger: #ef4444;\n  --color-text: #1f2937;\n  --color-text-muted: #6b7280;\n  --color-bg: #f9fafb;\n  --color-surface: #ffffff;\n  --color-border: #e5e7eb;\n\n  /* Spacing */\n  --space-xs: 4px;\n  --space-sm: 8px;\n  --space-md: 16px;\n  --space-lg: 24px;\n  --space-xl: 40px;\n\n  /* Typography */\n  --font-sans: 'Inter', system-ui, sans-serif;\n  --font-mono: 'Fira Code', monospace;\n  --text-sm: 0.875rem;\n  --text-base: 1rem;\n  --text-lg: 1.125rem;\n  --text-xl: 1.5rem;\n\n  /* Shadows */\n  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);\n  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);\n  --shadow-lg: 0 10px 30px rgba(0,0,0,0.15);\n\n  /* Radius */\n  --radius-sm: 4px;\n  --radius-md: 8px;\n  --radius-lg: 16px;\n  --radius-full: 9999px;\n}\n\n.btn {\n  background: var(--color-primary);\n  color: white;\n  padding: var(--space-sm) var(--space-md);\n  border-radius: var(--radius-md);\n  font-family: var(--font-sans);\n  font-size: var(--text-sm);\n  box-shadow: var(--shadow-sm);\n}`,
        preview: 'css', xp: 100,
      };
    },
  ],
  expert: [
    () => {
      return {
        topic: 'Neon UI', title: 'Neon Glow Dashboard Card',
        desc: 'Buat dark card dengan neon glow effect menggunakan CSS box-shadow dan text-shadow.',
        code: `body {\n  background: #0a0a1a;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  font-family: 'Courier New', monospace;\n}\n\n.neon-card {\n  background: rgba(10, 10, 30, 0.9);\n  border: 1px solid rgba(0, 255, 200, 0.3);\n  border-radius: 16px;\n  padding: 32px;\n  max-width: 400px;\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n}\n\n.neon-card::before {\n  content: '';\n  position: absolute;\n  inset: -1px;\n  background: linear-gradient(45deg, #00ffc8, #7c6af7, #ff6b9d, #00ffc8);\n  background-size: 300%;\n  border-radius: 17px;\n  z-index: -1;\n  animation: neon-border 4s linear infinite;\n  opacity: 0.5;\n}\n\n@keyframes neon-border {\n  0% { background-position: 0% 50%; }\n  100% { background-position: 300% 50%; }\n}\n\n.neon-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #00ffc8;\n  text-shadow:\n    0 0 10px rgba(0,255,200,0.8),\n    0 0 20px rgba(0,255,200,0.5),\n    0 0 40px rgba(0,255,200,0.3);\n  margin-bottom: 16px;\n}\n\n.neon-value {\n  font-size: 2.5rem;\n  font-weight: 900;\n  color: #7c6af7;\n  text-shadow:\n    0 0 15px rgba(124,106,247,0.9),\n    0 0 30px rgba(124,106,247,0.6);\n}`,
        preview: 'css', xp: 130,
      };
    },
  ],
  professional: [
    () => {
      return {
        topic: 'Modern Architecture', title: 'CSS Architecture — BEM + Tokens',
        desc: 'Implementasi CSS arsitektur profesional dengan BEM naming, custom properties, dan responsive design.',
        code: `/* ============================================\n   DESIGN TOKENS\n============================================ */\n:root {\n  --c-brand: #6366f1;\n  --c-brand-light: #a5b4fc;\n  --c-brand-dark: #4f46e5;\n  --c-surface-1: #ffffff;\n  --c-surface-2: #f8fafc;\n  --c-surface-3: #f1f5f9;\n  --c-text-primary: #0f172a;\n  --c-text-secondary: #475569;\n  --c-border: #e2e8f0;\n  --transition-fast: 150ms ease;\n  --transition-base: 300ms ease;\n}\n\n/* ============================================\n   BLOCK: Dashboard Card\n============================================ */\n.dashboard-card {\n  --card-padding: clamp(16px, 3vw, 28px);\n  background: var(--c-surface-1);\n  border: 1px solid var(--c-border);\n  border-radius: 16px;\n  padding: var(--card-padding);\n  container-type: inline-size;\n  transition: box-shadow var(--transition-base),\n              transform var(--transition-fast);\n}\n\n.dashboard-card:hover {\n  box-shadow: 0 20px 48px -12px rgba(0,0,0,0.15);\n  transform: translateY(-2px);\n}\n\n/* Element */\n.dashboard-card__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 20px;\n}\n\n.dashboard-card__title {\n  font-size: clamp(0.875rem, 2cqi, 1.125rem);\n  font-weight: 700;\n  color: var(--c-text-primary);\n  letter-spacing: -0.02em;\n}\n\n.dashboard-card__value {\n  font-size: clamp(1.5rem, 5cqi, 2.25rem);\n  font-weight: 800;\n  color: var(--c-brand);\n  font-variant-numeric: tabular-nums;\n}\n\n/* Modifier */\n.dashboard-card--highlight {\n  border-color: var(--c-brand-light);\n  background: linear-gradient(135deg,\n    rgba(99,102,241,0.04),\n    rgba(99,102,241,0.01));\n}`,
        preview: 'css', xp: 170,
      };
    },
  ],
};

// ================================================================
// JAVASCRIPT CHALLENGE GENERATORS
// ================================================================
const CT_JS_GENERATORS = {
  beginner: [
    () => {
      const fn = ctRand(CT_FN_NAMES), v = ctRand(CT_VARS);
      return {
        topic: 'DOM Manipulation', title: `Function ${fn}`,
        desc: 'Manipulasi DOM: querySelector, textContent, classList, dan event listener.',
        code: `// DOM Manipulation — ${fn}\nconst ${v} = document.querySelector('#app');\n\nfunction ${fn}(text) {\n  const el = document.createElement('div');\n  el.classList.add('item', 'active');\n  el.textContent = text;\n  el.style.padding = '12px';\n  el.style.marginBottom = '8px';\n  ${v}.appendChild(el);\n}\n\n// Tambahkan event listener\ndocument.querySelector('#btn').addEventListener('click', () => {\n  const input = document.querySelector('#input');\n  if (input.value.trim()) {\n    ${fn}(input.value);\n    input.value = '';\n  }\n});\n\n// Init\n${fn}('Item pertama');`,
        preview: 'js', xp: 45,
      };
    },
    () => {
      const arr = ctRandItems(CT_NAMES, 4);
      const fn = ctRand(['filter','map','find','reduce','forEach','some','every']);
      return {
        topic: `Array.${fn}`, title: `Array Method — ${fn}`,
        desc: `Gunakan array method ${fn} untuk memproses daftar data.`,
        code: `// Array Method: ${fn}\nconst users = [\n${arr.map((n,i) => `  { name: '${n}', age: ${20+i*3}, active: ${i%2===0} }`).join(',\n')}\n];\n\n// ${fn === 'filter' ? 'Filter hanya user yang aktif' : fn === 'map' ? 'Map ke array nama saja' : fn === 'find' ? 'Cari user bernama ' + arr[0] : fn === 'forEach' ? 'Log setiap user' : 'Proses data'}\nconst result = users.${fn}(${
          fn === 'filter' ? 'user => user.active' :
          fn === 'map' ? 'user => user.name.toUpperCase()' :
          fn === 'find' ? `user => user.name === '${arr[0]}'` :
          fn === 'reduce' ? '(acc, user) => acc + user.age, 0' :
          fn === 'forEach' ? 'user => console.log(user.name)' :
          fn === 'some' ? 'user => user.age > 25' :
          'user => user.active'
        });\n\nconsole.log('Result:', result);\nconsole.log('Total users:', users.length);`,
        preview: 'js', xp: 40,
      };
    },
  ],
  intermediate: [
    () => {
      const fn = ctRand(CT_FN_NAMES), entity = ctRand(['users','products','posts','orders']);
      return {
        topic: 'Async/Await + Fetch', title: `Fetch ${entity} dari API`,
        desc: 'Gunakan async/await dan fetch untuk mengambil data dari API.',
        code: `// Async/Await — Fetch ${entity}\nconst API_URL = 'https://jsonplaceholder.typicode.com/${entity}';\n\nasync function ${fn}() {\n  const loadingEl = document.querySelector('#loading');\n  const containerEl = document.querySelector('#container');\n\n  try {\n    loadingEl.textContent = 'Memuat ${entity}...';\n    loadingEl.style.display = 'block';\n\n    const response = await fetch(API_URL);\n\n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`);\n    }\n\n    const data = await response.json();\n    const items = data.slice(0, 5);\n\n    containerEl.innerHTML = items\n      .map(item => \`<div class="item">\n        <strong>\${item.id}.</strong>\n        \${item.title || item.name}\n      </div>\`)\n      .join('');\n\n  } catch (error) {\n    containerEl.innerHTML = \`<p class="error">Error: \${error.message}</p>\`;\n    console.error('Fetch error:', error);\n  } finally {\n    loadingEl.style.display = 'none';\n  }\n}\n\n${fn}();`,
        preview: 'js', xp: 70,
      };
    },
    () => {
      const varName = ctRand(CT_VARS), fn = ctRand(CT_FN_NAMES);
      return {
        topic: 'localStorage', title: 'Penyimpanan Data Lokal',
        desc: 'Simpan dan ambil data dari localStorage dengan JSON.',
        code: `// localStorage Manager\nconst STORAGE_KEY = '${varName}_data';\n\nfunction ${fn}Save(data) {\n  try {\n    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));\n    return true;\n  } catch (e) {\n    console.error('Save error:', e);\n    return false;\n  }\n}\n\nfunction ${fn}Load() {\n  try {\n    const raw = localStorage.getItem(STORAGE_KEY);\n    return raw ? JSON.parse(raw) : null;\n  } catch (e) {\n    console.error('Load error:', e);\n    return null;\n  }\n}\n\nfunction ${fn}Clear() {\n  localStorage.removeItem(STORAGE_KEY);\n  console.log('Storage cleared');\n}\n\n// Demo\nconst ${varName} = { user: '${ctRand(CT_NAMES)}', count: ${ctRandN(1,100)}, active: true };\n${fn}Save(${varName});\n\nconst loaded = ${fn}Load();\nconsole.log('Loaded:', loaded);\nconsole.log('Name:', loaded?.user);`,
        preview: 'js', xp: 65,
      };
    },
    () => {
      const fn = ctRand(CT_FN_NAMES);
      return {
        topic: 'Form Validation', title: 'Validasi Form — Real-time',
        desc: 'Buat sistem validasi form yang berjalan real-time saat user mengetik.',
        code: `// Form Validation\nconst validators = {\n  required: (v) => v.trim().length > 0 || 'Field wajib diisi',\n  email: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v) || 'Email tidak valid',\n  minLength: (min) => (v) => v.length >= min || \`Minimal \${min} karakter\`,\n  maxLength: (max) => (v) => v.length <= max || \`Maksimal \${max} karakter\`,\n};\n\nfunction ${fn}(input, rules) {\n  for (const rule of rules) {\n    const result = typeof rule === 'function' ? rule(input.value) : rule;\n    if (result !== true) {\n      return { valid: false, message: result };\n    }\n  }\n  return { valid: true, message: '' };\n}\n\n// Attach validation to input\nfunction attachValidation(inputEl, rules) {\n  const errorEl = document.querySelector(\`#\${inputEl.id}-error\`);\n\n  inputEl.addEventListener('input', () => {\n    const { valid, message } = ${fn}(inputEl, rules);\n    inputEl.classList.toggle('is-invalid', !valid);\n    inputEl.classList.toggle('is-valid', valid);\n    if (errorEl) errorEl.textContent = valid ? '' : message;\n  });\n}\n\n// Usage\nattachValidation(document.querySelector('#email'), [\n  validators.required,\n  validators.email,\n]);\n\nattachValidation(document.querySelector('#username'), [\n  validators.required,\n  validators.minLength(3),\n  validators.maxLength(20),\n]);`,
        preview: 'js', xp: 80,
      };
    },
  ],
  advanced: [
    () => {
      const className = ctRand(['UserStore','DataManager','EventBus','StateController','Repository']);
      const entity = ctRand(['User','Product','Task','Order','Post']);
      return {
        topic: 'OOP JavaScript', title: `Class ${className}`,
        desc: `Implementasi class ${className} dengan constructor, methods, getters, dan static methods.`,
        code: `// OOP — ${className}\nclass ${className} {\n  #items = [];\n  #listeners = new Map();\n\n  constructor(initialData = []) {\n    this.#items = [...initialData];\n    this.createdAt = new Date();\n  }\n\n  // Getter\n  get count() {\n    return this.#items.length;\n  }\n\n  get all() {\n    return [...this.#items];\n  }\n\n  // Methods\n  add(item) {\n    if (!item || !item.id) throw new Error('Item harus punya id');\n    const exists = this.#items.find(i => i.id === item.id);\n    if (exists) throw new Error(\`ID \${item.id} sudah ada\`);\n    this.#items.push({ ...item, createdAt: Date.now() });\n    this.#emit('add', item);\n    return this;\n  }\n\n  remove(id) {\n    const index = this.#items.findIndex(i => i.id === id);\n    if (index === -1) throw new Error(\`Item \${id} tidak ditemukan\`);\n    const removed = this.#items.splice(index, 1)[0];\n    this.#emit('remove', removed);\n    return removed;\n  }\n\n  find(id) {\n    return this.#items.find(i => i.id === id) ?? null;\n  }\n\n  filter(predicate) {\n    return this.#items.filter(predicate);\n  }\n\n  // Events\n  on(event, handler) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, []);\n    this.#listeners.get(event).push(handler);\n    return () => this.off(event, handler);\n  }\n\n  off(event, handler) {\n    const handlers = this.#listeners.get(event) || [];\n    this.#listeners.set(event, handlers.filter(h => h !== handler));\n  }\n\n  #emit(event, data) {\n    (this.#listeners.get(event) || []).forEach(h => h(data));\n  }\n\n  // Static factory\n  static from(data) {\n    return new ${className}(data);\n  }\n\n  toJSON() {\n    return { items: this.#items, count: this.count };\n  }\n}\n\n// Usage\nconst store = ${className}.from([\n  { id: 1, name: '${ctRand(CT_NAMES)}' },\n  { id: 2, name: '${ctRand(CT_NAMES)}' }\n]);\n\nconst unsubscribe = store.on('add', item => console.log('Added:', item));\n\nstore.add({ id: 3, name: '${ctRand(CT_NAMES)}' });\nconsole.log('Count:', store.count);\nconsole.log('All:', store.all);\n\nunsubscribe();`,
        preview: 'js', xp: 110,
      };
    },
  ],
  expert: [
    () => {
      const fn = ctRand(CT_FN_NAMES);
      return {
        topic: 'State Management', title: 'Mini State Manager',
        desc: 'Buat state manager sederhana dengan subscribe, dispatch, dan reducer pattern.',
        code: `// Mini State Manager — Redux-like\nfunction createStore(reducer, initialState) {\n  let state = initialState;\n  const subscribers = new Set();\n\n  return {\n    getState: () => ({ ...state }),\n\n    dispatch(action) {\n      if (!action || typeof action.type !== 'string') {\n        throw new Error('Action harus punya type string');\n      }\n      const prevState = state;\n      state = reducer(state, action);\n      if (state !== prevState) {\n        subscribers.forEach(sub => sub(state, action));\n      }\n      return action;\n    },\n\n    subscribe(listener) {\n      subscribers.add(listener);\n      return () => subscribers.delete(listener);\n    },\n\n    replaceReducer(newReducer) {\n      reducer = newReducer;\n    }\n  };\n}\n\n// Reducer\nconst initialState = { count: 0, user: null, loading: false, errors: [] };\n\nfunction appReducer(state = initialState, action) {\n  switch (action.type) {\n    case 'INCREMENT':\n      return { ...state, count: state.count + (action.payload ?? 1) };\n    case 'DECREMENT':\n      return { ...state, count: Math.max(0, state.count - 1) };\n    case 'RESET':\n      return { ...state, count: 0 };\n    case 'SET_USER':\n      return { ...state, user: action.payload, loading: false };\n    case 'SET_LOADING':\n      return { ...state, loading: action.payload };\n    case 'ADD_ERROR':\n      return { ...state, errors: [...state.errors, action.payload] };\n    default:\n      return state;\n  }\n}\n\n// Create store\nconst store = createStore(appReducer, initialState);\n\n// Subscribe\nconst unsubscribe = store.subscribe((state, action) => {\n  console.log(\`[\${action.type}]\`, state);\n});\n\n// Dispatch\nstore.dispatch({ type: 'INCREMENT' });\nstore.dispatch({ type: 'INCREMENT', payload: 5 });\nstore.dispatch({ type: 'SET_USER', payload: { id: 1, name: '${ctRand(CT_NAMES)}' } });\nconsole.log('Final state:', store.getState());\n\nunsubscribe();`,
        preview: 'js', xp: 140,
      };
    },
  ],
  professional: [
    () => {
      return {
        topic: 'Design Patterns', title: 'Observer + Strategy Pattern',
        desc: 'Implementasi Observer pattern dan Strategy pattern dalam JavaScript modern.',
        code: `// === OBSERVER PATTERN ===\nclass EventEmitter {\n  #events = new Map();\n  #maxListeners = 10;\n\n  on(event, listener, options = {}) {\n    if (!this.#events.has(event)) this.#events.set(event, []);\n    const listeners = this.#events.get(event);\n    if (listeners.length >= this.#maxListeners) {\n      console.warn(\`MaxListeners (\${this.#maxListeners}) exceeded for "\${event}"\`);\n    }\n    listeners.push({ listener, once: options.once || false });\n    return this;\n  }\n\n  once(event, listener) {\n    return this.on(event, listener, { once: true });\n  }\n\n  off(event, listener) {\n    const listeners = this.#events.get(event) || [];\n    this.#events.set(event, listeners.filter(l => l.listener !== listener));\n    return this;\n  }\n\n  emit(event, ...args) {\n    const listeners = [...(this.#events.get(event) || [])];\n    listeners.forEach(({ listener, once }) => {\n      listener(...args);\n      if (once) this.off(event, listener);\n    });\n    return listeners.length > 0;\n  }\n}\n\n// === STRATEGY PATTERN ===\nclass SortContext extends EventEmitter {\n  #strategy;\n  #data;\n\n  constructor(data, strategy) {\n    super();\n    this.#data = [...data];\n    this.#strategy = strategy;\n  }\n\n  setStrategy(strategy) {\n    const prev = this.#strategy;\n    this.#strategy = strategy;\n    this.emit('strategy:changed', { prev, current: strategy });\n    return this;\n  }\n\n  sort() {\n    const start = performance.now();\n    const result = this.#strategy.sort([...this.#data]);\n    const time = (performance.now() - start).toFixed(3);\n    this.emit('sort:complete', { result, time, size: result.length });\n    return result;\n  }\n}\n\n// Concrete strategies\nconst BubbleSort = {\n  name: 'Bubble Sort',\n  sort: (arr) => {\n    for (let i = 0; i < arr.length - 1; i++)\n      for (let j = 0; j < arr.length - i - 1; j++)\n        if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n    return arr;\n  }\n};\n\nconst QuickSort = {\n  name: 'Quick Sort',\n  sort: (arr) => arr.length <= 1 ? arr : [\n    ...QuickSort.sort(arr.slice(1).filter(x => x <= arr[0])),\n    arr[0],\n    ...QuickSort.sort(arr.slice(1).filter(x => x > arr[0]))\n  ]\n};\n\n// Usage\nconst data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));\nconst ctx = new SortContext(data, BubbleSort);\n\nctx.on('sort:complete', ({ result, time }) => {\n  console.log('Sorted:', result.join(', '));\n  console.log('Time:', time + 'ms');\n});\n\nconsole.log('Original:', data.join(', '));\nctx.sort();\nctx.setStrategy(QuickSort);\nctx.sort();`,
        preview: 'js', xp: 180,
      };
    },
  ],
};

// ================================================================
// PYTHON CHALLENGE GENERATORS
// ================================================================
const CT_PY_GENERATORS = {
  beginner: [
    () => {
      const fn = ctRand(CT_PY_FNS), n = ctRandN(3, 8);
      return {
        topic: 'Functions & Loops', title: `Function ${fn}`,
        desc: 'Buat function Python dengan loop, kondisi, dan return value.',
        code: `# Function dengan loop dan kondisi\ndef ${fn}(items):\n    """Proses daftar item dan kembalikan statistik."""\n    if not items:\n        return {"error": "List kosong"}\n    \n    total = 0\n    count = 0\n    \n    for item in items:\n        if isinstance(item, (int, float)):\n            total += item\n            count += 1\n    \n    if count == 0:\n        return {"error": "Tidak ada angka"}\n    \n    return {\n        "total": total,\n        "count": count,\n        "average": total / count,\n        "min": min(i for i in items if isinstance(i, (int, float))),\n        "max": max(i for i in items if isinstance(i, (int, float)))\n    }\n\n\n# Test\ndata = [${Array.from({length: n}, () => ctRandN(1, 100)).join(', ')}]\nresult = ${fn}(data)\n\nprint("Statistik:")\nfor key, val in result.items():\n    print(f"  {key}: {val}")`,
        preview: 'python', xp: 40,
      };
    },
    () => {
      const items = ctRandItems(CT_NAMES, 5);
      return {
        topic: 'List Comprehension', title: 'List Comprehension',
        desc: 'Gunakan list comprehension, filter, dan transform data.',
        code: `# List Comprehension\nnames = ${JSON.stringify(items)}\n\n# Filter dan transform\nlong_names = [name for name in names if len(name) > 4]\nupper_names = [name.upper() for name in names]\nname_lengths = {name: len(name) for name in names}\nformatted = [f"Hi, {name}!" for name in names if name[0].upper() == name[0]]\n\nprint("Original:", names)\nprint("Long names:", long_names)\nprint("Uppercase:", upper_names)\nprint("Lengths:", name_lengths)\nprint("Formatted:", formatted)\n\n# Nested list comprehension\nmatrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]\nprint("Matrix:")\nfor row in matrix:\n    print("  ", row)`,
        preview: 'python', xp: 45,
      };
    },
    () => {
      const fn = ctRand(CT_PY_FNS);
      return {
        topic: 'Dictionary', title: 'Manipulasi Dictionary',
        desc: 'Operasi dictionary: create, update, iterate, dan nested dict.',
        code: `# Dictionary Operations\ndef ${fn}(user_data):\n    """Update dan return user data."""\n    # Update fields\n    user_data["status"] = "active"\n    user_data["score"] = user_data.get("score", 0) + 10\n    \n    # Nested dict\n    user_data["preferences"] = {\n        "theme": "dark",\n        "language": "id",\n        "notifications": True\n    }\n    \n    return user_data\n\n\n# Data\nusers = [\n    {"id": 1, "name": "${ctRand(CT_NAMES)}", "score": ${ctRandN(10,90)}},\n    {"id": 2, "name": "${ctRand(CT_NAMES)}", "score": ${ctRandN(10,90)}},\n    {"id": 3, "name": "${ctRand(CT_NAMES)}"},\n]\n\n# Process\nprocessed = [${fn}(u) for u in users]\n\n# Display\nfor user in processed:\n    print(f"ID {user['id']}: {user['name']} — score: {user['score']}, status: {user['status']}")\n\n# Aggregate\nscores = {u['name']: u['score'] for u in processed}\nbest = max(scores, key=scores.get)\nprint(f"\\nTop scorer: {best} ({scores[best]} pts)")`,
        preview: 'python', xp: 50,
      };
    },
  ],
  intermediate: [
    () => {
      const className = ctRand(['Stack','Queue','LinkedList','BinaryTree','Graph','Cache']);
      return {
        topic: 'OOP Python', title: `Class ${className}`,
        desc: `Implementasi class ${className} dengan __init__, methods, dunder, dan property.`,
        code: `# OOP — ${className}\nfrom typing import Optional, Any\n\n\nclass ${className}:\n    """${className} data structure implementation."""\n\n    def __init__(self, max_size: int = 100):\n        self._data: list = []\n        self._max_size = max_size\n        self._operation_count = 0\n\n    # Dunder methods\n    def __len__(self) -> int:\n        return len(self._data)\n\n    def __repr__(self) -> str:\n        return f"${className}(size={len(self)}, max={self._max_size})"\n\n    def __contains__(self, item: Any) -> bool:\n        return item in self._data\n\n    def __iter__(self):\n        return iter(self._data.copy())\n\n    # Property\n    @property\n    def is_empty(self) -> bool:\n        return len(self._data) == 0\n\n    @property\n    def is_full(self) -> bool:\n        return len(self._data) >= self._max_size\n\n    @property\n    def operation_count(self) -> int:\n        return self._operation_count\n\n    # Methods\n    def push(self, item: Any) -> bool:\n        if self.is_full:\n            raise OverflowError(f"${className} penuh (max: {self._max_size})")\n        self._data.append(item)\n        self._operation_count += 1\n        return True\n\n    def pop(self) -> Any:\n        if self.is_empty:\n            raise IndexError("${className} kosong")\n        self._operation_count += 1\n        return self._data.pop()\n\n    def peek(self) -> Optional[Any]:\n        return self._data[-1] if self._data else None\n\n    def clear(self) -> None:\n        self._data.clear()\n        print(f"${className} cleared")\n\n\n# Usage\ns = ${className}(max_size=5)\nfor val in [${Array.from({length:4}, () => ctRandN(1,99)).join(', ')}]:\n    s.push(val)\n\nprint(s)\nprint("Size:", len(s))\nprint("Peek:", s.peek())\nprint("All items:", list(s))\nprint("Ops:", s.operation_count)`,
        preview: 'python', xp: 90,
      };
    },
    () => {
      return {
        topic: 'Algorithms', title: 'Sorting Algorithms',
        desc: 'Implementasi dan bandingkan Bubble Sort, Merge Sort, dan Binary Search.',
        code: `# Sorting & Searching Algorithms\nimport time\nimport random\n\n\ndef bubble_sort(arr):\n    n = len(arr)\n    arr = arr.copy()\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n\n\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    return result + left[i:] + right[j:]\n\n\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\n\n# Test\ndata = [${Array.from({length:10}, () => ctRandN(1,99)).join(', ')}]\ntarget = data[${ctRandN(0,9)}]\n\nbs = bubble_sort(data)\nms = merge_sort(data)\n\nprint("Original:", data)\nprint("Bubble  :", bs)\nprint("Merge   :", ms)\n\nidx = binary_search(ms, target)\nprint(f"Search {target}: index {idx}")`,
        preview: 'python', xp: 100,
      };
    },
  ],
  advanced: [
    () => {
      return {
        topic: 'Decorators & Context', title: 'Decorator Pattern + Context Manager',
        desc: 'Buat custom decorator dan context manager dengan __enter__/__exit__.',
        code: `# Decorators & Context Managers\nimport time\nimport functools\nfrom contextlib import contextmanager\n\n\n# === DECORATORS ===\ndef timer(func):\n    """Mengukur waktu eksekusi fungsi."""\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"⏱ {func.__name__}: {elapsed:.4f}s")\n        return result\n    return wrapper\n\n\ndef retry(max_attempts=3, delay=0.5, exceptions=(Exception,)):\n    """Retry decorator dengan exponential backoff."""\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_attempts + 1):\n                try:\n                    return func(*args, **kwargs)\n                except exceptions as e:\n                    if attempt == max_attempts:\n                        raise\n                    wait = delay * (2 ** (attempt - 1))\n                    print(f"Attempt {attempt} failed: {e}. Retry in {wait:.1f}s")\n                    time.sleep(wait)\n        return wrapper\n    return decorator\n\n\n# === CONTEXT MANAGER ===\nclass Timer:\n    """Context manager untuk mengukur waktu."""\n\n    def __init__(self, name=""):\n        self.name = name\n        self.elapsed = 0\n\n    def __enter__(self):\n        self._start = time.perf_counter()\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.elapsed = time.perf_counter() - self._start\n        label = f"[{self.name}] " if self.name else ""\n        print(f"⏱ {label}{self.elapsed:.4f}s")\n        return False  # Don't suppress exceptions\n\n\n@timer\ndef slow_function(n):\n    return sum(i ** 2 for i in range(n))\n\n\n# Usage\nprint("=== Decorator ===")\nresult = slow_function(${ctRandN(50000, 100000)})\nprint("Result:", result)\n\nprint("\\n=== Context Manager ===")\nwith Timer("computation"):\n    total = sum(i * i for i in range(${ctRandN(100000, 500000)}))\n    print("Sum:", total)`,
        preview: 'python', xp: 130,
      };
    },
  ],
  expert: [
    () => {
      return {
        topic: 'Data Processing', title: 'Data Pipeline & Generator',
        desc: 'Buat data processing pipeline menggunakan generator, yield, dan functional programming.',
        code: `# Data Pipeline dengan Generators\nfrom typing import Iterator, Callable, TypeVar\nimport random\n\nT = TypeVar('T')\n\n\n# === PIPELINE ===\nclass Pipeline:\n    """Composable data processing pipeline."""\n\n    def __init__(self, source):\n        self._source = source\n        self._steps = []\n\n    def map(self, func: Callable):\n        self._steps.append(('map', func))\n        return self\n\n    def filter(self, predicate: Callable):\n        self._steps.append(('filter', predicate))\n        return self\n\n    def take(self, n: int):\n        self._steps.append(('take', n))\n        return self\n\n    def _execute(self) -> Iterator:\n        data = iter(self._source)\n        for step_type, func in self._steps:\n            if step_type == 'map':\n                data = (func(item) for item in data)\n            elif step_type == 'filter':\n                data = (item for item in data if func(item))\n            elif step_type == 'take':\n                data = self._islice(data, func)\n        return data\n\n    @staticmethod\n    def _islice(iterable, n):\n        for i, item in enumerate(iterable):\n            if i >= n:\n                break\n            yield item\n\n    def collect(self) -> list:\n        return list(self._execute())\n\n    def reduce(self, func, initial=None):\n        from functools import reduce\n        return reduce(func, self._execute(), initial)\n\n\n# === INFINITE GENERATOR ===\ndef number_stream(start=0, step=1):\n    """Infinite number generator."""\n    n = start\n    while True:\n        yield n\n        n += step\n\n\n# Usage\nrandom.seed(${ctRandN(1, 999)})\nraw_data = [random.randint(1, 100) for _ in range(1000)]\n\nresult = (\n    Pipeline(raw_data)\n    .filter(lambda x: x % 2 == 0)\n    .map(lambda x: x ** 2)\n    .filter(lambda x: x > 1000)\n    .map(lambda x: {'value': x, 'root': x ** 0.5})\n    .take(5)\n    .collect()\n)\n\nprint("Pipeline result:")\nfor item in result:\n    print(f"  value={item['value']}, sqrt={item['root']:.2f}")\n\n# Infinite stream\nevens = Pipeline(number_stream(0, 2)).filter(lambda x: x % 3 == 0).take(5).collect()\nprint("\\nFirst 5 multiples of 6:", evens)`,
        preview: 'python', xp: 160,
      };
    },
  ],
  professional: [
    () => {
      return {
        topic: 'Architecture', title: 'Clean Architecture — Repository Pattern',
        desc: 'Implementasi Repository pattern dengan abstract base class, dependency injection, dan type hints.',
        code: `# Clean Architecture — Repository Pattern\nfrom abc import ABC, abstractmethod\nfrom dataclasses import dataclass, field\nfrom typing import Optional, List, Protocol, TypeVar, Generic\nfrom datetime import datetime\nimport uuid\n\n# === DOMAIN MODELS ===\n@dataclass\nclass User:\n    name: str\n    email: str\n    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])\n    created_at: datetime = field(default_factory=datetime.now)\n    active: bool = True\n\n    def __post_init__(self):\n        if not self.email or '@' not in self.email:\n            raise ValueError(f"Email tidak valid: {self.email}")\n\n    def deactivate(self):\n        self.active = False\n\n\nT = TypeVar('T')\n\n\n# === ABSTRACT REPOSITORY ===\nclass Repository(ABC, Generic[T]):\n    @abstractmethod\n    def find_by_id(self, id: str) -> Optional[T]: ...\n\n    @abstractmethod\n    def find_all(self) -> List[T]: ...\n\n    @abstractmethod\n    def save(self, entity: T) -> T: ...\n\n    @abstractmethod\n    def delete(self, id: str) -> bool: ...\n\n\n# === IN-MEMORY IMPLEMENTATION ===\nclass InMemoryUserRepository(Repository[User]):\n    def __init__(self):\n        self._store: dict[str, User] = {}\n\n    def find_by_id(self, id: str) -> Optional[User]:\n        return self._store.get(id)\n\n    def find_all(self) -> List[User]:\n        return list(self._store.values())\n\n    def find_active(self) -> List[User]:\n        return [u for u in self._store.values() if u.active]\n\n    def save(self, user: User) -> User:\n        self._store[user.id] = user\n        return user\n\n    def delete(self, id: str) -> bool:\n        return bool(self._store.pop(id, None))\n\n    def count(self) -> int:\n        return len(self._store)\n\n\n# === SERVICE LAYER ===\nclass UserService:\n    def __init__(self, repo: Repository[User]):\n        self._repo = repo\n\n    def register(self, name: str, email: str) -> User:\n        existing = next((u for u in self._repo.find_all() if u.email == email), None)\n        if existing:\n            raise ValueError(f"Email {email} sudah terdaftar")\n        user = User(name=name, email=email)\n        return self._repo.save(user)\n\n    def get_all_active(self) -> List[User]:\n        return [u for u in self._repo.find_all() if u.active]\n\n\n# === USAGE ===\nrepo = InMemoryUserRepository()\nservice = UserService(repo)\n\nfor name, email in [\n    ('${ctRand(CT_NAMES)}', '${ctRand(CT_NAMES).toLowerCase()}@example.com'),\n    ('${ctRand(CT_NAMES)}', '${ctRand(CT_NAMES).toLowerCase()}@company.id'),\n    ('${ctRand(CT_NAMES)}', '${ctRand(CT_NAMES).toLowerCase()}@dev.io'),\n]:\n    u = service.register(name, email)\n    print(f"Registered: {u.name} (id={u.id})")\n\nprint(f"\\nTotal: {repo.count()}")\nprint(f"Active: {len(service.get_all_active())}")`,
        preview: 'python', xp: 200,
      };
    },
  ],
};

// All generators map
const CT_GENERATORS = { html: CT_HTML_GENERATORS, css: CT_CSS_GENERATORS, js: CT_JS_GENERATORS, python: CT_PY_GENERATORS };

// ================================================================
// SYNTAX HELPERS — per language
// ================================================================
const CT_SYNTAX_HELPERS = {
  html: [
    { token: '<!DOCTYPE html>', desc: 'Deklarasi dokumen HTML5. Selalu letakkan di baris pertama.' },
    { token: '<html lang="id">', desc: 'Root element. lang= menentukan bahasa (penting untuk aksesibilitas).' },
    { token: '<meta charset="UTF-8">', desc: 'Mendukung karakter Unicode/UTF-8 termasuk huruf Indonesia.' },
    { token: 'aria-label=""', desc: 'Memberikan label aksesibel untuk screen reader.' },
    { token: 'role=""', desc: 'ARIA role mendefinisikan tujuan elemen secara semantik.' },
  ],
  css: [
    { token: 'var(--name)', desc: 'CSS Custom Property (variable). Didefinisikan di :root {}.' },
    { token: 'clamp(min, val, max)', desc: 'Fluid sizing: nilai otomatis antara min dan max.' },
    { token: 'grid-template-columns', desc: 'Mendefinisikan kolom grid. repeat(3, 1fr) = 3 kolom sama lebar.' },
    { token: 'backdrop-filter: blur()', desc: 'Efek blur pada background di belakang elemen (glassmorphism).' },
    { token: 'transition: all 0.3s ease', desc: 'Animasi halus saat property berubah.' },
  ],
  js: [
    { token: 'async/await', desc: 'Cara modern menangani Promise. async function, await menunggu hasil.' },
    { token: '?.', desc: 'Optional chaining. obj?.prop aman jika obj null/undefined.' },
    { token: '??', desc: 'Nullish coalescing. a ?? b = a jika bukan null/undefined, else b.' },
    { token: 'Array.from()', desc: 'Buat array dari iterable atau object array-like.' },
    { token: 'structuredClone()', desc: 'Deep clone object/array (modern, lebih aman dari JSON.parse).' },
  ],
  python: [
    { token: '@property', desc: 'Decorator yang membuat method bisa diakses sebagai attribute.' },
    { token: '__dunder__', desc: 'Magic methods (dunder). __init__ = constructor, __repr__ = string representation.' },
    { token: 'f"string {var}"', desc: 'f-string: interpolasi variabel dalam string. Lebih cepat dari format().' },
    { token: 'yield', desc: 'Membuat generator function. Menghasilkan nilai satu per satu (lazy evaluation).' },
    { token: 'TypeVar / Generic', desc: 'Type hints generik untuk class/function yang bekerja dengan berbagai tipe data.' },
  ],
};

// ================================================================
// GENERATE CHALLENGE
// ================================================================
function ctGenerateChallenge() {
  const generators = CT_GENERATORS[CT_STATE.lang]?.[CT_STATE.level] || [];
  if (generators.length === 0) {
    // Fallback to beginner
    const fallback = CT_GENERATORS[CT_STATE.lang]?.beginner || [];
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)]();
  }

  // Anti-monotony: try 5 times to get a non-recent challenge
  for (let i = 0; i < 8; i++) {
    const gen = generators[Math.floor(Math.random() * generators.length)];
    const challenge = gen();
    const hash = ctHash(challenge.code);
    if (!CT_STATE.recentHashes.includes(hash) || i > 5) {
      CT_STATE.recentHashes.push(hash);
      if (CT_STATE.recentHashes.length > 20) CT_STATE.recentHashes.shift();
      return challenge;
    }
  }
  return generators[Math.floor(Math.random() * generators.length)]();
}

// ================================================================
// INIT & SETUP
// ================================================================
function ctInit() {
  ctLoadState();
  ctUpdateUI();
  ctNewChallenge();
  ctRenderSyntaxHelper();
}

function ctLoadState() {
  try {
    const saved = localStorage.getItem('ct_state_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      CT_STATE.xp = parsed.xp || 0;
      CT_STATE.streak = parsed.streak || 0;
      CT_STATE.gameLevel = parsed.gameLevel || 1;
      CT_STATE.bestWPM = parsed.bestWPM || 0;
      CT_STATE.challengesDone = parsed.challengesDone || 0;
      CT_STATE.mastery = parsed.mastery || {};
      CT_STATE.recentHashes = parsed.recentHashes || [];
    }
  } catch(e) {}
}

function ctSaveState() {
  try {
    localStorage.setItem('ct_state_v2', JSON.stringify({
      xp: CT_STATE.xp, streak: CT_STATE.streak, gameLevel: CT_STATE.gameLevel,
      bestWPM: CT_STATE.bestWPM, challengesDone: CT_STATE.challengesDone,
      mastery: CT_STATE.mastery, recentHashes: CT_STATE.recentHashes,
    }));
  } catch(e) {}
}

// ================================================================
// CONTROLS: Language / Level / Mode
// ================================================================
function ctSetLang(lang, btn) {
  CT_STATE.lang = lang;
  document.querySelectorAll('#ct-lang-tabs .ct-seg').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const icons = { html:'🌐 HTML', css:'🎨 CSS', js:'⚡ JS', python:'🐍 Python' };
  document.getElementById('ct-lang-pill').textContent = icons[lang] || lang;
  ctRenderSyntaxHelper();
  ctNewChallenge();
}

function ctSetLevel(level, btn) {
  CT_STATE.level = level;
  document.querySelectorAll('#ct-level-tabs .ct-seg').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ctNewChallenge();
}

function ctSetMode(mode, btn) {
  CT_STATE.mode = mode;
  document.querySelectorAll('#ct-mode-tabs .ct-seg').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ctUpdateModeBanner();
  ctNewChallenge();
}

function ctUpdateModeBanner() {
  const modes = {
    practice: { icon:'📖', title:'Practice Mode', desc:'Ketik syntax sambil melihat contoh. Pelajari pola dan struktur kode.' },
    memory:   { icon:'🧠', title:'Memory Mode', desc:'Hafalkan kode, lalu sembunyikan. Ketik dari ingatan. Latih memory dan syntax recall.' },
    speed:    { icon:'⚡', title:'Speed Mode', desc:'Ketik secepat mungkin dengan akurasi maksimal. WPM adalah penilaian utama.' },
    exam:     { icon:'🏆', title:'Exam Mode', desc:'Tanpa hint, tanpa referensi. Test kemampuan nyatamu. Nilai akurasi dan memori.' },
  };
  const m = modes[CT_STATE.mode] || modes.practice;
  document.getElementById('ct-mode-icon').textContent = m.icon;
  document.getElementById('ct-mode-title').textContent = m.title;
  document.getElementById('ct-mode-desc').textContent = m.desc;
}

// ================================================================
// LOAD NEW CHALLENGE
// ================================================================
function ctNewChallenge() {
  try {
    CT_STATE.typingStartTime = null;
    CT_STATE.typingFinished = false;
    CT_STATE.phase = 'typing';
    CT_STATE.mistakes = 0;

    const ch = ctGenerateChallenge();
    if (!ch) {
      document.getElementById('ct-challenge-title').textContent = 'Tantangan tidak tersedia untuk kombinasi ini.';
      return;
    }
    CT_STATE.currentChallenge = ch;

    // Update challenge info
    const numEl = document.getElementById('ct-challenge-num');
    numEl.textContent = `#${CT_STATE.challengesDone + 1}`;
    document.getElementById('ct-challenge-title').textContent = ch.title;
    document.getElementById('ct-challenge-desc').textContent = ch.desc || '';

    const langBadge = document.getElementById('ct-lang-badge');
    langBadge.textContent = CT_STATE.lang.toUpperCase();

    const diffBadge = document.getElementById('ct-diff-badge');
    diffBadge.textContent = CT_STATE.level.charAt(0).toUpperCase() + CT_STATE.level.slice(1);
    diffBadge.dataset.d = CT_STATE.level;

    document.getElementById('ct-topic-tag').textContent = ch.topic || '';

    // Render reference code (with syntax highlight)
    const refEl = document.getElementById('ct-ref-code');
    refEl.innerHTML = ctHighlight(ch.code, CT_STATE.lang);

    // Mode-specific UI
    ctSetupModeUI(ch);

    // Clear input and display
    document.getElementById('ct-input').value = '';
    ctRenderTypingDisplay('');

    // Result bar hidden
    document.getElementById('ct-result-bar').style.display = 'none';

    // Update preview
    ctUpdatePreview(ch.preview);

    // Reset stats
    document.getElementById('ct-stat-wpm').textContent = '0';
    document.getElementById('ct-stat-acc').textContent = '100%';
    document.getElementById('ct-stat-mem').textContent = '—';
    document.getElementById('ct-stat-prog').textContent = '0%';

  } catch(e) {
    console.error('ctNewChallenge error:', e);
  }
}

function ctSetupModeUI(ch) {
  const refWrap = document.getElementById('ct-reference-wrap');
  const memPhase = document.getElementById('ct-memorize-phase');
  const hintBtn = document.getElementById('ct-hint-btn');

  memPhase.style.display = 'none';

  if (CT_STATE.mode === 'practice' || CT_STATE.mode === 'speed') {
    refWrap.style.display = 'block';
    if (hintBtn) hintBtn.style.display = CT_STATE.mode === 'speed' ? 'none' : '';
  } else if (CT_STATE.mode === 'memory') {
    refWrap.style.display = 'none';
    memPhase.style.display = 'block';
    document.getElementById('ct-mem-code-display').textContent = ch.code;
    ctStartMemoryCountdown();
  } else if (CT_STATE.mode === 'exam') {
    refWrap.style.display = 'none';
    if (hintBtn) hintBtn.style.display = 'none';
  }

  // Typing label
  const labels = {
    practice: 'Ketik sambil melihat referensi di atas',
    memory: 'Ketik dari ingatan (kode sudah disembunyikan)',
    speed: 'Ketik secepat mungkin!',
    exam: 'Exam Mode — tidak ada referensi. Ketik dari kemampuanmu.',
  };
  document.getElementById('ct-typing-label').textContent = labels[CT_STATE.mode] || 'Type Here';
}

// ================================================================
// MEMORY COUNTDOWN
// ================================================================
function ctStartMemoryCountdown() {
  let remaining = 12;
  const countEl = document.getElementById('ct-mem-countdown');
  const fillEl = document.getElementById('ct-mem-progress-fill');
  if (CT_STATE.memCountdown) clearInterval(CT_STATE.memCountdown);

  CT_STATE.memCountdown = setInterval(() => {
    remaining--;
    if (countEl) countEl.textContent = remaining;
    if (fillEl) fillEl.style.width = (remaining / 12 * 100) + '%';
    if (remaining <= 0) {
      clearInterval(CT_STATE.memCountdown);
      ctStartMemoryRecall();
    }
  }, 1000);
}

function ctStartMemoryRecall() {
  if (CT_STATE.memCountdown) clearInterval(CT_STATE.memCountdown);
  document.getElementById('ct-memorize-phase').style.display = 'none';
  CT_STATE.phase = 'typing';
  CT_STATE.memStartTime = Date.now();
  document.getElementById('ct-input').focus();
}

// ================================================================
// TYPING INPUT HANDLER
// ================================================================
function ctHandleInput() {
  try {
    const input = document.getElementById('ct-input');
    const typed = input.value;

    if (!CT_STATE.typingStartTime && typed.length > 0) {
      CT_STATE.typingStartTime = Date.now();
    }

    const target = CT_STATE.currentChallenge?.code || '';
    CT_STATE.inputText = typed;

    // Render display
    ctRenderTypingDisplay(typed);

    // Stats
    ctUpdateLiveStats(typed, target);

    // Live preview (debounced)
    clearTimeout(CT_STATE.livePreviewTimeout);
    CT_STATE.livePreviewTimeout = setTimeout(() => ctUpdatePreview(CT_STATE.currentChallenge?.preview, typed), 400);

  } catch(e) {}
}

function ctHandleKeydown(e) {
  // Allow Tab to insert spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.substring(0, start) + '  ' + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + 2;
    ctHandleInput();
  }
  // Enter to check when done
  if (e.key === 'Enter' && e.ctrlKey) {
    ctCheckAnswer();
  }
}

// ================================================================
// RENDER TYPING DISPLAY (character-level highlight)
// ================================================================
function ctRenderTypingDisplay(typed) {
  const target = CT_STATE.currentChallenge?.code || '';
  const displayEl = document.getElementById('ct-typing-display');
  if (!displayEl) return;

  if (!target) {
    displayEl.innerHTML = '<span style="color:var(--text3);font-size:13px;padding:12px;display:block">Ketik kode di bawah...</span>';
    return;
  }

  let html = '';
  const targetChars = target.split('');

  targetChars.forEach((ch, i) => {
    let cls = 'ct-char pending';
    if (i < typed.length) {
      cls = typed[i] === ch ? 'ct-char correct' : 'ct-char wrong';
    } else if (i === typed.length) {
      cls = 'ct-char current';
    }

    if (ch === '\n') {
      html += `<span class="${cls} newline">\n</span>`;
    } else {
      const escaped = ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch;
      html += `<span class="${cls}">${escaped}</span>`;
    }
  });

  displayEl.innerHTML = html;

  // Scroll to current char
  const currentChar = displayEl.querySelector('.current');
  if (currentChar) {
    currentChar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// ================================================================
// LIVE STATS UPDATE
// ================================================================
function ctUpdateLiveStats(typed, target) {
  const correct = typed.split('').filter((ch, i) => ch === target[i]).length;
  const elapsed = CT_STATE.typingStartTime ? (Date.now() - CT_STATE.typingStartTime) / 60000 : 0.001;
  const wpm = Math.round((correct / 5) / Math.max(elapsed, 0.001)) || 0;
  const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
  const prog = Math.min(Math.round((typed.length / target.length) * 100), 100);

  document.getElementById('ct-stat-wpm').textContent = wpm;
  document.getElementById('ct-stat-acc').textContent = acc + '%';
  document.getElementById('ct-stat-prog').textContent = prog + '%';
}

// ================================================================
// CHECK ANSWER
// ================================================================
function ctCheckAnswer() {
  if (CT_STATE.typingFinished) return;

  const typed = (document.getElementById('ct-input')?.value || '').trimEnd();
  const target = (CT_STATE.currentChallenge?.code || '').trimEnd();

  const chars = Math.max(typed.length, target.length);
  const correct = typed.split('').filter((ch, i) => ch === target[i]).length;
  const accuracy = chars > 0 ? Math.round((correct / chars) * 100) : 0;

  const elapsed = CT_STATE.typingStartTime ? (Date.now() - CT_STATE.typingStartTime) / 1000 : 1;
  const wpm = Math.round((correct / 5) / Math.max(elapsed / 60, 0.001));

  // Memory score (how close the typed is to target without reference)
  const memScore = (CT_STATE.mode === 'memory' || CT_STATE.mode === 'exam')
    ? accuracy
    : null;

  // Overall score
  const score = CT_STATE.mode === 'speed'
    ? Math.min(100, Math.round((wpm / 60) * 50 + accuracy * 0.5))
    : accuracy;

  CT_STATE.typingFinished = true;
  CT_STATE.challengesDone++;

  // Update best WPM
  if (wpm > CT_STATE.bestWPM) CT_STATE.bestWPM = wpm;

  // XP
  const baseXP = CT_STATE.currentChallenge?.xp || 50;
  const xpEarned = Math.round(baseXP * (accuracy / 100) * (CT_STATE.mode === 'exam' ? 1.5 : 1));
  ctAddXP(xpEarned);

  // Mastery update
  const key = `${CT_STATE.lang}-${CT_STATE.level}-${CT_STATE.currentChallenge?.topic || 'misc'}`;
  ctUpdateMastery(key, accuracy, memScore);

  // Show result bar
  const resultBar = document.getElementById('ct-result-bar');
  resultBar.style.display = 'flex';

  document.getElementById('ct-res-score').textContent = score + '%';
  document.getElementById('ct-res-wpm').textContent = wpm;
  document.getElementById('ct-res-acc').textContent = accuracy + '%';
  document.getElementById('ct-res-time').textContent = Math.round(elapsed) + 's';

  const memWrap = document.getElementById('ct-res-mem-wrap');
  document.getElementById('ct-res-mem').textContent = memScore !== null ? memScore + '%' : '—';
  document.getElementById('ct-stat-mem').textContent = memScore !== null ? memScore + '%' : '—';

  // Color score
  const scoreEl = document.getElementById('ct-res-score').parentElement;
  scoreEl.className = 'ct-result-item ' + (score >= 90 ? 'good' : '');

  // Update counters
  document.getElementById('ct-best-wpm').textContent = CT_STATE.bestWPM;
  document.getElementById('ct-challenges-done').textContent = CT_STATE.challengesDone;
  document.getElementById('ct-mistake-count').textContent = typed.split('').filter((ch, i) => ch !== target[i]).length;

  ctSaveState();
  ctUpdateMasteryBar();

  // Toast
  const msg = score >= 95 ? '🏆 Sempurna! +' + xpEarned + ' XP' :
               score >= 80 ? '✅ Bagus! +' + xpEarned + ' XP' :
               score >= 60 ? '👍 Cukup! +' + xpEarned + ' XP' :
               '📝 Perlu latihan. +' + xpEarned + ' XP';
  ctShowToast(msg);

  // Update preview with typed code
  ctUpdatePreview(CT_STATE.currentChallenge?.preview, typed);
}

// ================================================================
// LIVE PREVIEW
// ================================================================
function ctUpdatePreview(type, code) {
  if (!code) code = CT_STATE.currentChallenge?.code || '';
  const lang = type || CT_STATE.currentChallenge?.preview || CT_STATE.lang;
  const iframe = document.getElementById('ct-preview-iframe');
  const consoleOut = document.getElementById('ct-console-output');
  const label = document.getElementById('ct-preview-label');

  if (lang === 'html') {
    iframe.style.display = 'block';
    consoleOut.style.display = 'none';
    label.textContent = 'Live HTML Preview';
    try { iframe.srcdoc = code; } catch(e) {}
  } else if (lang === 'css') {
    iframe.style.display = 'block';
    consoleOut.style.display = 'none';
    label.textContent = 'Live CSS Preview';
    const demoHTML = `<!DOCTYPE html><html><head><style>
      body{margin:16px;font-family:system-ui,sans-serif;background:#f8fafc}
      ${code}
    </style></head><body>
      <div class="glass-card neon-card dashboard-card card card-grid flex-container grid-layout">
        <h2 class="dashboard-card__title neon-title card-title">Preview Title</h2>
        <p class="dashboard-card__body card-body">Preview paragraph text content here for styling demonstration.</p>
        <button class="btn btn-animated btn-primary glass-input">Button</button>
      </div>
      <div class="flex-container grid-layout" style="margin-top:16px">
        <div class="flex-item grid-header card">Item A</div>
        <div class="flex-item grid-sidebar card">Item B</div>
        <div class="flex-item grid-main card">Item C</div>
      </div>
    </body></html>`;
    try { iframe.srcdoc = demoHTML; } catch(e) {}
  } else if (lang === 'js') {
    iframe.style.display = 'none';
    consoleOut.style.display = 'flex';
    label.textContent = 'JS Console';
    ctRunJSPreview(code);
  } else if (lang === 'python') {
    iframe.style.display = 'none';
    consoleOut.style.display = 'flex';
    label.textContent = 'Python Output (simulated)';
    ctRunPythonPreview(code);
  }
}

function ctRunJSPreview(code) {
  const lines = document.getElementById('ct-console-lines');
  if (!lines) return;
  lines.innerHTML = '';
  const logs = [];

  try {
    const sandboxConsole = {
      log: (...args) => logs.push({ type: 'output', text: args.map(a => {
        try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); } catch { return String(a); }
      }).join(' ') }),
      error: (...args) => logs.push({ type: 'error', text: args.join(' ') }),
      warn: (...args) => logs.push({ type: 'info', text: '⚠ ' + args.join(' ') }),
      info: (...args) => logs.push({ type: 'info', text: args.join(' ') }),
    };

    // Safe sandbox — replace document/window references
    const safeCode = code
      .replace(/document\./g, '/* doc */ null?.') 
      .replace(/window\./g, '/* win */ ({})?.')
      .replace(/localStorage\./g, '/* ls */ null?.');

    const fn = new Function('console', safeCode);
    fn(sandboxConsole);
  } catch(e) {
    logs.push({ type: 'error', text: e.message });
  }

  if (logs.length === 0) logs.push({ type: 'info', text: '(No console output)' });
  logs.forEach(l => {
    const el = document.createElement('div');
    el.className = 'ct-console-line ' + l.type;
    el.innerHTML = `<span class="ct-console-prefix">${l.type === 'error' ? '✗' : l.type === 'info' ? 'ℹ' : '>'}</span><span>${ctEscHtml(l.text)}</span>`;
    lines.appendChild(el);
  });
  lines.scrollTop = lines.scrollHeight;
}

function ctRunPythonPreview(code) {
  const lines = document.getElementById('ct-console-lines');
  if (!lines) return;
  lines.innerHTML = '';

  // Simulated Python output extraction via print() analysis
  const logs = [];
  const printPattern = /print\s*\((.+?)\)(?:\s*$)/gm;
  let match;
  let printCount = 0;

  while ((match = printPattern.exec(code)) !== null && printCount < 30) {
    let content = match[1].trim();
    // Handle f-strings (simplified simulation)
    content = content
      .replace(/^f["'](.+)["']$/, (_, s) => {
        return s.replace(/\{([^{}]+)\}/g, (m, expr) => {
          // Try to evaluate simple expressions
          try {
            // Extract simple variables from code
            const varMatches = code.matchAll(/(\w+)\s*=\s*([^\n]+)/g);
            const scope = {};
            for (const vm of varMatches) {
              try { scope[vm[1]] = JSON.parse(vm[2]); } catch {}
            }
            return eval(`(function(){ const ${Object.entries(scope).map(([k,v]) => `${k}=${JSON.stringify(v)}`).join(',')}; return ${expr}; })()`);
          } catch { return `{${expr}}`; }
        });
      })
      .replace(/^["'](.+)["']$/, '$1');
    logs.push({ type: 'output', text: content });
    printCount++;
  }

  if (logs.length === 0) {
    // Show a generic simulation message
    logs.push({ type: 'info', text: '▶ Python code loaded. print() output will appear here.' });
    logs.push({ type: 'info', text: '  Note: This is a simulated preview.' });
  }

  logs.forEach(l => {
    const el = document.createElement('div');
    el.className = 'ct-console-line ' + l.type;
    el.innerHTML = `<span class="ct-console-prefix">${l.type === 'error' ? '✗' : '>'}</span><span>${ctEscHtml(l.text)}</span>`;
    lines.appendChild(el);
  });
}

function ctRefreshPreview() {
  const code = document.getElementById('ct-input')?.value || CT_STATE.currentChallenge?.code || '';
  ctUpdatePreview(CT_STATE.currentChallenge?.preview, code);
}

function ctClearConsole() {
  const el = document.getElementById('ct-console-lines');
  if (el) el.innerHTML = '';
}

function ctToggleFullPreview() {
  const right = document.getElementById('ct-right-panel');
  if (!right) return;
  right.style.position = right.style.position === 'fixed' ? '' : 'fixed';
  right.style.inset = right.style.inset === '20px' ? '' : '20px';
  right.style.zIndex = right.style.zIndex === '900' ? '' : '900';
  right.style.minHeight = '';
}

// ================================================================
// SYNTAX HIGHLIGHT
// ================================================================
function ctHighlight(code, lang) {
  if (!code) return '';
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  let result = esc(code);

  if (lang === 'html') {
    result = result
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="t-cmt">$1</span>')
      .replace(/(&lt;\/?\w[\w-]*)/g, '<span class="t-tag">$1</span>')
      .replace(/(\/?&gt;)/g, '<span class="t-tag">$1</span>')
      .replace(/\s([\w-]+)=(&quot;[^&]*&quot;)/g, ' <span class="t-attr">$1</span>=<span class="t-val">$2</span>');
  } else if (lang === 'css') {
    result = result
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="t-cmt">$1</span>')
      .replace(/([.#]?[\w-]+)(?=\s*\{)/g, '<span class="t-sel">$1</span>')
      .replace(/([\w-]+)(?=\s*:(?!:))/g, '<span class="t-prop">$1</span>')
      .replace(/:\s*([^;{}\n]+)/g, ': <span class="t-val">$1</span>')
      .replace(/(--[\w-]+)/g, '<span class="t-attr">$1</span>');
  } else if (lang === 'js') {
    result = result
      .replace(/(\/\/[^\n]*)/g, '<span class="t-cmt">$1</span>')
      .replace(/\b(const|let|var|function|class|return|if|else|for|while|async|await|import|export|new|this|typeof|instanceof|try|catch|throw|switch|case|default|of|in|from)\b/g, '<span class="t-kw">$1</span>')
      .replace(/(&quot;[^&]*&quot;|&#39;[^&#]*&#39;|`[^`]*`)/g, '<span class="t-str">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="t-num">$1</span>');
  } else if (lang === 'python') {
    result = result
      .replace(/(#[^\n]*)/g, '<span class="t-py-cmt">$1</span>')
      .replace(/\b(def|class|return|if|elif|else|for|while|import|from|as|with|try|except|finally|raise|yield|lambda|and|or|not|in|is|None|True|False|pass|break|continue|self|super)\b/g, '<span class="t-py-kw">$1</span>')
      .replace(/(&quot;[^&]*&quot;|f&quot;[^&]*&quot;)/g, '<span class="t-py-str">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="t-py-num">$1</span>');
  }

  return result;
}

// ================================================================
// SYNTAX HELPER RENDER
// ================================================================
function ctRenderSyntaxHelper() {
  const helpers = CT_SYNTAX_HELPERS[CT_STATE.lang] || [];
  const el = document.getElementById('ct-syntax-helper-content');
  if (!el) return;
  el.innerHTML = helpers.map(h =>
    `<div class="ct-sh-item"><div class="ct-sh-token">${ctEscHtml(h.token)}</div><div class="ct-sh-desc">${h.desc}</div></div>`
  ).join('');
}

// ================================================================
// HINT / COPY
// ================================================================
function ctToggleHint() {
  if (CT_STATE.mode === 'exam' || CT_STATE.mode === 'memory') return;
  const syntaxPanel = document.getElementById('ct-syntax-panel');
  if (!syntaxPanel) return;
  const visible = syntaxPanel.style.display !== 'none';
  syntaxPanel.style.display = visible ? 'none' : 'block';
  if (!visible) {
    const ch = CT_STATE.currentChallenge;
    document.getElementById('ct-syntax-explain-content').innerHTML = ch
      ? `<strong>${ch.topic}</strong> — ${ch.desc || ''}<br><br>Ini adalah contoh <em>${CT_STATE.lang.toUpperCase()}</em> level <em>${CT_STATE.level}</em>. Perhatikan struktur dan indentasi.`
      : 'Tidak ada hint tersedia.';
  }
}

function ctCopyRef() {
  const code = CT_STATE.currentChallenge?.code || '';
  if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
  ctShowToast('📋 Kode disalin!');
}

function ctClearInput() {
  const input = document.getElementById('ct-input');
  if (input) input.value = '';
  CT_STATE.typingStartTime = null;
  CT_STATE.typingFinished = false;
  document.getElementById('ct-result-bar').style.display = 'none';
  ctRenderTypingDisplay('');
}

// ================================================================
// XP & LEVEL
// ================================================================
function ctAddXP(amount) {
  CT_STATE.xp += amount;
  CT_STATE.streak++;
  const xpForLevel = CT_XP_LEVELS[CT_STATE.gameLevel] || 20000;
  if (CT_STATE.xp >= xpForLevel && CT_STATE.gameLevel < CT_XP_LEVELS.length - 1) {
    CT_STATE.gameLevel++;
    ctShowToast('⚡ Level Up! Level ' + CT_STATE.gameLevel);
  }
  ctUpdateUI();
  ctSaveState();
  if (typeof addXP === 'function') addXP(Math.round(amount * 0.4));
}

function ctUpdateUI() {
  const el = id => document.getElementById(id);
  if (!el('ct-xp-val')) return;

  el('ct-xp-val').textContent = CT_STATE.xp;
  el('ct-level-val').textContent = CT_STATE.gameLevel;
  el('ct-streak-val').textContent = CT_STATE.streak;
  el('ct-rank-label').textContent = CT_RANKS[Math.min(CT_STATE.gameLevel - 1, CT_RANKS.length - 1)];

  const xpMin = CT_XP_LEVELS[CT_STATE.gameLevel - 1] || 0;
  const xpMax = CT_XP_LEVELS[CT_STATE.gameLevel] || 20000;
  const pct = Math.min(Math.round(((CT_STATE.xp - xpMin) / (xpMax - xpMin)) * 100), 100);
  el('ct-xp-bar').style.width = pct + '%';
  el('ct-xp-cur').textContent = CT_STATE.xp - xpMin;
  el('ct-xp-nxt').textContent = xpMax - xpMin;

  ctUpdateMasteryBar();
  ctUpdateModeBanner();
}

// ================================================================
// MASTERY TRACKING
// ================================================================
function ctUpdateMastery(key, accuracy, memScore) {
  if (!CT_STATE.mastery[key]) {
    CT_STATE.mastery[key] = { attempts: 0, totalAcc: 0, totalMem: 0, memCount: 0 };
  }
  const m = CT_STATE.mastery[key];
  m.attempts++;
  m.totalAcc += accuracy;
  if (memScore !== null) { m.totalMem += memScore; m.memCount++; }
  m.lastSeen = Date.now();
}

function ctUpdateMasteryBar() {
  const keys = Object.keys(CT_STATE.mastery);
  if (keys.length === 0) return;
  const avg = keys.reduce((sum, k) => {
    const m = CT_STATE.mastery[k];
    return sum + (m.attempts > 0 ? m.totalAcc / m.attempts : 0);
  }, 0) / keys.length;
  const pct = Math.round(avg);
  const el = document.getElementById('ct-mastery-bar-fill');
  const pctEl = document.getElementById('ct-mastery-pct');
  if (el) el.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct;
}

function ctShowMasteryPanel() {
  const overlay = document.getElementById('ct-mastery-overlay');
  const grid = document.getElementById('ct-mastery-grid');
  if (!overlay || !grid) return;

  const keys = Object.keys(CT_STATE.mastery);
  if (keys.length === 0) {
    grid.innerHTML = '<p style="color:var(--text3);font-size:13px">Belum ada data mastery. Selesaikan beberapa challenge!</p>';
  } else {
    grid.innerHTML = keys.map(k => {
      const m = CT_STATE.mastery[k];
      const avgAcc = m.attempts > 0 ? Math.round(m.totalAcc / m.attempts) : 0;
      const avgMem = m.memCount > 0 ? Math.round(m.totalMem / m.memCount) : null;
      const color = avgAcc >= 90 ? '#5de0a0' : avgAcc >= 70 ? '#f7b96a' : '#f76a6a';
      const [lang, level, ...topicParts] = k.split('-');
      return `<div class="ct-mastery-card">
        <div class="mc-lang">${lang?.toUpperCase()} · ${level}</div>
        <div class="mc-topic">${topicParts.join(' ')}</div>
        <div class="mc-bar-w"><div class="mc-bar-f" style="width:${avgAcc}%;background:${color}"></div></div>
        <div class="mc-pct">Acc: ${avgAcc}%${avgMem !== null ? ` · Mem: ${avgMem}%` : ''} · ×${m.attempts}</div>
      </div>`;
    }).join('');
  }
  overlay.style.display = 'flex';
}

function ctHideMasteryPanel() {
  document.getElementById('ct-mastery-overlay').style.display = 'none';
}

// ================================================================
// UTILITIES
// ================================================================
function ctEscHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let ctToastTimer = null;
function ctShowToast(msg) {
  if (typeof showToast === 'function') { showToast('⌨️', msg); return; }
  let toast = document.getElementById('ct-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(ctToastTimer);
  ctToastTimer = setTimeout(() => { if (toast) toast.style.display = 'none'; }, 2500);
}

// ================================================================
// HOOK INTO NAVIGATION
// ================================================================
(function hookNavigate() {
  if (typeof navigate === 'function') {
    const orig = navigate;
    window.navigate = function(page) {
      orig(page);
      if (page === 'codetyper') setTimeout(() => ctInit(), 100);
    };
  }
  if (typeof PAGE_TITLES !== 'undefined') {
    PAGE_TITLES['codetyper'] = 'Code Typer';
  }
})();

// ================================================================
// AUTO-PATCH SIDEBAR & DASHBOARD
// ================================================================
(function patchSidebarDashboard() {
  // Sidebar nav item
  setTimeout(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.querySelector('[onclick*="codetyper"]')) {
      const item = document.createElement('div');
      item.className = 'nav-item';
      item.setAttribute('onclick', "navigate('codetyper')");
      item.innerHTML = '<span class="nav-icon">⌨️</span><span class="nav-label">Code Typer</span>';
      // Insert after HTML Trainer if present, else append to sidebar
      const htItem = sidebar.querySelector('[onclick*="htmltrainer"]');
      if (htItem && htItem.parentNode) htItem.parentNode.insertBefore(item, htItem.nextSibling);
      else sidebar.appendChild(item);
    }
  }, 200);

  // Dashboard mode card
  setTimeout(() => {
    const grid = document.querySelector('.modes-grid');
    if (grid && !grid.querySelector('[data-page="codetyper"]')) {
      const card = document.createElement('div');
      card.className = 'mode-card';
      card.dataset.page = 'codetyper';
      card.style.setProperty('--card-color', '#7c6af7');
      card.setAttribute('onclick', "navigate('codetyper')");
      card.innerHTML = `
        <div class="mode-icon">⌨️</div>
        <h3>Code Typer</h3>
        <p>Typing · Memory · Speed · Exam untuk HTML, CSS, JavaScript, dan Python. Procedural generation — tidak pernah monoton.</p>
        <span class="mode-tag">4 mode · 5 level · 4 bahasa · Live preview</span>
      `;
      grid.appendChild(card);
    }
  }, 600);
})();

console.log('CodeTyper: Module loaded ✓');
