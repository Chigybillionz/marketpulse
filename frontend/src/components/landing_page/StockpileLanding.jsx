import React, { useEffect, useRef } from 'react';
import './StockpileLanding.css';

export default function StockpileLanding({ onNavigate }) {
  const storyRef = useRef(null);
  const cvRef = useRef(null);
  const pushVideoRef = useRef(null);
  const plateRef = useRef(null);
  const cutoutRef = useRef(null);
  const camRef = useRef(null);
  const camFRef = useRef(null);
  const fogRef = useRef(null);
  const fogF1Ref = useRef(null);
  const fogF2Ref = useRef(null);
  const layerL0Ref = useRef(null);
  const layerL1Ref = useRef(null);
  const layerL2Ref = useRef(null);
  const layerL3Ref = useRef(null);
  const layerL4Ref = useRef(null);
  const heroCopyRef = useRef(null);
  const hudRef = useRef(null);
  const captionRef = useRef(null);
  const hintRef = useRef(null);
  const rk1Ref = useRef(null);
  const rk3Ref = useRef(null);
  const progBarRef = useRef(null);

  const visionBlockRef = useRef(null);
  const visionWordContainerRef = useRef(null);
  const visionPRef = useRef(null);

  const acctWrapRef = useRef(null);
  const acctPRef = useRef(null);

  const credWrapRef = useRef(null);
  const telemetryCardRef = useRef(null);
  const telemetryNumRef = useRef(null);
  const sparklinePolyRef = useRef(null);
  const featsRef = useRef(null);
  const solRef = useRef(null);

  const solCard1BgRef = useRef(null);
  const solCard2BgRef = useRef(null);
  const solCard3BgRef = useRef(null);

  useEffect(() => {
    /* --- High Fidelity Asset Generators for Standalone / Offline Preview --- */
    function createFallbackHeroPlate() {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e6ece8" />
              <stop offset="60%" stop-color="#d6e0db" />
              <stop offset="100%" stop-color="#cad4ce" />
            </linearGradient>
            <linearGradient id="obsidian" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#091610" />
              <stop offset="50%" stop-color="#142820" />
              <stop offset="100%" stop-color="#050e09" />
            </linearGradient>
            <linearGradient id="conduit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22e584" />
              <stop offset="100%" stop-color="#12b866" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="1600" height="900" fill="url(#sky)" />
          <ellipse cx="800" cy="520" rx="650" ry="240" fill="rgba(255,255,255,0.22)" filter="blur(40px)" />
          <g id="monolith" transform="translate(800, 520)">
            <polygon points="0,-275 -16,-180 16,-180" fill="#0d2117" />
            <line x1="0" y1="-275" x2="0" y2="-180" stroke="#22e584" stroke-width="2.5" filter="url(#glow)" />
            <polygon points="-42,-220 -52,-140 -32,-140" fill="#0d2117" />
            <line x1="-42" y1="-220" x2="-42" y2="-140" stroke="#22e584" stroke-width="1.8" />
            <polygon points="42,-220 32,-140 52,-140" fill="#0d2117" />
            <line x1="42" y1="-220" x2="42" y2="-140" stroke="#22e584" stroke-width="1.8" />
            <polygon points="0,-180 -120,-80 -140,110 0,190 140,110 120,-80" fill="url(#obsidian)" stroke="rgba(255,255,255,0.18)" stroke-width="1" />
            <polygon points="0,-180 -120,-80 0,60" fill="#18362b" opacity="0.65" />
            <polygon points="0,-180 120,-80 0,60" fill="#08140e" opacity="0.8" />
            <polygon points="-120,-80 -140,110 0,190 0,60" fill="#112920" />
            <polygon points="120,-80 140,110 0,190 0,60" fill="#0b1b14" />
            <path d="M-90,-60 L-10,0 L-10,130" fill="none" stroke="url(#conduit)" stroke-width="3" filter="url(#glow)" />
            <path d="M90,-60 L10,0 L10,130" fill="none" stroke="url(#conduit)" stroke-width="3" filter="url(#glow)" />
            <circle cx="0" cy="60" r="14" fill="#22e584" filter="url(#glow)" opacity="0.9" />
            <circle cx="0" cy="60" r="6" fill="#ffffff" />
          </g>
        </svg>
      `);
    }

    function createFallbackCutout() {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
          <defs>
            <linearGradient id="obsidian2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#091610" />
              <stop offset="50%" stop-color="#142820" />
              <stop offset="100%" stop-color="#050e09" />
            </linearGradient>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g id="monolith" transform="translate(800, 520)">
            <polygon points="0,-275 -16,-180 16,-180" fill="#0d2117" />
            <line x1="0" y1="-275" x2="0" y2="-180" stroke="#22e584" stroke-width="2.5" filter="url(#glow2)" />
            <polygon points="-42,-220 -52,-140 -32,-140" fill="#0d2117" />
            <line x1="-42" y1="-220" x2="-42" y2="-140" stroke="#22e584" stroke-width="1.8" />
            <polygon points="42,-220 32,-140 52,-140" fill="#0d2117" />
            <line x1="42" y1="-220" x2="42" y2="-140" stroke="#22e584" stroke-width="1.8" />
            <polygon points="0,-180 -120,-80 -140,110 0,190 140,110 120,-80" fill="url(#obsidian2)" stroke="rgba(255,255,255,0.18)" stroke-width="1" />
            <path d="M-90,-60 L-10,0 L-10,130" fill="none" stroke="#22e584" stroke-width="3" filter="url(#glow2)" />
            <path d="M90,-60 L10,0 L10,130" fill="none" stroke="#22e584" stroke-width="3" filter="url(#glow2)" />
            <circle cx="0" cy="60" r="14" fill="#22e584" filter="url(#glow2)" opacity="0.9" />
            <circle cx="0" cy="60" r="6" fill="#ffffff" />
          </g>
        </svg>
      `);
    }

    function createFallbackSpriteSheet() {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="678" viewBox="0 0 1200 678">
          <defs>
            <linearGradient id="prism" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#22e584" />
              <stop offset="50%" stop-color="#0f5236" />
              <stop offset="100%" stop-color="#071b12" />
            </linearGradient>
          </defs>
          <g transform="translate(160, 347)">
            <polygon points="0,-110 90,40 -90,40" fill="url(#prism)" stroke="#22e584" stroke-width="2" />
            <polygon points="0,-110 0,40 -90,40" fill="#22e584" opacity="0.35" />
            <line x1="0" y1="-80" x2="0" y2="20" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
            <circle cx="0" cy="-20" r="16" fill="none" stroke="#22e584" stroke-width="2.5" />
          </g>
          <g transform="translate(1027, 375)">
            <polygon points="0,-80 80,-35 0,10 -80,-35" fill="#296349" stroke="#ffffff" stroke-width="1.5" />
            <polygon points="-80,-35 0,10 0,95 -80,50" fill="#0d2117" stroke="#22e584" stroke-width="1.5" />
            <polygon points="80,-35 0,10 0,95 80,50" fill="#143e2d" stroke="#22e584" stroke-width="1.5" />
            <text x="0" y="58" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="34" fill="#22e584" text-anchor="middle">₦</text>
          </g>
        </svg>
      `);
    }

    function createFallbackTerminalStill() {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
          <rect width="800" height="600" fill="#0e2319" />
          <rect x="40" y="40" width="720" height="520" rx="16" fill="#163828" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
          <path d="M80,300 Q140,220 200,300 T320,300 T440,260 T560,340 T680,290" fill="none" stroke="#22e584" stroke-width="4" stroke-linecap="round" />
          <circle cx="440" cy="260" r="8" fill="#ffffff" />
          <rect x="80" y="90" width="180" height="30" rx="6" fill="#22e584" opacity="0.25" />
          <text x="95" y="110" font-family="'JetBrains Mono', monospace" font-size="13" fill="#22e584" font-weight="bold">VOICE PARSED 99.4%</text>
          <text x="80" y="440" font-family="'Inter Tight', sans-serif" font-size="28" fill="#ffffff" font-weight="600">Stockpile Command Center</text>
          <text x="80" y="480" font-family="'Inter Tight', sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">Instant voice transcription, offline SQLite cache &amp; cloud reconciliation.</text>
        </svg>
      `);
    }

    function createFallbackLedgerStill() {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
          <rect width="800" height="600" fill="#0b1c14" />
          <rect x="50" y="50" width="700" height="500" rx="16" fill="#133324" stroke="rgba(34,229,132,0.3)" stroke-width="2" />
          <rect x="90" y="100" width="300" height="90" rx="10" fill="#0a1a12" />
          <text x="110" y="135" font-family="'Inter Tight', sans-serif" font-size="14" fill="rgba(255,255,255,0.6)">Total Recoverable Credit</text>
          <text x="110" y="170" font-family="'Inter Tight', sans-serif" font-size="28" font-weight="bold" fill="#22e584">₦ 1,840,500</text>
          <rect x="420" y="100" width="290" height="90" rx="10" fill="#1e4e37" />
          <circle cx="455" cy="145" r="18" fill="#25D366" />
          <text x="490" y="142" font-family="'Inter Tight', sans-serif" font-size="14" fill="#ffffff" font-weight="bold">Auto-Nudge Ready</text>
          <text x="490" y="162" font-family="'Inter Tight', sans-serif" font-size="12" fill="rgba(255,255,255,0.7)">14 Reminders Queued</text>
          <line x1="90" y1="240" x2="710" y2="240" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <line x1="90" y1="320" x2="710" y2="320" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <line x1="90" y1="400" x2="710" y2="400" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <text x="90" y="290" font-family="'Inter Tight', sans-serif" font-size="18" fill="#ffffff">Alhaji Musa · 5 bags Rice · ₦175,000</text>
          <text x="90" y="370" font-family="'Inter Tight', sans-serif" font-size="18" fill="#ffffff">Mama Ngozi · Provisions batch · ₦42,000</text>
          <text x="90" y="450" font-family="'Inter Tight', sans-serif" font-size="18" fill="#ffffff">Emeka &amp; Sons · Palm Oil drums · ₦96,000</text>
        </svg>
      `);
    }

    // Apply fallbacks immediately
    function isPlaceholder(src) {
      if (!src) return true;
      return src.includes('[ASSET_') || src.includes('%5BASSET_');
    }

    if (plateRef.current) {
      plateRef.current.onerror = () => { plateRef.current.src = createFallbackHeroPlate(); };
      if (isPlaceholder(plateRef.current.src)) {
        plateRef.current.src = createFallbackHeroPlate();
      }
    }
    if (cutoutRef.current) {
      cutoutRef.current.onerror = () => { cutoutRef.current.src = createFallbackCutout(); };
      if (isPlaceholder(cutoutRef.current.src)) {
        cutoutRef.current.src = createFallbackCutout();
      }
    }
    document.querySelectorAll('.stockpile-root .artifact-sprite').forEach((img) => {
      img.onerror = () => { img.src = createFallbackSpriteSheet(); };
      if (isPlaceholder(img.src)) {
        img.src = createFallbackSpriteSheet();
      }
    });

    if (solCard1BgRef.current) solCard1BgRef.current.style.backgroundImage = `url("${createFallbackTerminalStill()}")`;
    if (solCard2BgRef.current) solCard2BgRef.current.style.backgroundImage = `url("${createFallbackLedgerStill()}")`;
    if (solCard3BgRef.current) solCard3BgRef.current.style.backgroundImage = `url("${createFallbackTerminalStill()}")`;

    // Setup Noise for Fog Bank
    const f1Svg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="700" height="460">
        <filter id="n1">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="3" seed="4" />
          <feColorMatrix type="matrix" values="
            0 0 0 0 0.74
            0 0 0 0 0.78
            0 0 0 0 0.79
            1.4 0 0 0 -0.7" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n1)" />
      </svg>
    `);
    const f2Svg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="700" height="460">
        <filter id="n2">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="4" seed="11" />
          <feColorMatrix type="matrix" values="
            0 0 0 0 0.90
            0 0 0 0 0.92
            0 0 0 0 0.92
            1.6 0 0 0 -0.55" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n2)" />
      </svg>
    `);
    if (fogF1Ref.current) fogF1Ref.current.style.backgroundImage = `url("${f1Svg}")`;
    if (fogF2Ref.current) fogF2Ref.current.style.backgroundImage = `url("${f2Svg}")`;

    // Populate Vision (L2) Words
    if (visionWordContainerRef.current) {
      visionWordContainerRef.current.innerHTML = '';
      const lines = [
        ["From", "Paper", "Notebooks"],
        ["to", "Voice-Powered,"],
        ["Profitable", "Shops"]
      ];
      let wordCount = 0;
      lines.forEach((line, lineIdx) => {
        line.forEach((word) => {
          const span = document.createElement('span');
          span.className = 'vision-word';
          span.dataset.vindex = wordCount++;
          span.textContent = word + '\u00A0';
          visionWordContainerRef.current.appendChild(span);
        });
        if (lineIdx < lines.length - 1) {
          visionWordContainerRef.current.appendChild(document.createElement('br'));
        }
      });
    }

    // Populate Accounting (L3) Words
    if (acctPRef.current) {
      acctPRef.current.innerHTML = '';
      const acctText = "Stockpile turns natural voice notes in English or Pidgin into structured inventory updates, customer credit records, and daily profit summaries — so you never lose a naira to forgotten debts or stockouts.";
      acctText.split(' ').forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'acct-word';
        span.dataset.aindex = i;
        span.textContent = w + ' ';
        acctPRef.current.appendChild(span);
      });
    }

    // Math Helpers
    function clamp(val, min = 0, max = 1) {
      return Math.min(max, Math.max(min, val));
    }
    function seg(p, a, b) {
      return clamp((p - a) / (b - a));
    }
    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Layout Hero math
    function layoutHero() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const heroCopy = heroCopyRef.current;
      if (!heroCopy) return;
      const h1 = heroCopy.querySelector('h1');
      const lineWrap = heroCopy.querySelector('.line-wrap');
      if (!h1 || !lineWrap) return;

      if (W <= 820) {
        heroCopy.style.top = '';
        h1.style.fontSize = '';
        lineWrap.style.whiteSpace = 'normal';
        return;
      }

      lineWrap.style.whiteSpace = 'nowrap';
      const bw = W * 1.06;
      const bh = H * 1.12;
      const k = Math.max(bw / 1600, bh / 900);
      const spireTop = -0.09 * H + (bh - 900 * k) / 2 + 245 * k + 0.06 * H;
      let fs = Math.min(104, 72 * k);
      h1.style.fontSize = fs + 'px';

      const maxW = W * 0.86;
      if (lineWrap.scrollWidth > maxW) {
        fs = fs * (maxW / lineWrap.scrollWidth);
        h1.style.fontSize = fs + 'px';
      }

      const blockHeight = heroCopy.offsetHeight || 160;
      // Guarantee clear minimum clearance below the fixed nav bar
      const blockTop = Math.max(92, spireTop + 0.5 * fs - blockHeight);
      heroCopy.style.top = blockTop + 'px';
    }

    window.addEventListener('resize', layoutHero);
    layoutHero();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layoutHero);
    }

    // Video frame caching & Canvas Scrubbing Engine
    const cv = cvRef.current;
    const ctx = cv ? cv.getContext('2d') : null;
    const FPS = 24;
    const NF = 121;
    const frames = new Array(NF);
    const grabCv = document.createElement('canvas');
    grabCv.width = 1600;
    grabCv.height = 900;
    const grabCtx = grabCv.getContext('2d');

    let shown = -1;
    let want = 0;
    let isDrawing = false;

    function resizeCanvas() {
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
      if (shown >= 0 && frames[shown]) {
        drawCachedBitmap(frames[shown]);
      }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function initProceduralFrames() {
      const tempImg = new Image();
      tempImg.onload = () => {
        for (let f = 0; f < NF; f++) {
          const p = f / (NF - 1);
          grabCtx.save();
          grabCtx.clearRect(0, 0, 1600, 900);
          grabCtx.fillStyle = '#dfe6e2';
          grabCtx.fillRect(0, 0, 1600, 900);

          const scale = 1 + p * 2.4;
          const transY = p * 220;
          grabCtx.translate(800, 520);
          grabCtx.scale(scale, scale);
          grabCtx.translate(-800, -520 + transY);

          grabCtx.drawImage(tempImg, 0, 0, 1600, 900);

          if (p > 0.4) {
            const alpha = ease((p - 0.4) / 0.6);
            grabCtx.fillStyle = 'rgba(13, 33, 23, ' + (alpha * 0.94) + ')';
            grabCtx.fillRect(600, 360, 400, 320);

            grabCtx.strokeStyle = '#22e584';
            grabCtx.lineWidth = 3;
            grabCtx.beginPath();
            for (let x = 620; x <= 980; x += 10) {
              const y = 480 + Math.sin((x + f * 12) * 0.05) * (18 * alpha);
              if (x === 620) grabCtx.moveTo(x, y); else grabCtx.lineTo(x, y);
            }
            grabCtx.stroke();
          }

          grabCtx.restore();

          grabCv.toBlob((blob) => {
            frames[f] = blob;
            if (f === 0 && shown < 0) drawWant();
          }, 'image/jpeg', f === 0 ? 0.9 : 0.86);
        }
      };
      tempImg.src = createFallbackHeroPlate();
    }
    initProceduralFrames();

    function drawCachedBitmap(blob) {
      if (!blob || !ctx || !cv) return;
      createImageBitmap(blob).then((bmp) => {
        const cw = cv.width;
        const ch = cv.height;
        const bw = bmp.width;
        const bh = bmp.height;
        const scale = Math.max(cw / bw, ch / bh);
        const dw = bw * scale;
        const dh = bh * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(bmp, dx, dy, dw, dh);
        bmp.close();
      }).catch(() => {});
    }

    function drawWant() {
      if (isDrawing || !cv || !ctx) return;
      if (!frames[want]) {
        let found = -1;
        for (let k = 1; k < NF; k++) {
          if (want - k >= 0 && frames[want - k]) { found = want - k; break; }
          if (want + k < NF && frames[want + k]) { found = want + k; break; }
        }
        if (found < 0 || found === shown) return;
        isDrawing = true;
        shown = found;
        createImageBitmap(frames[found]).then((bmp) => {
          const cw = cv.width;
          const ch = cv.height;
          const bw = bmp.width;
          const bh = bmp.height;
          const scale = Math.max(cw / bw, ch / bh);
          const dw = bw * scale;
          const dh = bh * scale;
          const dx = (cw - dw) / 2;
          const dy = (ch - dh) / 2;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(bmp, dx, dy, dw, dh);
          bmp.close();
          isDrawing = false;
          if (want !== shown) drawWant();
        }).catch(() => { isDrawing = false; });
        return;
      }

      if (want === shown) return;
      isDrawing = true;
      shown = want;
      createImageBitmap(frames[want]).then((bmp) => {
        const cw = cv.width;
        const ch = cv.height;
        const bw = bmp.width;
        const bh = bmp.height;
        const scale = Math.max(cw / bw, ch / bh);
        const dw = bw * scale;
        const dh = bh * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(bmp, dx, dy, dw, dh);
        bmp.close();
        isDrawing = false;
        if (want !== shown) drawWant();
      }).catch(() => { isDrawing = false; });
    }

    // Pointer move tracking
    let mx = 0, my = 0;
    let sx = 0, sy = 0;
    const handlePointerMove = (e) => {
      mx = (e.clientX / window.innerWidth) - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Hotspot & Feat rows
    const hotspots = document.querySelectorAll('.stockpile-root .hotspot');
    hotspots.forEach((hs) => {
      hs.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOn = hs.classList.contains('on');
        hotspots.forEach((h) => h.classList.remove('on'));
        if (!isOn) hs.classList.add('on');
      });
    });

    const featRows = document.querySelectorAll('.stockpile-root .feat-row');
    featRows.forEach((row) => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOn = row.classList.contains('on');
        featRows.forEach((r) => r.classList.remove('on'));
        if (!isOn) row.classList.add('on');
      });
    });

    const handleDocClick = () => {
      hotspots.forEach((h) => h.classList.remove('on'));
      featRows.forEach((r) => r.classList.remove('on'));
    };
    document.addEventListener('click', handleDocClick);

    // Tilt for solutions cards
    const solCards = document.querySelectorAll('.stockpile-root .sol-card');
    solCards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      });
    });

    // Stats count up
    let statsTriggered = false;
    function checkStatsTrigger() {
      if (statsTriggered || !solRef.current) return;
      const rect = solRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        statsTriggered = true;
        const statEls = document.querySelectorAll('.stockpile-root .stat-num');
        const startTime = performance.now();
        const duration = 1600;

        function animateStats(now) {
          const elapsed = now - startTime;
          const progress = clamp(elapsed / duration, 0, 1);
          const eased = ease(progress);

          statEls.forEach((el) => {
            const target = parseFloat(el.dataset.target);
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            el.textContent = (target * eased).toFixed(decimals);
          });

          if (progress < 1) {
            requestAnimationFrame(animateStats);
          } else {
            statEls.forEach((el) => {
              const target = parseFloat(el.dataset.target);
              const decimals = parseInt(el.dataset.decimals || '0', 10);
              el.textContent = target.toFixed(decimals);
            });
          }
        }
        requestAnimationFrame(animateStats);
      }
    }

    // Sparkline setup
    const sparklineTotalLength = 250;
    if (sparklinePolyRef.current) {
      sparklinePolyRef.current.style.strokeDasharray = sparklineTotalLength;
      sparklinePolyRef.current.style.strokeDashoffset = sparklineTotalLength;
    }

    // Main rAF loop
    let animId;
    let sp = 0;
    let lastTime = performance.now();

    function updateFrame(now) {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      const story = storyRef.current;
      if (!story) return;

      const storyRect = story.getBoundingClientRect();
      const maxScroll = story.offsetHeight - window.innerHeight;
      const p = maxScroll > 0 ? clamp(-storyRect.top / maxScroll, 0, 1) : 0;

      sp += (p - sp) * (1 - Math.pow(0.86, dt / 16.7));
      if (Math.abs(p - sp) < 0.0002) sp = p;

      sx += (mx - sx) * 0.06;
      sy += (my - sy) * 0.06;

      const vp = ease(seg(sp, 0.05, 0.70));
      want = Math.round(vp * (NF - 1));
      drawWant();

      const camTrans = `translate3d(${-sx * 18}px, ${-sy * 12 + (1 - vp) * window.innerHeight * 0.06}px, 0) scale(${1 + 0.02 * (1 - vp)})`;
      if (camRef.current) camRef.current.style.transform = camTrans;
      if (camFRef.current) camFRef.current.style.transform = camTrans;

      const ho = (shown < 0) ? 0 : (shown === 0 ? seg(sp, 0.06, 0.105) : 1);
      const plateOpacity = 1 - ho;
      if (plateRef.current) {
        plateRef.current.style.opacity = plateOpacity;
        plateRef.current.style.visibility = plateOpacity <= 0 ? 'hidden' : 'visible';
      }
      if (camFRef.current) {
        camFRef.current.style.opacity = plateOpacity;
        camFRef.current.style.visibility = (plateOpacity > 0 && shown >= 0) ? 'visible' : 'hidden';
      }

      // Shards
      const fp = seg(sp, 0.02, 0.2);
      const fe = fp * fp;
      if (rk1Ref.current && rk3Ref.current) {
        if (fp >= 1) {
          rk1Ref.current.style.visibility = 'hidden';
          rk3Ref.current.style.visibility = 'hidden';
        } else {
          rk1Ref.current.style.visibility = 'visible';
          rk3Ref.current.style.visibility = 'visible';
          const d1 = 1.3, x1 = -0.3, y1 = -0.6;
          rk1Ref.current.style.transform = `translate3d(${x1 * fp * 70 + sx * -24 * d1}vw, ${y1 * fp * 60 + sy * -16 * d1}vh, 0) scale(${1 + fe * 1.6 * d1})`;
          rk1Ref.current.style.filter = `blur(${fe * 5 * d1}px)`;

          const d3 = 1.8, x3 = 1, y3 = 0.55;
          rk3Ref.current.style.transform = `translate3d(${x3 * fp * 70 + sx * -24 * d3}vw, ${y3 * fp * 60 + sy * -16 * d3}vh, 0) scale(${1 + fe * 1.6 * d3})`;
          rk3Ref.current.style.filter = `blur(${fe * 5 * d3}px)`;
        }
      }

      // Hero copy (Smooth, progressive fade out without abrupt disappearance)
      const h = seg(sp, 0.04, 0.16);
      if (layerL0Ref.current && layerL1Ref.current) {
        if (h >= 1) {
          layerL0Ref.current.style.visibility = 'hidden';
          layerL1Ref.current.style.visibility = 'hidden';
        } else {
          layerL0Ref.current.style.visibility = 'visible';
          layerL1Ref.current.style.visibility = 'visible';
          if (heroCopyRef.current) {
            heroCopyRef.current.style.transform = `translate3d(${-sx * 10}px, ${-h * 80 - sy * 6}px, 0) scale(${1 + h * 0.12})`;
            heroCopyRef.current.style.filter = `blur(${h * 12}px)`;
            heroCopyRef.current.style.opacity = 1 - h;
          }
          if (hudRef.current) {
            hudRef.current.style.transform = `translate3d(${sx * 26}px, ${sy * 18 - h * 40}px, 0)`;
            hudRef.current.style.opacity = 1 - seg(sp, 0.04, 0.14);
          }
          const hintOpacity = 1 - seg(sp, 0.02, 0.10);
          if (captionRef.current) captionRef.current.style.opacity = hintOpacity;
          if (hintRef.current) hintRef.current.style.opacity = hintOpacity;
        }
      }

      // Fog bank
      const fg = ease(seg(sp, 0.34, 0.46));
      if (fogRef.current) {
        if (fg > 0.001) {
          fogRef.current.style.visibility = 'visible';
          fogRef.current.style.opacity = fg;
          fogRef.current.style.transform = `translate3d(${(fg - 1) * 18 + sx * -10}vw, ${sy * -6}px, 0)`;
        } else {
          fogRef.current.style.visibility = 'hidden';
        }
      }

      // Vision (L2)
      const vIn = seg(sp, 0.14, 0.28);
      const vOut = seg(sp, 0.36, 0.45);
      if (layerL2Ref.current && visionBlockRef.current) {
        if (vIn > 0 && vOut < 1) {
          layerL2Ref.current.style.visibility = 'visible';
          visionBlockRef.current.style.visibility = 'visible';
          const visionWordEls = document.querySelectorAll('.stockpile-root .vision-word');
          visionWordEls.forEach((span) => {
            const i = parseInt(span.dataset.vindex || '0', 10);
            const k = clamp(vIn * 1.6 - i * 0.08, 0, 1);
            span.style.transform = `translate3d(0, ${(1 - k) * 30 - vOut * 60}px, 0)`;
            span.style.filter = `blur(${(1 - k) * 12 + vOut * 14}px)`;
            span.style.opacity = k * (1 - vOut);
          });
          const auxOpacity = clamp(vIn * 2 - 0.6, 0, 1) * (1 - vOut);
          const auxTrans = `translate3d(0, ${-vOut * 50}px, 0)`;
          const chip = visionBlockRef.current.querySelector('.chip');
          if (chip) {
            chip.style.opacity = auxOpacity;
            chip.style.transform = auxTrans;
          }
          if (visionPRef.current) {
            visionPRef.current.style.opacity = auxOpacity;
            visionPRef.current.style.transform = auxTrans;
          }
        } else {
          layerL2Ref.current.style.visibility = 'hidden';
          visionBlockRef.current.style.visibility = 'hidden';
        }
      }

      // Accounting (L3)
      const aIn = seg(sp, 0.38, 0.52);
      const aOut = seg(sp, 0.62, 0.70);
      if (layerL3Ref.current && acctWrapRef.current) {
        if (aIn > 0 && aOut < 1) {
          layerL3Ref.current.style.visibility = 'visible';
          acctWrapRef.current.style.visibility = 'visible';
          const acctWordEls = document.querySelectorAll('.stockpile-root .acct-word');
          const totalWords = acctWordEls.length || 1;
          acctWordEls.forEach((span) => {
            const i = parseInt(span.dataset.aindex || '0', 10);
            const k = clamp(aIn * 2.2 - (i / totalWords) * 1.2, 0, 1);
            span.style.opacity = (0.15 + 0.85 * k) * (1 - aOut);
            span.style.filter = `blur(${(1 - k) * 6 + aOut * 10}px)`;
          });

          hotspots.forEach((hs, i) => {
            const hk = seg(sp, 0.42 + i * 0.02, 0.48 + i * 0.02);
            hs.style.visibility = hk > 0 ? 'visible' : 'hidden';
            hs.style.transform = `translate3d(${sx * -30}px, ${sy * -20}px, 0) scale(${hk * (1 - aOut)})`;
            hs.style.opacity = hk * (1 - aOut);
          });
        } else {
          layerL3Ref.current.style.visibility = 'hidden';
          acctWrapRef.current.style.visibility = 'hidden';
          hotspots.forEach((hs) => { hs.style.visibility = 'hidden'; });
        }
      }

      // Station (L4)
      const sIn = seg(sp, 0.65, 0.78);
      const cIn = ease(seg(sp, 0.68, 0.82));
      if (layerL4Ref.current && credWrapRef.current && telemetryCardRef.current && featsRef.current) {
        if (sIn > 0) {
          layerL4Ref.current.style.visibility = 'visible';
          credWrapRef.current.style.visibility = 'visible';
          credWrapRef.current.style.opacity = sIn;
          credWrapRef.current.style.transform = `translate3d(0, ${(1 - sIn) * 30}px, 0)`;
          credWrapRef.current.style.filter = `blur(${(1 - sIn) * 8}px)`;

          telemetryCardRef.current.style.visibility = 'visible';
          telemetryCardRef.current.style.opacity = cIn;
          telemetryCardRef.current.style.transform = `translate3d(${sx * -14}px, ${(1 - cIn) * 60 + sy * -10}px, 0) rotateY(${sx * 8}deg) rotateX(${-sy * 8}deg)`;

          if (telemetryNumRef.current) {
            telemetryNumRef.current.textContent = Math.round(485 * seg(sp, 0.70, 0.85));
          }
          if (sparklinePolyRef.current) {
            sparklinePolyRef.current.style.strokeDashoffset = (1 - seg(sp, 0.72, 0.88)) * sparklineTotalLength;
          }

          featsRef.current.style.visibility = 'visible';
          featRows.forEach((row, i) => {
            const rk = ease(seg(sp, 0.70 + i * 0.025, 0.78 + i * 0.025));
            row.style.opacity = rk;
            row.style.transform = `translateX(${(1 - rk) * 40}px)`;
          });
        } else {
          layerL4Ref.current.style.visibility = 'hidden';
          credWrapRef.current.style.visibility = 'hidden';
          telemetryCardRef.current.style.visibility = 'hidden';
          featsRef.current.style.visibility = 'hidden';
        }
      }

      if (progBarRef.current) {
        progBarRef.current.style.transform = `scaleX(${sp})`;
      }

      checkStatsTrigger();
      animId = requestAnimationFrame(updateFrame);
    }

    animId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', layoutHero);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('click', handleDocClick);
    };
  }, []);

  return (
    <div className="stockpile-root">
      {/* Navigation */}
      <header id="nav">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            src="/stockpile-logo.jpg"
            alt="Stockpile"
            className="nav-brand-img"
          />
        </div>

        <nav className="nav-menu">
          <a className="nav-link" href="#voice">Voice Ledger <span className="nav-chevron"></span></a>
          <a className="nav-link" href="#stock">Stock Control <span className="nav-chevron"></span></a>
          <a className="nav-link" href="#debtors">Debtors <span className="nav-chevron"></span></a>
          <a className="nav-link" href="#sol">Solutions <span className="nav-chevron"></span></a>
        </nav>

        <div className="nav-cta-wrapper">
          <button
            className="nav-cta"
            onClick={() => onNavigate ? onNavigate('home') : window.location.assign('/home')}
          >
            <span>OPEN LEDGER</span>
            <span className="cta-square">›</span>
          </button>
        </div>
      </header>

      {/* Pinned Scroll Story */}
      <main id="story" ref={storyRef}>
        <div id="stage">
          {/* Camera Box */}
          <div className="cam" id="cam" ref={camRef}>
            <canvas id="cv" ref={cvRef}></canvas>
            <img className="plate" id="hero-plate" ref={plateRef} src="[ASSET_2_HERO_STILL_PNG]" alt="Stockpile Vault Still" />
            <div className="mist"></div>
          </div>

          <video id="push" ref={pushVideoRef} muted playsInline preload="auto" crossOrigin="anonymous" src="[ASSET_1_FLYIN_VIDEO_MP4]"></video>

          {/* Fog Bank */}
          <div className="fog" id="fog" ref={fogRef}>
            <div className="fog-layer f0"></div>
            <div className="fog-layer f1" ref={fogF1Ref}></div>
            <div className="fog-layer f2" ref={fogF2Ref}></div>
          </div>

          {/* Layer L0: Hero Headline */}
          <div className="layer" id="layer-l0" ref={layerL0Ref}>
            <div className="hero-copy" ref={heroCopyRef}>
              <div className="chip">Voice-First Commerce OS</div>
              <h1>
                <span className="line-wrap">
                  <span>Speak Your Stock</span>
                </span>
              </h1>
            </div>
          </div>

          {/* Front Cut-Out */}
          <div className="cam camF" id="camF" ref={camFRef}>
            <img id="hero-cutout" ref={cutoutRef} src="[ASSET_3_HERO_CUTOUT_PNG]" alt="Monolith Spire Cutout" />
          </div>

          {/* Floating Collateral Shards */}
          <div className="rock rk1" id="rk1" ref={rk1Ref} data-x="-0.3" data-y="-0.6" data-d="1.3">
            <div className="bob">
              <img className="artifact-sprite" src="[ASSET_4_ARTIFACT_SPRITES_PNG]" alt="Voice Waveform Prism" />
            </div>
          </div>

          <div className="rock rk3" id="rk3" ref={rk3Ref} data-x="1" data-y="0.55" data-d="1.8">
            <div className="bob">
              <img className="artifact-sprite" src="[ASSET_4_ARTIFACT_SPRITES_PNG]" alt="Inventory Stack Cube" />
            </div>
          </div>

          {/* Layer L1: Hero HUD & Captions */}
          <div className="layer" id="layer-l1" ref={layerL1Ref}>
            <div className="hud" id="hud" ref={hudRef}>
              <div className="crosshair"></div>
              <div className="hud-frame"></div>
              <div className="chip">Voice Ledger</div>
              <pre>
LANG EN · PCM · YOR · IGB
SYNC REAL-TIME INVENTORY
MODE OFFLINE-READY
              </pre>
            </div>

            <div className="hero-caption" id="caption" ref={captionRef}>
              Voice-first inventory &amp; bookkeeping.<br />
              Record sales, restocks, and credit<br />
              in seconds — no typing required.
            </div>

            <div className="scroll-hint" id="hint" ref={hintRef}>
              <div className="hint-circle">
                <span className="hint-chevron"></span>
              </div>
              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>

          {/* Layer L2: Vision */}
          <div className="layer" id="layer-l2" ref={layerL2Ref}>
            <div className="vision-block" id="vision" ref={visionBlockRef}>
              <div className="chip">Our vision</div>
              <h2 id="vision-h2" ref={visionWordContainerRef}></h2>
              <p className="vision-p" id="vision-p" ref={visionPRef}>
                Built for busy traders and retail stores,<br />
                turning spoken transactions into live profit insights.
              </p>
            </div>
          </div>

          {/* Layer L3: Accounting & Hotspots */}
          <div className="layer" id="layer-l3" ref={layerL3Ref}>
            <div className="acct-wrap" id="acct-wrap" ref={acctWrapRef}>
              <p className="acct" id="acct-p" ref={acctPRef}></p>
            </div>

            <div className="hotspot hs-1" id="hs-0">
              <div className="hotspot-inner">
                <div className="hotspot-dot">
                  <span className="hotspot-plus"></span>
                </div>
                <div className="hotspot-label-pill">
                  <span>Voice capture</span>
                  <em>&lt; 2.5 sec parse</em>
                </div>
              </div>
            </div>

            <div className="hotspot hs-2" id="hs-1">
              <div className="hotspot-inner">
                <div className="hotspot-dot">
                  <span className="hotspot-plus"></span>
                </div>
                <div className="hotspot-label-pill">
                  <span>Stock alerts</span>
                  <em>Auto low-stock</em>
                </div>
              </div>
            </div>

            <div className="hotspot hs-3" id="hs-2">
              <div className="hotspot-inner">
                <div className="hotspot-dot">
                  <span className="hotspot-plus"></span>
                </div>
                <div className="hotspot-label-pill">
                  <span>Debtor ledger</span>
                  <em>1-tap WhatsApp</em>
                </div>
              </div>
            </div>

            <div className="hotspot hs-4" id="hs-3">
              <div className="hotspot-inner">
                <div className="hotspot-dot">
                  <span className="hotspot-plus"></span>
                </div>
                <div className="hotspot-label-pill">
                  <span>Daily margin</span>
                  <em>+28.4% net</em>
                </div>
              </div>
            </div>
          </div>

          {/* Layer L4: Station (Merchant Telemetry) */}
          <div className="layer" id="layer-l4" ref={layerL4Ref}>
            <div className="cred-wrap" id="cred-wrap" ref={credWrapRef}>
              <div className="cred-badge">✕ Shop branch #01</div>
              <h2 className="cred">Real-time stock clarity and credit-ready records</h2>
            </div>

            <div className="telemetry-card" id="telemetry-card" ref={telemetryCardRef}>
              <h4>Weekly net cashflow<br />&amp; stock value</h4>
              <div className="telemetry-note">Main Store · 42 SKUs tracked</div>
              <div className="telemetry-metric">
                <span className="telemetry-num" id="telemetry-num" ref={telemetryNumRef}>0</span>
                <span className="telemetry-unit">K NGN</span>
              </div>
              <div className="telemetry-tag">+19.2% profit</div>

              <svg className="telemetry-sparkline" viewBox="0 0 220 70">
                <polyline id="sparkline-poly" ref={sparklinePolyRef} points="0,60 30,55 60,57 90,44 120,46 150,30 180,24 214,10" />
                <circle cx="90" cy="44" r="2.4" fill="#ffffff" />
                <circle cx="150" cy="30" r="2.4" fill="#ffffff" />
                <circle cx="214" cy="10" r="3.4" fill="#22e584" />
              </svg>

              <div className="telemetry-footer">MON · WED · FRI · SUN</div>
            </div>

            <div className="feats" id="feats" ref={featsRef}>
              <div className="feat-row" data-idx="0">
                <span className="feat-idx">01</span>
                <span className="feat-label">Multilingual voice entry</span>
                <span className="feat-arrow">→</span>
              </div>
              <div className="feat-row" data-idx="1">
                <span className="feat-idx">02</span>
                <span className="feat-label">Live stock &amp; expiry alerts</span>
                <span className="feat-arrow">→</span>
              </div>
              <div className="feat-row" data-idx="2">
                <span className="feat-idx">03</span>
                <span className="feat-label">Customer credit &amp; debtor tracking</span>
                <span className="feat-arrow">→</span>
              </div>
              <div className="feat-row" data-idx="3">
                <span className="feat-idx">04</span>
                <span className="feat-label">Instant profit &amp; loss reports</span>
                <span className="feat-arrow">→</span>
              </div>
              <div className="feat-row" data-idx="4">
                <span className="feat-idx">05</span>
                <span className="feat-label">Bank-ready credit scoring</span>
                <span className="feat-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="prog">
            <div className="prog-bar" id="prog-bar" ref={progBarRef}></div>
          </div>
        </div>
      </main>

      {/* Solutions Section (#sol) */}
      <section id="sol" ref={solRef}>
        <div className="sol-head">
          <div className="sol-head-left">
            <div className="chip">Merchant tools</div>
            <h2>Built for fast-moving shops, markets, and growing brands</h2>
          </div>
          <p className="sol-head-p">
            Speak a sale while attending to customers, automatically deduct stock counts, and send polite payment reminders — all from one simple dashboard.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="sol-grid">
          <div
            className="sol-card"
            id="sol-card-1"
            onClick={() => onNavigate ? onNavigate('listeng') : window.location.assign('/record')}
          >
            <div
              className="sol-card-bg"
              id="sol-card-1-bg"
              ref={solCard1BgRef}
              style={{ backgroundPosition: '22% 70%', backgroundSize: '260%' }}
            ></div>
            <div className="sol-card-overlay"></div>
            <div className="sol-card-top">
              <span className="sol-card-label">[Voice bookkeeping]</span>
              <div className="sol-card-arrow-circle">→</div>
            </div>
            <div className="sol-card-bottom">
              <h3>Speak sales &amp; expenses<br />in seconds</h3>
              <p className="sol-card-desc">
                Say 'Sold 2 bags of garri for 15,000 Naira' and Stockpile logs the revenue, updates stock, and calculates net profit.
              </p>
            </div>
          </div>

          <div
            className="sol-card"
            id="sol-card-2"
            onClick={() => onNavigate ? onNavigate('credit') : window.location.assign('/credit')}
          >
            <div
              className="sol-card-bg"
              id="sol-card-2-bg"
              ref={solCard2BgRef}
              style={{ backgroundPosition: '50% 50%', backgroundSize: '190%' }}
            ></div>
            <div className="sol-card-overlay"></div>
            <div className="sol-card-top">
              <span className="sol-card-label">[Debtor &amp; credit tracker]</span>
              <div className="sol-card-arrow-circle">→</div>
            </div>
            <div className="sol-card-bottom">
              <h3>Recover unpaid customer<br />credit faster</h3>
              <p className="sol-card-desc">
                Track every 'buy now, pay later' balance by customer name and send automated WhatsApp &amp; SMS payment nudges.
              </p>
            </div>
          </div>

          <div
            className="sol-card"
            id="sol-card-3"
            onClick={() => onNavigate ? onNavigate('storeProfile') : window.location.assign('/store-profile')}
          >
            <div
              className="sol-card-bg"
              id="sol-card-3-bg"
              ref={solCard3BgRef}
              style={{ backgroundPosition: '62% 30%', backgroundSize: '230%' }}
            ></div>
            <div className="sol-card-overlay"></div>
            <div className="sol-card-top">
              <span className="sol-card-label">[Smart inventory]</span>
              <div className="sol-card-arrow-circle">→</div>
            </div>
            <div className="sol-card-bottom">
              <h3>Real-time stockpile<br />&amp; low-stock alerts</h3>
              <p className="sol-card-desc">
                Know exact unit counts across shelves and warehouses before you run out of your fastest-selling items.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Count-up Stats */}
        <div className="sol-stats" id="sol-stats">
          <div className="stat-cell">
            <div className="stat-num-row">
              <span className="stat-num" data-target="3" data-decimals="0">0</span>
            </div>
            <div className="stat-label">Sec Voice Entry</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num-row">
              <span className="stat-num" data-target="98.6" data-decimals="1">0.0</span>
              <span>%</span>
            </div>
            <div className="stat-label">% Transcription Accuracy</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num-row">
              <span className="stat-num" data-target="42" data-decimals="0">0</span>
              <span>%</span>
            </div>
            <div className="stat-label">% Faster Debt Recovery</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num-row">
              <span className="stat-num" data-target="24" data-decimals="0">0</span>
              <span>/7</span>
            </div>
            <div className="stat-label">Offline Sync</div>
          </div>
        </div>
      </section>
    </div>
  );
}
