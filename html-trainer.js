// ================================================================
// HTML LEARNING TRAINER — Complete Module for TypeCraft
// 
// HOW TO INTEGRATE:
// 1. Add nav item to sidebar in index.html:
//    <div class="nav-item" onclick="navigate('htmltrainer')">
//      <span class="nav-icon">🌐</span>
//      <span class="nav-label">HTML Trainer</span></div>
//
// 2. Add to PAGE_TITLES object in navigate():
//    htmltrainer: 'HTML Trainer'
//
// 3. Add mode card to dashboard modes-grid (optional)
//
// 4. Call this script AFTER python-trainer.js:
//    <script src="html-trainer.js"></script>
//
// 5. The page HTML is injected automatically on load.
// ================================================================
'use strict';

// ================================================================
// INJECT PAGE HTML INTO DOM
// ================================================================
(function injectHTMLTrainerPage() {
  const main = document.querySelector('.main');
  if (!main) { console.error('HTMLTrainer: .main not found'); return; }

  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';
  pageDiv.id = 'page-htmltrainer';
  pageDiv.innerHTML = `
<!-- ═══ HTML TRAINER PAGE ═══ -->
<div class="ht-header">
  <div class="ht-title-row">
    <div>
      <h2 class="section-title" style="margin-bottom:4px">🌐 HTML Learning Trainer</h2>
      <div style="font-size:13px;color:var(--text3)">Belajar HTML dari dasar sampai profesional — interaktif & bertahap</div>
    </div>
    <div class="ht-header-stats">
      <div class="ht-stat-pill"><span id="ht-xp-display">0</span> XP</div>
      <div class="ht-stat-pill" id="ht-streak-pill">🔥 <span id="ht-streak-display">0</span></div>
      <div class="ht-stat-pill" id="ht-level-pill">Lv <span id="ht-level-display">1</span></div>
    </div>
  </div>

  <!-- XP Bar -->
  <div class="ht-xp-bar-wrap">
    <div class="ht-xp-bar" id="ht-xp-bar" style="width:0%"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
    <span id="ht-rank-label">HTML Beginner</span>
    <span><span id="ht-xp-cur">0</span> / <span id="ht-xp-next">500</span> XP</span>
  </div>
</div>

<!-- Daily Challenge Banner -->
<div class="ht-daily-banner" id="ht-daily-banner">
  <span style="font-size:24px">🎯</span>
  <div>
    <div style="font-weight:700;color:var(--accent4);font-size:14px" id="ht-daily-title">Daily HTML Challenge</div>
    <div style="font-size:12px;color:var(--text2)" id="ht-daily-desc">Selesaikan tantangan hari ini untuk bonus XP!</div>
  </div>
  <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="htStartDailyChallenge()">Mulai</button>
</div>

<!-- Main Layout: Sidebar + Content -->
<div class="ht-layout">

  <!-- LEFT: Level & Topic Sidebar -->
  <div class="ht-sidebar" id="ht-sidebar">
    <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;padding:10px 14px 6px">Kurikulum HTML</div>
    <div id="ht-curriculum-list"></div>
  </div>

  <!-- RIGHT: Content Area -->
  <div class="ht-content" id="ht-content">

    <!-- Welcome Screen -->
    <div id="ht-welcome-screen">
      <div class="ht-hero-card">
        <div style="font-size:48px;margin-bottom:12px">🌐</div>
        <h3 style="font-size:22px;font-weight:700;margin-bottom:8px">Selamat Datang di HTML Trainer!</h3>
        <p style="color:var(--text2);font-size:14px;line-height:1.7;max-width:500px;margin:0 auto 20px">
          Platform belajar HTML interaktif. Setiap topik dilengkapi penjelasan, contoh kode, live preview, quiz, dan latihan coding.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="htStartFromBeginning()">🚀 Mulai dari Awal</button>
          <button class="btn btn-ghost" onclick="htContinueLearning()">▶ Lanjutkan Belajar</button>
        </div>
      </div>
      <!-- Progress Overview -->
      <div class="ht-progress-grid" id="ht-progress-overview"></div>
    </div>

    <!-- Lesson Screen (shown when topic selected) -->
    <div id="ht-lesson-screen" style="display:none">

      <!-- Lesson Nav -->
      <div class="ht-lesson-nav">
        <button class="btn btn-ghost btn-sm" onclick="htPrevLesson()">← Prev</button>
        <div style="text-align:center">
          <div style="font-size:12px;color:var(--text3)" id="ht-lesson-breadcrumb">Level 1 · Dasar HTML</div>
          <div style="font-size:15px;font-weight:700" id="ht-lesson-title">Struktur HTML</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="htNextLesson()">Next →</button>
      </div>

      <!-- Difficulty & Topic Tags -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
        <span class="difficulty-badge" id="ht-diff-badge">Beginner</span>
        <span class="ht-topic-badge" id="ht-topic-badge">HTML Dasar</span>
        <span style="margin-left:auto;font-size:12px;color:var(--text3)" id="ht-lesson-progress-text">Topik 1 dari 8</span>
      </div>

      <!-- Tab Navigation -->
      <div class="ht-tabs" id="ht-tabs">
        <button class="ht-tab active" onclick="htSwitchTab('explain',this)">📖 Materi</button>
        <button class="ht-tab" onclick="htSwitchTab('example',this)">💡 Contoh</button>
        <button class="ht-tab" onclick="htSwitchTab('editor',this)">✏️ Editor</button>
        <button class="ht-tab" onclick="htSwitchTab('quiz',this)">🧠 Quiz</button>
        <button class="ht-tab" onclick="htSwitchTab('challenge',this)">🏆 Challenge</button>
      </div>

      <!-- Tab Contents -->
      <div id="ht-tab-explain" class="ht-tab-content active">
        <div class="ht-lesson-card">
          <div id="ht-explain-content"></div>
        </div>
      </div>

      <div id="ht-tab-example" class="ht-tab-content">
        <div class="ht-lesson-card">
          <div id="ht-example-content"></div>
        </div>
      </div>

      <div id="ht-tab-editor" class="ht-tab-content">
        <div class="ht-editor-wrap">
          <div class="ht-editor-panel">
            <div class="ht-panel-header">
              <span class="panel-dot red"></span><span class="panel-dot yellow"></span><span class="panel-dot green"></span>
              <span style="margin-left:8px;font-size:12px;color:var(--text3)">index.html</span>
              <div style="margin-left:auto;display:flex;gap:6px">
                <button class="btn btn-ghost btn-sm" onclick="htRunCode()">▶ Run</button>
                <button class="btn btn-ghost btn-sm" onclick="htResetCode()">↺ Reset</button>
                <button class="btn btn-ghost btn-sm" onclick="htCopyCode()">📋 Copy</button>
              </div>
            </div>
            <textarea id="ht-code-editor" class="ht-code-editor" spellcheck="false" autocorrect="off" autocapitalize="off"
              oninput="htLiveUpdate()" placeholder="Tulis HTML di sini..."></textarea>
          </div>
          <div class="ht-preview-panel">
            <div class="ht-panel-header">
              <span class="panel-dot red"></span><span class="panel-dot yellow"></span><span class="panel-dot green"></span>
              <span style="margin-left:8px;font-size:12px;color:var(--text3)">Live Preview</span>
              <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="htTogglePreviewSize()">⛶</button>
            </div>
            <iframe id="ht-preview-iframe" class="ht-preview-iframe" sandbox="allow-scripts"></iframe>
          </div>
        </div>
        <!-- Editor Tips -->
        <div class="ht-editor-tips" id="ht-editor-tips"></div>
        <!-- Typing Mode Toggle -->
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px">
          <button class="btn btn-ghost btn-sm" id="ht-typing-mode-btn" onclick="htToggleTypingMode()">⌨️ Typing Mode</button>
          <span style="font-size:12px;color:var(--text3)">Latih mengetik code sekaligus belajar syntax</span>
        </div>
        <!-- Typing Mode Zone -->
        <div id="ht-typing-zone" style="display:none;margin-top:14px">
          <div class="ht-typing-instruction">Ketik ulang code di bawah ini dengan tepat:</div>
          <div id="ht-typing-display" class="ht-typing-display"></div>
          <input type="text" id="ht-typing-input" class="typing-input" placeholder="Mulai ketik..." oninput="htHandleTypingInput(event)" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="margin-top:10px">
          <div class="typing-stats-bar" style="margin-top:10px">
            <div class="ts-item"><div class="ts-val" id="ht-t-wpm">0</div><div class="ts-label">WPM</div></div>
            <div class="ts-item"><div class="ts-val" id="ht-t-acc">100%</div><div class="ts-label">Accuracy</div></div>
            <div class="ts-item"><div class="ts-val" id="ht-t-prog">0%</div><div class="ts-label">Progress</div></div>
          </div>
        </div>
      </div>

      <div id="ht-tab-quiz" class="ht-tab-content">
        <div class="ht-lesson-card" id="ht-quiz-content"></div>
      </div>

      <div id="ht-tab-challenge" class="ht-tab-content">
        <div class="ht-lesson-card" id="ht-challenge-content"></div>
      </div>

      <!-- Complete Lesson Button -->
      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="htCompleteLesson()" id="ht-complete-btn">✅ Selesai & Lanjut</button>
        <button class="btn btn-ghost" onclick="htNextLesson()">Lewati →</button>
        <div id="ht-lesson-complete-badge" style="display:none;align-items:center;gap:6px;background:rgba(93,224,160,0.1);border:1px solid rgba(93,224,160,0.2);padding:6px 14px;border-radius:20px;font-size:12px;color:var(--green)">
          ✓ Topik ini sudah diselesaikan
        </div>
      </div>
    </div>

    <!-- Mode: Drag & Drop -->
    <div id="ht-dragdrop-screen" style="display:none">
      <div class="ht-lesson-card">
        <h3 style="margin-bottom:8px">🧩 Susun Struktur HTML</h3>
        <p style="font-size:13px;color:var(--text2);margin-bottom:16px" id="ht-dd-instruction">Seret tag HTML ke posisi yang benar untuk membuat struktur yang valid.</p>
        <div class="ht-dd-wrap">
          <div class="ht-dd-tags" id="ht-dd-tags"></div>
          <div class="ht-dd-drop" id="ht-dd-drop">
            <div style="color:var(--text3);font-size:13px">Seret tag ke sini dalam urutan yang benar</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn btn-primary btn-sm" onclick="htCheckDragDrop()">✓ Cek Jawaban</button>
          <button class="btn btn-ghost btn-sm" onclick="htResetDragDrop()">↺ Reset</button>
        </div>
        <div id="ht-dd-feedback" style="margin-top:10px;font-size:13px"></div>
      </div>
    </div>

    <!-- Mode: Debug -->
    <div id="ht-debug-screen" style="display:none">
      <div class="ht-lesson-card">
        <h3 style="margin-bottom:8px">🐛 Debug HTML</h3>
        <p style="font-size:13px;color:var(--text2);margin-bottom:12px" id="ht-debug-desc">Temukan dan perbaiki error pada HTML di bawah ini.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:11px;color:var(--red);font-weight:700;margin-bottom:6px">🐛 Code bermasalah:</div>
            <pre id="ht-debug-buggy" class="ht-code-block" style="border-color:rgba(247,106,106,0.2)"></pre>
          </div>
          <div>
            <div style="font-size:11px;color:var(--green);font-weight:700;margin-bottom:6px">✅ Ketik yang sudah diperbaiki:</div>
            <textarea id="ht-debug-input" class="ht-code-editor" style="height:160px;font-size:12px" placeholder="Ketik HTML yang sudah diperbaiki..."></textarea>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn btn-primary btn-sm" onclick="htCheckDebug()">✓ Cek</button>
          <button class="btn btn-ghost btn-sm" onclick="htShowDebugHint()">💡 Hint</button>
        </div>
        <div id="ht-debug-feedback" style="margin-top:10px;font-size:13px"></div>
      </div>
    </div>

  </div><!-- /ht-content -->
</div><!-- /ht-layout -->
`;

  // Insert before closing of .main
  main.appendChild(pageDiv);
  console.log('HTMLTrainer: Page injected ✓');
})();

// ================================================================
// INJECT CSS
// ================================================================
(function injectHTMLTrainerCSS() {
  const style = document.createElement('style');
  style.textContent = `
/* ── HTML TRAINER STYLES ── */
.ht-header{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px 24px;margin-bottom:18px}
.ht-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}
.ht-header-stats{display:flex;gap:8px;flex-wrap:wrap}
.ht-stat-pill{background:var(--bg3);border:1px solid var(--border);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:var(--font-data)}
.ht-xp-bar-wrap{background:var(--bg3);border-radius:4px;height:6px;overflow:hidden}
.ht-xp-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .5s ease}

.ht-daily-banner{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,rgba(247,185,106,.08),rgba(93,224,160,.05));border:1px solid rgba(247,185,106,.2);border-radius:var(--radius);padding:14px 18px;margin-bottom:18px;flex-wrap:wrap}

.ht-layout{display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:start}
@media(max-width:900px){.ht-layout{grid-template-columns:1fr}}

.ht-sidebar{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;position:sticky;top:72px;max-height:calc(100vh - 100px);overflow-y:auto}
.ht-level-item{border-bottom:1px solid var(--border);overflow:hidden}
.ht-level-header{padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--text2);transition:background .15s;user-select:none}
.ht-level-header:hover{background:var(--bg3)}
.ht-level-header.open{color:var(--accent)}
.ht-level-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ht-level-topics{display:none;padding:4px 0}
.ht-level-topics.open{display:block}
.ht-topic-item{padding:7px 14px 7px 28px;font-size:12px;color:var(--text3);cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px;border-left:2px solid transparent}
.ht-topic-item:hover{color:var(--text);background:var(--bg3)}
.ht-topic-item.active{color:var(--accent);background:rgba(124,106,247,.08);border-left-color:var(--accent)}
.ht-topic-item.completed::before{content:'✓';color:var(--green);margin-right:2px;font-size:10px}
.ht-topic-item.locked{opacity:.4;cursor:not-allowed}
.ht-topic-progress{font-size:10px;color:var(--text3);margin-left:auto}

.ht-content{min-height:400px}
.ht-hero-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:40px 32px;text-align:center;margin-bottom:20px}
.ht-progress-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.ht-progress-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;cursor:pointer;transition:all .2s}
.ht-progress-card:hover{transform:translateY(-2px);border-color:rgba(124,106,247,.3)}
.ht-progress-card .pc-icon{font-size:24px;margin-bottom:6px}
.ht-progress-card .pc-name{font-size:12px;font-weight:600;margin-bottom:4px}
.ht-progress-card .pc-bar-wrap{background:var(--bg3);border-radius:3px;height:4px;overflow:hidden}
.ht-progress-card .pc-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .5s}
.ht-progress-card .pc-pct{font-size:10px;color:var(--text3);margin-top:3px}

.ht-lesson-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius)}
.ht-topic-badge{background:rgba(93,224,197,.1);color:var(--accent2);border:1px solid rgba(93,224,197,.2);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:var(--font-mono)}

.ht-tabs{display:flex;gap:4px;background:var(--bg2);padding:4px;border-radius:10px;border:1px solid var(--border);margin-bottom:16px;flex-wrap:wrap}
.ht-tab{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;color:var(--text2);background:transparent;border:none;font-family:var(--font-ui)}
.ht-tab.active{background:var(--accent);color:#fff}
.ht-tab:hover:not(.active){background:var(--bg3);color:var(--text)}

.ht-tab-content{display:none}
.ht-tab-content.active{display:block}

.ht-lesson-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 28px}
.ht-lesson-card h3{font-size:18px;font-weight:700;margin-bottom:12px;color:var(--text)}
.ht-lesson-card h4{font-size:14px;font-weight:700;color:var(--accent);margin:16px 0 8px;display:flex;align-items:center;gap:6px}
.ht-lesson-card p{font-size:13px;color:var(--text2);line-height:1.75;margin-bottom:10px}
.ht-lesson-card ul,.ht-lesson-card ol{font-size:13px;color:var(--text2);line-height:1.75;padding-left:18px;margin-bottom:10px}
.ht-lesson-card li{margin-bottom:4px}
.ht-lesson-card strong{color:var(--text);font-weight:700}
.ht-lesson-card code{font-family:var(--font-mono);font-size:12px;background:var(--bg3);padding:2px 6px;border-radius:5px;color:var(--accent2)}

.ht-code-block{font-family:var(--font-mono);font-size:13px;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px;white-space:pre-wrap;word-break:break-all;color:var(--text2);line-height:1.75;margin:10px 0;overflow:auto;max-height:320px}
.ht-copy-row{display:flex;justify-content:flex-end;margin-top:-4px;margin-bottom:8px}
.ht-copy-btn{background:var(--bg3);border:1px solid var(--border);color:var(--text3);padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer;font-family:var(--font-ui);transition:all .15s}
.ht-copy-btn:hover{color:var(--text)}

.ht-preview-box{background:#fff;border-radius:10px;border:1px solid var(--border);overflow:hidden;min-height:80px}
.ht-preview-box iframe{width:100%;border:none;min-height:80px;display:block}

.ht-tip-box{background:rgba(93,224,197,.06);border:1px solid rgba(93,224,197,.15);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--accent2);line-height:1.6;margin:10px 0;display:flex;gap:8px;align-items:flex-start}
.ht-warn-box{background:rgba(247,185,106,.07);border:1px solid rgba(247,185,106,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--accent4);line-height:1.6;margin:10px 0;display:flex;gap:8px;align-items:flex-start}
.ht-error-box{background:rgba(247,106,106,.07);border:1px solid rgba(247,106,106,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);line-height:1.6;margin:10px 0;display:flex;gap:8px;align-items:flex-start}

/* Editor */
.ht-editor-wrap{display:grid;grid-template-columns:1fr 1fr;gap:12px;min-height:340px}
@media(max-width:700px){.ht-editor-wrap{grid-template-columns:1fr}}
.ht-editor-panel,.ht-preview-panel{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column}
.ht-panel-header{padding:8px 14px;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;flex-shrink:0}
.ht-code-editor{flex:1;padding:14px 16px;font-family:var(--font-mono);font-size:13px;line-height:1.75;background:var(--bg);border:none;color:var(--text);outline:none;resize:vertical;min-height:220px;caret-color:var(--accent);tab-size:2}
.ht-preview-iframe{flex:1;background:#fff;border:none;width:100%;min-height:220px}
.ht-editor-tips{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-top:10px;font-size:12px;color:var(--text3);line-height:1.6}

/* Typing Mode */
.ht-typing-instruction{font-size:11px;color:var(--text3);font-family:var(--font-mono);margin-bottom:8px}
.ht-typing-display{font-family:var(--font-mono);font-size:14px;line-height:1.85;background:var(--bg);border-radius:8px;padding:12px 14px;border:1px solid var(--border);user-select:none;white-space:pre-wrap;word-break:break-all}

/* Quiz */
.ht-quiz-option{width:100%;text-align:left;padding:10px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;color:var(--text2);cursor:pointer;font-size:13px;font-family:var(--font-ui);transition:all .2s;margin-bottom:8px;display:block}
.ht-quiz-option:hover{background:var(--bg3);color:var(--text)}
.ht-quiz-option.correct{background:rgba(93,224,160,.12);border-color:var(--green);color:var(--green)}
.ht-quiz-option.wrong{background:rgba(247,106,106,.1);border-color:var(--red);color:var(--red)}
.ht-quiz-result{margin-top:12px;padding:10px 16px;border-radius:8px;font-size:13px;line-height:1.6}
.ht-quiz-result.pass{background:rgba(93,224,160,.1);border:1px solid rgba(93,224,160,.2);color:var(--green)}
.ht-quiz-result.fail{background:rgba(247,106,106,.08);border:1px solid rgba(247,106,106,.2);color:var(--red)}

/* Drag-drop */
.ht-dd-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:600px){.ht-dd-wrap{grid-template-columns:1fr}}
.ht-dd-tags{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:var(--bg3);border-radius:8px;min-height:80px;align-content:flex-start}
.ht-dd-drop{min-height:160px;border:2px dashed rgba(124,106,247,.3);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:6px;align-items:flex-start;justify-content:flex-start;transition:border-color .2s}
.ht-dd-drop.dragover{border-color:var(--accent);background:rgba(124,106,247,.05)}
.ht-dd-tag{padding:5px 12px;background:var(--bg2);border:1px solid rgba(124,106,247,.3);border-radius:6px;font-size:12px;font-family:var(--font-mono);color:var(--accent);cursor:grab;transition:all .15s;user-select:none}
.ht-dd-tag:hover{background:rgba(124,106,247,.1)}
.ht-dd-tag.placed{background:var(--bg3);color:var(--text2);cursor:grab}

/* Achievement popup */
.ht-badge-popup{position:fixed;top:70px;left:50%;transform:translateX(-50%) translateY(-120px);background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;z-index:999;transition:transform .4s cubic-bezier(.34,1.56,.64,1);box-shadow:0 4px 24px rgba(124,106,247,.5);white-space:nowrap;pointer-events:none;display:flex;align-items:center;gap:8px}
.ht-badge-popup.show{transform:translateX(-50%) translateY(0)}
`;
  document.head.appendChild(style);
})();

// ================================================================
// CURRICULUM DATA — 12 Levels, 60+ Topics
// ================================================================
const HT_CURRICULUM = [
  {
    id: 1, name: 'Dasar HTML', icon: '🏗️', color: '#5de0a0',
    topics: [
      {
        id: 'l1t1', title: 'Apa itu HTML?', diff: 'beginner',
        explain: `
<h3>Apa itu HTML?</h3>
<p><strong>HTML</strong> singkatan dari <strong>HyperText Markup Language</strong>. HTML adalah bahasa yang digunakan untuk membuat struktur dan konten halaman web.</p>
<h4>🔑 Konsep Dasar</h4>
<ul>
  <li><strong>HyperText</strong> — teks yang bisa menghubungkan ke halaman lain melalui link</li>
  <li><strong>Markup</strong> — cara menandai (tag) teks agar browser tahu cara menampilkannya</li>
  <li><strong>Language</strong> — bahasa yang dipahami oleh browser web</li>
</ul>
<h4>📌 HTML bukan programming language!</h4>
<p>HTML adalah <em>markup language</em> — ia mendeskripsikan <strong>struktur</strong> halaman, bukan logika program. Untuk logika gunakan JavaScript.</p>
<div class="ht-tip-box">💡 <span>Browser seperti Chrome, Firefox, Safari membaca HTML dan menampilkannya sebagai halaman web yang kamu lihat sehari-hari.</span></div>
<h4>🌐 Bagaimana HTML bekerja?</h4>
<ol>
  <li>Kamu menulis file <code>.html</code></li>
  <li>Browser membaca file tersebut</li>
  <li>Browser menampilkannya sebagai halaman web</li>
</ol>
`,
        example: `<!DOCTYPE html>
<html>
  <head>
    <title>Halaman Pertamaku</title>
  </head>
  <body>
    <h1>Halo Dunia!</h1>
    <p>Ini halaman HTML pertamaku.</p>
  </body>
</html>`,
        previewNote: 'Browser akan menampilkan judul "Halo Dunia!" dan paragraf di bawahnya.',
        editorStarter: `<!DOCTYPE html>
<html>
  <head>
    <title>Latihan HTML</title>
  </head>
  <body>
    <h1>Halo, ini HTML pertamaku!</h1>
    <p>HTML sangat mudah dipelajari.</p>
  </body>
</html>`,
        editorTask: 'Coba ganti teks di dalam <h1> dan <p> dengan kata-katamu sendiri. Klik Run untuk melihat hasilnya!',
        quiz: {
          q: 'Apa kepanjangan dari HTML?',
          options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Making Language', 'Home Tool Markup Language'],
          correct: 0,
          explanation: 'HTML = HyperText Markup Language — bahasa markup untuk membuat halaman web.',
        },
        challenge: {
          title: 'Buat Halaman Perkenalan',
          desc: 'Buat halaman HTML sederhana yang berisi namamu, umurmu, dan hobimu. Gunakan tag <h1>, <p>.',
          starter: `<!DOCTYPE html>\n<html>\n  <head><title>Perkenalan</title></head>\n  <body>\n    <!-- Tulis perkenalan dirimu di sini -->\n  </body>\n</html>`,
          hint: 'Gunakan <h1> untuk nama, <p> untuk informasi lainnya.',
        },
        xp: 30,
      },
      {
        id: 'l1t2', title: 'Struktur HTML & DOCTYPE', diff: 'beginner',
        explain: `
<h3>Struktur Dasar HTML</h3>
<p>Setiap halaman HTML yang valid harus memiliki struktur dasar seperti ini:</p>
<h4>🔑 Bagian-bagian Penting</h4>
<ul>
  <li><code>&lt;!DOCTYPE html&gt;</code> — Deklarasi dokumen HTML5. Selalu tulis di baris pertama.</li>
  <li><code>&lt;html&gt;</code> — Root element, semua konten HTML ada di dalamnya</li>
  <li><code>&lt;head&gt;</code> — Berisi informasi meta, link CSS, judul (tidak ditampilkan di halaman)</li>
  <li><code>&lt;body&gt;</code> — Berisi semua konten yang DITAMPILKAN di browser</li>
</ul>
<h4>📌 Aturan Tag HTML</h4>
<ul>
  <li>Tag pembuka: <code>&lt;tagname&gt;</code></li>
  <li>Tag penutup: <code>&lt;/tagname&gt;</code> (ada slash /)</li>
  <li>Konten berada di antara tag pembuka dan penutup</li>
  <li>Tag self-closing (tidak butuh penutup): <code>&lt;br&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;hr&gt;</code></li>
</ul>
<div class="ht-warn-box">⚠️ <span>Selalu tutup tag yang kamu buka! Lupa menutup tag adalah error paling umum pemula.</span></div>
`,
        example: `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Judul Halaman</title>
  </head>
  <body>
    <!-- Ini adalah komentar HTML -->
    <h1>Konten di sini</h1>
    <p>Paragraf pertama.</p>
  </body>
</html>`,
        editorStarter: `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <title>Struktur HTML</title>
  </head>
  <body>
    <h1>Belajar Struktur HTML</h1>
    <p>Semua konten ada di dalam tag &lt;body&gt;</p>
  </body>
</html>`,
        editorTask: 'Tambahkan tag <meta name="description" content="Deskripsi halamanku"> di dalam <head>. Amati apa yang terjadi.',
        quiz: {
          q: 'Di mana konten yang ditampilkan browser harus diletakkan?',
          options: ['Di dalam <head>', 'Di dalam <body>', 'Di luar <html>', 'Di dalam <title>'],
          correct: 1,
          explanation: 'Semua konten yang ingin ditampilkan di browser harus ada di dalam tag <body>.',
        },
        challenge: {
          title: 'Buat Struktur HTML Lengkap',
          desc: 'Buat halaman HTML dengan struktur lengkap: DOCTYPE, html, head (dengan title dan meta charset), dan body dengan minimal 2 elemen.',
          starter: '<!-- Tulis struktur HTML lengkap di sini -->',
          hint: 'Mulai dari <!DOCTYPE html>, lalu <html>, <head>, <body>.',
        },
        xp: 40,
      },
      {
        id: 'l1t3', title: 'Komentar HTML', diff: 'beginner',
        explain: `
<h3>Komentar di HTML</h3>
<p>Komentar adalah teks di dalam kode yang <strong>tidak ditampilkan di browser</strong>. Berguna untuk mencatat penjelasan atau menonaktifkan kode sementara.</p>
<h4>📝 Syntax Komentar</h4>
<p>Komentar HTML ditulis menggunakan <code>&lt;!-- --&gt;</code></p>
<h4>🎯 Kapan menggunakan komentar?</h4>
<ul>
  <li>Menjelaskan tujuan suatu bagian kode</li>
  <li>Menonaktifkan kode sementara saat debugging</li>
  <li>Membagi halaman menjadi section yang jelas</li>
  <li>Catatan untuk developer lain (atau dirimu sendiri di masa depan)</li>
</ul>
<div class="ht-tip-box">💡 <span>Komentar bisa lebih dari satu baris. Mulai dengan &lt;!-- dan akhiri dengan --> di mana saja.</span></div>
<div class="ht-warn-box">⚠️ <span>Komentar HTML tetap bisa dilihat orang melalui "View Source". Jangan letakkan informasi rahasia di komentar!</span></div>
`,
        example: `<!-- Ini komentar satu baris -->

<h1>Judul Halaman</h1>

<!-- 
  Ini komentar
  lebih dari satu baris
  untuk penjelasan panjang
-->

<!-- HEADER SECTION -->
<header>
  <nav>...</nav>
</header>

<!-- MAIN CONTENT -->
<main>
  <!-- <p>Paragraf ini dinonaktifkan sementara</p> -->
  <p>Paragraf yang aktif.</p>
</main>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Komentar HTML</title></head>
  <body>
    <!-- Section: Judul -->
    <h1>Belajar HTML</h1>
    
    <!-- Section: Konten Utama -->
    <p>Komentar tidak terlihat di browser.</p>
    
    <!-- <p>Baris ini di-comment, tidak akan muncul</p> -->
  </body>
</html>`,
        editorTask: 'Tambahkan komentar yang menjelaskan setiap bagian kode. Coba juga comment-out salah satu tag <p>.',
        quiz: {
          q: 'Manakah syntax komentar HTML yang benar?',
          options: ['// Ini komentar', '<!-- Ini komentar -->', '/* Ini komentar */', '# Ini komentar'],
          correct: 1,
          explanation: 'Komentar HTML menggunakan format <!-- komentar -->, berbeda dari JavaScript (//) atau CSS (/* */).',
        },
        challenge: { title: 'Buat Kode dengan Komentar', desc: 'Buat halaman HTML dengan minimal 3 section (header, main, footer) dan beri komentar pada setiap section.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Dengan Komentar</title></head>\n  <body>\n    <!-- Tambahkan section dengan komentar -->\n  </body>\n</html>`, hint: 'Gunakan <!-- NAMA SECTION --> sebelum setiap bagian.' },
        xp: 25,
      },
    ]
  },
  {
    id: 2, name: 'Teks & Konten', icon: '📝', color: '#60a5fa',
    topics: [
      {
        id: 'l2t1', title: 'Heading h1–h6', diff: 'beginner',
        explain: `
<h3>Tag Heading HTML</h3>
<p>HTML menyediakan 6 level heading dari <code>&lt;h1&gt;</code> (terbesar/terpenting) sampai <code>&lt;h6&gt;</code> (terkecil).</p>
<h4>🔑 Hierarki Heading</h4>
<ul>
  <li><code>&lt;h1&gt;</code> — Judul utama halaman (hanya 1 per halaman, penting untuk SEO)</li>
  <li><code>&lt;h2&gt;</code> — Judul section utama</li>
  <li><code>&lt;h3&gt;</code> — Sub-judul dari h2</li>
  <li><code>&lt;h4&gt;</code> — Sub-judul dari h3</li>
  <li><code>&lt;h5&gt;</code>, <code>&lt;h6&gt;</code> — Jarang digunakan, untuk hierarki yang sangat dalam</li>
</ul>
<div class="ht-tip-box">💡 <span>Gunakan heading secara berurutan. Jangan lompat dari h1 langsung ke h4 — ini penting untuk aksesibilitas dan SEO!</span></div>
<div class="ht-warn-box">⚠️ <span>Jangan gunakan heading hanya untuk membuat teks lebih besar/tebal. Gunakan CSS untuk styling.</span></div>
`,
        example: `<h1>Judul Halaman Utama</h1>
<h2>Section Pertama</h2>
<h3>Sub-section</h3>
<h4>Sub-sub-section</h4>
<h5>Level 5</h5>
<h6>Level 6 — Terkecil</h6>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Heading HTML</title></head>
  <body>
    <h1>Blog Teknologi</h1>
    <h2>Artikel Terbaru</h2>
    <h3>1. Belajar HTML</h3>
    <p>HTML adalah pondasi web development.</p>
    <h3>2. Belajar CSS</h3>
    <p>CSS digunakan untuk styling halaman.</p>
    <h2>Tentang</h2>
    <p>Blog ini membahas teknologi web.</p>
  </body>
</html>`,
        editorTask: 'Buat struktur artikel blog dengan h1 sebagai nama blog, h2 untuk kategori, dan h3 untuk judul artikel.',
        quiz: { q: 'Berapa kali tag <h1> sebaiknya digunakan dalam satu halaman?', options: ['Sesuka hati', 'Hanya 1 kali', 'Maksimal 3 kali', 'Tidak boleh digunakan'], correct: 1, explanation: 'Best practice: gunakan <h1> hanya 1 kali per halaman sebagai judul utama, penting untuk SEO.' },
        challenge: { title: 'Buat Struktur Artikel', desc: 'Buat outline artikel dengan h1 (judul), h2 (2 section), dan h3 (2 sub-section di setiap h2). Total: 1+2+4 heading.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Artikel</title></head>\n  <body>\n    <!-- Buat struktur heading yang benar -->\n  </body>\n</html>`, hint: 'Bayangkan seperti daftar isi buku.' },
        xp: 35,
      },
      {
        id: 'l2t2', title: 'Paragraf & Format Teks', diff: 'beginner',
        explain: `
<h3>Tag Teks di HTML</h3>
<h4>📌 Tag-tag Penting</h4>
<ul>
  <li><code>&lt;p&gt;</code> — Paragraf. Browser otomatis menambahkan spasi atas-bawah.</li>
  <li><code>&lt;br&gt;</code> — Line break (pindah baris tanpa paragraf baru). Self-closing.</li>
  <li><code>&lt;hr&gt;</code> — Horizontal rule (garis pemisah). Self-closing.</li>
  <li><code>&lt;strong&gt;</code> — Teks penting, ditampilkan <strong>tebal</strong>. Punya makna semantik.</li>
  <li><code>&lt;em&gt;</code> — Teks yang ditekankan, ditampilkan <em>miring</em>. Punya makna semantik.</li>
  <li><code>&lt;b&gt;</code> — Tebal tanpa makna semantik (hanya visual).</li>
  <li><code>&lt;i&gt;</code> — Miring tanpa makna semantik (hanya visual).</li>
  <li><code>&lt;mark&gt;</code> — <mark>Highlight</mark> teks seperti stabilo kuning.</li>
  <li><code>&lt;small&gt;</code> — <small>Teks kecil</small> untuk fine print.</li>
  <li><code>&lt;sub&gt;</code> — Subscript: H<sub>2</sub>O</li>
  <li><code>&lt;sup&gt;</code> — Superscript: x<sup>2</sup></li>
</ul>
<div class="ht-tip-box">💡 <span>Gunakan &lt;strong&gt; dan &lt;em&gt; bukan &lt;b&gt; dan &lt;i&gt; untuk konten yang benar-benar penting — screen reader akan mengumumkannya berbeda.</span></div>
`,
        example: `<p>Ini adalah <strong>teks penting</strong> dan ini <em>ditekankan</em>.</p>
<p>Baris pertama.<br>Baris kedua setelah br.</p>
<hr>
<p>Rumus air: H<sub>2</sub>O</p>
<p>Einstein: E=mc<sup>2</sup></p>
<p><mark>Ini di-highlight</mark> dengan tag mark.</p>
<p><small>Hak cipta 2024. Semua hak dilindungi.</small></p>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Format Teks</title></head>
  <body>
    <h1>Artikel Sains</h1>
    <p>Air memiliki rumus kimia H<sub>2</sub>O dan titik didih 100<sup>o</sup>C.</p>
    <p>Fakta <strong>paling penting</strong>: air sangat <em>vital</em> bagi kehidupan.</p>
    <hr>
    <p>Baris 1<br>Baris 2<br>Baris 3</p>
    <p><mark>Catatan penting ini</mark> perlu diperhatikan.</p>
    <p><small>Sumber: Wikipedia, 2024</small></p>
  </body>
</html>`,
        editorTask: 'Tambahkan <strong>, <em>, <mark>, <sub>, dan <sup> di tempat yang tepat sesuai konteks.',
        quiz: { q: 'Perbedaan utama <strong> dan <b> adalah?', options: ['Tidak ada perbedaan', '<strong> punya makna semantik, <b> hanya visual', '<b> lebih tebal dari <strong>', '<strong> hanya untuk heading'], correct: 1, explanation: '<strong> menandai konten penting secara semantik (dimengerti screen reader), <b> hanya membuat teks tebal secara visual.' },
        challenge: { title: 'Artikel dengan Format Teks', desc: 'Buat artikel singkat tentang topik favoritmu dengan menggunakan minimal 5 tag teks berbeda.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Artikel</title></head>\n  <body>\n    <h1>Judul Artikel</h1>\n    <!-- Gunakan berbagai tag teks -->\n  </body>\n</html>`, hint: 'Gunakan strong untuk kata kunci, em untuk istilah, mark untuk highlight, sub/sup untuk formula.' },
        xp: 40,
      },
    ]
  },
  {
    id: 3, name: 'Link & Media', icon: '🔗', color: '#f7b96a',
    topics: [
      {
        id: 'l3t1', title: 'Link dengan tag <a>', diff: 'beginner',
        explain: `
<h3>Membuat Link dengan Tag &lt;a&gt;</h3>
<p>Tag <code>&lt;a&gt;</code> (anchor) digunakan untuk membuat hyperlink — tautan ke halaman lain, file, email, atau bagian lain di halaman yang sama.</p>
<h4>🔑 Atribut Penting</h4>
<ul>
  <li><code>href</code> — URL tujuan link (WAJIB)</li>
  <li><code>target="_blank"</code> — Buka di tab baru</li>
  <li><code>target="_self"</code> — Buka di tab yang sama (default)</li>
  <li><code>rel="noopener noreferrer"</code> — Keamanan untuk target="_blank"</li>
  <li><code>title</code> — Tooltip saat hover</li>
</ul>
<h4>📌 Jenis-jenis Link</h4>
<ul>
  <li><strong>Link eksternal:</strong> <code>href="https://google.com"</code></li>
  <li><strong>Link internal:</strong> <code>href="halaman-lain.html"</code></li>
  <li><strong>Link anchor:</strong> <code>href="#section-id"</code></li>
  <li><strong>Link email:</strong> <code>href="mailto:user@email.com"</code></li>
  <li><strong>Link telepon:</strong> <code>href="tel:+628123456789"</code></li>
</ul>
<div class="ht-tip-box">💡 <span>Selalu gunakan rel="noopener noreferrer" bersama target="_blank" untuk keamanan.</span></div>
`,
        example: `<!-- Link eksternal -->
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Buka Google
</a>

<!-- Link internal -->
<a href="tentang.html">Halaman Tentang</a>

<!-- Link ke section di halaman sama -->
<a href="#kontak">Ke Bagian Kontak</a>

<!-- Link email -->
<a href="mailto:halo@email.com">Kirim Email</a>

<!-- Link dengan title -->
<a href="https://github.com" title="Kunjungi GitHub" target="_blank">
  GitHub
</a>

<!-- Anchor target -->
<section id="kontak">
  <h2>Kontak</h2>
</section>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Link HTML</title></head>
  <body>
    <h1>Navigasi</h1>
    <nav>
      <a href="#tentang">Tentang</a> |
      <a href="#kontak">Kontak</a> |
      <a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
    </nav>
    
    <section id="tentang">
      <h2>Tentang</h2>
      <p>Ini halaman tentang kami.</p>
    </section>
    
    <section id="kontak">
      <h2>Kontak</h2>
      <a href="mailto:halo@contoh.com">Kirim Email</a>
    </section>
  </body>
</html>`,
        editorTask: 'Buat navigation bar dengan link ke setiap section di halaman, dan tambahkan link eksternal ke situs favoritmu.',
        quiz: { q: 'Atribut apa yang WAJIB ada di tag <a>?', options: ['target', 'href', 'rel', 'title'], correct: 1, explanation: 'Atribut href adalah wajib — tanpa href, <a> tidak memiliki tujuan link.' },
        challenge: { title: 'Buat Navigation Page', desc: 'Buat halaman dengan navbar berisi 4 link (2 anchor link, 1 email, 1 eksternal). Semua link harus berfungsi.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Navigation</title></head>\n  <body>\n    <!-- Buat navbar dan section yang bisa dilinkkan -->\n  </body>\n</html>`, hint: 'Gunakan id="nama" pada section, lalu href="#nama" pada link.' },
        xp: 45,
      },
      {
        id: 'l3t2', title: 'Gambar dengan tag <img>', diff: 'beginner',
        explain: `
<h3>Menampilkan Gambar dengan &lt;img&gt;</h3>
<p>Tag <code>&lt;img&gt;</code> digunakan untuk menampilkan gambar di halaman web. Ini adalah tag <em>self-closing</em> (tidak perlu tag penutup).</p>
<h4>🔑 Atribut Penting</h4>
<ul>
  <li><code>src</code> — URL/path gambar (WAJIB)</li>
  <li><code>alt</code> — Teks alternatif (WAJIB untuk aksesibilitas & SEO)</li>
  <li><code>width</code> — Lebar gambar (px atau %)</li>
  <li><code>height</code> — Tinggi gambar</li>
  <li><code>loading="lazy"</code> — Gambar dimuat hanya saat terlihat (performa)</li>
  <li><code>title</code> — Tooltip saat hover</li>
</ul>
<div class="ht-error-box">🚫 <span>JANGAN pernah menghilangkan atribut <code>alt</code>! Ini penting untuk aksesibilitas dan SEO. Jika gambar dekoratif, gunakan alt="" (kosong).</span></div>
<div class="ht-tip-box">💡 <span>Gunakan format WebP untuk gambar yang lebih kecil dan cepat. Format JPEG untuk foto, PNG untuk gambar transparan.</span></div>
`,
        example: `<!-- Gambar dari URL -->
<img src="https://picsum.photos/400/200" alt="Foto landscape acak" width="400" height="200">

<!-- Gambar lokal -->
<img src="images/logo.png" alt="Logo perusahaan" width="120">

<!-- Gambar dengan lazy loading -->
<img src="foto-besar.jpg" alt="Deskripsi foto" loading="lazy" width="800" height="600">

<!-- Gambar sebagai link -->
<a href="https://google.com">
  <img src="google-logo.png" alt="Google" width="200">
</a>

<!-- Gambar dekoratif (alt kosong) -->
<img src="dekorasi.png" alt="" role="presentation">`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Gambar HTML</title></head>
  <body>
    <h1>Galeri Foto</h1>
    <img src="https://picsum.photos/400/250?random=1" alt="Foto pemandangan 1" width="400" height="250">
    <img src="https://picsum.photos/400/250?random=2" alt="Foto pemandangan 2" width="400" height="250">
    <p>Klik gambar untuk membuka:</p>
    <a href="https://picsum.photos" target="_blank">
      <img src="https://picsum.photos/300/200?random=3" alt="Link ke Picsum" width="300" height="200">
    </a>
  </body>
</html>`,
        editorTask: 'Buat galeri 3 gambar dari URL, masing-masing dengan alt yang deskriptif dan ukuran yang sesuai.',
        quiz: { q: 'Mengapa atribut alt penting pada tag <img>?', options: ['Untuk menampilkan gambar lebih besar', 'Untuk aksesibilitas dan SEO', 'Agar gambar dimuat lebih cepat', 'Untuk mengubah warna gambar'], correct: 1, explanation: 'Alt text penting untuk screen reader (aksesibilitas), muncul saat gambar gagal dimuat, dan membantu mesin pencari memahami gambar (SEO).' },
        challenge: { title: 'Halaman Profil dengan Foto', desc: 'Buat halaman profil dengan foto profil (dari picsum.photos), nama, dan bio singkat. Foto harus bisa diklik dan membuka URL gambar.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Profil</title></head>\n  <body>\n    <!-- Buat halaman profil dengan gambar -->\n  </body>\n</html>`, hint: 'Wrap img di dalam tag <a> agar bisa diklik.' },
        xp: 45,
      },
    ]
  },
  {
    id: 4, name: 'List & Tabel', icon: '📋', color: '#a78bfa',
    topics: [
      {
        id: 'l4t1', title: 'Unordered & Ordered List', diff: 'beginner',
        explain: `
<h3>List di HTML</h3>
<h4>📌 Jenis List</h4>
<ul>
  <li><code>&lt;ul&gt;</code> (Unordered List) — Daftar dengan bullet point (•). Untuk item yang tidak perlu urutan.</li>
  <li><code>&lt;ol&gt;</code> (Ordered List) — Daftar bernomor (1, 2, 3...). Untuk item yang perlu urutan.</li>
  <li><code>&lt;li&gt;</code> (List Item) — Item di dalam ul atau ol. Selalu di dalam ul/ol.</li>
  <li><code>&lt;dl&gt;</code> — Definition list (daftar istilah dan definisi)</li>
</ul>
<h4>🔑 Atribut ol</h4>
<ul>
  <li><code>type="1"</code> — Angka (default)</li>
  <li><code>type="A"</code> — Huruf besar</li>
  <li><code>type="a"</code> — Huruf kecil</li>
  <li><code>type="I"</code> — Romawi besar</li>
  <li><code>start="5"</code> — Mulai dari angka 5</li>
</ul>
<div class="ht-tip-box">💡 <span>List bisa di-nest (list di dalam list item) untuk membuat sub-list. Sangat berguna untuk menu navigasi dan outline.</span></div>
`,
        example: `<!-- Unordered List -->
<h2>Belanjaan</h2>
<ul>
  <li>Apel</li>
  <li>Jeruk</li>
  <li>Mangga</li>
</ul>

<!-- Ordered List -->
<h2>Cara Membuat Nasi Goreng</h2>
<ol>
  <li>Panaskan minyak</li>
  <li>Masukkan nasi</li>
  <li>Aduk rata</li>
  <li>Tambahkan bumbu</li>
  <li>Sajikan</li>
</ol>

<!-- Nested List -->
<ul>
  <li>Buah
    <ul>
      <li>Apel</li>
      <li>Jeruk</li>
    </ul>
  </li>
  <li>Sayur
    <ul>
      <li>Bayam</li>
      <li>Wortel</li>
    </ul>
  </li>
</ul>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>List HTML</title></head>
  <body>
    <h1>Menu Restoran</h1>
    <h2>Makanan Utama</h2>
    <ul>
      <li>Nasi Goreng - Rp 25.000</li>
      <li>Mie Goreng - Rp 22.000</li>
      <li>Ayam Bakar - Rp 35.000</li>
    </ul>
    
    <h2>Cara Pesan</h2>
    <ol>
      <li>Pilih menu</li>
      <li>Hubungi kasir</li>
      <li>Bayar</li>
      <li>Tunggu pesanan</li>
    </ol>
  </body>
</html>`,
        editorTask: 'Tambahkan sub-menu menggunakan nested list. Buat kategori Minuman dengan sub-item hot dan cold.',
        quiz: { q: 'Tag apa yang digunakan untuk item di dalam list?', options: ['<list>', '<item>', '<li>', '<ul>'], correct: 2, explanation: '<li> (list item) digunakan untuk setiap item di dalam <ul> atau <ol>.' },
        challenge: { title: 'Daftar Isi Buku', desc: 'Buat daftar isi buku dengan ol untuk chapter utama dan ul untuk sub-topik di setiap chapter. Minimal 3 chapter, masing-masing 3 sub-topik.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Daftar Isi</title></head>\n  <body>\n    <h1>Daftar Isi: Belajar HTML</h1>\n    <!-- Buat daftar isi yang terstruktur -->\n  </body>\n</html>`, hint: 'Nested list: li > ul > li untuk sub-topik.' },
        xp: 40,
      },
      {
        id: 'l4t2', title: 'Tabel HTML', diff: 'intermediate',
        explain: `
<h3>Membuat Tabel di HTML</h3>
<h4>🔑 Tag-tag Tabel</h4>
<ul>
  <li><code>&lt;table&gt;</code> — Container tabel</li>
  <li><code>&lt;thead&gt;</code> — Bagian header tabel</li>
  <li><code>&lt;tbody&gt;</code> — Bagian isi/body tabel</li>
  <li><code>&lt;tfoot&gt;</code> — Bagian footer tabel</li>
  <li><code>&lt;tr&gt;</code> — Table Row (baris)</li>
  <li><code>&lt;th&gt;</code> — Table Header (header kolom, otomatis tebal dan center)</li>
  <li><code>&lt;td&gt;</code> — Table Data (sel data biasa)</li>
</ul>
<h4>📌 Atribut Penggabungan Sel</h4>
<ul>
  <li><code>colspan="2"</code> — Sel menggabungkan 2 kolom</li>
  <li><code>rowspan="3"</code> — Sel menggabungkan 3 baris</li>
</ul>
<div class="ht-tip-box">💡 <span>Gunakan <thead>, <tbody>, <tfoot> untuk struktur tabel yang benar. Ini membantu aksesibilitas dan CSS styling.</span></div>
<div class="ht-warn-box">⚠️ <span>Jangan gunakan tabel untuk layout halaman! Tabel hanya untuk data tabular.</span></div>
`,
        example: `<table border="1" style="border-collapse:collapse;width:100%">
  <thead>
    <tr>
      <th>Nama</th>
      <th>Nilai</th>
      <th>Grade</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>92</td>
      <td>A</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>78</td>
      <td>B</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Rata-rata</td>
      <td>85</td>
    </tr>
  </tfoot>
</table>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Tabel HTML</title></head>
  <body>
    <h1>Jadwal Pelajaran</h1>
    <table border="1" style="border-collapse:collapse;width:100%;font-family:sans-serif">
      <thead style="background:#f0f0f0">
        <tr>
          <th style="padding:8px">Hari</th>
          <th style="padding:8px">08:00</th>
          <th style="padding:8px">10:00</th>
          <th style="padding:8px">13:00</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px">Senin</td>
          <td style="padding:8px">Matematika</td>
          <td style="padding:8px">Bahasa</td>
          <td style="padding:8px">Sains</td>
        </tr>
        <tr>
          <td style="padding:8px">Selasa</td>
          <td style="padding:8px">Seni</td>
          <td style="padding:8px">Olahraga</td>
          <td style="padding:8px">Komputer</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`,
        editorTask: 'Tambahkan baris untuk Rabu dan gunakan colspan untuk menggabungkan kolom "Bebas" selama 2 jam.',
        quiz: { q: 'Apa perbedaan <th> dan <td>?', options: ['Tidak ada perbedaan', '<th> untuk header (tebal+center), <td> untuk data biasa', '<td> hanya untuk kolom pertama', '<th> tidak bisa digunakan di tbody'], correct: 1, explanation: '<th> adalah table header — otomatis bold dan center, punya makna semantik sebagai judul kolom/baris. <td> untuk data biasa.' },
        challenge: { title: 'Tabel Perbandingan Produk', desc: 'Buat tabel perbandingan 3 produk dengan 5 fitur. Gunakan thead, tbody, tfoot. Gunakan colspan di footer untuk total/kesimpulan.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Perbandingan</title></head>\n  <body>\n    <h1>Perbandingan Produk</h1>\n    <!-- Buat tabel perbandingan -->\n  </body>\n</html>`, hint: 'Struktur: thead(fitur), tbody(data produk), tfoot(rekomendasi dengan colspan).' },
        xp: 55,
      },
    ]
  },
  {
    id: 5, name: 'Form & Input', icon: '📝', color: '#f76a6a',
    topics: [
      {
        id: 'l5t1', title: 'Form Dasar & Input', diff: 'intermediate',
        explain: `
<h3>Form HTML</h3>
<p>Form digunakan untuk mengumpulkan input dari pengguna. Semua elemen input harus berada di dalam tag <code>&lt;form&gt;</code>.</p>
<h4>🔑 Atribut Form</h4>
<ul>
  <li><code>action</code> — URL tujuan pengiriman data form</li>
  <li><code>method="get"</code> — Data dikirim via URL (untuk pencarian)</li>
  <li><code>method="post"</code> — Data dikirim via HTTP body (untuk data sensitif)</li>
</ul>
<h4>📌 Jenis Input</h4>
<ul>
  <li><code>type="text"</code> — Teks satu baris</li>
  <li><code>type="email"</code> — Email dengan validasi format</li>
  <li><code>type="password"</code> — Password (text tersembunyi)</li>
  <li><code>type="number"</code> — Angka</li>
  <li><code>type="checkbox"</code> — Pilih banyak</li>
  <li><code>type="radio"</code> — Pilih satu dari grup</li>
  <li><code>type="submit"</code> — Tombol submit</li>
  <li><code>type="date"</code> — Pemilih tanggal</li>
  <li><code>type="file"</code> — Upload file</li>
</ul>
<div class="ht-tip-box">💡 <span>Selalu gunakan tag <label> dan hubungkan ke input via for/id. Ini meningkatkan aksesibilitas dan area klik.</span></div>
`,
        example: `<form action="/submit" method="post">
  <!-- Text input -->
  <label for="nama">Nama:</label>
  <input type="text" id="nama" name="nama" placeholder="Nama lengkap">
  
  <!-- Email -->
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <!-- Password -->
  <label for="pass">Password:</label>
  <input type="password" id="pass" name="pass" minlength="8">
  
  <!-- Textarea -->
  <label for="pesan">Pesan:</label>
  <textarea id="pesan" name="pesan" rows="4" cols="40"></textarea>
  
  <!-- Select -->
  <label for="kota">Kota:</label>
  <select id="kota" name="kota">
    <option value="">Pilih kota...</option>
    <option value="jkt">Jakarta</option>
    <option value="bdg">Bandung</option>
  </select>
  
  <!-- Radio -->
  <input type="radio" id="pria" name="gender" value="pria">
  <label for="pria">Pria</label>
  <input type="radio" id="wanita" name="gender" value="wanita">
  <label for="wanita">Wanita</label>
  
  <!-- Checkbox -->
  <input type="checkbox" id="setuju" name="setuju">
  <label for="setuju">Saya setuju syarat & ketentuan</label>
  
  <!-- Submit -->
  <button type="submit">Kirim</button>
</form>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head>
    <title>Form Kontak</title>
    <style>
      body { font-family: sans-serif; max-width: 500px; margin: 20px auto; padding: 0 20px; }
      label { display: block; margin-top: 12px; font-weight: bold; font-size: 14px; }
      input, textarea, select { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
      button { margin-top: 16px; padding: 10px 24px; background: #7c6af7; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    </style>
  </head>
  <body>
    <h1>Form Kontak</h1>
    <form>
      <label for="nama">Nama Lengkap:</label>
      <input type="text" id="nama" placeholder="Masukkan nama kamu">
      
      <label for="email">Email:</label>
      <input type="email" id="email" placeholder="email@contoh.com">
      
      <label for="pesan">Pesan:</label>
      <textarea id="pesan" rows="4" placeholder="Tuliskan pesanmu..."></textarea>
      
      <button type="submit">Kirim Pesan</button>
    </form>
  </body>
</html>`,
        editorTask: 'Tambahkan select dropdown untuk "Topik Pesan" dengan 4 pilihan, dan checkbox untuk berlangganan newsletter.',
        quiz: { q: 'Perbedaan method GET dan POST pada form?', options: ['Tidak ada perbedaan', 'GET menampilkan data di URL, POST menyembunyikan data', 'POST lebih lambat dari GET', 'GET hanya untuk login'], correct: 1, explanation: 'GET mengirim data melalui URL (cocok untuk pencarian/filter), POST mengirim data di HTTP body (aman untuk password, data sensitif).' },
        challenge: { title: 'Form Registrasi Lengkap', desc: 'Buat form registrasi dengan: nama, username, email, password, tanggal lahir, jenis kelamin (radio), kota (select), dan terms (checkbox). Semua input harus punya label.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Registrasi</title></head>\n  <body>\n    <h1>Daftar Akun</h1>\n    <!-- Form registrasi lengkap -->\n  </body>\n</html>`, hint: 'Radio button grup harus punya name yang sama. Checkbox harus punya id unik.' },
        xp: 60,
      },
    ]
  },
  {
    id: 7, name: 'Semantic HTML', icon: '🏛️', color: '#5de0c5',
    topics: [
      {
        id: 'l7t1', title: 'Elemen Semantik HTML5', diff: 'intermediate',
        explain: `
<h3>Semantic HTML5</h3>
<p>Semantic HTML adalah menggunakan tag yang <strong>mendeskripsikan makna konten</strong>, bukan hanya tampilannya. HTML5 memperkenalkan banyak elemen semantik.</p>
<h4>🔑 Elemen Semantik Utama</h4>
<ul>
  <li><code>&lt;header&gt;</code> — Header halaman atau section (logo, nav, judul)</li>
  <li><code>&lt;nav&gt;</code> — Navigasi (menu link)</li>
  <li><code>&lt;main&gt;</code> — Konten utama halaman (hanya 1 per halaman)</li>
  <li><code>&lt;section&gt;</code> — Section tematik dengan heading</li>
  <li><code>&lt;article&gt;</code> — Konten mandiri (blog post, berita, komentar)</li>
  <li><code>&lt;aside&gt;</code> — Konten sampingan (sidebar, iklan, widget)</li>
  <li><code>&lt;footer&gt;</code> — Footer halaman atau section</li>
  <li><code>&lt;figure&gt;</code> dan <code>&lt;figcaption&gt;</code> — Gambar dengan keterangan</li>
  <li><code>&lt;time&gt;</code> — Waktu/tanggal</li>
  <li><code>&lt;address&gt;</code> — Informasi kontak</li>
</ul>
<h4>🌟 Manfaat Semantic HTML</h4>
<ul>
  <li>SEO lebih baik — mesin pencari memahami struktur konten</li>
  <li>Aksesibilitas — screen reader dapat navigasi dengan benar</li>
  <li>Keterbacaan kode — developer lain memahami struktur</li>
  <li>Maintenance lebih mudah</li>
</ul>
<div class="ht-warn-box">⚠️ <span>div dan span tidak memiliki makna semantik — gunakan hanya untuk kebutuhan styling, bukan struktur konten.</span></div>
`,
        example: `<!DOCTYPE html>
<html lang="id">
<head>
  <title>Blog Teknologi</title>
</head>
<body>
  <header>
    <h1>Blog Teknologi</h1>
    <nav>
      <ul>
        <li><a href="#beranda">Beranda</a></li>
        <li><a href="#artikel">Artikel</a></li>
        <li><a href="#kontak">Kontak</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="artikel">
      <h2>Artikel Terbaru</h2>
      
      <article>
        <header>
          <h3>Belajar HTML dalam Sehari</h3>
          <time datetime="2024-01-15">15 Januari 2024</time>
        </header>
        <p>HTML adalah dasar dari semua halaman web...</p>
        <figure>
          <img src="html.png" alt="Logo HTML">
          <figcaption>Logo HTML5</figcaption>
        </figure>
      </article>
    </section>
    
    <aside>
      <h3>Artikel Populer</h3>
      <ul>
        <li><a href="#">Tips CSS Terbaik</a></li>
        <li><a href="#">JavaScript untuk Pemula</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <address>
      Email: <a href="mailto:halo@blog.com">halo@blog.com</a>
    </address>
    <p>&copy; 2024 Blog Teknologi</p>
  </footer>
</body>
</html>`,
        editorStarter: `<!DOCTYPE html>
<html lang="id">
  <head><title>Halaman Semantik</title></head>
  <body>
    <header>
      <h1>Portal Berita</h1>
      <nav>
        <a href="#berita">Berita</a> | 
        <a href="#olahraga">Olahraga</a> | 
        <a href="#teknologi">Teknologi</a>
      </nav>
    </header>
    
    <main>
      <section id="berita">
        <h2>Berita Utama</h2>
        <article>
          <h3>Judul Berita 1</h3>
          <time datetime="2024-01-15">15 Jan 2024</time>
          <p>Isi berita pertama di sini...</p>
        </article>
      </section>
      
      <aside>
        <h3>Berita Terpopuler</h3>
        <ul>
          <li><a href="#">Berita trending 1</a></li>
          <li><a href="#">Berita trending 2</a></li>
        </ul>
      </aside>
    </main>
    
    <footer>
      <p>&copy; 2024 Portal Berita. All rights reserved.</p>
    </footer>
  </body>
</html>`,
        editorTask: 'Tambahkan section kedua dengan artikel tentang Olahraga, termasuk figure dan figcaption.',
        quiz: { q: 'Elemen mana yang tepat untuk menu navigasi?', options: ['<menu>', '<nav>', '<ul>', '<div id="nav">'], correct: 1, explanation: '<nav> adalah elemen semantik yang dirancang khusus untuk navigasi. Ini memberi tahu browser dan screen reader bahwa ini adalah menu navigasi.' },
        challenge: { title: 'Halaman Blog Lengkap', desc: 'Buat halaman blog lengkap dengan header (logo+nav), main (2 article dengan time), aside (3 link populer), dan footer (copyright+email). Semua menggunakan semantic HTML.', starter: `<!DOCTYPE html>\n<html lang="id">\n  <head><title>Blog Saya</title></head>\n  <body>\n    <!-- Buat blog lengkap dengan semantic HTML -->\n  </body>\n</html>`, hint: 'Urutan: header > main(section+aside) > footer. Artikel di dalam section.' },
        xp: 65,
      },
    ]
  },
  {
    id: 8, name: 'Responsive HTML', icon: '📱', color: '#f472b6',
    topics: [
      {
        id: 'l8t1', title: 'Viewport & Responsive', diff: 'intermediate',
        explain: `
<h3>Responsive HTML</h3>
<p>Responsive web design memastikan halaman web terlihat baik di semua ukuran layar — desktop, tablet, dan smartphone.</p>
<h4>🔑 Meta Viewport</h4>
<p>Tag meta viewport WAJIB ada di semua halaman mobile-friendly:</p>
<code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code>
<ul>
  <li><code>width=device-width</code> — Lebar halaman = lebar layar perangkat</li>
  <li><code>initial-scale=1.0</code> — Zoom awal = 100%</li>
</ul>
<h4>📌 Gambar Responsive</h4>
<ul>
  <li><code>max-width: 100%</code> — Gambar tidak melebihi container</li>
  <li>Atribut <code>srcset</code> — Gambar berbeda untuk resolusi berbeda</li>
  <li>Tag <code>&lt;picture&gt;</code> — Kontrol penuh gambar responsif</li>
</ul>
<div class="ht-tip-box">💡 <span>Tanpa meta viewport, mobile browser akan men-zoom-out halaman dan membuatnya sangat kecil. Ini alasan utama mobile tidak responsif!</span></div>
`,
        example: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <!-- Viewport wajib untuk responsive -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Page</title>
  <style>
    img { max-width: 100%; height: auto; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Halaman Responsive</h1>
    
    <!-- Gambar responsive -->
    <img src="foto.jpg" alt="Responsive image" style="max-width:100%">
    
    <!-- Picture tag untuk multiple sumber -->
    <picture>
      <source media="(min-width: 768px)" srcset="gambar-besar.jpg">
      <source media="(min-width: 480px)" srcset="gambar-sedang.jpg">
      <img src="gambar-kecil.jpg" alt="Responsive picture">
    </picture>
  </div>
</body>
</html>`,
        editorStarter: `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Demo</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: sans-serif; margin: 0; padding: 16px; }
      .container { max-width: 900px; margin: 0 auto; }
      img { max-width: 100%; height: auto; border-radius: 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Halaman Responsive</h1>
      <p>Coba ubah ukuran browser untuk melihat responsivitasnya.</p>
      <img src="https://picsum.photos/800/400?random=10" alt="Gambar landscape">
      <p>Gambar di atas selalu fit di container.</p>
    </div>
  </body>
</html>`,
        editorTask: 'Tambahkan tag <picture> dengan dua sumber gambar berbeda untuk ukuran layar berbeda.',
        quiz: { q: 'Apa fungsi "width=device-width" pada meta viewport?', options: ['Membuat halaman selebar 100px', 'Membuat lebar halaman = lebar layar perangkat', 'Menonaktifkan zoom pada mobile', 'Mengatur font size'], correct: 1, explanation: 'width=device-width membuat browser mengatur lebar halaman sesuai lebar layar perangkat, bukan lebar default (biasanya 980px).' },
        challenge: { title: 'Landing Page Responsive', desc: 'Buat landing page dengan meta viewport, header responsif, gambar responsif (max-width:100%), dan footer. Pastikan tampil baik di mobile.', starter: `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8">\n    <!-- Tambahkan meta viewport -->\n    <title>Landing Page</title>\n  </head>\n  <body>\n    <!-- Buat landing page responsive -->\n  </body>\n</html>`, hint: 'Jangan lupa meta viewport! Gunakan max-width:100% untuk gambar.' },
        xp: 55,
      },
    ]
  },
  {
    id: 11, name: 'Advanced HTML', icon: '⚡', color: '#e879f9',
    topics: [
      {
        id: 'l11t1', title: 'Canvas & SVG', diff: 'advanced',
        explain: `
<h3>Canvas & SVG di HTML</h3>
<h4>🎨 Tag &lt;canvas&gt;</h4>
<p>Canvas adalah area gambar berbasis pixel. Semua gambar dibuat melalui JavaScript.</p>
<ul>
  <li>Cocok untuk game, animasi, chart interaktif</li>
  <li>Tidak bisa di-scale tanpa kehilangan kualitas (raster)</li>
  <li>Dikontrol penuh oleh JavaScript</li>
</ul>
<h4>🔶 Tag &lt;svg&gt;</h4>
<p>SVG (Scalable Vector Graphics) adalah format gambar vektor berbasis XML.</p>
<ul>
  <li>Selalu tajam di semua ukuran (vector)</li>
  <li>Cocok untuk ikon, logo, ilustrasi sederhana</li>
  <li>Bisa di-style dengan CSS</li>
  <li>Bisa dianimasikan dengan CSS/JS</li>
</ul>
<div class="ht-tip-box">💡 <span>Pilih SVG untuk grafis statis yang perlu scale. Pilih Canvas untuk grafis dinamis/real-time seperti game atau chart yang update terus.</span></div>
`,
        example: `<!-- Canvas dengan JavaScript -->
<canvas id="myCanvas" width="300" height="150" style="border:1px solid #ccc"></canvas>
<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#7c6af7';
ctx.fillRect(10, 10, 150, 80);
ctx.fillStyle = '#5de0c5';
ctx.beginPath();
ctx.arc(200, 75, 50, 0, Math.PI * 2);
ctx.fill();
</script>

<!-- SVG inline -->
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <!-- Kotak -->
  <rect x="10" y="10" width="80" height="60" fill="#7c6af7" rx="8"/>
  <!-- Lingkaran -->
  <circle cx="150" cy="40" r="35" fill="#5de0c5"/>
  <!-- Teks -->
  <text x="10" y="90" font-size="14" fill="#333">SVG Text</text>
</svg>`,
        editorStarter: `<!DOCTYPE html>
<html>
  <head><title>Canvas & SVG</title></head>
  <body>
    <h1>Grafis di HTML</h1>
    
    <h2>Canvas</h2>
    <canvas id="myCanvas" width="400" height="200" style="border:2px solid #ddd;border-radius:8px"></canvas>
    <script>
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');
      // Latar belakang
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 400, 200);
      // Kotak
      ctx.fillStyle = '#7c6af7';
      ctx.fillRect(20, 20, 100, 80);
      // Lingkaran
      ctx.fillStyle = '#f76a6a';
      ctx.beginPath();
      ctx.arc(200, 100, 60, 0, Math.PI * 2);
      ctx.fill();
      // Teks
      ctx.fillStyle = '#333';
      ctx.font = '18px Arial';
      ctx.fillText('Canvas!', 300, 100);
    </script>
    
    <h2>SVG</h2>
    <svg width="400" height="150" style="border:2px solid #ddd;border-radius:8px">
      <rect x="20" y="20" width="100" height="80" fill="#5de0c5" rx="10"/>
      <circle cx="200" cy="75" r="50" fill="#f7b96a"/>
      <polygon points="320,20 360,100 280,100" fill="#7c6af7"/>
      <text x="20" y="135" font-size="14" fill="#666">Persegi, Lingkaran, Segitiga</text>
    </svg>
  </body>
</html>`,
        editorTask: 'Tambahkan teks di canvas dan buat path SVG berbentuk bintang atau hati.',
        quiz: { q: 'Kapan sebaiknya menggunakan SVG dibanding Canvas?', options: ['Untuk membuat game', 'Untuk ikon dan logo yang perlu scalable', 'Untuk video streaming', 'Untuk animasi 3D'], correct: 1, explanation: 'SVG adalah vector — selalu tajam di ukuran apapun. Cocok untuk ikon, logo, ilustrasi. Canvas untuk grafis pixel/raster dinamis.' },
        challenge: { title: 'Buat Kartu Nama Digital', desc: 'Buat kartu nama digital menggunakan SVG. Harus ada: background, nama (text), jabatan, kotak/shape dekoratif, dan minimal satu lingkaran.', starter: `<!DOCTYPE html>\n<html>\n  <head><title>Kartu Nama</title></head>\n  <body>\n    <h1>Kartu Nama Digital</h1>\n    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">\n      <!-- Buat kartu nama di sini -->\n    </svg>\n  </body>\n</html>`, hint: 'Gunakan rect untuk background, text untuk nama, circle untuk dekorasi.' },
        xp: 75,
      },
    ]
  },
];

// ================================================================
// STATE
// ================================================================
let htState = {
  xp: 0,
  level: 1,
  streak: 0,
  completedTopics: [],
  currentLevel: null,
  currentTopicIdx: 0,
  currentTab: 'explain',
  typingMode: false,
  typingStartTime: null,
  quizAnswered: false,
  liveUpdateTimer: null,
};

const HT_RANKS = [
  [0,    'HTML Beginner'],
  [200,  'HTML Student'],
  [500,  'HTML Developer'],
  [1000, 'HTML Craftsman'],
  [2000, 'HTML Expert'],
  [3500, 'HTML Master'],
  [5000, 'HTML Professional'],
];
const HT_XP_LEVELS = [0, 200, 500, 1000, 2000, 3500, 5000, 7000];

function htGetRank(xp) {
  let rank = HT_RANKS[0][1];
  for (const [req, name] of HT_RANKS) { if (xp >= req) rank = name; }
  return rank;
}

// Flatten all topics
function htAllTopics() {
  return HT_CURRICULUM.flatMap(lv => lv.topics.map(t => ({ ...t, levelId: lv.id, levelName: lv.name })));
}

// ================================================================
// INIT
// ================================================================
function htInit() {
  // Load saved progress
  try {
    const saved = JSON.parse(localStorage.getItem('typecraft_html_trainer') || 'null');
    if (saved) {
      htState.xp = saved.xp || 0;
      htState.level = saved.level || 1;
      htState.streak = saved.streak || 0;
      htState.completedTopics = saved.completedTopics || [];
    }
  } catch(e) {}

  htBuildCurriculum();
  htUpdateXPBar();
  htRenderProgressOverview();
  htUpdateDailyChallenge();
}

function htSave() {
  try {
    localStorage.setItem('typecraft_html_trainer', JSON.stringify({
      xp: htState.xp,
      level: htState.level,
      streak: htState.streak,
      completedTopics: htState.completedTopics,
    }));
  } catch(e) {}
}

// ================================================================
// CURRICULUM SIDEBAR
// ================================================================
function htBuildCurriculum() {
  const container = document.getElementById('ht-curriculum-list');
  if (!container) return;
  container.innerHTML = '';

  HT_CURRICULUM.forEach(lv => {
    const totalTopics = lv.topics.length;
    const doneTopics = lv.topics.filter(t => htState.completedTopics.includes(t.id)).length;
    const pct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;
    const isOpen = htState.currentLevel === lv.id;

    const lvEl = document.createElement('div');
    lvEl.className = 'ht-level-item';

    const header = document.createElement('div');
    header.className = 'ht-level-header' + (isOpen ? ' open' : '');
    header.innerHTML = `
      <span style="width:8px;height:8px;border-radius:50%;background:${lv.color};flex-shrink:0;display:inline-block"></span>
      <span>${lv.icon} ${lv.name}</span>
      <span style="margin-left:auto;font-size:10px;font-weight:400;color:var(--text3)">${doneTopics}/${totalTopics}</span>
      <span style="font-size:10px;margin-left:4px">${isOpen ? '▼' : '▶'}</span>
    `;

    const topicsEl = document.createElement('div');
    topicsEl.className = 'ht-level-topics' + (isOpen ? ' open' : '');

    lv.topics.forEach((topic, idx) => {
      const done = htState.completedTopics.includes(topic.id);
      const isActive = htState.currentLevel === lv.id && htState.currentTopicIdx === idx;
      const topicEl = document.createElement('div');
      topicEl.className = 'ht-topic-item' + (done ? ' completed' : '') + (isActive ? ' active' : '');
      topicEl.innerHTML = `<span>${topic.title}</span><span class="ht-topic-progress">${topic.xp} XP</span>`;
      topicEl.onclick = () => htOpenTopic(lv.id, idx);
      topicsEl.appendChild(topicEl);
    });

    header.onclick = () => {
      const isNowOpen = topicsEl.classList.contains('open');
      // Close all
      document.querySelectorAll('.ht-level-topics').forEach(t => t.classList.remove('open'));
      document.querySelectorAll('.ht-level-header').forEach(h => h.classList.remove('open'));
      if (!isNowOpen) {
        topicsEl.classList.add('open');
        header.classList.add('open');
      }
    };

    lvEl.appendChild(header);
    lvEl.appendChild(topicsEl);
    container.appendChild(lvEl);
  });
}

// ================================================================
// OPEN TOPIC
// ================================================================
function htOpenTopic(levelId, topicIdx) {
  const level = HT_CURRICULUM.find(l => l.id === levelId);
  if (!level) return;

  htState.currentLevel = levelId;
  htState.currentTopicIdx = topicIdx;
  const topic = level.topics[topicIdx];
  if (!topic) return;

  htState.quizAnswered = false;

  // Switch screens
  document.getElementById('ht-welcome-screen').style.display = 'none';
  document.getElementById('ht-lesson-screen').style.display = 'block';
  document.getElementById('ht-dragdrop-screen').style.display = 'none';
  document.getElementById('ht-debug-screen').style.display = 'none';

  // Update lesson header
  document.getElementById('ht-lesson-breadcrumb').textContent = `Level ${levelId} · ${level.name}`;
  document.getElementById('ht-lesson-title').textContent = topic.title;
  document.getElementById('ht-lesson-progress-text').textContent = `Topik ${topicIdx + 1} dari ${level.topics.length}`;

  const diffMap = { beginner: 'diff-easy', intermediate: 'diff-medium', advanced: 'diff-hard', expert: 'diff-expert' };
  const badge = document.getElementById('ht-diff-badge');
  badge.textContent = topic.diff.charAt(0).toUpperCase() + topic.diff.slice(1);
  badge.className = 'difficulty-badge ' + (diffMap[topic.diff] || 'diff-easy');
  document.getElementById('ht-topic-badge').textContent = level.name;

  // Populate tabs
  htPopulateExplain(topic);
  htPopulateExample(topic);
  htPopulateEditor(topic);
  htPopulateQuiz(topic);
  htPopulateChallenge(topic);

  // Switch to first tab
  htSwitchTab('explain', document.querySelector('.ht-tab'));

  // Check if already completed
  const doneEl = document.getElementById('ht-lesson-complete-badge');
  if (htState.completedTopics.includes(topic.id)) {
    doneEl.style.display = 'flex';
  } else {
    doneEl.style.display = 'none';
  }

  // Rebuild sidebar to update active state
  htBuildCurriculum();

  // Open the correct level section
  setTimeout(() => {
    const headers = document.querySelectorAll('.ht-level-header');
    const topicLists = document.querySelectorAll('.ht-level-topics');
    headers.forEach((h, i) => {
      const lv = HT_CURRICULUM[i];
      if (lv && lv.id === levelId) {
        h.classList.add('open');
        topicLists[i].classList.add('open');
      }
    });
  }, 50);
}

// ================================================================
// POPULATE TABS
// ================================================================
function htPopulateExplain(topic) {
  const el = document.getElementById('ht-explain-content');
  el.innerHTML = topic.explain || '<p>Penjelasan belum tersedia.</p>';
}

function htPopulateExample(topic) {
  const el = document.getElementById('ht-example-content');
  const code = topic.example || '';
  el.innerHTML = `
    <h3>💡 Contoh Kode</h3>
    <div class="ht-copy-row">
      <button class="ht-copy-btn" onclick="htCopyToClipboard(this, ${JSON.stringify(code)})">📋 Copy</button>
    </div>
    <pre class="ht-code-block">${htEsc(code)}</pre>
    <h4 style="margin-top:16px">👁️ Preview Tampilan</h4>
    <div class="ht-preview-box">
      <iframe id="ht-example-preview" style="width:100%;border:none;min-height:120px"></iframe>
    </div>
    ${topic.previewNote ? `<div class="ht-tip-box" style="margin-top:10px">👁️ <span>${topic.previewNote}</span></div>` : ''}
  `;
  setTimeout(() => {
    const iframe = document.getElementById('ht-example-preview');
    if (iframe) {
      iframe.srcdoc = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:12px;margin:0;font-size:14px}*{box-sizing:border-box}</style></head><body>${code}</body></html>`;
      iframe.onload = () => {
        try { iframe.style.height = Math.max(80, iframe.contentDocument.body.scrollHeight + 20) + 'px'; } catch(e) {}
      };
    }
  }, 100);
}

function htPopulateEditor(topic) {
  const editor = document.getElementById('ht-code-editor');
  const tipsEl = document.getElementById('ht-editor-tips');
  if (editor) editor.value = topic.editorStarter || topic.example || '';
  if (tipsEl) tipsEl.textContent = '💡 Task: ' + (topic.editorTask || 'Modifikasi kode di atas dan klik Run untuk melihat hasilnya.');
  htLiveUpdate();

  // Setup typing mode
  if (topic.example) {
    const typingText = topic.example;
    const display = document.getElementById('ht-typing-display');
    if (display) {
      display.innerHTML = '';
      typingText.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char ' + (i === 0 ? 'current' : 'pending');
        span.textContent = ch === '\n' ? '↵' : (ch === ' ' ? '\u00a0' : ch);
        if (ch === '\n') { span.style.color = 'var(--text3)'; span.style.fontSize = '10px'; display.appendChild(span); display.appendChild(document.createElement('br')); return; }
        display.appendChild(span);
      });
    }
    const input = document.getElementById('ht-typing-input');
    if (input) {
      input.value = '';
      input._targetText = typingText;
    }
  }
}

function htPopulateQuiz(topic) {
  const el = document.getElementById('ht-quiz-content');
  if (!topic.quiz) { el.innerHTML = '<p style="color:var(--text3)">Quiz untuk topik ini akan segera hadir.</p>'; return; }

  const q = topic.quiz;
  htState.quizAnswered = false;

  el.innerHTML = `
    <h3 style="margin-bottom:12px">🧠 Quiz: ${topic.title}</h3>
    <p style="font-size:14px;color:var(--text2);margin-bottom:16px;line-height:1.6"><strong>${q.q}</strong></p>
    <div id="ht-quiz-options-wrap">
      ${q.options.map((opt, i) => `
        <button class="ht-quiz-option" onclick="htAnswerQuiz(${i}, ${q.correct}, this)">
          <span style="color:var(--text3);margin-right:8px;font-family:var(--font-mono)">${['A','B','C','D'][i]}.</span> ${htEsc(opt)}
        </button>
      `).join('')}
    </div>
    <div id="ht-quiz-result-box"></div>
  `;
}

function htAnswerQuiz(chosen, correct, btn) {
  if (htState.quizAnswered) return;
  htState.quizAnswered = true;

  const topic = htGetCurrentTopic();
  const allBtns = document.querySelectorAll('.ht-quiz-option');
  allBtns.forEach(b => b.style.pointerEvents = 'none');

  if (chosen === correct) {
    btn.classList.add('correct');
    const xpBonus = Math.round((topic?.xp || 30) * 0.3);
    document.getElementById('ht-quiz-result-box').innerHTML = `
      <div class="ht-quiz-result pass">✅ Benar! +${xpBonus} XP<br><small style="opacity:.8">${topic?.quiz?.explanation || ''}</small></div>`;
    htAddXP(xpBonus);
  } else {
    btn.classList.add('wrong');
    allBtns[correct].classList.add('correct');
    document.getElementById('ht-quiz-result-box').innerHTML = `
      <div class="ht-quiz-result fail">❌ Belum tepat! Jawaban: ${['A','B','C','D'][correct]}<br><small style="opacity:.8">${topic?.quiz?.explanation || ''}</small></div>`;
  }
}

function htPopulateChallenge(topic) {
  const el = document.getElementById('ht-challenge-content');
  if (!topic.challenge) { el.innerHTML = '<p style="color:var(--text3)">Challenge untuk topik ini akan segera hadir.</p>'; return; }

  const ch = topic.challenge;
  el.innerHTML = `
    <h3>🏆 ${ch.title}</h3>
    <p style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:16px">${ch.desc}</p>
    <div class="ht-tip-box" style="margin-bottom:14px">💡 <span>Hint: ${ch.hint}</span></div>
    <div class="ht-editor-wrap">
      <div class="ht-editor-panel">
        <div class="ht-panel-header">
          <span class="panel-dot red"></span><span class="panel-dot yellow"></span><span class="panel-dot green"></span>
          <span style="margin-left:8px;font-size:12px;color:var(--text3)">challenge.html</span>
          <div style="margin-left:auto;display:flex;gap:6px">
            <button class="btn btn-primary btn-sm" onclick="htRunChallenge()">▶ Run</button>
            <button class="btn btn-ghost btn-sm" onclick="htResetChallenge()">↺ Reset</button>
          </div>
        </div>
        <textarea id="ht-challenge-editor" class="ht-code-editor" spellcheck="false" style="min-height:200px">${htEsc(ch.starter)}</textarea>
      </div>
      <div class="ht-preview-panel">
        <div class="ht-panel-header">
          <span class="panel-dot red"></span><span class="panel-dot yellow"></span><span class="panel-dot green"></span>
          <span style="margin-left:8px;font-size:12px;color:var(--text3)">Preview</span>
        </div>
        <iframe id="ht-challenge-preview" class="ht-preview-iframe"></iframe>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:12px">
      <button class="btn btn-primary btn-sm" onclick="htSubmitChallenge()">✅ Selesai Challenge (+${topic.xp} XP)</button>
    </div>
    <div id="ht-challenge-feedback" style="margin-top:10px"></div>
  `;

  setTimeout(() => {
    const iframe = document.getElementById('ht-challenge-preview');
    if (iframe) iframe.srcdoc = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:12px;font-size:14px}</style></head><body>${ch.starter}</body></html>`;
  }, 100);
}

// ================================================================
// EDITOR FUNCTIONS
// ================================================================
function htLiveUpdate() {
  clearTimeout(htState.liveUpdateTimer);
  htState.liveUpdateTimer = setTimeout(() => {
    const code = document.getElementById('ht-code-editor')?.value || '';
    const iframe = document.getElementById('ht-preview-iframe');
    if (iframe) iframe.srcdoc = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:12px;font-size:14px;margin:0}*{box-sizing:border-box}</style></head><body>${code}</body></html>`;
  }, 350);
}

function htRunCode() {
  const code = document.getElementById('ht-code-editor')?.value || '';
  const iframe = document.getElementById('ht-preview-iframe');
  if (iframe) iframe.srcdoc = code;
}

function htResetCode() {
  const topic = htGetCurrentTopic();
  if (topic) {
    document.getElementById('ht-code-editor').value = topic.editorStarter || topic.example || '';
    htLiveUpdate();
  }
}

function htCopyCode() {
  const code = document.getElementById('ht-code-editor')?.value || '';
  htCopyToClipboard(null, code);
}

function htTogglePreviewSize() {
  const wrap = document.querySelector('.ht-editor-wrap');
  if (!wrap) return;
  if (wrap.style.gridTemplateColumns === '1fr') {
    wrap.style.gridTemplateColumns = '1fr 1fr';
  } else {
    wrap.style.gridTemplateColumns = '1fr';
  }
}

function htRunChallenge() {
  const code = document.getElementById('ht-challenge-editor')?.value || '';
  const iframe = document.getElementById('ht-challenge-preview');
  if (iframe) iframe.srcdoc = code;
}

function htResetChallenge() {
  const topic = htGetCurrentTopic();
  if (topic?.challenge) {
    document.getElementById('ht-challenge-editor').value = topic.challenge.starter;
    htRunChallenge();
  }
}

function htSubmitChallenge() {
  const topic = htGetCurrentTopic();
  const feedback = document.getElementById('ht-challenge-feedback');
  const xp = topic?.xp || 50;
  htAddXP(xp);
  htRunChallenge();
  if (feedback) feedback.innerHTML = `<div class="ht-tip-box">🎉 <span>Challenge selesai! +${xp} XP. Bagus sekali! Lanjutkan ke topik berikutnya.</span></div>`;
  if (typeof showToast === 'function') showToast('🏆', `Challenge selesai! +${xp} XP`);
}

// ================================================================
// TYPING MODE
// ================================================================
function htToggleTypingMode() {
  htState.typingMode = !htState.typingMode;
  const zone = document.getElementById('ht-typing-zone');
  const btn = document.getElementById('ht-typing-mode-btn');
  zone.style.display = htState.typingMode ? 'block' : 'none';
  btn.textContent = htState.typingMode ? '✕ Exit Typing Mode' : '⌨️ Typing Mode';
  if (htState.typingMode) {
    document.getElementById('ht-typing-input').focus();
    htState.typingStartTime = null;
  }
}

function htHandleTypingInput(e) {
  const input = e.target;
  const typed = input.value;
  const text = input._targetText || '';

  if (!htState.typingStartTime && typed.length > 0) htState.typingStartTime = Date.now();

  const display = document.getElementById('ht-typing-display');
  const spans = display.querySelectorAll('.char');
  let spanIdx = 0, typedIdx = 0;

  text.split('').forEach((ch) => {
    const span = spans[spanIdx];
    if (!span) { spanIdx++; return; }
    span.className = 'char';
    if (typedIdx < typed.length) {
      span.className = 'char ' + (typed[typedIdx] === ch ? 'correct' : 'wrong');
      typedIdx++;
    } else if (typedIdx === typed.length) {
      span.className = 'char current';
    } else {
      span.className = 'char pending';
    }
    spanIdx++;
    if (ch === '\n') spanIdx++;
  });

  const correct = typed.split('').filter((ch, i) => ch === text[i]).length;
  const elapsed = htState.typingStartTime ? (Date.now() - htState.typingStartTime) / 60000 : 0.001;
  const wpm = Math.round((correct / 5) / elapsed) || 0;
  const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
  const prog = Math.round((typed.length / text.length) * 100);

  document.getElementById('ht-t-wpm').textContent = wpm;
  document.getElementById('ht-t-acc').textContent = acc + '%';
  document.getElementById('ht-t-prog').textContent = Math.min(prog, 100) + '%';

  if (typed === text) {
    htAddXP(20);
    if (typeof showToast === 'function') showToast('⌨️', 'Typing selesai! +20 XP');
    input.value = '';
    htState.typingStartTime = null;
  }
}

// ================================================================
// COMPLETE LESSON
// ================================================================
function htCompleteLesson() {
  const topic = htGetCurrentTopic();
  if (!topic) return;

  if (!htState.completedTopics.includes(topic.id)) {
    htState.completedTopics.push(topic.id);
    htState.streak++;
    htAddXP(topic.xp || 40);
    htShowBadge('✅ Topik selesai! +' + (topic.xp || 40) + ' XP');
    htSave();
  }

  document.getElementById('ht-lesson-complete-badge').style.display = 'flex';
  htBuildCurriculum();
  htRenderProgressOverview();

  // Auto advance
  setTimeout(() => htNextLesson(), 800);
}

function htNextLesson() {
  const level = HT_CURRICULUM.find(l => l.id === htState.currentLevel);
  if (!level) return;
  if (htState.currentTopicIdx < level.topics.length - 1) {
    htOpenTopic(htState.currentLevel, htState.currentTopicIdx + 1);
  } else {
    // Next level
    const currentLevelIndex = HT_CURRICULUM.findIndex(l => l.id === htState.currentLevel);
    if (currentLevelIndex < HT_CURRICULUM.length - 1) {
      const nextLevel = HT_CURRICULUM[currentLevelIndex + 1];
      htOpenTopic(nextLevel.id, 0);
    } else {
      if (typeof showToast === 'function') showToast('🎓', 'Semua level selesai! Kamu luar biasa!');
    }
  }
}

function htPrevLesson() {
  if (htState.currentTopicIdx > 0) {
    htOpenTopic(htState.currentLevel, htState.currentTopicIdx - 1);
  } else {
    const currentLevelIndex = HT_CURRICULUM.findIndex(l => l.id === htState.currentLevel);
    if (currentLevelIndex > 0) {
      const prevLevel = HT_CURRICULUM[currentLevelIndex - 1];
      htOpenTopic(prevLevel.id, prevLevel.topics.length - 1);
    }
  }
}

// ================================================================
// TAB SWITCHING
// ================================================================
function htSwitchTab(tabName, btn) {
  htState.currentTab = tabName;
  document.querySelectorAll('.ht-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ht-tab').forEach(t => t.classList.remove('active'));
  const target = document.getElementById('ht-tab-' + tabName);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');
  else {
    const tabs = document.querySelectorAll('.ht-tab');
    const tabOrder = ['explain', 'example', 'editor', 'quiz', 'challenge'];
    const idx = tabOrder.indexOf(tabName);
    if (tabs[idx]) tabs[idx].classList.add('active');
  }
}

// ================================================================
// XP & LEVEL
// ================================================================
function htAddXP(amount) {
  htState.xp += amount;
  const xpForLevel = HT_XP_LEVELS[htState.level] || 9999;
  if (htState.xp >= xpForLevel && htState.level < HT_XP_LEVELS.length) {
    htState.level++;
    htShowBadge('⚡ Level Up! Sekarang Level ' + htState.level);
  }
  htUpdateXPBar();
  htSave();
  // Sync with main userData if available
  if (typeof addXP === 'function') addXP(Math.round(amount * 0.5));
}

function htUpdateXPBar() {
  document.getElementById('ht-xp-display').textContent = htState.xp;
  document.getElementById('ht-level-display').textContent = htState.level;
  document.getElementById('ht-streak-display').textContent = htState.streak;
  document.getElementById('ht-rank-label').textContent = htGetRank(htState.xp);

  const xpMin = HT_XP_LEVELS[htState.level - 1] || 0;
  const xpMax = HT_XP_LEVELS[htState.level] || 5000;
  const pct = Math.min(Math.round(((htState.xp - xpMin) / (xpMax - xpMin)) * 100), 100);
  document.getElementById('ht-xp-bar').style.width = pct + '%';
  document.getElementById('ht-xp-cur').textContent = htState.xp - xpMin;
  document.getElementById('ht-xp-next').textContent = xpMax - xpMin;
}

// ================================================================
// PROGRESS OVERVIEW
// ================================================================
function htRenderProgressOverview() {
  const el = document.getElementById('ht-progress-overview');
  if (!el) return;
  el.innerHTML = '';
  HT_CURRICULUM.forEach(lv => {
    const total = lv.topics.length;
    const done = lv.topics.filter(t => htState.completedTopics.includes(t.id)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'ht-progress-card';
    card.innerHTML = `
      <div class="pc-icon">${lv.icon}</div>
      <div class="pc-name" style="color:${pct===100?'var(--green)':'var(--text)'}">${lv.name}</div>
      <div class="pc-bar-wrap"><div class="pc-bar" style="width:${pct}%;background:${lv.color}"></div></div>
      <div class="pc-pct">${done}/${total} · ${pct}%</div>
    `;
    card.onclick = () => { htOpenTopic(lv.id, 0); };
    el.appendChild(card);
  });
}

// ================================================================
// NAVIGATION HELPERS
// ================================================================
function htStartFromBeginning() {
  const first = HT_CURRICULUM[0];
  htOpenTopic(first.id, 0);
}

function htContinueLearning() {
  // Find first incomplete topic
  const allTopics = htAllTopics();
  const next = allTopics.find(t => !htState.completedTopics.includes(t.id));
  if (next) htOpenTopic(next.levelId, HT_CURRICULUM.find(l => l.id === next.levelId)?.topics.findIndex(t => t.id === next.id) || 0);
  else htStartFromBeginning();
}

// ================================================================
// DAILY CHALLENGE
// ================================================================
const HT_DAILY = [
  { title: 'HTML Structure', desc: 'Buat 3 halaman HTML dengan struktur lengkap hari ini. Reward: 150 XP' },
  { title: 'Semantic Master', desc: 'Selesaikan semua topik Semantic HTML. Reward: 200 XP' },
  { title: 'Form Builder', desc: 'Buat form lengkap dengan 6+ jenis input. Reward: 180 XP' },
  { title: 'Table Creator', desc: 'Buat tabel dengan colspan dan rowspan. Reward: 120 XP' },
  { title: 'Responsive Page', desc: 'Buat halaman mobile-friendly dengan viewport. Reward: 160 XP' },
  { title: 'Accessibility Check', desc: 'Pastikan semua gambar punya alt text. Reward: 100 XP' },
  { title: 'SVG Artist', desc: 'Buat ilustrasi menggunakan SVG murni. Reward: 220 XP' },
];
function htUpdateDailyChallenge() {
  const day = new Date().getDay();
  const ch = HT_DAILY[day % HT_DAILY.length];
  document.getElementById('ht-daily-title').textContent = ch.title;
  document.getElementById('ht-daily-desc').textContent = ch.desc;
}
function htStartDailyChallenge() {
  const day = new Date().getDay();
  const ch = HT_DAILY[day % HT_DAILY.length];
  htStartFromBeginning();
  if (typeof showToast === 'function') showToast('🎯', 'Daily Challenge: ' + ch.title + ' dimulai!');
}

// ================================================================
// DRAG & DROP (launch from sidebar/button)
// ================================================================
const HT_DD_CHALLENGES = [
  {
    instruction: 'Susun tag HTML5 dasar dalam urutan yang benar',
    tags: ['<!DOCTYPE html>', '<html>', '<head>', '<title>', '</title>', '</head>', '<body>', '<h1>', '</h1>', '</body>', '</html>'],
    correct: ['<!DOCTYPE html>', '<html>', '<head>', '<title>', '</title>', '</head>', '<body>', '<h1>', '</h1>', '</body>', '</html>'],
  },
  {
    instruction: 'Susun elemen tabel dalam urutan yang benar',
    tags: ['<table>', '<thead>', '<tr>', '<th>', '</th>', '</tr>', '</thead>', '<tbody>', '</tbody>', '</table>'],
    correct: ['<table>', '<thead>', '<tr>', '<th>', '</th>', '</tr>', '</thead>', '<tbody>', '</tbody>', '</table>'],
  },
];

function htInitDragDrop() {
  const ch = HT_DD_CHALLENGES[Math.floor(Math.random() * HT_DD_CHALLENGES.length)];
  document.getElementById('ht-dd-instruction').textContent = ch.instruction;

  const tagsEl = document.getElementById('ht-dd-tags');
  const dropEl = document.getElementById('ht-dd-drop');
  tagsEl.innerHTML = '<div style="font-size:11px;color:var(--text3);margin-bottom:8px;width:100%">Drag tag:</div>';
  dropEl.innerHTML = '<div style="color:var(--text3);font-size:13px">Drop di sini...</div>';
  dropEl._correctOrder = ch.correct;
  dropEl._droppedItems = [];

  const shuffled = [...ch.tags].sort(() => Math.random() - 0.5);
  shuffled.forEach(tag => {
    const tagEl = document.createElement('div');
    tagEl.className = 'ht-dd-tag';
    tagEl.textContent = tag;
    tagEl.draggable = true;
    tagEl.dataset.tag = tag;
    tagEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', tag);
      tagEl.style.opacity = '0.5';
    });
    tagEl.addEventListener('dragend', () => tagEl.style.opacity = '1');
    tagsEl.appendChild(tagEl);
  });

  dropEl.addEventListener('dragover', (e) => { e.preventDefault(); dropEl.classList.add('dragover'); });
  dropEl.addEventListener('dragleave', () => dropEl.classList.remove('dragover'));
  dropEl.addEventListener('drop', (e) => {
    e.preventDefault();
    dropEl.classList.remove('dragover');
    const tag = e.dataTransfer.getData('text/plain');
    dropEl._droppedItems = dropEl._droppedItems || [];
    dropEl._droppedItems.push(tag);
    const placedTag = document.createElement('div');
    placedTag.className = 'ht-dd-tag placed';
    placedTag.textContent = tag;
    // Remove "Drop di sini" placeholder
    const placeholder = dropEl.querySelector('div');
    if (placeholder && placeholder.textContent.includes('Drop')) placeholder.remove();
    dropEl.appendChild(placedTag);
    // Remove from source
    tagsEl.querySelectorAll('.ht-dd-tag').forEach(t => { if (t.dataset.tag === tag && !t.classList.contains('placed')) { t.remove(); } });
  });
}

function htCheckDragDrop() {
  const dropEl = document.getElementById('ht-dd-drop');
  const placed = dropEl._droppedItems || [];
  const correct = dropEl._correctOrder || [];
  const feedback = document.getElementById('ht-dd-feedback');
  if (JSON.stringify(placed) === JSON.stringify(correct)) {
    feedback.innerHTML = '<div class="ht-tip-box">✅ Benar! Urutan HTML sempurna! +50 XP</div>';
    htAddXP(50);
  } else {
    feedback.innerHTML = '<div class="ht-error-box">❌ Belum tepat. Urutan yang benar: ' + htEsc(correct.join(' → ')) + '</div>';
  }
}

function htResetDragDrop() { htInitDragDrop(); document.getElementById('ht-dd-feedback').innerHTML = ''; }

// ================================================================
// DEBUG CHALLENGES
// ================================================================
const HT_BUGS = [
  {
    desc: 'Temukan semua bug di kode HTML di bawah ini.',
    buggy: `<html>
  <head>
    <title>Halaman Saya
  </head>
  <body>
    <h1>Judul Halaman</h2>
    <p>Paragraf pertama.
    <img src="foto.jpg">
  </body>
</html>`,
    fixed: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Halaman Saya</title>\n  </head>\n  <body>\n    <h1>Judul Halaman</h1>\n    <p>Paragraf pertama.</p>\n    <img src="foto.jpg" alt="Foto">\n  </body>\n</html>`,
    hint: 'Ada 4 bug: DOCTYPE hilang, title tidak ditutup, h1 ditutup dengan h2, img tidak ada alt.',
  },
];

function htInitDebug() {
  const bug = HT_BUGS[Math.floor(Math.random() * HT_BUGS.length)];
  document.getElementById('ht-debug-desc').textContent = bug.desc;
  document.getElementById('ht-debug-buggy').textContent = bug.buggy;
  document.getElementById('ht-debug-input').value = '';
  document.getElementById('ht-debug-input')._correctFixed = bug.fixed;
  document.getElementById('ht-debug-input')._hint = bug.hint;
  document.getElementById('ht-debug-feedback').innerHTML = '';
}

function htCheckDebug() {
  const input = document.getElementById('ht-debug-input');
  const typed = input.value.replace(/\s+/g, ' ').trim();
  const correct = (input._correctFixed || '').replace(/\s+/g, ' ').trim();
  const feedback = document.getElementById('ht-debug-feedback');
  // Loose check — see if key fixes are present
  const hasDoctype = typed.includes('<!DOCTYPE html>') || typed.includes('<!doctype html>');
  const hasAlt = typed.includes('alt=');
  const hasCorrectH1 = typed.includes('</h1>') && !typed.includes('</h2>');
  const score = [hasDoctype, hasAlt, hasCorrectH1].filter(Boolean).length;
  if (score === 3) {
    feedback.innerHTML = '<div class="ht-tip-box">✅ Semua bug berhasil diperbaiki! +80 XP</div>';
    htAddXP(80);
  } else {
    feedback.innerHTML = `<div class="ht-warn-box">⚠️ ${score}/3 bug diperbaiki. Periksa kembali: DOCTYPE, alt text, dan tag penutup yang benar.</div>`;
  }
}

function htShowDebugHint() {
  const input = document.getElementById('ht-debug-input');
  const hint = input._hint || 'Perhatikan tag yang tidak ditutup dan atribut yang hilang.';
  if (typeof showToast === 'function') showToast('💡', hint);
  else alert('Hint: ' + hint);
}

// ================================================================
// UTILITIES
// ================================================================
function htGetCurrentTopic() {
  const level = HT_CURRICULUM.find(l => l.id === htState.currentLevel);
  return level?.topics[htState.currentTopicIdx] || null;
}

function htEsc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function htCopyToClipboard(btn, text) {
  navigator.clipboard?.writeText(text).then(() => {
    if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = orig, 1500); }
    else if (typeof showToast === 'function') showToast('📋', 'Kode disalin!');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    if (typeof showToast === 'function') showToast('📋', 'Kode disalin!');
  });
}

function htShowBadge(msg) {
  let badge = document.getElementById('ht-badge-popup');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'ht-badge-popup';
    badge.className = 'ht-badge-popup';
    document.body.appendChild(badge);
  }
  badge.textContent = msg;
  badge.classList.add('show');
  setTimeout(() => badge.classList.remove('show'), 3000);
}

// ================================================================
// HOOK INTO NAVIGATION
// ================================================================
(function hookNavigate() {
  const orig = typeof navigate === 'function' ? navigate : null;
  if (orig) {
    window.navigate = function(page) {
      orig(page);
      if (page === 'htmltrainer') {
        setTimeout(() => htInit(), 100);
      }
    };
  }

  // Patch PAGE_TITLES if it exists
  if (typeof PAGE_TITLES !== 'undefined') {
    PAGE_TITLES['htmltrainer'] = 'HTML Trainer';
  }
})();

// ================================================================
// ADD TO SIDEBAR & DASHBOARD (auto-patch)
// ================================================================
(function patchSidebarAndDashboard() {
  // Add nav item to sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const learnSection = [...sidebar.querySelectorAll('.nav-section')].find(s => s.textContent.includes('Practice'));
    if (learnSection) {
      // Insert after Python Trainer item
      const pyItem = [...sidebar.querySelectorAll('.nav-item')].find(n => n.getAttribute('onclick')?.includes('pytrainer'));
      const htmlItem = document.createElement('div');
      htmlItem.className = 'nav-item';
      htmlItem.setAttribute('onclick', "navigate('htmltrainer')");
      htmlItem.innerHTML = '<span class="nav-icon">🌐</span><span class="nav-label">HTML Trainer</span>';
      if (pyItem && pyItem.nextSibling) {
        sidebar.insertBefore(htmlItem, pyItem.nextSibling);
      } else if (learnSection) {
        sidebar.insertBefore(htmlItem, learnSection.nextSibling);
      }
    }
  }

  // Add mode card to dashboard
  setTimeout(() => {
    const modesGrid = document.querySelector('.modes-grid');
    if (modesGrid) {
      const card = document.createElement('div');
      card.className = 'mode-card';
      card.style.setProperty('--card-color', '#60a5fa');
      card.setAttribute('onclick', "navigate('htmltrainer')");
      card.innerHTML = `
        <div class="mode-icon">🌐</div>
        <h3>HTML Trainer</h3>
        <p>Belajar HTML dari dasar sampai professional. Live preview, quiz, dan tantangan coding interaktif.</p>
        <span class="mode-tag">12 level · 60+ topik · Live preview</span>
      `;
      modesGrid.appendChild(card);
    }
  }, 500);
})();

console.log('HTMLTrainer: Module loaded ✓');
