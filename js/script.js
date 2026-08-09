document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       LOADER
    ========================================================= */

    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');

    if (loaderBar) {
        gsap.to(loaderBar, {
            width: '100%',
            duration: 1.1,
            ease: 'power2.inOut'
        });
    }

    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.style.overflow = '';
            }, 500);
        });

        // Fallback
        setTimeout(() => {
            loader.classList.add('hide');
            document.body.style.overflow = '';
        }, 2500);
    }


    /* =========================================================
       LENIS SMOOTH SCROLL
    ========================================================= */

    let lenis = null;

    try {
        if (typeof Lenis !== 'undefined') {

            lenis = new Lenis({
                duration: 1.1,
                easing: (t) =>
                    Math.min(
                        1,
                        1.001 - Math.pow(2, -10 * t)
                    ),
                smoothWheel: true
            });

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        }

    } catch (error) {
        console.warn('Lenis unavailable:', error);
    }


    /* =========================================================
       GSAP PLUGIN
    ========================================================= */

    gsap.registerPlugin(ScrollTrigger);


    /* =========================================================
       SCROLL PROGRESS BAR
    ========================================================= */

    const progressBar =
        document.getElementById('scroll-progress');

    if (progressBar) {

        ScrollTrigger.create({
            start: 0,
            end: 'max',

            onUpdate: (self) => {
                progressBar.style.width =
                    (self.progress * 100) + '%';
            }
        });

    }


    /* =========================================================
       NAVBAR STATE
    ========================================================= */

    const navbar =
        document.getElementById('navbar');

    if (navbar) {

        ScrollTrigger.create({

            start: 80,
            end: 99999,

            onUpdate: (self) => {

                if (self.scroll() > 80) {

                    navbar.classList.add(
                        'bg-navy/90',
                        'backdrop-blur-md',
                        'shadow-md',
                        'py-3'
                    );

                    navbar.classList.remove('py-5');

                } else {

                    navbar.classList.remove(
                        'bg-navy/90',
                        'backdrop-blur-md',
                        'shadow-md',
                        'py-3'
                    );

                    navbar.classList.add('py-5');
                }
            }
        });

    }


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const mobileBtn =
        document.getElementById('mobile-menu-btn');

    const mobileMenu =
        document.getElementById('mobile-menu');

    const mobileClose =
        document.getElementById('mobile-menu-close');

    if (mobileBtn && mobileMenu) {

        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });

    }

    if (mobileClose && mobileMenu) {

        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });

    }

    document
        .querySelectorAll('.mobile-link')
        .forEach(link => {

            link.addEventListener('click', () => {

                if (mobileMenu) {
                    mobileMenu.classList.add(
                        'translate-x-full'
                    );
                }

            });

        });


    /* =========================================================
       CURSOR GLOW
    ========================================================= */

    const glow =
        document.getElementById('cursor-glow');

    if (glow) {

        window.addEventListener('mousemove', (e) => {

            gsap.to(glow, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: 'power3.out'
            });

        });

    }


    /* =========================================================
       HERO PARTICLES
    ========================================================= */

    const canvas =
        document.getElementById('hero-canvas');

    if (canvas) {

        const ctx = canvas.getContext('2d');

        let particles = [];

        function resizeCanvas() {

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

        }

        function initParticles() {

            resizeCanvas();

            const count =
                window.innerWidth < 768 ? 40 : 90;

            particles =
                Array.from(
                    { length: count },
                    () => ({

                        x: Math.random() * canvas.width,

                        y: Math.random() * canvas.height,

                        r: Math.random() * 1.6 + 0.4,

                        vx:
                            (Math.random() - 0.5) * 0.25,

                        vy:
                            (Math.random() - 0.5) * 0.25,

                        o:
                            Math.random() * 0.5 + 0.1
                    })
                );

        }

        function animateParticles() {

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            particles.forEach(p => {

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0)
                    p.x = canvas.width;

                if (p.x > canvas.width)
                    p.x = 0;

                if (p.y < 0)
                    p.y = canvas.height;

                if (p.y > canvas.height)
                    p.y = 0;

                ctx.beginPath();

                ctx.arc(
                    p.x,
                    p.y,
                    p.r,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(201,162,75,${p.o})`;

                ctx.fill();

            });

            requestAnimationFrame(
                animateParticles
            );

        }

        initParticles();
        animateParticles();

        window.addEventListener(
            'resize',
            initParticles
        );

    }


    /* =========================================================
       REVEAL ANIMATIONS
    ========================================================= */

    const revealEls =
        gsap.utils.toArray('[data-reveal]');

    revealEls.forEach(el => {

        gsap.to(el, {

            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,

            duration: 1,

            ease: 'power3.out',

            scrollTrigger: {

                trigger: el,

                start: 'top 88%',

                toggleActions:
                    'play none none none'
            }

        });

    });


    /* =========================================================
       ANIMATED COUNTERS
    ========================================================= */

    document
        .querySelectorAll('.counter')
        .forEach(counter => {

            const target =
                parseFloat(
                    counter.dataset.target || 0
                );

            const prefix =
                counter.dataset.prefix || '';

            const suffix =
                counter.dataset.suffix || '';

            ScrollTrigger.create({

                trigger: counter,

                start: 'top 90%',

                once: true,

                onEnter: () => {

                    const obj = {
                        val: 0
                    };

                    gsap.to(obj, {

                        val: target,

                        duration: 2,

                        ease: 'power2.out',

                        onUpdate: () => {

                            counter.textContent =
                                prefix +
                                Math.floor(obj.val)
                                    .toLocaleString('en-IN') +
                                suffix;

                        }

                    });

                }

            });

        });


    /* =========================================================
       PROCESS LINE
    ========================================================= */

    const processLine =
        document.getElementById('process-line');

    if (processLine) {

        gsap.to(processLine, {

            width: '100%',

            ease: 'none',

            scrollTrigger: {

                trigger: '#process',

                start: 'top 60%',

                end: 'bottom 70%',

                scrub: 1
            }

        });

    }


    /* =========================================================
       JOURNEY LINE
    ========================================================= */

    const journeyLine =
        document.getElementById('journey-line');

    if (journeyLine) {

        gsap.to(journeyLine, {

            width: '100%',

            ease: 'none',

            scrollTrigger: {

                trigger: '#journey',

                start: 'top 60%',

                end: 'bottom 70%',

                scrub: 1
            }

        });

    }


    /* =========================================================
       WEALTH JOURNEY
       SEED → TREE
    ========================================================= */

    const stages =
        gsap.utils.toArray('.journey-stage');

    if (
        stages.length &&
        document.getElementById('wealth-journey')
    ) {

        const treeTL =
            gsap.timeline({

                scrollTrigger: {

                    trigger: '#wealth-journey',

                    start: 'top top',

                    end: '+=2500',

                    scrub: 1,

                    pin: false,

                    onUpdate: (self) => {

                        const idx =
                            Math.min(
                                stages.length - 1,
                                Math.floor(
                                    self.progress *
                                    stages.length
                                )
                            );

                        stages.forEach((stage, i) => {

                            if (i === idx) {

                                stage.classList.remove(
                                    'opacity-40'
                                );

                                stage.classList.add(
                                    'opacity-100',
                                    'bg-white',
                                    'shadow-soft'
                                );

                            } else {

                                stage.classList.add(
                                    'opacity-40'
                                );

                                stage.classList.remove(
                                    'opacity-100',
                                    'bg-white',
                                    'shadow-soft'
                                );

                            }

                        });

                    }

                }

            });


        treeTL

            .to(
                '#tree-trunk',
                {
                    attr: {
                        height: 60
                    },
                    y: -60,
                    duration: 1
                },
                0
            )

            .to(
                '#tree-branch-1, #tree-branch-2',
                {
                    opacity: 1,
                    duration: 1
                },
                0.6
            )

            .to(
                '#tree-branch-3, #tree-branch-4',
                {
                    opacity: 1,
                    duration: 1
                },
                1.2
            )

            .to(
                '#tree-leaf-1, #tree-leaf-2, #tree-leaf-3',
                {
                    attr: {
                        r: 38
                    },
                    duration: 1.2
                },
                1.6
            )

            .to(
                '#tree-leaf-4, #tree-leaf-5, #tree-leaf-6',
                {
                    attr: {
                        r: 30
                    },
                    duration: 1.2
                },
                2.2
            )

            .to(
                '#tree-coin-1, #tree-coin-2, #tree-coin-3',
                {
                    attr: {
                        r: 7
                    },
                    duration: 1
                },
                2.8
            )

            .to(
                '#tree-seed',
                {
                    opacity: 0,
                    duration: 0.4
                },
                0.3
            );

    }


    /* =========================================================
       TILT CARDS
    ========================================================= */

    document
        .querySelectorAll('.tilt-card')
        .forEach(card => {

            card.addEventListener(
                'mousemove',
                (e) => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        e.clientX - rect.left;

                    const y =
                        e.clientY - rect.top;

                    const rx =
                        ((y / rect.height) - 0.5) * -8;

                    const ry =
                        ((x / rect.width) - 0.5) * 8;

                    gsap.to(card, {

                        rotateX: rx,

                        rotateY: ry,

                        duration: 0.4,

                        ease: 'power2.out',

                        transformPerspective: 800
                    });

                }
            );

            card.addEventListener(
                'mouseleave',
                () => {

                    gsap.to(card, {

                        rotateX: 0,

                        rotateY: 0,

                        duration: 0.6,

                        ease: 'power3.out'
                    });

                }
            );

        });


    /* =========================================================
       BUTTON RIPPLE
    ========================================================= */

    document
        .querySelectorAll('.btn-ripple')
        .forEach(btn => {

            btn.addEventListener(
                'click',
                function (e) {

                    const ripple =
                        document.createElement('span');

                    ripple.className = 'ripple';

                    const rect =
                        this.getBoundingClientRect();

                    const size =
                        Math.max(
                            rect.width,
                            rect.height
                        );

                    ripple.style.width =
                        size + 'px';

                    ripple.style.height =
                        size + 'px';

                    ripple.style.left =
                        (
                            e.clientX -
                            rect.left -
                            size / 2
                        ) + 'px';

                    ripple.style.top =
                        (
                            e.clientY -
                            rect.top -
                            size / 2
                        ) + 'px';

                    this.appendChild(ripple);

                    setTimeout(
                        () => ripple.remove(),
                        700
                    );

                }
            );

        });


    /* =========================================================
       SERVICE MODAL
    ========================================================= */

    const modal =
        document.getElementById('service-modal');

    const modalTitle =
        document.getElementById('modal-title');

    const modalDesc =
        document.getElementById('modal-desc');

    const modalPoints =
        document.getElementById('modal-points');

    const modalIconContainer =
        document.getElementById('modal-icon');

    const modalIcon =
        modalIconContainer
            ? modalIconContainer.querySelector('i')
            : null;


    document
        .querySelectorAll('.service-card')
        .forEach(card => {

            card.addEventListener(
                'click',
                () => {

                    if (!modal) return;

                    if (modalTitle) {
                        modalTitle.textContent =
                            card.dataset.title || '';
                    }

                    if (modalDesc) {
                        modalDesc.textContent =
                            card.dataset.desc || '';
                    }

                    if (modalIcon) {

                        modalIcon.className =
                            'fa-solid ' +
                            (
                                card.dataset.icon || ''
                            ) +
                            ' text-gold text-xl';

                    }

                    if (modalPoints) {

                        modalPoints.innerHTML = '';

                        const points =
                            (
                                card.dataset.points || ''
                            )
                                .split(',')
                                .map(point => point.trim())
                                .filter(Boolean);

                        points.forEach(point => {

                            const li =
                                document.createElement('li');

                            li.className =
                                'flex items-start gap-3 text-sm text-navy/70';

                            li.innerHTML =
                                `
                                <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
                                <span>${point}</span>
                                `;

                            modalPoints.appendChild(li);

                        });

                    }

                    modal.classList.remove('hidden');
                    modal.classList.add('flex');

                    document.body.style.overflow =
                        'hidden';

                }
            );

        });


    function closeModal() {

        if (!modal) return;

        modal.classList.add('hidden');
        modal.classList.remove('flex');

        document.body.style.overflow = '';

    }


    const modalClose =
        document.getElementById(
            'service-modal-close'
        );

    if (modalClose) {
        modalClose.addEventListener(
            'click',
            closeModal
        );
    }

    if (modal) {

        modal.addEventListener(
            'click',
            (e) => {

                if (e.target === modal) {
                    closeModal();
                }

            }
        );

    }


    /* =========================================================
       TESTIMONIAL CAROUSEL
    ========================================================= */

    const track =
        document.getElementById(
            'testimonial-track'
        );

    const testiNext =
        document.getElementById('testi-next');

    const testiPrev =
        document.getElementById('testi-prev');

    if (track && testiNext) {

        testiNext.addEventListener(
            'click',
            () => {

                track.scrollBy({
                    left: 440,
                    behavior: 'smooth'
                });

            }
        );

    }

    if (track && testiPrev) {

        testiPrev.addEventListener(
            'click',
            () => {

                track.scrollBy({
                    left: -440,
                    behavior: 'smooth'
                });

            }
        );

    }


    /* =========================================================
       FINANCIAL HEALTH CHECK
    ========================================================= */

    const hcIncome =
        document.getElementById('hc-income');

    const hcSavings =
        document.getElementById('hc-savings');

    const hcDebt =
        document.getElementById('hc-debt');

    const hcEmergency =
        document.getElementById('hc-emergency');

    const hcInsurance =
        document.getElementById('hc-insurance');

    const hcGoals =
        document.getElementById('hc-goals');

    const gaugeCircle =
        document.getElementById('gauge-circle');

    const gaugeScore =
        document.getElementById('gauge-score');

    const gaugeLabel =
        document.getElementById('gauge-label');

    const gaugeRecs =
        document.getElementById('gauge-recs');

    const CIRC =
        2 * Math.PI * 85;


    function fmtINR(number) {

        return (
            '₹' +
            Math.round(
                Number(number) || 0
            ).toLocaleString('en-IN')
        );

    }


    function computeHealth() {

        if (
            !hcSavings ||
            !hcDebt ||
            !hcEmergency
        ) return;

        const savings =
            parseFloat(hcSavings.value) || 0;

        const debt =
            parseFloat(hcDebt.value) || 0;

        const emergency =
            parseFloat(hcEmergency.value) || 0;

        const insurance =
            hcInsurance
                ? hcInsurance.checked
                : false;

        const goals =
            hcGoals
                ? hcGoals.checked
                : false;


        let score = 0;

        score +=
            Math.min(
                35,
                savings * 1.75
            );

        score +=
            Math.max(
                0,
                25 - debt * 0.6
            );

        score +=
            Math.min(
                20,
                emergency * (20 / 6)
            );

        score +=
            insurance ? 12 : 0;

        score +=
            goals ? 8 : 0;


        score =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(score)
                )
            );


        if (gaugeScore) {
            gaugeScore.textContent =
                score;
        }


        if (gaugeCircle) {

            const offset =
                CIRC -
                (
                    CIRC *
                    score /
                    100
                );

            gaugeCircle.style.strokeDashoffset =
                offset;

            gaugeCircle.style.stroke =
                score >= 70
                    ? '#12704F'
                    : score >= 40
                        ? '#C9A24B'
                        : '#B84C4C';

        }


        let label =
            'Needs Attention';

        if (score >= 80)
            label = 'Excellent';

        else if (score >= 60)
            label = 'Healthy';

        else if (score >= 40)
            label = 'Building Momentum';


        if (gaugeLabel) {
            gaugeLabel.textContent =
                label;
        }


        const recs = [];


        if (savings < 20) {

            recs.push(
                'Increase your monthly savings rate toward 20%+ of income.'
            );

        }


        if (debt > 35) {

            recs.push(
                'Prioritise reducing EMI obligations below 35% of income.'
            );

        }


        if (emergency < 6) {

            recs.push(
                'Build your emergency fund to at least 6 months of expenses.'
            );

        }


        if (!insurance) {

            recs.push(
                'Close protection gaps with adequate term & health insurance.'
            );

        }


        if (!goals) {

            recs.push(
                'Define clear, time-bound financial goals with your advisor.'
            );

        }


        if (recs.length === 0) {

            recs.push(
                "You're on a strong path — let's optimise for tax efficiency next."
            );

        }


        if (gaugeRecs) {

            gaugeRecs.innerHTML =
                recs
                    .map(
                        recommendation => `
                        <div class="flex items-start gap-3 text-sm text-navy/65">
                            <i class="fa-solid fa-arrow-right text-gold mt-1 text-xs"></i>
                            <span>${recommendation}</span>
                        </div>
                        `
                    )
                    .join('');

        }

    }


    if (hcIncome) {

        hcIncome.addEventListener(
            'input',
            () => {

                const value =
                    document.getElementById(
                        'hc-income-val'
                    );

                if (value) {
                    value.textContent =
                        fmtINR(
                            hcIncome.value
                        );
                }

                computeHealth();

            }
        );

    }


    if (hcSavings) {

        hcSavings.addEventListener(
            'input',
            () => {

                const value =
                    document.getElementById(
                        'hc-savings-val'
                    );

                if (value) {
                    value.textContent =
                        hcSavings.value;
                }

                computeHealth();

            }
        );

    }


    if (hcDebt) {

        hcDebt.addEventListener(
            'input',
            () => {

                const value =
                    document.getElementById(
                        'hc-debt-val'
                    );

                if (value) {
                    value.textContent =
                        hcDebt.value;
                }

                computeHealth();

            }
        );

    }


    if (hcEmergency) {

        hcEmergency.addEventListener(
            'input',
            () => {

                const value =
                    document.getElementById(
                        'hc-emergency-val'
                    );

                if (value) {
                    value.textContent =
                        hcEmergency.value;
                }

                computeHealth();

            }
        );

    }


    if (hcInsurance) {
        hcInsurance.addEventListener(
            'change',
            computeHealth
        );
    }

    if (hcGoals) {
        hcGoals.addEventListener(
            'change',
            computeHealth
        );
    }


    if (
        document.getElementById(
            'health-check'
        )
    ) {

        ScrollTrigger.create({

            trigger: '#health-check',

            start: 'top 70%',

            once: true,

            onEnter: computeHealth

        });

    }


    /* =========================================================
       SIP CALCULATOR
    ========================================================= */

    const sipAmount =
        document.getElementById('sip-amount');

    const sipYears =
        document.getElementById('sip-years');

    const sipReturn =
        document.getElementById('sip-return');

    let sipChart = null;


    function calculateSIPValue(
        monthlyInvestment,
        annualRate,
        months
    ) {

        if (annualRate === 0) {
            return monthlyInvestment * months;
        }

        const monthlyRate =
            annualRate / 100 / 12;

        return (
            monthlyInvestment *
            (
                (
                    Math.pow(
                        1 + monthlyRate,
                        months
                    ) - 1
                ) /
                monthlyRate
            ) *
            (1 + monthlyRate)
        );

    }


    function computeSIP() {

        if (
            !sipAmount ||
            !sipYears ||
            !sipReturn
        ) return;


        const P =
            parseFloat(
                sipAmount.value
            ) || 0;

        const years =
            parseFloat(
                sipYears.value
            ) || 0;

        const annualRate =
            parseFloat(
                sipReturn.value
            ) || 0;

        const months =
            years * 12;


        const futureValue =
            calculateSIPValue(
                P,
                annualRate,
                months
            );

        const invested =
            P * months;


        const amountValue =
            document.getElementById(
                'sip-amt-val'
            );

        const yearsValue =
            document.getElementById(
                'sip-years-val'
            );

        const returnValue =
            document.getElementById(
                'sip-return-val'
            );

        const investedElement =
            document.getElementById(
                'sip-invested'
            );

        const totalElement =
            document.getElementById(
                'sip-total'
            );


        if (amountValue)
            amountValue.textContent =
                fmtINR(P);

        if (yearsValue)
            yearsValue.textContent =
                years + ' yrs';

        if (returnValue)
            returnValue.textContent =
                annualRate + '%';

        if (investedElement)
            investedElement.textContent =
                fmtINR(invested);

        if (totalElement)
            totalElement.textContent =
                fmtINR(futureValue);


        const labels = [];
        const investedData = [];
        const valueData = [];


        for (
            let year = 1;
            year <= years;
            year++
        ) {

            const monthsAtYear =
                year * 12;

            const fv =
                calculateSIPValue(
                    P,
                    annualRate,
                    monthsAtYear
                );

            labels.push(
                'Y' + year
            );

            investedData.push(
                Math.round(
                    P * monthsAtYear
                )
            );

            valueData.push(
                Math.round(fv)
            );

        }


        const chartCanvas =
            document.getElementById(
                'sipChart'
            );


        if (
            typeof Chart === 'undefined' ||
            !chartCanvas
        ) return;


        if (!sipChart) {

            sipChart =
                new Chart(
                    chartCanvas,
                    {

                        type: 'line',

                        data: {

                            labels,

                            datasets: [

                                {
                                    label: 'Invested',
                                    data: investedData,
                                    borderColor: '#8598BC',
                                    backgroundColor: 'rgba(133,152,188,0.08)',
                                    fill: true,
                                    tension: 0.35,
                                    pointRadius: 0
                                },

                                {
                                    label: 'Value',
                                    data: valueData,
                                    borderColor: '#C9A24B',
                                    backgroundColor: 'rgba(201,162,75,0.15)',
                                    fill: true,
                                    tension: 0.35,
                                    pointRadius: 0
                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    display: true,

                                    labels: {

                                        boxWidth: 10,

                                        font: {
                                            size: 10
                                        }

                                    }

                                }

                            },

                            scales: {

                                x: {
                                    display: false
                                },

                                y: {
                                    display: false
                                }

                            }

                        }

                    }
                );

        } else {

            sipChart.data.labels =
                labels;

            sipChart.data.datasets[0].data =
                investedData;

            sipChart.data.datasets[1].data =
                valueData;

            sipChart.update();

        }

    }


    [sipAmount, sipYears, sipReturn]
        .filter(Boolean)
        .forEach(element => {

            element.addEventListener(
                'input',
                computeSIP
            );

        });


    /* =========================================================
       RETIREMENT CALCULATOR
    ========================================================= */

    const retAge =
        document.getElementById('ret-age');

    const retRetage =
        document.getElementById('ret-retage');

    const retExp =
        document.getElementById('ret-exp');

    let retChart = null;


    function computeRetirement() {

        if (
            !retAge ||
            !retRetage ||
            !retExp
        ) return;


        const age =
            parseFloat(
                retAge.value
            ) || 0;


        let retireAge =
            parseFloat(
                retRetage.value
            ) || 0;


        retireAge =
            Math.max(
                retireAge,
                age + 1
            );

        retRetage.value =
            retireAge;


        const expenses =
            parseFloat(
                retExp.value
            ) || 0;


        const yearsToRetire =
            retireAge - age;


        const inflation = 0.06;

        const postRetireReturn = 0.07;

        const lifeExpectancyYears = 25;


        const futureMonthlyExpense =
            expenses *
            Math.pow(
                1 + inflation,
                yearsToRetire
            );


        const annualExpense =
            futureMonthlyExpense * 12;


        const realReturn =
            (
                (1 + postRetireReturn) /
                (1 + inflation)
            ) - 1;


        const corpus =
            annualExpense *
            (
                (
                    1 -
                    Math.pow(
                        1 + realReturn,
                        -lifeExpectancyYears
                    )
                ) /
                realReturn
            );


        const preRetireReturn =
            0.12;

        const rMonthly =
            preRetireReturn / 12;

        const nMonths =
            yearsToRetire * 12;


        let requiredSIP = 0;


        if (nMonths > 0) {

            requiredSIP =
                corpus /
                (
                    (
                        Math.pow(
                            1 + rMonthly,
                            nMonths
                        ) - 1
                    ) /
                    rMonthly *
                    (1 + rMonthly)
                );

        }


        const ageVal =
            document.getElementById(
                'ret-age-val'
            );

        const retireAgeVal =
            document.getElementById(
                'ret-retage-val'
            );

        const expVal =
            document.getElementById(
                'ret-exp-val'
            );

        const corpusVal =
            document.getElementById(
                'ret-corpus'
            );

        const sipVal =
            document.getElementById(
                'ret-sip'
            );


        if (ageVal)
            ageVal.textContent =
                age;

        if (retireAgeVal)
            retireAgeVal.textContent =
                retireAge;

        if (expVal)
            expVal.textContent =
                fmtINR(expenses);

        if (corpusVal)
            corpusVal.textContent =
                fmtINR(corpus);

        if (sipVal)
            sipVal.textContent =
                fmtINR(
                    Math.max(
                        0,
                        requiredSIP
                    )
                );


        const labels = [];
        const corpusGrowth = [];


        const interval =
            Math.max(
                1,
                Math.round(
                    yearsToRetire / 10
                )
            );


        for (
            let y = 0;
            y <= yearsToRetire;
            y += interval
        ) {

            labels.push(
                'Age ' +
                (age + y)
            );


            const months =
                y * 12;


            const fv =
                requiredSIP *
                (
                    (
                        Math.pow(
                            1 + rMonthly,
                            months
                        ) - 1
                    ) /
                    rMonthly
                ) *
                (1 + rMonthly);


            corpusGrowth.push(
                Math.round(fv)
            );

        }


        const chartCanvas =
            document.getElementById(
                'retirementChart'
            );


        if (
            typeof Chart === 'undefined' ||
            !chartCanvas
        ) return;


        if (!retChart) {

            retChart =
                new Chart(
                    chartCanvas,
                    {

                        type: 'bar',

                        data: {

                            labels,

                            datasets: [

                                {
                                    label: 'Projected Corpus',
                                    data: corpusGrowth,
                                    backgroundColor: '#0A1830',
                                    borderRadius: 6
                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                }

                            },

                            scales: {

                                x: {
                                    display: false
                                },

                                y: {
                                    display: false
                                }

                            }

                        }

                    }
                );

        } else {

            retChart.data.labels =
                labels;

            retChart.data.datasets[0].data =
                corpusGrowth;

            retChart.update();

        }

    }


    [retAge, retRetage, retExp]
        .filter(Boolean)
        .forEach(element => {

            element.addEventListener(
                'input',
                computeRetirement
            );

        });


    if (
        document.getElementById(
            'calculators'
        )
    ) {

        ScrollTrigger.create({

            trigger: '#calculators',

            start: 'top 70%',

            once: true,

            onEnter: () => {

                computeSIP();
                computeRetirement();

            }

        });

    }


    /* =========================================================
       APPOINTMENT CALENDAR
    ========================================================= */

    const calMonthEl =
        document.getElementById(
            'cal-month'
        );

    const calGrid =
        document.getElementById(
            'cal-grid'
        );


    let calDate =
        new Date(
            2026,
            7,
            1
        );


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
        document.getElementById(
            'appointment-date'
        );

    const appointmentTimeInput =
        document.getElementById(
            'appointment-time'
        );


    /* =========================================================
       RENDER CALENDAR
    ========================================================= */

    function renderCalendar() {

        if (!calGrid || !calMonthEl)
            return;


        calGrid.innerHTML = '';


        const year =
            calDate.getFullYear();

        const month =
            calDate.getMonth();


        calMonthEl.textContent =
            monthNames[month] +
            ' ' +
            year;


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        const today =
            new Date();


        const todayOnly =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );


        /* ---------------------------------------------------------
           EMPTY CELLS
        --------------------------------------------------------- */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const emptyCell =
                document.createElement('div');

            calGrid.appendChild(
                emptyCell
            );

        }


        /* ---------------------------------------------------------
           DAYS
        --------------------------------------------------------- */

        for (
            let d = 1;
            d <= daysInMonth;
            d++
        ) {

            const btn =
                document.createElement('button');


            // Prevent form submission
            btn.type = 'button';


            btn.textContent = d;


            const thisDate =
                new Date(
                    year,
                    month,
                    d
                );


            const isPast =
                thisDate < todayOnly;


            const isSunday =
                thisDate.getDay() === 0;


            btn.className =
                `
                w-9 h-9
                rounded-full
                text-sm
                flex
                items-center
                justify-center
                transition
                mx-auto
                ${
                    isPast || isSunday
                        ? 'text-navy/20 cursor-not-allowed'
                        : 'hover:bg-navy hover:text-white cursor-pointer'
                }
                `;


            if (
                !isPast &&
                !isSunday
            ) {

                btn.addEventListener(
                    'click',
                    function () {

                        calGrid
                            .querySelectorAll('button')
                            .forEach(button => {

                                button.classList.remove(
                                    'bg-gold',
                                    'text-navy',
                                    'font-semibold'
                                );

                            });


                        btn.classList.add(
                            'bg-gold',
                            'text-navy',
                            'font-semibold'
                        );


                        selectedDay = d;


                        const selectedDate =
                            new Date(
                                year,
                                month,
                                d
                            );


                        const formattedDate =
                            selectedDate.toLocaleDateString(
                                'en-IN',
                                {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                }
                            );


                        if (
                            appointmentDateInput
                        ) {

                            appointmentDateInput.value =
                                formattedDate;

                        }


                        console.log(
                            'Selected appointment date:',
                            formattedDate
                        );

                    }
                );

            }


            const cell =
                document.createElement('div');

            cell.appendChild(btn);

            calGrid.appendChild(cell);

        }

    }


    /* =========================================================
       PREVIOUS MONTH
    ========================================================= */

    const calPrev =
        document.getElementById(
            'cal-prev'
        );


    if (calPrev) {

        calPrev.addEventListener(
            'click',
            () => {

                calDate.setMonth(
                    calDate.getMonth() - 1
                );


                selectedDay = null;


                if (appointmentDateInput) {
                    appointmentDateInput.value = '';
                }


                renderCalendar();

            }
        );

    }


    /* =========================================================
       NEXT MONTH
    ========================================================= */

    const calNext =
        document.getElementById(
            'cal-next'
        );


    if (calNext) {

        calNext.addEventListener(
            'click',
            () => {

                calDate.setMonth(
                    calDate.getMonth() + 1
                );


                selectedDay = null;


                if (appointmentDateInput) {
                    appointmentDateInput.value = '';
                }


                renderCalendar();

            }
        );

    }


    /* =========================================================
       INITIAL CALENDAR LOAD
    ========================================================= */

    renderCalendar();


    /* =========================================================
       AVAILABLE TIME SLOTS
    ========================================================= */

    const slotButtons =
        document.querySelectorAll(
            '.slot-btn'
        );


    slotButtons.forEach(btn => {

        btn.addEventListener(
            'click',
            () => {


                slotButtons.forEach(button => {

                    button.classList.remove(
                        'bg-navy',
                        'text-white',
                        'border-navy'
                    );

                });


                btn.classList.add(
                    'bg-navy',
                    'text-white',
                    'border-navy'
                );


                selectedSlot =
                    btn.textContent.trim();


                if (appointmentTimeInput) {

                    appointmentTimeInput.value =
                        selectedSlot;

                }


                console.log(
                    'Selected appointment time:',
                    selectedSlot
                );

            }
        );

    });


    /* =========================================================
       APPOINTMENT FORM
    ========================================================= */

    const appointmentForm =
        document.getElementById(
            'appointment-form'
        );


    if (appointmentForm) {

        appointmentForm.addEventListener(
            'submit',
            async (e) => {

                e.preventDefault();


                const submitButton =
                    appointmentForm.querySelector(
                        'button[type="submit"]'
                    );


                if (!submitButton) return;


                const originalButtonText =
                    submitButton.innerHTML;


                /* -------------------------------------------------
                   VALIDATE DATE
                ------------------------------------------------- */

                if (
                    !appointmentDateInput ||
                    !appointmentDateInput.value
                ) {

                    alert(
                        'Please select an appointment date.'
                    );

                    return;

                }


                /* -------------------------------------------------
                   VALIDATE TIME
                ------------------------------------------------- */

                if (
                    !appointmentTimeInput ||
                    !appointmentTimeInput.value
                ) {

                    alert(
                        'Please select an appointment time slot.'
                    );

                    return;

                }


                /* -------------------------------------------------
                   DISABLE BUTTON
                ------------------------------------------------- */

                submitButton.disabled = true;

                submitButton.innerHTML =
                    'Sending...';


                /* -------------------------------------------------
                   FORM DATA
                ------------------------------------------------- */

                const formData =
                    new FormData(
                        appointmentForm
                    );


                console.log(
                    'Appointment Date:',
                    formData.get(
                        'appointment_date'
                    )
                );

                console.log(
                    'Appointment Time:',
                    formData.get(
                        'appointment_time'
                    )
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


                /* -------------------------------------------------
                   WEB3FORMS
                ------------------------------------------------- */

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


                    /* ---------------------------------------------
                       SUCCESS
                    --------------------------------------------- */

                    if (result.success) {


                        appointmentForm.reset();


                        selectedDay = null;
                        selectedSlot = null;


                        if (
                            appointmentDateInput
                        ) {
                            appointmentDateInput.value =
                                '';
                        }


                        if (
                            appointmentTimeInput
                        ) {
                            appointmentTimeInput.value =
                                '';
                        }


                        /* -----------------------------------------
                           CLEAR CALENDAR
                        ----------------------------------------- */

                        if (calGrid) {

                            calGrid
                                .querySelectorAll('button')
                                .forEach(button => {

                                    button.classList.remove(
                                        'bg-gold',
                                        'text-navy',
                                        'font-semibold'
                                    );

                                });

                        }


                        /* -----------------------------------------
                           CLEAR SLOTS
                        ----------------------------------------- */

                        slotButtons.forEach(button => {

                            button.classList.remove(
                                'bg-navy',
                                'text-white',
                                'border-navy'
                            );

                        });


                        /* -----------------------------------------
                           SUCCESS BUTTON
                        ----------------------------------------- */

                        submitButton.innerHTML =
                            '✓ Consultation Requested';


                        submitButton.classList.remove(
                            'bg-navy',
                            'bg-red-600'
                        );


                        submitButton.classList.add(
                            'bg-green-600'
                        );


                        /* -----------------------------------------
                           RESET BUTTON
                        ----------------------------------------- */

                        setTimeout(
                            () => {

                                submitButton.innerHTML =
                                    originalButtonText;

                                submitButton.classList.remove(
                                    'bg-green-600'
                                );

                                submitButton.classList.add(
                                    'bg-navy'
                                );

                                submitButton.disabled =
                                    false;

                            },
                            3000
                        );


                    } else {

                        throw new Error(
                            result.message ||
                            'Something went wrong.'
                        );

                    }


                } catch (error) {

                    console.error(
                        'Form submission error:',
                        error
                    );


                    submitButton.innerHTML =
                        'Failed — Try Again';


                    submitButton.classList.remove(
                        'bg-navy'
                    );


                    submitButton.classList.add(
                        'bg-red-600'
                    );


                    setTimeout(
                        () => {

                            submitButton.innerHTML =
                                originalButtonText;

                            submitButton.classList.remove(
                                'bg-red-600'
                            );

                            submitButton.classList.add(
                                'bg-navy'
                            );

                            submitButton.disabled =
                                false;

                        },
                        3000
                    );

                }

            }
        );

    }


    /* =========================================================
       SMOOTH ANCHOR SCROLL
    ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {

            anchor.addEventListener(
                'click',
                function (e) {

                    const targetId =
                        this.getAttribute('href');


                    if (
                        !targetId ||
                        targetId.length <= 1
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) return;


                    e.preventDefault();


                    if (lenis) {

                        lenis.scrollTo(
                            target,
                            {
                                offset: -60
                            }
                        );

                    } else {

                        target.scrollIntoView({
                            behavior: 'smooth'
                        });

                    }

                }
            );

        });


    /* =========================================================
       FINAL SCROLLTRIGGER REFRESH
    ========================================================= */

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);

});