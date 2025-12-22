(function() {
  'use strict';

  // ==================== HEADER SCROLL ====================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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
  
  // Check for reduced motion preference
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
  // Default mode: redacts PASSWORD, AUTH_BEARER, API_KEY_HEADER, EMAIL
  // Strict mode: ALSO redacts STRIPE_KEY, AWS_KEY
  var logLines = [
    { 
      num: '01', 
      prefix: '[DEBUG]', 
      content: 'password=',
      secret: 'secret123',
      redacted: '&lt;REDACTED_PASSWORD&gt;',
      redactedStrict: '&lt;REDACTED_PASSWORD&gt;',
      type: 'PASSWORD',
      alwaysRedact: true
    },
    { 
      num: '02', 
      prefix: '[INFO]', 
      content: 'Authorization: Bearer ',
      secret: 'eyJhbGciOiJIUzI1...',
      redacted: '&lt;REDACTED_TOKEN&gt;',
      redactedStrict: '&lt;REDACTED_TOKEN&gt;',
      type: 'AUTH_BEARER',
      alwaysRedact: true
    },
    { 
      num: '03', 
      prefix: '[WARN]', 
      content: 'STRIPE_SECRET_KEY=',
      secret: 'sk_test_51Nabc...',
      redacted: 'sk_test_51Nabc...', // NOT redacted in default
      redactedStrict: '&lt;REDACTED_STRIPE_KEY&gt;',
      type: 'STRIPE_KEY',
      alwaysRedact: false // only in strict
    },
    { 
      num: '04', 
      prefix: '[INFO]', 
      content: 'AWS_ACCESS_KEY_ID=',
      secret: 'AKIAIOSFODNN7EXAMPLE',
      redacted: 'AKIAIOSFODNN7EXAMPLE', // NOT redacted in default
      redactedStrict: '&lt;REDACTED_AWS_KEY&gt;',
      type: 'AWS_KEY',
      alwaysRedact: false // only in strict
    },
    { 
      num: '05', 
      prefix: '[DEBUG]', 
      content: 'email: ',
      secret: 'user@example.com',
      redacted: '&lt;REDACTED_EMAIL&gt;',
      redactedStrict: '&lt;REDACTED_EMAIL&gt;',
      type: 'EMAIL',
      alwaysRedact: true
    }
  ];

  var demoState = {
    phase: 'idle',
    currentLine: 0,
    isStrict: false,
    isDryRun: false,
    hasRunOnce: false,
    animationTimeout: null
  };

  function clearAnimation() {
    if (demoState.animationTimeout) {
      clearTimeout(demoState.animationTimeout);
      demoState.animationTimeout = null;
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }

  function createLogLine(data, showRedacted, isStrict) {
    var line = document.createElement('div');
    line.className = 'log-line';
    
    var num = document.createElement('span');
    num.className = 'log-number';
    num.textContent = data.num;
    
    var content = document.createElement('span');
    content.className = 'log-content';
    
    var prefix = document.createElement('span');
    prefix.className = 'log-prefix';
    prefix.textContent = data.prefix + ' ';
    
    var key = document.createElement('span');
    key.className = 'log-key';
    key.textContent = data.content;
    
    var value = document.createElement('span');
    
    if (showRedacted) {
      var redactedValue = isStrict ? data.redactedStrict : data.redacted;
      var isActuallyRedacted = redactedValue.indexOf('REDACTED') !== -1;
      
      if (isActuallyRedacted) {
        value.className = 'log-redacted';
        value.textContent = escapeHtml(redactedValue);
      } else {
        // Not redacted in this mode - show as warning (still exposed)
        value.className = 'log-secret';
        value.textContent = redactedValue;
      }
    } else {
      value.className = 'log-secret';
      value.textContent = data.secret;
    }
    
    content.appendChild(prefix);
    content.appendChild(key);
    content.appendChild(value);
    
    line.appendChild(num);
    line.appendChild(content);
    
    return line;
  }

  function getRedactedCount(isStrict) {
    if (isStrict) {
      return logLines.length; // All redacted in strict
    }
    return logLines.filter(function(l) { return l.alwaysRedact; }).length;
  }

  function createDryRunOutput(isStrict) {
    var container = document.createElement('div');
    container.className = 'dry-run-output';
    
    // Header
    var headerLine = document.createElement('div');
    headerLine.className = 'log-line';
    headerLine.innerHTML = '<span class="log-content"><span class="log-redacted">[DRY RUN]</span> <span class="log-value">Detected redactions:</span></span>';
    container.appendChild(headerLine);
    
    // Count each type that would be redacted
    var types = {};
    logLines.forEach(function(line) {
      if (isStrict || line.alwaysRedact) {
        if (!types[line.type]) {
          types[line.type] = 0;
        }
        types[line.type]++;
      }
    });
    
    // List each type with aligned counts using non-breaking spaces
    var typeKeys = Object.keys(types);
    var maxTypeLength = Math.max.apply(null, typeKeys.map(function(t) { return t.length; }));
    var padLength = Math.max(maxTypeLength + 3, 20); // minimum 20 chars
    
    typeKeys.forEach(function(type) {
      var typeLine = document.createElement('div');
      typeLine.className = 'log-line';
      var spaces = '';
      var spacesNeeded = padLength - type.length;
      for (var i = 0; i < spacesNeeded; i++) {
        spaces += '\u00A0'; // non-breaking space
      }
      typeLine.innerHTML = '<span class="log-content"><span class="log-key">\u00A0\u00A0' + type + spaces + '</span><span class="log-value">x' + types[type] + '</span></span>';
      container.appendChild(typeLine);
    });
    
    // Empty line
    var emptyLine = document.createElement('div');
    emptyLine.className = 'log-line';
    emptyLine.innerHTML = '<span class="log-content">&nbsp;</span>';
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
    
    return container;
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

  function runDemoAnimation() {
    clearAnimation();
    
    demoState.phase = 'input';
    demoState.currentLine = 0;
    demoBody.innerHTML = '';
    updateDemoStatus('Reading input...', '');

    if (prefersReducedMotion) {
      showFinalState();
      return;
    }

    function showInputLines() {
      if (demoState.currentLine < logLines.length) {
        var line = createLogLine(logLines[demoState.currentLine], false, false);
        demoBody.appendChild(line);
        
        setTimeout(function() {
          line.classList.add('visible');
        }, 50);
        
        demoState.currentLine++;
        demoState.animationTimeout = setTimeout(showInputLines, 180);
      } else {
        demoState.animationTimeout = setTimeout(startScanning, 350);
      }
    }

    function startScanning() {
      demoState.phase = 'scanning';
      updateDemoStatus('Scanning...', '');
      demoState.animationTimeout = setTimeout(showOutput, 700);
    }

    function showOutput() {
      demoState.phase = 'output';
      demoBody.innerHTML = '';
      demoState.currentLine = 0;
      
      if (demoState.isDryRun) {
        showDryRunOutput();
      } else {
        showRedactedOutput();
      }
    }

    function showDryRunOutput() {
      var dryRunContainer = createDryRunOutput(demoState.isStrict);
      var lines = dryRunContainer.querySelectorAll('.log-line');
      
      demoBody.appendChild(dryRunContainer);
      
      lines.forEach(function(line, i) {
        setTimeout(function() {
          line.classList.add('visible');
        }, i * 80);
      });
      
      demoState.animationTimeout = setTimeout(function() {
        freezeDemo();
      }, lines.length * 80 + 250);
    }

    function showRedactedOutput() {
      function showOutputLines() {
        if (demoState.currentLine < logLines.length) {
          var line = createLogLine(logLines[demoState.currentLine], true, demoState.isStrict);
          demoBody.appendChild(line);
          
          setTimeout(function() {
            line.classList.add('visible');
          }, 50);
          
          demoState.currentLine++;
          demoState.animationTimeout = setTimeout(showOutputLines, 130);
        } else {
          demoState.animationTimeout = setTimeout(freezeDemo, 250);
        }
      }
      
      showOutputLines();
    }

    function freezeDemo() {
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

    showInputLines();
  }

  function showFinalState() {
    demoBody.innerHTML = '';
    
    var count = getRedactedCount(demoState.isStrict);
    
    if (demoState.isDryRun) {
      var dryRunContainer = createDryRunOutput(demoState.isStrict);
      var lines = dryRunContainer.querySelectorAll('.log-line');
      demoBody.appendChild(dryRunContainer);
      lines.forEach(function(line) {
        line.classList.add('visible');
      });
      updateDemoStatus('dry-run complete', count + ' detections');
    } else {
      logLines.forEach(function(data) {
        var line = createLogLine(data, true, demoState.isStrict);
        line.classList.add('visible');
        demoBody.appendChild(line);
      });
      var modeText = demoState.isStrict ? 'strict mode' : 'default mode';
      updateDemoStatus(modeText, count + ' secrets redacted');
    }
    
    demoState.phase = 'frozen';
    demoState.hasRunOnce = true;
  }

  // Flag toggles - restart animation from beginning
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
    var btn = e.target.closest('.copy-btn');
    var codeBlock = btn.closest('.code-block');
    if (codeBlock) {
      var codeBody = codeBlock.querySelector('.code-body');
      if (codeBody) {
        var text = codeBody.textContent;
        navigator.clipboard.writeText(text).then(function() {
          var originalHTML = btn.innerHTML;
          btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
          setTimeout(function() {
            btn.innerHTML = originalHTML;
          }, 2000);
        });
      }
    }
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