    document.addEventListener('DOMContentLoaded', () => {

      /* ============ LOADER ============ */
      const loaderBar = document.getElementById('loader-bar');
      gsap.to(loaderBar, { width: '100%', duration: 1.1, ease: 'power2.inOut' });
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.getElementById('loader').classList.add('hide');
          document.body.style.overflow = '';
        }, 500);
      });
      // fallback in case load event already fired
      setTimeout(() => document.getElementById('loader').classList.add('hide'), 2500);

      /* ============ LENIS SMOOTH SCROLL ============ */
      let lenis;
      try {
        lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch (e) { console.warn('Lenis unavailable', e); }

      gsap.registerPlugin(ScrollTrigger);

      /* ============ SCROLL PROGRESS BAR ============ */
      const progressBar = document.getElementById('scroll-progress');
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => { progressBar.style.width = (self.progress * 100) + '%'; }
      });

      /* ============ NAVBAR STATE ============ */
      const navbar = document.getElementById('navbar');
      ScrollTrigger.create({
        start: 80, end: 99999,
        onUpdate: (self) => {
          if (self.scroll() > 80) {
            navbar.classList.add('bg-navy/90', 'backdrop-blur-md', 'shadow-md', 'py-3');
            navbar.classList.remove('py-5');
          } else {
            navbar.classList.remove('bg-navy/90', 'backdrop-blur-md', 'shadow-md', 'py-3');
            navbar.classList.add('py-5');
          }
        }
      });

      /* ============ MOBILE MENU ============ */
      const mobileBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileClose = document.getElementById('mobile-menu-close');
      mobileBtn.addEventListener('click', () => mobileMenu.classList.remove('translate-x-full'));
      mobileClose.addEventListener('click', () => mobileMenu.classList.add('translate-x-full'));
      document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.add('translate-x-full')));

      /* ============ CURSOR GLOW ============ */
      const glow = document.getElementById('cursor-glow');
      window.addEventListener('mousemove', (e) => {
        gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power3.out' });
      });

      /* ============ HERO PARTICLES ============ */
      const canvas = document.getElementById('hero-canvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      function initParticles() {
        resizeCanvas();
        const count = window.innerWidth < 768 ? 40 : 90;
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          o: Math.random() * 0.5 + 0.1
        }));
      }
      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201,162,75,${p.o})`;
          ctx.fill();
        });
        requestAnimationFrame(animateParticles);
      }
      initParticles();
      animateParticles();
      window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

      /* ============ REVEAL ANIMATIONS ============ */
      const revealEls = gsap.utils.toArray('[data-reveal]');
      revealEls.forEach(el => {
        gsap.to(el, {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      /* ============ ANIMATED COUNTERS ============ */
      document.querySelectorAll('.counter').forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        ScrollTrigger.create({
          trigger: counter, start: 'top 90%', once: true,
          onEnter: () => {
            let obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 2, ease: 'power2.out',
              onUpdate: () => { counter.textContent = prefix + Math.floor(obj.val).toLocaleString('en-IN') + suffix; }
            });
          }
        });
      });

      /* ============ PROCESS LINE ============ */
      const processLine = document.getElementById('process-line');
      if (processLine) {
        gsap.to(processLine, {
          width: '100%', ease: 'none',
          scrollTrigger: { trigger: '#process', start: 'top 60%', end: 'bottom 70%', scrub: 1 }
        });
      }

      /* ============ JOURNEY LINE (COMPANY) ============ */
      const journeyLine = document.getElementById('journey-line');
      if (journeyLine) {
        gsap.to(journeyLine, {
          width: '100%', ease: 'none',
          scrollTrigger: { trigger: '#journey', start: 'top 60%', end: 'bottom 70%', scrub: 1 }
        });
      }

      /* ============ WEALTH JOURNEY: SEED TO TREE ============ */
      const stages = gsap.utils.toArray('.journey-stage');
      const treeTL = gsap.timeline({
        scrollTrigger: {
          trigger: '#wealth-journey', start: 'top top', end: '+=2500', scrub: 1, pin: false,
          onUpdate: (self) => {
            const idx = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
            stages.forEach((s, i) => {
              if (i === idx) { s.classList.remove('opacity-40'); s.classList.add('opacity-100', 'bg-white', 'shadow-soft'); }
              else { s.classList.add('opacity-40'); s.classList.remove('opacity-100', 'bg-white', 'shadow-soft'); }
            });
          }
        }
      });
      treeTL
        .to('#tree-trunk', { attr: { height: 60 }, y: -60, duration: 1 }, 0)
        .to('#tree-branch-1, #tree-branch-2', { opacity: 1, duration: 1 }, 0.6)
        .to('#tree-branch-3, #tree-branch-4', { opacity: 1, duration: 1 }, 1.2)
        .to('#tree-leaf-1, #tree-leaf-2, #tree-leaf-3', { attr: { r: 38 }, duration: 1.2 }, 1.6)
        .to('#tree-leaf-4, #tree-leaf-5, #tree-leaf-6', { attr: { r: 30 }, duration: 1.2 }, 2.2)
        .to('#tree-coin-1, #tree-coin-2, #tree-coin-3', { attr: { r: 7 }, duration: 1 }, 2.8)
        .to('#tree-seed', { opacity: 0, duration: 0.4 }, 0.3);

      /* ============ TILT CARDS ============ */
      document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left; const y = e.clientY - r.top;
          const rx = ((y / r.height) - 0.5) * -8;
          const ry = ((x / r.width) - 0.5) * 8;
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' }));
      });

      /* ============ BUTTON RIPPLE ============ */
      document.querySelectorAll('.btn-ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
          const r = document.createElement('span');
          r.className = 'ripple';
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          r.style.width = r.style.height = size + 'px';
          r.style.left = (e.clientX - rect.left - size / 2) + 'px';
          r.style.top = (e.clientY - rect.top - size / 2) + 'px';
          this.appendChild(r);
          setTimeout(() => r.remove(), 700);
        });
      });

      /* ============ SERVICE MODAL ============ */
      const modal = document.getElementById('service-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalDesc = document.getElementById('modal-desc');
      const modalPoints = document.getElementById('modal-points');
      const modalIcon = document.getElementById('modal-icon').querySelector('i');
      document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
          modalTitle.textContent = card.dataset.title;
          modalDesc.textContent = card.dataset.desc;
          modalIcon.className = 'fa-solid ' + card.dataset.icon + ' text-gold text-xl';
          modalPoints.innerHTML = '';
          card.dataset.points.split(',').forEach(pt => {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-3 text-sm text-navy/70';
            li.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i><span>' + pt + '</span>';
            modalPoints.appendChild(li);
          });
          modal.classList.remove('hidden');
          modal.classList.add('flex');
          document.body.style.overflow = 'hidden';
        });
      });
      function closeModal() {
        modal.classList.add('hidden'); modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
      document.getElementById('service-modal-close').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

      /* ============ TESTIMONIAL CAROUSEL ============ */
      const track = document.getElementById('testimonial-track');
      document.getElementById('testi-next').addEventListener('click', () => track.scrollBy({ left: 440, behavior: 'smooth' }));
      document.getElementById('testi-prev').addEventListener('click', () => track.scrollBy({ left: -440, behavior: 'smooth' }));

      /* ============ FINANCIAL HEALTH CHECK ============ */
      const hcIncome = document.getElementById('hc-income');
      const hcSavings = document.getElementById('hc-savings');
      const hcDebt = document.getElementById('hc-debt');
      const hcEmergency = document.getElementById('hc-emergency');
      const hcInsurance = document.getElementById('hc-insurance');
      const hcGoals = document.getElementById('hc-goals');
      const gaugeCircle = document.getElementById('gauge-circle');
      const gaugeScore = document.getElementById('gauge-score');
      const gaugeLabel = document.getElementById('gauge-label');
      const gaugeRecs = document.getElementById('gauge-recs');
      const CIRC = 2 * Math.PI * 85;

      function fmtINR(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

      function computeHealth() {
        const savings = parseFloat(hcSavings.value);
        const debt = parseFloat(hcDebt.value);
        const emergency = parseFloat(hcEmergency.value);
        const insurance = hcInsurance.checked;
        const goals = hcGoals.checked;

        let score = 0;
        score += Math.min(35, savings * 1.75);
        score += Math.max(0, 25 - debt * 0.6);
        score += Math.min(20, emergency * (20 / 6));
        score += insurance ? 12 : 0;
        score += goals ? 8 : 0;
        score = Math.max(0, Math.min(100, Math.round(score)));

        gaugeScore.textContent = score;
        const offset = CIRC - (CIRC * score / 100);
        gaugeCircle.style.strokeDashoffset = offset;
        gaugeCircle.style.stroke = score >= 70 ? '#12704F' : score >= 40 ? '#C9A24B' : '#B84C4C';

        let label = 'Needs Attention';
        if (score >= 80) label = 'Excellent';
        else if (score >= 60) label = 'Healthy';
        else if (score >= 40) label = 'Building Momentum';
        gaugeLabel.textContent = label;

        const recs = [];
        if (savings < 20) recs.push('Increase your monthly savings rate toward 20%+ of income.');
        if (debt > 35) recs.push('Prioritise reducing EMI obligations below 35% of income.');
        if (emergency < 6) recs.push('Build your emergency fund to at least 6 months of expenses.');
        if (!insurance) recs.push('Close protection gaps with adequate term &amp; health insurance.');
        if (!goals) recs.push('Define clear, time-bound financial goals with your advisor.');
        if (recs.length === 0) recs.push('You\'re on a strong path — let\'s optimise for tax efficiency next.');

        gaugeRecs.innerHTML = recs.map(r => `<div class="flex items-start gap-3 text-sm text-navy/65"><i class="fa-solid fa-arrow-right text-gold mt-1 text-xs"></i><span>${r}</span></div>`).join('');
      }

      hcIncome.addEventListener('input', () => { document.getElementById('hc-income-val').textContent = fmtINR(hcIncome.value); computeHealth(); });
      hcSavings.addEventListener('input', () => { document.getElementById('hc-savings-val').textContent = hcSavings.value; computeHealth(); });
      hcDebt.addEventListener('input', () => { document.getElementById('hc-debt-val').textContent = hcDebt.value; computeHealth(); });
      hcEmergency.addEventListener('input', () => { document.getElementById('hc-emergency-val').textContent = hcEmergency.value; computeHealth(); });
      hcInsurance.addEventListener('change', computeHealth);
      hcGoals.addEventListener('change', computeHealth);
      ScrollTrigger.create({ trigger: '#health-check', start: 'top 70%', once: true, onEnter: computeHealth });

      /* ============ SIP CALCULATOR ============ */
      const sipAmount = document.getElementById('sip-amount');
      const sipYears = document.getElementById('sip-years');
      const sipReturn = document.getElementById('sip-return');
      let sipChart;

      function computeSIP() {
        const P = parseFloat(sipAmount.value);
        const years = parseFloat(sipYears.value);
        const annualRate = parseFloat(sipReturn.value);
        const n = years * 12;
        const r = annualRate / 100 / 12;
        const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const invested = P * n;

        document.getElementById('sip-amt-val').textContent = fmtINR(P);
        document.getElementById('sip-years-val').textContent = years + ' yrs';
        document.getElementById('sip-return-val').textContent = annualRate + '%';
        document.getElementById('sip-invested').textContent = fmtINR(invested);
        document.getElementById('sip-total').textContent = fmtINR(futureValue);

        const labels = []; const investedData = []; const valueData = [];
        for (let y = 1; y <= years; y++) {
          const m = y * 12;
          const fv = P * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
          labels.push('Y' + y);
          investedData.push(Math.round(P * m));
          valueData.push(Math.round(fv));
        }

        if (!sipChart) {
          sipChart = new Chart(document.getElementById('sipChart'), {
            type: 'line',
            data: {
              labels, datasets: [
                { label: 'Invested', data: investedData, borderColor: '#8598BC', backgroundColor: 'rgba(133,152,188,0.08)', fill: true, tension: 0.35, pointRadius: 0 },
                { label: 'Value', data: valueData, borderColor: '#C9A24B', backgroundColor: 'rgba(201,162,75,0.15)', fill: true, tension: 0.35, pointRadius: 0 }
              ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { boxWidth: 10, font: { size: 10 } } } }, scales: { x: { display: false }, y: { display: false } } }
          });
        } else {
          sipChart.data.labels = labels;
          sipChart.data.datasets[0].data = investedData;
          sipChart.data.datasets[1].data = valueData;
          sipChart.update();
        }
      }
      [sipAmount, sipYears, sipReturn].forEach(el => el.addEventListener('input', computeSIP));

      /* ============ RETIREMENT CALCULATOR ============ */
      const retAge = document.getElementById('ret-age');
      const retRetage = document.getElementById('ret-retage');
      const retExp = document.getElementById('ret-exp');
      let retChart;

      function computeRetirement() {
        const age = parseFloat(retAge.value);
        const retireAge = Math.max(parseFloat(retRetage.value), age + 1);
        retRetage.value = retireAge;
        const expenses = parseFloat(retExp.value);
        const yearsToRetire = retireAge - age;
        const inflation = 0.06;
        const postRetireReturn = 0.07;
        const lifeExpectancyYears = 25;

        const futureMonthlyExpense = expenses * Math.pow(1 + inflation, yearsToRetire);
        const annualExpense = futureMonthlyExpense * 12;
        const realReturn = ((1 + postRetireReturn) / (1 + inflation)) - 1;
        const corpus = annualExpense * ((1 - Math.pow(1 + realReturn, -lifeExpectancyYears)) / realReturn);

        const preRetireReturn = 0.12;
        const rMonthly = preRetireReturn / 12;
        const nMonths = yearsToRetire * 12;
        const requiredSIP = corpus / (((Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly) * (1 + rMonthly));

        document.getElementById('ret-age-val').textContent = age;
        document.getElementById('ret-retage-val').textContent = retireAge;
        document.getElementById('ret-exp-val').textContent = fmtINR(expenses);
        document.getElementById('ret-corpus').textContent = fmtINR(corpus);
        document.getElementById('ret-sip').textContent = fmtINR(Math.max(0, requiredSIP));

        const labels = []; const corpusGrowth = [];
        for (let y = 0; y <= yearsToRetire; y += Math.max(1, Math.round(yearsToRetire / 10))) {
          labels.push('Age ' + (age + y));
          const m = y * 12;
          const fv = requiredSIP * ((Math.pow(1 + rMonthly, m) - 1) / rMonthly) * (1 + rMonthly);
          corpusGrowth.push(Math.round(fv));
        }

        if (!retChart) {
          retChart = new Chart(document.getElementById('retirementChart'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Projected Corpus', data: corpusGrowth, backgroundColor: '#0A1830', borderRadius: 6 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
          });
        } else {
          retChart.data.labels = labels;
          retChart.data.datasets[0].data = corpusGrowth;
          retChart.update();
        }
      }
      [retAge, retRetage, retExp].forEach(el => el.addEventListener('input', computeRetirement));

      ScrollTrigger.create({ trigger: '#calculators', start: 'top 70%', once: true, onEnter: () => { computeSIP(); computeRetirement(); } });

/* =========================================================
   APPOINTMENT CALENDAR + SLOT + FORM SUBMISSION
   ========================================================= */


/* =========================================================
   APPOINTMENT CALENDAR
   ========================================================= */

const calMonthEl = document.getElementById('cal-month');
const calGrid = document.getElementById('cal-grid');

let calDate = new Date(2026, 7, 1); // August 2026

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

let selectedDay = null;
let selectedSlot = null;


/* =========================================================
   HIDDEN FORM FIELDS
   ========================================================= */

const appointmentDateInput =
  document.getElementById('appointment-date');

const appointmentTimeInput =
  document.getElementById('appointment-time');


/* =========================================================
   RENDER CALENDAR
   ========================================================= */

function renderCalendar() {

  calGrid.innerHTML = '';

  const year = calDate.getFullYear();
  const month = calDate.getMonth();

  // Display month and year
  calMonthEl.textContent =
    monthNames[month] + ' ' + year;


  // First day of month
  const firstDay =
    new Date(year, month, 1).getDay();


  // Number of days in month
  const daysInMonth =
    new Date(year, month + 1, 0).getDate();


  // Today's date
  const today = new Date();

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );


  /* ---------------------------------------------------------
     EMPTY CELLS BEFORE FIRST DAY
     --------------------------------------------------------- */

  for (let i = 0; i < firstDay; i++) {

    const emptyCell =
      document.createElement('div');

    calGrid.appendChild(emptyCell);
  }


  /* ---------------------------------------------------------
     CREATE DAYS
     --------------------------------------------------------- */

  for (let d = 1; d <= daysInMonth; d++) {

    const btn =
      document.createElement('button');

    // IMPORTANT:
    // Prevent calendar buttons from submitting the form
    btn.type = 'button';

    btn.textContent = d;


    const thisDate =
      new Date(year, month, d);


    const isPast =
      thisDate < todayOnly;


    const isSunday =
      thisDate.getDay() === 0;


    /* -------------------------------------------------------
       BUTTON STYLING
       ------------------------------------------------------- */

    btn.className =
      'w-9 h-9 rounded-full text-sm flex items-center justify-center transition mx-auto ' +
      (
        isPast || isSunday
          ? 'text-navy/20 cursor-not-allowed'
          : 'hover:bg-navy hover:text-white cursor-pointer'
      );


    /* -------------------------------------------------------
       ENABLE VALID DATES
       ------------------------------------------------------- */

    if (!isPast && !isSunday) {

      btn.addEventListener('click', function () {


        /* ---------------------------------------------------
           REMOVE PREVIOUS DATE SELECTION
           --------------------------------------------------- */

        calGrid
          .querySelectorAll('button')
          .forEach(function (b) {

            b.classList.remove(
              'bg-gold',
              'text-navy',
              'font-semibold'
            );

          });


        /* ---------------------------------------------------
           HIGHLIGHT SELECTED DATE
           --------------------------------------------------- */

        btn.classList.add(
          'bg-gold',
          'text-navy',
          'font-semibold'
        );


        /* ---------------------------------------------------
           SAVE SELECTED DAY
           --------------------------------------------------- */

        selectedDay = d;


        /* ---------------------------------------------------
           CREATE FULL DATE
           Example:
           18 August 2026
           --------------------------------------------------- */

        const selectedDate =
          new Date(year, month, d);


        const formattedDate =
          selectedDate.toLocaleDateString(
            'en-IN',
            {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }
          );


        /* ---------------------------------------------------
           STORE DATE IN HIDDEN FORM FIELD
           --------------------------------------------------- */

        appointmentDateInput.value =
          formattedDate;


        console.log(
          'Selected appointment date:',
          formattedDate
        );

      });

    }


    /* -------------------------------------------------------
       ADD BUTTON TO GRID
       ------------------------------------------------------- */

    const cell =
      document.createElement('div');

    cell.appendChild(btn);

    calGrid.appendChild(cell);

  }

}


/* =========================================================
   PREVIOUS MONTH
   ========================================================= */

document
  .getElementById('cal-prev')
  .addEventListener('click', function () {

    calDate.setMonth(
      calDate.getMonth() - 1
    );


    // Clear selected date
    selectedDay = null;

    appointmentDateInput.value = '';


    renderCalendar();

  });


/* =========================================================
   NEXT MONTH
   ========================================================= */

document
  .getElementById('cal-next')
  .addEventListener('click', function () {

    calDate.setMonth(
      calDate.getMonth() + 1
    );


    // Clear selected date
    selectedDay = null;

    appointmentDateInput.value = '';


    renderCalendar();

  });


/* =========================================================
   INITIAL CALENDAR LOAD
   ========================================================= */

renderCalendar();



/* =========================================================
   AVAILABLE TIME SLOTS
   ========================================================= */

const slotButtons =
  document.querySelectorAll('.slot-btn');


slotButtons.forEach(function (btn) {

  btn.addEventListener('click', function () {


    /* -------------------------------------------------------
       REMOVE PREVIOUS SLOT SELECTION
       ------------------------------------------------------- */

    slotButtons.forEach(function (b) {

      b.classList.remove(
        'bg-navy',
        'text-white',
        'border-navy'
      );

    });


    /* -------------------------------------------------------
       HIGHLIGHT SELECTED SLOT
       ------------------------------------------------------- */

    btn.classList.add(
      'bg-navy',
      'text-white',
      'border-navy'
    );


    /* -------------------------------------------------------
       GET SELECTED TIME
       ------------------------------------------------------- */

    selectedSlot =
      btn.textContent.trim();


    /* -------------------------------------------------------
       STORE TIME IN HIDDEN FORM FIELD
       ------------------------------------------------------- */

    appointmentTimeInput.value =
      selectedSlot;


    console.log(
      'Selected appointment time:',
      selectedSlot
    );

  });

});



/* =========================================================
   APPOINTMENT FORM
   ========================================================= */

const appointmentForm =
  document.getElementById(
    'appointment-form'
  );


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

appointmentForm.addEventListener(
  'submit',
  async function (e) {

    // Prevent page navigation
    e.preventDefault();


    /* -------------------------------------------------------
       GET SUBMIT BUTTON
       ------------------------------------------------------- */

    const submitButton =
      appointmentForm.querySelector(
        'button[type="submit"]'
      );


    const originalButtonText =
      submitButton.innerHTML;


    /* =======================================================
       VALIDATE DATE
       ======================================================= */

    if (!appointmentDateInput.value) {

      alert(
        'Please select an appointment date.'
      );

      return;
    }


    /* =======================================================
       VALIDATE TIME SLOT
       ======================================================= */

    if (!appointmentTimeInput.value) {

      alert(
        'Please select an appointment time slot.'
      );

      return;
    }


    /* =======================================================
       DISABLE BUTTON
       ======================================================= */

    submitButton.disabled = true;

    submitButton.innerHTML =
      'Sending...';


    /* =======================================================
       CREATE FORM DATA
       ======================================================= */

    const formData =
      new FormData(appointmentForm);


    /* -------------------------------------------------------
       DEBUG
       -------------------------------------------------------

       You can open browser console with F12
       and check exactly what is being sent.
       ------------------------------------------------------- */

    console.log(
      'Appointment Date:',
      formData.get('appointment_date')
    );

    console.log(
      'Appointment Time:',
      formData.get('appointment_time')
    );

    console.log(
      'Name:',
      formData.get('name')
    );

    console.log(
      'Email:',
      formData.get('email')
    );

    console.log(
      'Phone:',
      formData.get('phone')
    );

    console.log(
      'Service:',
      formData.get('service')
    );


    /* =======================================================
       SEND TO WEB3FORMS
       ======================================================= */

    try {

      const response =
        await fetch(
          appointmentForm.action,
          {
            method: 'POST',
            body: formData
          }
        );


      const result =
        await response.json();


      console.log(
        'Web3Forms response:',
        result
      );


      /* =====================================================
         SUCCESS
         ===================================================== */

      if (result.success) {


        /* ---------------------------------------------------
           CLEAR FORM
           --------------------------------------------------- */

        appointmentForm.reset();


        /* ---------------------------------------------------
           CLEAR SELECTED DATE
           --------------------------------------------------- */

        selectedDay = null;

        appointmentDateInput.value = '';


        /* ---------------------------------------------------
           CLEAR SELECTED SLOT
           --------------------------------------------------- */

        selectedSlot = null;

        appointmentTimeInput.value = '';


        /* ---------------------------------------------------
           REMOVE CALENDAR SELECTION
           --------------------------------------------------- */

        calGrid
          .querySelectorAll('button')
          .forEach(function (btn) {

            btn.classList.remove(
              'bg-gold',
              'text-navy',
              'font-semibold'
            );

          });


        /* ---------------------------------------------------
           REMOVE SLOT SELECTION
           --------------------------------------------------- */

        slotButtons.forEach(function (btn) {

          btn.classList.remove(
            'bg-navy',
            'text-white',
            'border-navy'
          );

        });


        /* ---------------------------------------------------
           SUCCESS BUTTON
           --------------------------------------------------- */

        submitButton.innerHTML =
          '✓ Consultation Requested';


        submitButton.classList.remove(
          'bg-navy'
        );


        submitButton.classList.add(
          'bg-green-600'
        );


        /* ---------------------------------------------------
           RESET BUTTON AFTER 3 SECONDS
           --------------------------------------------------- */

        setTimeout(function () {

          submitButton.innerHTML =
            originalButtonText;


          submitButton.classList.remove(
            'bg-green-600'
          );


          submitButton.classList.add(
            'bg-navy'
          );


          submitButton.disabled = false;

        }, 3000);


      }


      /* =====================================================
         WEB3FORMS ERROR
         ===================================================== */

      else {

        throw new Error(
          result.message ||
          'Something went wrong.'
        );

      }


    }


    /* =======================================================
       NETWORK / JAVASCRIPT ERROR
       ======================================================= */

    catch (error) {

      console.error(
        'Form submission error:',
        error
      );


      /* ---------------------------------------------------
         ERROR BUTTON
         --------------------------------------------------- */

      submitButton.innerHTML =
        'Failed — Try Again';


      submitButton.classList.remove(
        'bg-navy'
      );


      submitButton.classList.add(
        'bg-red-600'
      );


      /* ---------------------------------------------------
         RESET ERROR BUTTON
         --------------------------------------------------- */

      setTimeout(function () {

        submitButton.innerHTML =
          originalButtonText;


        submitButton.classList.remove(
          'bg-red-600'
        );


        submitButton.classList.add(
          'bg-navy'
        );


        submitButton.disabled = false;

      }, 3000);

    }

  }
);
      /* ============ SMOOTH ANCHOR SCROLL ============ */
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId.length > 1) {
            const target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              if (lenis) lenis.scrollTo(target, { offset: -60 });
              else target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });

      ScrollTrigger.refresh();
    });
  