






  function toggleMobileNav() {
    var btn  = document.getElementById('gs-hamburger');
    var menu = document.getElementById('gs-mobile-menu');
    if (!btn || !menu) return;
    var isOpen = btn.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
  }
  function closeMobileNav() {
    var btn  = document.getElementById('gs-hamburger');
    var menu = document.getElementById('gs-mobile-menu');
    if (!btn || !menu) return;
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
  // Close menu on outside click
  document.addEventListener('click', function(e) {
    var nav = document.querySelector('nav');
    if (nav && !nav.contains(e.target)) closeMobileNav();
  });

(function () {
  // --- Scalev data (defensive) ---
  var scalevData = (window.Scalev && window.Scalev.data && window.Scalev.data.get)
    ? window.Scalev.data.get()
    : { page: {}, store: null };

  // --- Jadwal pelaksanaan (edit tanggal di sini saja, semua bagian lain menyesuaikan otomatis) ---
  var SCHEDULE = [
    { month: 'Jul',  monthFull: 'Juli',      year: 2026, start: 13, end: 15 },
    { month: 'Agt',  monthFull: 'Agustus',   year: 2026, start: 3,  end: 6  },
    { month: 'Sept', monthFull: 'September', year: 2026, start: 1,  end: 3  },
    { month: 'Okt',  monthFull: 'Oktober',   year: 2026, start: 5,  end: 7  },
    { month: 'Nov',  monthFull: 'November',  year: 2026, start: 2,  end: 4  },
    { month: 'Des',  monthFull: 'Desember',  year: 2026, start: 1,  end: 3  },
    { month: 'Jan',  monthFull: 'Januari',   year: 2027, start: 6,  end: 8  },
    { month: 'Feb',  monthFull: 'Februari',  year: 2027, start: 1,  end: 3  },
    { month: 'Mar',  monthFull: 'Maret',     year: 2027, start: 1,  end: 3  },
    { month: 'Apr',  monthFull: 'April',     year: 2027, start: 5,  end: 7  },
    { month: 'Mei',  monthFull: 'Mei',       year: 2027, start: 3,  end: 5  },
    { month: 'Jun',  monthFull: 'Juni',      year: 2027, start: 2,  end: 4  },
    { month: 'Jul',  monthFull: 'Juli',      year: 2027, start: 5,  end: 7  }
  ];
  var MONTH_NUM = { Jan:0, Feb:1, Mar:2, Apr:3, Mei:4, Jun:5, Jul:6, Agt:7, Sept:8, Okt:9, Nov:10, Des:11 };
  SCHEDULE.forEach(function(b){
    b.startDate = new Date(b.year, MONTH_NUM[b.month], b.start, 8, 0, 0);
    b.endDate   = new Date(b.year, MONTH_NUM[b.month], b.end, 23, 59, 59);
    b.label     = b.start + '–' + b.end + ' ' + b.monthFull + ' ' + b.year;
  });
  var now = new Date();
  var today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Batch dianggap "terdekat" hanya sebelum hari-H (day 1) tiba; begitu tanggal
  // mulai pelatihan sudah berjalan/lewat, otomatis pindah ke batch berikutnya.
  var nearestBatch = SCHEDULE.find(function(b){
    var startDay = new Date(b.year, MONTH_NUM[b.month], b.start);
    return startDay > today0;
  }) || SCHEDULE[SCHEDULE.length - 1];

  // --- WhatsApp links ---
  var num = '6287759151278';
  function wa(text) {
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text);
  }
  var WA = {
    nav:   wa('Halo Wahana Totalita, saya tertarik dengan Sertifikasi BNSP PPPA/POPAL (' + nearestBatch.label + '). Mohon info pendaftaran dan subsidi. [Gads]'),
    hero:  wa('Halo Wahana Totalita, saya ingin konsultasi dan mendaftar Sertifikasi BNSP PPPA/POPAL (' + nearestBatch.label + '). Mohon info paket dan subsidi. [Gads]'),
    pppa:  wa('Halo Wahana Totalita, saya ingin mendaftar pelatihan & sertifikasi PPPA (estimasi Rp 7.750.000). Mohon info paket dan penawaran resmi.[Gads]'),
    popal: wa('Halo Wahana Totalita, saya ingin mendaftar pelatihan & sertifikasi POPAL (estimasi Rp 6.750.000). Mohon info paket dan penawaran resmi.[Gads]'),
    final: wa('Halo Wahana Totalita, saya siap mengamankan kuota subsidi untuk kelas PPPA/POPAL.[Gads]')
  };

  // --- Update tanggal dinamis di hero, final CTA & box harga ---
  setEl('hero-jadwal-date', nearestBatch.label);
  setEl('final-jadwal-date', nearestBatch.label);
  setEl('harga-pppa-date', nearestBatch.label);
  setEl('harga-popal-date', nearestBatch.label);

  // --- Chip jadwal mendatang (batch terdekat s.d. batch terakhir) di box harga; bisa dipilih ---
  (function renderHargaChips(){
    var upcoming = SCHEDULE.slice(SCHEDULE.indexOf(nearestBatch));
    function chipsHtml(skema) {
      return upcoming.map(function(b, i){
        return '<button type="button" class="bt-opt" data-skema="' + skema + '" data-batch="' + b.label + '" aria-pressed="' + (i === 0) + '">'
          + b.month + ' ' + b.start + '-' + b.end + (b.year !== upcoming[0].year ? ' ' + b.year : '') + '</button>';
      }).join('');
    }
    var pppaChips = document.getElementById('harga-pppa-chips');
    if (pppaChips) pppaChips.innerHTML = chipsHtml('PPPA');
    var popalChips = document.getElementById('harga-popal-chips');
    if (popalChips) popalChips.innerHTML = chipsHtml('POPAL');
  })();

  function setLinks() {
    document.querySelectorAll('.wa-nav').forEach(function(el){ el.href = WA.nav; });
    document.querySelectorAll('.wa-hero').forEach(function(el){ el.href = WA.hero; });
    document.querySelectorAll('.wa-final').forEach(function(el){ el.href = WA.final; });
  }
  setLinks();

  // --- Pilihan potongan grup: pilihan ikut terisi di pesan WhatsApp ---
  var groupChoice = { PPPA: '', POPAL: '' };
  var batchChoice = { PPPA: nearestBatch.label, POPAL: nearestBatch.label };
  function skemaMsg(skema) {
    var msg = 'Halo Wahana Totalita, saya ingin mendaftar pelatihan & sertifikasi ' + skema + ' batch ' + batchChoice[skema] + '.';
    if (groupChoice[skema]) msg += ' Saya mendaftar secara grup (' + groupChoice[skema] + ') dan ingin menanyakan harga khusus grup.';
    return msg + ' Mohon info paket dan subsidi.[Gads]';
  }
  function updateSkemaLinks() {
    document.querySelectorAll('.wa-pppa').forEach(function(el){ el.href = wa(skemaMsg('PPPA')); });
    document.querySelectorAll('.wa-popal').forEach(function(el){ el.href = wa(skemaMsg('POPAL')); });
  }
  document.querySelectorAll('.grp-box').forEach(function(box) {
    var skema = box.getAttribute('data-skema');
    box.querySelectorAll('.grp-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var already = btn.getAttribute('aria-pressed') === 'true';
        box.querySelectorAll('.grp-opt').forEach(function(b) { b.setAttribute('aria-pressed', 'false'); });
        groupChoice[skema] = already ? '' : btn.getAttribute('data-grp');
        if (!already) btn.setAttribute('aria-pressed', 'true');
        updateSkemaLinks();
      });
    });
  });
  document.querySelectorAll('.bt-opt').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var skema = btn.getAttribute('data-skema');
      document.querySelectorAll('.bt-opt[data-skema="' + skema + '"]').forEach(function(b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      batchChoice[skema] = btn.getAttribute('data-batch');
      updateSkemaLinks();
    });
  });
  updateSkemaLinks();

  // Analytics on CTA click
  function track(label) {
    if (window.Scalev && window.Scalev.analytics && window.Scalev.analytics.track) {
      window.Scalev.analytics.track('facebook', { event: 'Lead', content_name: label });
      window.Scalev.analytics.track('tiktok',   { event: 'SubmitForm', content_name: label });
    }
  }
  document.querySelectorAll('[class*="wa-"]').forEach(function(el){
    el.addEventListener('click', function(){ track(el.className); });
  });

  // --- Countdown bar utama ---
  var now = Date.now();
  var target = (nearestBatch && nearestBatch.startDate && nearestBatch.startDate.getTime() > now)
    ? nearestBatch.startDate.getTime()
    : now + (3 * 24 * 3600 * 1000) + (14 * 3600 * 1000);

  function pad(n){ return String(n).padStart(2,'0'); }
  function setEl(id, val){ var el = document.getElementById(id); if (el) el.textContent = val; }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff / 86400000); diff -= d * 86400000;
    var h = Math.floor(diff / 3600000);  diff -= h * 3600000;
    var m = Math.floor(diff / 60000);    diff -= m * 60000;
    var s = Math.floor(diff / 1000);
    setEl('cd-d', pad(d)); setEl('cd-h', pad(h)); setEl('cd-m', pad(m)); setEl('cd-s', pad(s));
    setEl('cd3-d', pad(d)); setEl('cd3-h', pad(h)); setEl('cd3-m', pad(m)); setEl('cd3-s', pad(s));
    setEl('cd2-d', pad(d)); setEl('cd2-h', pad(h)); setEl('cd2-m', pad(m)); setEl('cd2-s', pad(s));
  }
  tick();
  setInterval(tick, 1000);

  // --- Facilities table ---

  var checkSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22AD5C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var dashEl   = '<span style="display:inline-block;width:14px;height:2px;border-radius:2px;background:#D1D5DB"></span>';
  var facData = [
    ['Sertifikat profesi BNSP (jika kompeten)', 1, 1],
    ['Sertifikat pelatihan', 1, 1],
    ['Surat keterangan lulus', 1, 1],
    ['E-materi', 1, 1],
    ['Akses video & e-module selamanya', 1, 1],
    ['Update materi & regulasi', 1, 1],
    ['Rekaman pelatihan', 1, 1],
    ['Lunch & coffee break', 1, 0],
    ['Exclusive merch', 1, 0],   
  ];
  var tbody = document.getElementById('facilities-tbody');
  if (tbody) {
    tbody.innerHTML = facData.map(function(r){
      return '<tr class="gs-row" style="border-top:1px solid var(--border-2);transition:background .15s ease">'
        + '<td style="padding:14px 24px;font-size:14px;color:var(--fg-2)">' + r[0] + '</td>'
        + '<td style="text-align:center;padding:14px 12px">' + (r[1] ? checkSvg : dashEl) + '</td>'
        + '<td style="text-align:center;padding:14px 12px">' + (r[2] ? checkSvg : dashEl) + '</td>'
        + '</tr>';
    }).join('');
  }

  // --- Units tab ---
  var pppaUnits = [
    { no:1,  code:'E.370000.001.01', name:'Mengidentifikasi sumber pencemaran air limbah' },
    { no:2,  code:'E.370000.002.01', name:'Menentukan karakteristik sumber pencemaran air limbah' },
    { no:3,  code:'E.370000.003.01', name:'Menilai tingkat pencemaran air limbah' },
    { no:4,  code:'E.370000.006.01', name:'Menentukan peralatan instalasi pengolahan air limbah (IPAL)' },
    { no:5,  code:'E.370000.007.01', name:'Mengoperasikan instalasi pengolahan air limbah' },
    { no:6,  code:'E.370000.008.01', name:'Melaksanakan daur ulang olahan air limbah' },
    { no:7,  code:'E.370000.010.01', name:'Menyusun rencana pemantauan kualitas air limbah' },
    { no:8,  code:'E.370000.011.01', name:'Melaksanakan pemantauan kualitas air limbah' },
    { no:9,  code:'E.370000.012.01', name:'Mengidentifikasi bahaya dalam pengolahan air limbah' },
    { no:10, code:'E.370000.013.01', name:'Melakukan tindakan keselamatan dan kesehatan kerja (K3) terhadap bahaya dalam pengolahan air limbah' }
  ];
  var popalUnits = [
    { no:1, code:'E.370000.007.01', name:'Mengoperasikan instalasi pengolahan air limbah (IPAL)' },
    { no:2, code:'E.370000.003.01', name:'Menilai tingkat pencemaran air limbah' },
    { no:3, code:'E.370000.009.01', name:'Melakukan perawatan instalasi pengolahan air limbah (IPAL)' },
    { no:4, code:'E.370000.012.01', name:'Mengidentifikasi bahaya dalam pengolahan air limbah' },
    { no:5, code:'E.370000.013.01', name:'Melakukan tindakan keselamatan dan kesehatan kerja (K3) terhadap bahaya dalam pengolahan air limbah' }
  ];
  var currentTab = 'pppa';

  function renderUnits(tab) {
    var units = tab === 'pppa' ? pppaUnits : popalUnits;
    var tb = document.getElementById('units-tbody');
    if (!tb) return;
    tb.innerHTML = units.map(function(u){
      return '<tr class="gs-row" style="border-top:1px solid var(--border-2);transition:background .15s ease">'
        + '<td class="units-col-no" style="text-align:center;padding:13px 16px;font-size:14px;font-weight:600;color:var(--fg-4)">' + u.no + '</td>'
        + '<td class="units-col-kode" style="padding:13px 16px;font-family:var(--font-mono);font-size:13px;color:var(--gs-cyan-dark);white-space:nowrap">' + u.code + '</td>'
        + '<td style="padding:13px 16px;font-size:14px;color:var(--fg-2);line-height:1.5">'
          + u.name
          + '<span class="units-kode-mobile" style="display:none;margin-top:4px;font-family:var(--font-mono);font-size:11px;color:var(--gs-cyan-dark)">' + u.code + '</span>'
        + '</td>'
        + '</tr>';
    }).join('');
  }

  window.setTab = function(tab) {
    currentTab = tab;
    renderUnits(tab);
    var btnPPPA  = document.getElementById('tab-pppa');
    var btnPOPAL = document.getElementById('tab-popal');
    if (btnPPPA && btnPOPAL) {
      btnPPPA.style.background  = tab === 'pppa'  ? '#fff' : 'transparent';
      btnPPPA.style.color       = tab === 'pppa'  ? 'var(--gs-cyan)' : 'var(--fg-3)';
      btnPOPAL.style.background = tab === 'popal' ? '#fff' : 'transparent';
      btnPOPAL.style.color      = tab === 'popal' ? 'var(--gs-cyan)' : 'var(--fg-3)';
    }
  };
  renderUnits('pppa');

  // --- FAQ accordion ---
  var faqData = [
    { q: 'Apakah sertifikatnya berlaku nasional?',      a: 'Ya. Sertifikat kompetensi diterbitkan oleh BNSP (Badan Nasional Sertifikasi Profesi) dan berlaku secara nasional di seluruh Indonesia.' },
    { q: 'Apa perbedaan PPPA dan POPAL?',               a: 'PPPA berfokus pada pengendalian dan pemantauan pencemaran air (10 unit kompetensi), sedangkan POPAL berfokus pada operasional pengolahan air limbah/IPAL (5 unit kompetensi).' },
    { q: 'Apa bedanya kelas Offline, Online, dan LMS?', a: 'Offline adalah pelatihan tatap muka dengan fasilitas lengkap. Online dilaksanakan live via Zoom. LMS adalah belajar mandiri dengan akses materi fleksibel — saat ini tersedia untuk skema POPAL.' },
    { q: 'Apa syarat untuk mengikuti uji kompetensi?',  a: 'Peserta diharapkan memiliki latar belakang atau pengalaman operasional di bidang pengolahan air limbah. Detail persyaratan administratif akan dikirimkan tim kami setelah pendaftaran.' },
    { q: 'Bagaimana skema subsidi diberikan?',          a: 'Subsidi memotong biaya hingga Rp1.000.000 dari harga normal dan berlaku selama kuota per kelas masih tersedia. Semakin cepat mendaftar, semakin besar peluang mendapatkannya.' },
    { q: 'Apakah ada jaminan kelulusan?',               a: 'Tidak ada jaminan otomatis. Sertifikat BNSP diterbitkan apabila peserta dinyatakan kompeten oleh asesor. Kami membekali Anda dengan materi lengkap dan pendampingan untuk memaksimalkan peluang.' },
    { q: 'Kapan dan di mana pelaksanaannya?',           a: 'Batch terdekat pada ' + nearestBatch.label + '. Kelas berjalan tiap bulan hingga ' + SCHEDULE[SCHEDULE.length - 1].monthFull + ' ' + SCHEDULE[SCHEDULE.length - 1].year + ' — lihat jadwal lengkap di bagian "Harga & paket". Kelas Offline, kelas Online via Zoom.' },
    { q: 'Bagaimana cara mendaftar?',                   a: 'Klik tombol WhatsApp di halaman ini. Tim kami akan memandu Anda memilih skema dan format, lalu membantu proses pendaftaran serta pembayaran hingga selesai.' }
  ];
  var openFaq = 0;

  function renderFaq() {
    var list = document.getElementById('faq-list');
    if (!list) return;
    list.innerHTML = faqData.map(function(f, i){
      var isOpen = i === openFaq;
      return '<div class="reveal" style="background:#fff;border:1px solid var(--stroke);border-radius:14px;overflow:hidden">'
        + '<button onclick="toggleFaq(' + i + ')" style="width:100%;border:none;background:none;cursor:pointer;font-family:inherit;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px">'
        + '<span style="font-size:16px;font-weight:600;color:var(--dark)">' + f.q + '</span>'
        + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;transition:transform .28s;transform:rotate(' + (isOpen ? '180deg' : '0deg') + ')"><path d="m6 9 6 6 6-6"/></svg>'
        + '</button>'
        + (isOpen ? '<div style="padding:0 24px 22px;font-size:15px;line-height:1.65;color:var(--fg-3)">' + f.a + '</div>' : '')
        + '</div>';
    }).join('');
    // re-observe new elements
    if (io) {
      list.querySelectorAll('.reveal:not(.is-in)').forEach(function(n){ io.observe(n); });
    }
  }

  window.toggleFaq = function(i) {
    openFaq = openFaq === i ? -1 : i;
    renderFaq();
  };
  renderFaq();

  // --- Hero slideshow ---
  (function () {
    var slides = document.querySelectorAll('.hs-slide');
    var dotsEl = document.getElementById('hs-dots');
    var total = slides.length;
    var idx = 0;

    if (dotsEl) {
      for (var i = 0; i < total; i++) {
        var d = document.createElement('button');
        d.setAttribute('aria-label', 'Foto ' + (i + 1));
        d.style.cssText = 'width:6px;height:6px;border-radius:50%;border:none;padding:0;cursor:pointer;transition:all .25s;background:' + (i === 0 ? '#fff' : 'rgba(255,255,255,.45)');
        (function(n){ d.addEventListener('click', function(){ goTo(n); }); })(i);
        dotsEl.appendChild(d);
      }
    }

    function goTo(n) {
      idx = (n + total) % total;
      slides.forEach(function(s, j) { s.style.opacity = j === idx ? '1' : '0'; });
      var dots = dotsEl ? dotsEl.querySelectorAll('button') : [];
      for (var j = 0; j < dots.length; j++) {
        dots[j].style.background = j === idx ? '#fff' : 'rgba(255,255,255,.45)';
        dots[j].style.width      = j === idx ? '18px' : '6px';
        dots[j].style.borderRadius = j === idx ? '3px' : '50%';
      }
    }

    goTo(0);
    setInterval(function () { goTo(idx + 1); }, 2200);
  })();

  // --- Gallery ---
  (function() {
    var strip = document.getElementById('gs-strip');
    var dotsEl = document.getElementById('gs-dots');
    if (!strip || !dotsEl) return;

    var slides = strip.querySelectorAll('.gs-slide');
    var total = slides.length;
    var AUTO_MS = 3500;
    var timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function step() {
      return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : strip.clientWidth;
    }
    function maxScroll() { return strip.scrollWidth - strip.clientWidth; }
    function currentIdx() {
      if (strip.scrollLeft >= maxScroll() - 2) return total - 1;
      return Math.round(strip.scrollLeft / step());
    }
    function goTo(i) {
      strip.scrollTo({ left: Math.min(i * step(), maxScroll()), behavior: 'smooth' });
    }
    function next(dir) {
      var atEnd = strip.scrollLeft >= maxScroll() - 2;
      var atStart = strip.scrollLeft <= 2;
      if (dir > 0 && atEnd) return goTo(0);
      if (dir < 0 && atStart) return strip.scrollTo({ left: maxScroll(), behavior: 'smooth' });
      var base = Math.round(strip.scrollLeft / step());
      goTo(Math.max(0, base + dir));
    }

    // Dots
    for (var i = 0; i < total; i++) {
      var s = document.createElement('span');
      s.style.width = '8px';
      (function(idx) { s.onclick = function() { goTo(idx); restart(); }; })(i);
      dotsEl.appendChild(s);
    }
    function updateDots() {
      var idx = currentIdx();
      dotsEl.querySelectorAll('span').forEach(function(d, n) { d.classList.toggle('active', n === idx); });
    }
    updateDots();
    strip.addEventListener('scroll', function() {
      clearTimeout(strip._dt);
      strip._dt = setTimeout(updateDots, 60);
    }, { passive: true });

    // Manual: arrow buttons (desktop) + native swipe (mobile)
    window.gsScroll = function(dir) { next(dir); restart(); };

    // Auto-slide (pauses on hover / touch / hidden tab)
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      if (reduceMotion || timer) return;
      timer = setInterval(function() { next(1); }, AUTO_MS);
    }
    function restart() { stop(); start(); }
    var slider = document.getElementById('gs-slider') || strip;
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('touchstart', stop, { passive: true });
    slider.addEventListener('touchend', function() { setTimeout(restart, 4000); }, { passive: true });
    document.addEventListener('visibilitychange', function() { document.hidden ? stop() : start(); });
    window.addEventListener('resize', updateDots);
    start();
  })();

  // --- Testimonial slider ---
  window.tsScroll = function(dir) {
    var strip = document.getElementById('ts-strip');
    if (strip && window.innerWidth <= 639) {
      var slideW = strip.querySelector('.ts-slide');
      var w = slideW ? slideW.offsetWidth + 16 : strip.clientWidth;
      strip.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
  };

  (function() {
    var strip = document.getElementById('ts-strip');
    var dotsEl = document.getElementById('ts-dots');
    if (!strip || !dotsEl) return;

    var slides = document.querySelectorAll('.ts-slide');
    var total = slides.length;

    for (var i = 0; i < total; i++) {
      var s = document.createElement('span');
      (function(idx) {
        s.onclick = function() {
          var slideW = slides[idx] ? slides[idx].offsetWidth + 16 : strip.clientWidth;
          strip.scrollTo({ left: idx * slideW, behavior: 'smooth' });
        };
      })(i);
      dotsEl.appendChild(s);
    }

    function getIdx() {
      var slideW = slides[0] ? slides[0].offsetWidth + 16 : strip.clientWidth;
      return Math.round(strip.scrollLeft / slideW);
    }

    function updateDots() {
      var idx = getIdx();
      dotsEl.querySelectorAll('span').forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }

    updateDots();
    strip.addEventListener('scroll', function() {
      clearTimeout(strip._tdt);
      strip._tdt = setTimeout(updateDots, 80);
    });

    var tsTimer = null;
    function startTsAuto() {
      if (window.innerWidth > 639) return;
      tsTimer = setInterval(function() {
        var idx = getIdx();
        var next = (idx + 1) % total;
        var slideW = slides[0] ? slides[0].offsetWidth + 16 : strip.clientWidth;
        strip.scrollTo({ left: next * slideW, behavior: 'smooth' });
      }, 3500);
    }
    function stopTsAuto() { clearInterval(tsTimer); }
    startTsAuto();
    strip.addEventListener('touchstart', stopTsAuto, { passive: true });
    strip.addEventListener('touchend', function() { setTimeout(startTsAuto, 4000); }, { passive: true });
    window.addEventListener('resize', function() { stopTsAuto(); startTsAuto(); });
  })();

  // --- Reveal scroll animation ---
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(function(n){ io.observe(n); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(n){ n.classList.add('is-in'); });
  }
})();








// --- Form Penawaran Submission Handler ---
function handlePenawaranSubmit(e) {
  e.preventDefault();
  var nama = document.getElementById('form-nama').value.trim();
  var perusahaan = document.getElementById('form-perusahaan').value.trim();
  var waNum = document.getElementById('form-wa').value.trim();
  var email = document.getElementById('form-email').value.trim();
  var pelatihan = document.getElementById('form-pelatihan').value;
  var format = document.getElementById('form-format').value;
  var peserta = document.getElementById('form-peserta').value;
  var catatan = document.getElementById('form-catatan').value.trim();

  var text = 'Halo Wahana Totalita, saya ingin meminta Surat Penawaran & Proposal Pelatihan resmi:\n\n' +
    '👤 *Nama*: ' + nama + '\n' +
    '🏢 *Perusahaan*: ' + perusahaan + '\n' +
    '📱 *WhatsApp*: ' + waNum + '\n' +
    '✉️ *Email*: ' + email + '\n' +
    '📚 *Program*: ' + pelatihan + '\n' +
    '📍 *Format*: ' + format + '\n' +
    '👥 *Estimasi Peserta*: ' + peserta + '\n' +
    (catatan ? '📝 *Catatan Tambahan*: ' + catatan + '\n' : '') +
    '\nMohon info proposal silabus dan rincian penawaran biaya. [Gads-Penawaran]';

  var waLink = 'https://wa.me/6287759151278?text=' + encodeURIComponent(text);
  
  // Show success notification
  var successMsg = document.getElementById('penawaran-success-msg');
  if (successMsg) successMsg.style.display = 'block';

  // Open WhatsApp in new tab
  window.open(waLink, '_blank');
}
window.handlePenawaranSubmit = handlePenawaranSubmit;
