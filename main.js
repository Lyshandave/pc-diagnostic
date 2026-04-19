/* PC Diagnostic Tool — main.js */
'use strict';

const TESTS = {
  all:     ['CPU', 'RAM', 'Storage', 'GPU', 'Temperature'],
  cpu:     ['CPU'],
  ram:     ['RAM'],
  storage: ['Storage'],
  gpu:     ['GPU'],
  temp:    ['Temperature'],
};

const COMP_MAP = {
  CPU: ['.cpu'], RAM: ['.ram-1', '.ram-2'],
  Storage: ['.ssd', '.hdd'], GPU: ['.gpu'], Temperature: ['.cpu'],
};

let currentTest = 'all';
let isRunning   = false;

// ── Test item selection ───────────────────────────────────────────────
document.querySelectorAll('.test-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.test-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    currentTest = item.dataset.test;
  });
});

// ── Component tooltips ────────────────────────────────────────────────
const tooltip = document.getElementById('tooltip');
document.querySelectorAll('.pc-component[data-comp]').forEach(comp => {
  comp.addEventListener('mouseenter', e => {
    tooltip.innerHTML = `<strong>${e.currentTarget.dataset.comp}</strong><br>Status: ${e.currentTarget.dataset.status || 'Ready'}`;
    tooltip.style.display = 'block';
  });
  comp.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top  = (e.clientY + 12) + 'px';
  });
  comp.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
});

// ── Logging ───────────────────────────────────────────────────────────
function addLog(message, type = 'info') {
  const container = document.getElementById('logContainer');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">[${time}]</span><span class="log-${type}">${message}</span>`;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

// ── Sleep helper ──────────────────────────────────────────────────────
const sleep = ms => new Promise(res => setTimeout(res, ms));

// ── Start diagnostic ──────────────────────────────────────────────────
async function startDiagnostic() {
  if (isRunning) return;
  isRunning = true;

  const progressSection = document.getElementById('progressSection');
  const progressFill    = document.getElementById('progressFill');
  const testName        = document.getElementById('testName');
  const testPercent     = document.getElementById('testPercent');

  progressSection.style.display = 'block';
  const list       = TESTS[currentTest];
  const totalSteps = list.length * 20;
  let step = 0;

  addLog(`Starting ${currentTest === 'all' ? 'full system' : currentTest.toUpperCase()} diagnostic…`, 'info');

  for (const test of list) {
    addLog(`Testing ${test}…`, 'info');
    for (let i = 0; i < 20; i++) {
      await sleep(80);
      step++;
      const pct = Math.round((step / totalSteps) * 100);
      progressFill.style.width = pct + '%';
      testName.textContent    = `Testing ${test}…`;
      testPercent.textContent = pct + '%';
    }

    const hasError = Math.random() > 0.82;
    addLog(
      hasError ? `${test} test completed with warnings` : `${test} test passed`,
      hasError ? 'warning' : 'success'
    );

    // Update visual components
    (COMP_MAP[test] || []).forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.remove('ok', 'error');
        el.classList.add(hasError ? 'error' : 'ok');
        el.dataset.status = hasError ? 'Warning' : 'OK';
      });
    });
  }

  addLog('Diagnostic complete!', 'success');
  testName.textContent    = 'Complete';
  testPercent.textContent = '100%';
  isRunning = false;
}

// ── Clear ─────────────────────────────────────────────────────────────
function clearResults() {
  document.getElementById('progressSection').style.display = 'none';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('logContainer').innerHTML =
    `<div class="log-entry"><span class="log-time">[${new Date().toLocaleTimeString('en-US',{hour12:false})}]</span><span class="log-info">System ready. Click "Start Diagnostic" to begin.</span></div>`;
  document.querySelectorAll('.pc-component').forEach(el => {
    el.classList.remove('ok', 'error');
    el.dataset.status = 'Ready';
  });
}

// ── Generate report ───────────────────────────────────────────────────
function generateReport() {
  const logs = document.querySelectorAll('.log-entry');
  if (logs.length <= 1) { alert('Please run a diagnostic first!'); return; }

  let report = `PC DIAGNOSTIC REPORT\n${'='.repeat(40)}\nDate: ${new Date().toLocaleString()}\n\nRESULTS:\n`;
  logs.forEach(log => { report += log.textContent.trim() + '\n'; });
  report += `\nRECOMMENDATIONS:\n- Keep drivers updated\n- Monitor temperatures regularly\n- Schedule monthly diagnostics\n`;

  const a = document.createElement('a');
  a.href     = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
  a.download = `diagnostic-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  addLog('Report downloaded.', 'success');
}
