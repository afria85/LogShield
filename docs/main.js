(function() {
  'use strict';

  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('footerLogo').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var revealElements = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '-50px' });

  revealElements.forEach(function(el) {
    revealObserver.observe(el);
  });

  document.querySelectorAll('.bento-card, .feature-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  var demoBody = document.getElementById('demo-body');
  var statLines = document.getElementById('stat-lines');
  var statSecrets = document.getElementById('stat-secrets');
  var statStatus = document.getElementById('stat-status');
  var labelInput = document.getElementById('label-input');
  var labelOutput = document.getElementById('label-output');

  var logData = [
    { raw: 'INFO  App started on port 3000', hasSecret: false },
    { raw: 'DEBUG Authorization: Bearer sk_live_4f9e3c8d7a2b1c9d8e7f', hasSecret: true, secretType: 'STRIPE_KEY' },
    { raw: 'INFO  User login successful', hasSecret: false },
    { raw: 'DEBUG AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE', hasSecret: true, secretType: 'AWS_KEY' },
    { raw: 'WARN  Rate limit approaching', hasSecret: false },
    { raw: 'DEBUG x-api-key: ghp_1a2b3c4d5e6f7g8h9i0j', hasSecret: true, secretType: 'GITHUB_TOKEN' }
  ];

  var currentLine = 0;
  var secretCount = 0;
  var demoPhase = 'input';

  function createLogLine(index, data, isRedacted) {
    isRedacted = isRedacted || false;
    var line = document.createElement('div');
    line.className = 'log-line';
    line.id = 'log-' + index;
    
    var num = document.createElement('span');
    num.className = 'log-number';
    num.textContent = (index + 1).toString().padStart(2, '0');
    
    var content = document.createElement('span');
    content.className = 'log-content';
    
    if (isRedacted && data.hasSecret) {
      var parts = data.raw.split(/(:|\=)\s*/);
      if (parts.length >= 2) {
        var keyPart = parts[0] + (parts[1] || '');
        content.innerHTML = '<span class="log-key">' + keyPart + '</span> <span class="log-redacted"><svg class="redacted-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>[REDACTED:' + data.secretType + ']</span>';
      }
    } else if (data.hasSecret) {
      var parts = data.raw.split(/(:|\=)\s*/);
      if (parts.length >= 2) {
        var keyPart = parts[0] + (parts[1] || '');
        var valuePart = parts.slice(2).join('');
        content.innerHTML = '<span class="log-key">' + keyPart + '</span> <span class="log-secret">' + valuePart + '</span>';
      } else {
        content.innerHTML = '<span class="log-value">' + data.raw + '</span>';
      }
    } else {
      content.innerHTML = '<span class="log-value">' + data.raw + '</span>';
    }
    
    line.appendChild(num);
    line.appendChild(content);
    return line;
  }

  function runDemo() {
    if (demoPhase === 'input') {
      if (currentLine < logData.length) {
        var line = createLogLine(currentLine, logData[currentLine]);
        demoBody.appendChild(line);
        setTimeout(function() { line.classList.add('visible'); }, 50);
        statLines.textContent = currentLine + 1;
        statStatus.textContent = 'Reading...';
        if (currentLine === 0) { labelInput.classList.add('visible'); }
        currentLine++;
        setTimeout(runDemo, 400);
      } else {
        demoPhase = 'scanning';
        statStatus.textContent = 'Scanning...';
        currentLine = 0;
        setTimeout(runDemo, 500);
      }
    } else if (demoPhase === 'scanning') {
      if (currentLine < logData.length) {
        var line = document.getElementById('log-' + currentLine);
        line.classList.add('scanning');
        if (logData[currentLine].hasSecret) {
          secretCount++;
          statSecrets.textContent = secretCount;
        }
        currentLine++;
        setTimeout(runDemo, 300);
      } else {
        demoPhase = 'output';
        currentLine = 0;
        labelInput.classList.remove('visible');
        setTimeout(runDemo, 500);
      }
    } else if (demoPhase === 'output') {
      demoBody.innerHTML = '';
      logData.forEach(function(data, i) {
        var line = createLogLine(i, data, true);
        demoBody.appendChild(line);
        setTimeout(function() { line.classList.add('visible'); }, i * 100);
      });
      statStatus.textContent = 'Complete';
      labelOutput.classList.add('visible');
      demoPhase = 'reset';
      setTimeout(runDemo, 4000);
    } else if (demoPhase === 'reset') {
      demoBody.innerHTML = '';
      currentLine = 0;
      secretCount = 0;
      statLines.textContent = '0';
      statSecrets.textContent = '0';
      statStatus.textContent = 'Ready';
      labelOutput.classList.remove('visible');
      demoPhase = 'input';
      setTimeout(runDemo, 1000);
    }
  }

  var demoObserver = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      setTimeout(runDemo, 800);
      demoObserver.disconnect();
    }
  }, { threshold: 0.3 });

  var heroDemo = document.querySelector('.hero-demo');
  if (heroDemo) { demoObserver.observe(heroDemo); }

  window.copyCode = function(e) {
    navigator.clipboard.writeText('npm install -g logshield-cli');
    var btn = e.target.closest('.copy-btn');
    btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
    setTimeout(function() {
      btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    }, 2000);
  };

  window.copyInstall = function(e) {
    navigator.clipboard.writeText('npm install -g logshield-cli');
    var btn = e.target.closest('.copy-btn');
    btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
    setTimeout(function() {
      btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    }, 2000);
  };

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();
