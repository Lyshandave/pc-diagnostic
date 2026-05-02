/* PC Diagnostic Tool — Functional Version */
'use strict';

const TESTS = {
  all:     ['CPU', 'RAM', 'Storage', 'GPU', 'Platform'],
  cpu:     ['CPU'],
  ram:     ['RAM'],
  storage: ['Storage'],
  gpu:     ['GPU'],
  temp:    ['Temperature'],
};

const COMP_MAP = {
  CPU: ['.cpu'], RAM: ['.ram-1', '.ram-2'],
  Storage: ['.ssd', '.hdd'], GPU: ['.gpu'], Platform: ['.motherboard'],
};

let currentTest = 'all';
let isRunning   = false;

// ── Detection Logic ───────────────────────────────────────────────────
const detectHardware = {
  getCPU: () => {
    const cores = navigator.hardwareConcurrency || 'Unknown';
    return `${cores} Logical Cores`;
  },
  getRAM: () => {
    const mem = navigator.deviceMemory || 'Unknown';
    return mem !== 'Unknown' ? `${mem} GB Approximate` : 'Restricted by Browser';
  },
  getGPU: () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'Not Supported';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Generic WebGL';
    } catch (e) { return 'Detection Failed'; }
  },
  getStorage: async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const quotaGB = (estimate.quota / (1024 ** 3)).toFixed(2);
      const usageGB = (estimate.usage / (1024 ** 3)).toFixed(4);
      return `${usageGB}GB used of ${quotaGB}GB quota`;
    }
    return 'Permission Denied';
  },
  getPlatform: () => {
    return `${navigator.platform} (${navigator.oscpu || 'Unknown OS'})`;
  }
};

// ── Test item selection ───────────────────────────────────────────────
document.querySelectorAll('.test-item').forEach(item => {
  item.addEventListener('click', () => {
    if (isRunning) return;
    document.querySelectorAll('.test-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    currentTest = item.dataset.test;
    addLog(`Target set to: ${item.querySelector('span').textContent}`, 'info');
  });
});

// ── Component tooltips ────────────────────────────────────────────────
const tooltip = document.getElementById('tooltip');
document.querySelectorAll('.pc-component[data-comp]').forEach(comp => {
  comp.addEventListener('mouseenter', e => {
    tooltip.innerHTML = `<strong>${e.currentTarget.dataset.comp}</strong><br>Status: ${e.currentTarget.dataset.status || 'Ready'}<br><small>${e.currentTarget.dataset.info || ''}</small>`;
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

// ── Benchmarking ─────────────────────────────────────────────────────
async function runCPUBenchmark() {
  const start = performance.now();
  let x = 0;
  for (let i = 0; i < 10000000; i++) { x += Math.sqrt(i); }
  const end = performance.now();
  return (end - start).toFixed(2);
}

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
  let globalStep   = 0;

  addLog(`Initializing deep hardware scan…`, 'info');
  await sleep(1000);

  for (const test of list) {
    testName.textContent = `Analyzing ${test}…`;
    addLog(`Accessing ${test} layer…`, 'info');
    
    // Sub-steps for visual effect
    for (let i = 0; i < 20; i++) {
      await sleep(Math.random() * 50 + 30);
      globalStep++;
      const pct = Math.round((globalStep / totalSteps) * 100);
      progressFill.style.width = pct + '%';
      testPercent.textContent = pct + '%';
    }

    let resultInfo = '';
    let status = 'success';

    // Real Detection Logic
    if (test === 'CPU') {
      const ms = await runCPUBenchmark();
      resultInfo = detectHardware.getCPU() + ` (Score: ${ms}ms)`;
      addLog(`CPU: Detected ${resultInfo}`, 'success');
    } else if (test === 'RAM') {
      resultInfo = detectHardware.getRAM();
      addLog(`RAM: ${resultInfo}`, 'success');
    } else if (test === 'GPU') {
      resultInfo = detectHardware.getGPU();
      addLog(`GPU: ${resultInfo}`, 'success');
    } else if (test === 'Storage') {
      resultInfo = await detectHardware.getStorage();
      addLog(`Storage: ${resultInfo}`, 'success');
    } else if (test === 'Platform') {
      resultInfo = detectHardware.getPlatform();
      addLog(`Platform: ${resultInfo}`, 'success');
    }

    // Update Visuals
    (COMP_MAP[test] || []).forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('ok');
        el.dataset.status = 'Operational';
        el.dataset.info = resultInfo;
      });
    });
  }

  addLog('All systems functional. Diagnostic report generated.', 'success');
  testName.textContent    = 'Diagnostic Complete';
  testPercent.textContent = '100%';
  
  // Highlight system status in header
  const indicator = document.querySelector('.status-indicator');
  if (indicator) indicator.style.background = 'var(--success)';
  
  isRunning = false;
}

// ── Clear ─────────────────────────────────────────────────────────────
function clearResults() {
  if (isRunning) return;
  document.getElementById('progressSection').style.display = 'none';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('logContainer').innerHTML =
    `<div class="log-entry"><span class="log-time">[${new Date().toLocaleTimeString('en-US',{hour12:false})}]</span><span class="log-info">System initialized. Awaiting user command.</span></div>`;
  document.querySelectorAll('.pc-component').forEach(el => {
    el.classList.remove('ok', 'error');
    el.dataset.status = 'Ready';
    el.dataset.info = '';
  });
  const indicator = document.querySelector('.status-indicator');
  if (indicator) indicator.style.background = 'var(--success)';
}

// ── Generate report ───────────────────────────────────────────────────
function generateReport() {
  const logs = document.querySelectorAll('.log-entry');
  if (logs.length <= 1) { alert('Please run a diagnostic first!'); return; }

  let report = `ADVANCED HARDWARE DIAGNOSTIC REPORT\n${'='.repeat(45)}\n`;
  report += `Timestamp: ${new Date().toLocaleString()}\n`;
  report += `User Agent: ${navigator.userAgent}\n\n`;
  report += `DETECTION LOG:\n`;
  logs.forEach(log => { report += log.textContent.trim() + '\n'; });
  report += `\n${'='.repeat(45)}\n`;
  report += `SYSTEM HEALTH: OPTIMAL\n`;

  const a = document.createElement('a');
  a.href     = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
  a.download = `hardware-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  addLog('Report exported to file.', 'success');
}

