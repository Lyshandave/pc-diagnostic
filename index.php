<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="Interactive PC Hardware Diagnostic Tool">
  <meta name="robots" content="noindex">
  <title>PC Diagnostic Tool | Advanced Hardware Monitor</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <div class="header-logo">
      <i class="fas fa-stethoscope" aria-hidden="true"></i>
      <span>PC Diagnostic Tool</span>
    </div>
    <div class="header-status" id="systemStatus">
      <span class="status-indicator"></span> System Ready
    </div>
  </header>

  <main class="container">
    <div class="diagnostic-grid">

      <aside class="sidebar">
        <h2><i class="fas fa-microchip" aria-hidden="true"></i> Hardware Scan</h2>
        <?php
        $tests = [
          ['all',     'fa-microchip',       'Full System'],
          ['cpu',     'fa-microchip',       'CPU Test'],
          ['ram',     'fa-memory',          'Memory'],
          ['storage', 'fa-hdd',             'Storage'],
          ['gpu',     'fa-desktop',         'GPU Check'],
          ['temp',    'fa-thermometer-half','Thermal'],
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

        <div class="controls-card">
          <div class="progress-section" id="progressSection" style="display:none" aria-live="polite">
            <div class="progress-header">
              <span id="testName">Initializing system…</span>
              <span id="testPercent">0%</span>
            </div>
            <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="progress-fill" id="progressFill"></div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-primary" onclick="startDiagnostic()">
              <i class="fas fa-play" aria-hidden="true"></i> Run Scan
            </button>
            <button class="btn btn-secondary" onclick="clearResults()">
              <i class="fas fa-undo" aria-hidden="true"></i> Reset
            </button>
            <button class="btn btn-secondary" onclick="generateReport()">
              <i class="fas fa-file-export" aria-hidden="true"></i> Export Report
            </button>
          </div>
        </div>

        <div class="results-panel">
          <h3><i class="fas fa-terminal" aria-hidden="true"></i> Diagnostic Console</h3>
          <div class="log-container" id="logContainer" role="log" aria-live="polite">
            <div class="log-entry">
              <span class="log-time">[00:00:00]</span>
              <span class="log-info">System initialized. Awaiting user command.</span>
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
