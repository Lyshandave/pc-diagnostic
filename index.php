<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="Interactive PC Hardware Diagnostic Tool">
  <meta name="robots" content="noindex">
  <title>PC Diagnostic Tool | Lyshan Dave</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <h1><i class="fas fa-stethoscope" aria-hidden="true"></i> PC Diagnostic Tool</h1>
    <a href="../../#projects" class="back-btn"><i class="fas fa-arrow-left" aria-hidden="true"></i> Back</a>
  </header>

  <main class="container">
    <div class="diagnostic-grid">

      <aside class="sidebar">
        <h2><i class="fas fa-tasks" aria-hidden="true"></i> Diagnostic Tests</h2>
        <?php
        $tests = [
          ['all',     'fa-microchip',       'Full System Scan'],
          ['cpu',     'fa-microchip',       'CPU Stress Test'],
          ['ram',     'fa-memory',          'Memory Test'],
          ['storage', 'fa-hdd',             'Storage Health'],
          ['gpu',     'fa-desktop',         'GPU Diagnostic'],
          ['temp',    'fa-thermometer-half','Temperature Check'],
        ];
        foreach ($tests as $i => [$key, $icon, $label]):
        ?>
        <div class="test-item<?= $i === 0 ? ' active' : '' ?>" data-test="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8') ?>">
          <i class="fas <?= htmlspecialchars($icon, ENT_QUOTES, 'UTF-8') ?>" aria-hidden="true"></i>
          <span><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?></span>
        </div>
        <?php endforeach; ?>
      </aside>

      <div class="main-content">
        <div class="pc-visual" aria-label="PC Component Diagram">
          <div class="pc-case">
            <div class="pc-component motherboard" aria-hidden="true"></div>
            <div class="pc-component cpu"       data-comp="CPU"         data-status="Ready"><i class="fas fa-microchip" aria-hidden="true"></i></div>
            <div class="pc-component ram ram-1" data-comp="RAM Slot 1"  data-status="Ready"></div>
            <div class="pc-component ram ram-2" data-comp="RAM Slot 2"  data-status="Ready"></div>
            <div class="pc-component gpu"       data-comp="GPU"         data-status="Ready"><i class="fas fa-desktop" aria-hidden="true"></i></div>
            <div class="pc-component storage ssd" data-comp="SSD"       data-status="Ready">SSD</div>
            <div class="pc-component storage hdd" data-comp="HDD"       data-status="Ready">HDD</div>
            <div class="pc-component psu"       data-comp="PSU"         data-status="Ready"><i class="fas fa-bolt" aria-hidden="true"></i></div>
          </div>
        </div>

        <div class="progress-section" id="progressSection" style="display:none" aria-live="polite">
          <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-labelledby="testName">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="test-status">
            <span id="testName">Running diagnostics…</span>
            <span id="testPercent">0%</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" onclick="startDiagnostic()">
            <i class="fas fa-play" aria-hidden="true"></i> Start Diagnostic
          </button>
          <button class="btn btn-secondary" onclick="clearResults()">
            <i class="fas fa-trash" aria-hidden="true"></i> Clear
          </button>
          <button class="btn btn-secondary" onclick="generateReport()">
            <i class="fas fa-file-alt" aria-hidden="true"></i> Report
          </button>
        </div>

        <div class="results-panel">
          <h3><i class="fas fa-clipboard-list" aria-hidden="true"></i> Diagnostic Log</h3>
          <div class="log-container" id="logContainer" role="log" aria-live="polite">
            <div class="log-entry">
              <span class="log-time">[00:00:00]</span>
              <span class="log-info">System ready. Click "Start Diagnostic" to begin.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="component-tooltip" id="tooltip" role="tooltip"></div>
  <script src="main.js"></script>
</body>
</html>
