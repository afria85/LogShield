(function() {
  'use strict';

  // ==================== HEADER SCROLL ====================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Footer logo scroll to top
  var footerLogo = document.getElementById('footerLogo');
  if (footerLogo) {
    footerLogo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== REVEAL ANIMATIONS ====================
  var revealElements = document.querySelectorAll('.reveal');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    revealElements.forEach(function(el) {
      el.classList.add('visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '-40px' });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  // ==================== HERO DEMO ====================
  var demoBody = document.getElementById('demo-body');
  var demoStatus = document.getElementById('demo-status');
  var strictToggle = document.getElementById('toggle-strict');
  var dryRunToggle = document.getElementById('toggle-dryrun');
  
  // Demo data - shows real difference between default and strict mode
  var logLines = [
    { 
      prefix: '[DEBUG]', 
      key: 'password=',
      secret: 'secret123',
      redacted: '<REDACTED_PASSWORD>',
      type: 'PASSWORD',
      alwaysRedact: true
    },
    { 
      prefix: '[INFO]', 
      key: 'Authorization: Bearer ',
      secret: 'eyJhbGciOiJIUzI1NiIs...',
      redacted: '<REDACTED_TOKEN>',
      type: 'AUTH_BEARER',
      alwaysRedact: true
    },
    { 
      prefix: '[WARN]', 
      key: 'STRIPE_SECRET_KEY=',
      secret: 'sk_test_51Nabc...',
      redacted: '<REDACTED_STRIPE_KEY>',
      type: 'STRIPE_KEY',
      alwaysRedact: false // only in strict
    },
    { 
      prefix: '[INFO]', 
      key: 'AWS_ACCESS_KEY_ID=',
      secret: 'AKIAIOSFODNN7EXAMPLE',
      redacted: '<REDACTED_AWS_KEY>',
      type: 'AWS_KEY',
      alwaysRedact: false // only in strict
    },
    { 
      prefix: '[DEBUG]', 
      key: 'email: ',
      secret: 'user@example.com',
      redacted: '<REDACTED_EMAIL>',
      type: 'EMAIL',
      alwaysRedact: true
    }
  ];

  var demoState = {
    phase: 'idle',
    isStrict: false,
    isDryRun: false,
    hasRunOnce: false,
    animationTimeout: null,
    lineElements: [] // store references to line elements
  };

  function clearAnimation() {
    if (demoState.animationTimeout) {
      clearTimeout(demoState.animationTimeout);
      demoState.animationTimeout = null;
    }
  }

  function updateDemoStatus(text, rightText) {
    if (demoStatus) {
      var leftEl = demoStatus.querySelector('.demo-status-left');
      var rightEl = demoStatus.querySelector('.demo-status-right');
      
      if (leftEl) leftEl.textContent = text;
      if (rightEl) {
        rightEl.textContent = rightText || '';
        rightEl.style.color = rightText ? 'var(--accent-primary)' : 'var(--text-muted)';
      }
    }
  }

  function getRedactedCount(isStrict) {
    if (isStrict) {
      return logLines.length;
    }
    return logLines.filter(function(l) { return l.alwaysRedact; }).length;
  }

  function shouldRedact(line, isStrict) {
    return isStrict || line.alwaysRedact;
  }

  // Build initial lines with secret values
  function buildLines() {
    demoBody.innerHTML = '';
    demoState.lineElements = [];

    logLines.forEach(function(data, index) {
      var line = document.createElement('div');
      line.className = 'log-line';
      
      var num = document.createElement('span');
      num.className = 'log-number';
      num.textContent = String(index + 1).padStart(2, '0');
      
      var content = document.createElement('span');
      content.className = 'log-content';
      
      var prefix = document.createElement('span');
      prefix.className = 'log-prefix';
      prefix.textContent = data.prefix + ' ';
      
      var key = document.createElement('span');
      key.className = 'log-key';
      key.textContent = data.key;
      
      var value = document.createElement('span');
      value.className = 'log-secret';
      value.textContent = data.secret;
      value.setAttribute('data-index', index);
      
      content.appendChild(prefix);
      content.appendChild(key);
      content.appendChild(value);
      
      line.appendChild(num);
      line.appendChild(content);
      
      demoBody.appendChild(line);
      
      // Store reference
      demoState.lineElements.push({
        line: line,
        valueEl: value,
        data: data
      });
    });
  }

  // Show lines one by one
  function showLinesSequentially(callback) {
    var index = 0;
    
    function showNext() {
      if (index < demoState.lineElements.length) {
        demoState.lineElements[index].line.classList.add('visible');
        index++;
        demoState.animationTimeout = setTimeout(showNext, 150);
      } else {
        demoState.animationTimeout = setTimeout(callback, 300);
      }
    }
    
    showNext();
  }

  // Glow secrets that will be redacted
  function glowSecrets(callback) {
    var toGlow = [];
    
    demoState.lineElements.forEach(function(item) {
      if (shouldRedact(item.data, demoState.isStrict)) {
        toGlow.push(item.valueEl);
      }
    });
    
    // Add glow class
    toGlow.forEach(function(el) {
      el.classList.add('glow');
    });
    
    updateDemoStatus('Scanning...', '');
    
    // Wait for glow effect
    demoState.animationTimeout = setTimeout(function() {
      callback(toGlow);
    }, 800);
  }

  // Transform secrets to redacted (in-place)
  function transformSecrets(glowedElements, callback) {
    var index = 0;
    
    function transformNext() {
      if (index < glowedElements.length) {
        var el = glowedElements[index];
        var dataIndex = parseInt(el.getAttribute('data-index'));
        var data = logLines[dataIndex];
        
        // Remove glow, change class and text
        el.classList.remove('glow');
        el.classList.remove('log-secret');
        el.classList.add('log-redacted');
        el.textContent = data.redacted;
        
        index++;
        demoState.animationTimeout = setTimeout(transformNext, 120);
      } else {
        demoState.animationTimeout = setTimeout(callback, 200);
      }
    }
    
    transformNext();
  }

  // Create dry-run output (replaces entire content)
  function showDryRunOutput(callback) {
    demoBody.innerHTML = '';
    
    var container = document.createElement('div');
    container.className = 'dry-run-output';
    
    // Header
    var headerLine = document.createElement('div');
    headerLine.className = 'log-line';
    headerLine.innerHTML = '<span class="log-content"><span class="log-redacted">[DRY RUN]</span> <span class="log-value">Detected redactions:</span></span>';
    container.appendChild(headerLine);
    
    // Count types
    var types = {};
    logLines.forEach(function(line) {
      if (shouldRedact(line, demoState.isStrict)) {
        if (!types[line.type]) types[line.type] = 0;
        types[line.type]++;
      }
    });
    
    // List types with aligned counts
    var typeKeys = Object.keys(types);
    var maxLen = Math.max.apply(null, typeKeys.map(function(t) { return t.length; }));
    var padLen = Math.max(maxLen + 3, 20);
    
    typeKeys.forEach(function(type) {
      var typeLine = document.createElement('div');
      typeLine.className = 'log-line';
      var spaces = '';
      for (var i = 0; i < padLen - type.length; i++) {
        spaces += '\u00A0';
      }
      typeLine.innerHTML = '<span class="log-content"><span class="log-key">\u00A0\u00A0' + type + spaces + '</span><span class="log-value">x' + types[type] + '</span></span>';
      container.appendChild(typeLine);
    });
    
    // Empty line
    var emptyLine = document.createElement('div');
    emptyLine.className = 'log-line';
    emptyLine.innerHTML = '<span class="log-content">\u00A0</span>';
    container.appendChild(emptyLine);
    
    // Footer
    var footer1 = document.createElement('div');
    footer1.className = 'log-line';
    footer1.innerHTML = '<span class="log-content"><span class="log-value">No output was modified.</span></span>';
    container.appendChild(footer1);
    
    var footer2 = document.createElement('div');
    footer2.className = 'log-line';
    footer2.innerHTML = '<span class="log-content"><span class="log-prefix">Use without --dry-run to apply.</span></span>';
    container.appendChild(footer2);
    
    demoBody.appendChild(container);
    
    // Animate lines
    var lines = container.querySelectorAll('.log-line');
    lines.forEach(function(line, i) {
      setTimeout(function() {
        line.classList.add('visible');
      }, i * 80);
    });
    
    demoState.animationTimeout = setTimeout(callback, lines.length * 80 + 200);
  }

  function runDemoAnimation() {
    clearAnimation();
    updateDemoStatus('Reading input...', '');

    if (prefersReducedMotion) {
      showFinalState();
      return;
    }

    // Build lines first
    buildLines();

    // Step 1: Show lines sequentially
    showLinesSequentially(function() {
      
      // Step 2: Glow secrets (both for normal and dry-run)
      glowSecrets(function(glowedElements) {
        
        if (demoState.isDryRun) {
          // Step 3a: For dry-run, show dry-run output after glow
          demoState.animationTimeout = setTimeout(function() {
            showDryRunOutput(function() {
              finishDemo();
            });
          }, 300);
        } else {
          // Step 3b: Transform in-place
          transformSecrets(glowedElements, function() {
            finishDemo();
          });
        }
      });
    });
  }

  function finishDemo() {
    demoState.phase = 'frozen';
    demoState.hasRunOnce = true;
    
    var count = getRedactedCount(demoState.isStrict);
    
    if (demoState.isDryRun) {
      updateDemoStatus('dry-run complete', count + ' detections');
    } else {
      var modeText = demoState.isStrict ? 'strict mode' : 'default mode';
      updateDemoStatus(modeText, count + ' secrets redacted');
    }
  }

  function showFinalState() {
    // For reduced motion - show end state immediately
    if (demoState.isDryRun) {
      showDryRunOutput(function() {
        finishDemo();
      });
    } else {
      buildLines();
      demoState.lineElements.forEach(function(item) {
        item.line.classList.add('visible');
        if (shouldRedact(item.data, demoState.isStrict)) {
          item.valueEl.classList.remove('log-secret');
          item.valueEl.classList.add('log-redacted');
          item.valueEl.textContent = item.data.redacted;
        }
      });
      finishDemo();
    }
  }

  // Flag toggles
  if (strictToggle) {
    strictToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      demoState.isStrict = this.classList.contains('active');
      
      if (demoState.hasRunOnce) {
        runDemoAnimation();
      }
    });
  }

  if (dryRunToggle) {
    dryRunToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      demoState.isDryRun = this.classList.contains('active');
      
      if (demoState.hasRunOnce) {
        runDemoAnimation();
      }
    });
  }

  // Start demo when hero is visible
  var heroDemo = document.querySelector('.hero-demo');
  if (heroDemo && demoBody) {
    var demoObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !demoState.hasRunOnce) {
        setTimeout(runDemoAnimation, 500);
        demoObserver.disconnect();
      }
    }, { threshold: 0.3 });

    demoObserver.observe(heroDemo);
  }

  // ==================== COPY FUNCTIONS ====================
  window.copyInstall = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var text = 'npm install -g logshield-cli';
    navigator.clipboard.writeText(text).then(function() {
      var btn = e.target.closest('.copy-btn');
      if (btn) {
        var originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
        setTimeout(function() {
          btn.innerHTML = originalHTML;
        }, 2000);
      }
    });
  };

  window.copyCode = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    
    var codeBlock = btn.closest('.code-block');
    if (!codeBlock) return;
    
    var codeBody = codeBlock.querySelector('.code-body');
    if (!codeBody) return;
    
    // Get text content, clean it up
    var text = codeBody.textContent || codeBody.innerText;
    // Remove line numbers if present
    text = text.replace(/^\d+\s*/gm, '').trim();
    
    navigator.clipboard.writeText(text).then(function() {
      var originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
      setTimeout(function() {
        btn.innerHTML = originalHTML;
      }, 2000);
    });
  };

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        var target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();