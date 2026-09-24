/* =========================================================
   Sito Sofi - Interactive Logic & Escape Mechanics
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stageInvitation = document.getElementById('stage-invitation');
  const stageDetails = document.getElementById('stage-details');
  const stageTicket = document.getElementById('stage-ticket');

  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const teaseToast = document.getElementById('tease-toast');
  const heroImg = document.getElementById('hero-img');
  const reactionBubble = document.getElementById('reaction-bubble');

  const timeChips = document.querySelectorAll('#time-chips .chip');
  const customTimeWrapper = document.getElementById('custom-time-wrapper');
  const customTimeInput = document.getElementById('custom-time-input');
  const vibeCards = document.querySelectorAll('.vibe-card');
  const toggleOptions = document.querySelectorAll('.toggle-option');
  const specialNotes = document.getElementById('special-notes');
  const btnConfirm = document.getElementById('btn-confirm');

  // Ticket elements
  const tTime = document.getElementById('t-time');
  const tFood = document.getElementById('t-food');
  const tRide = document.getElementById('t-ride');
  const tNotesRow = document.getElementById('t-notes-row');
  const tNotes = document.getElementById('t-notes');

  // State
  let escapeCount = 0;
  let selectedTime = '20:00';
  let selectedFood = 'Sushi 🍣';
  let selectedRide = 'Passo a prenderti io sotto casa (autista privato a 5 stelle 🚗✨)';

  const wittyTeases = [
    "Ehi, dove provi a cliccare? 😂",
    "Riprova, sarai più fortunata! 😜",
    "Ops! Ti è scivolato il dito? 🙈",
    "Errore 404: L'opzione 'No' non esiste nel mio vocabolario! 💅",
    "Guarda che offro io e c'è pure il dolce! 🍰",
    "Daiii, non fare la difficile! 🥺",
    "Ormai il tasto 'Sì' è gigante, non puoi mancarlo! 🚀",
    "È il destino: sabato sera si va a cena insieme! ❤️",
    "Vedo che ti piace inseguire i bottoni... ma il Sì ti aspetta! 🏃‍♀️💨"
  ];

  const bubbleReactions = [
    "Ma come no?! 🥺",
    "Non ci credo! 😱",
    "Eddai Sofi! 🙈",
    "Insisti eh? 😂",
    "Clicca il Sì! ✨"
  ];

  /* ---------------------------------------------------------
     Web Audio API - Cute Procedural Sounds (No external assets)
     --------------------------------------------------------- */
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playDodgeSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320 + Math.random() * 150, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playSuccessSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  /* ---------------------------------------------------------
     Runaway "No" Button Mechanics
     --------------------------------------------------------- */
  function moveNoButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    escapeCount++;
    playDodgeSound();

    // Show funny tease message
    const msg = wittyTeases[(escapeCount - 1) % wittyTeases.length];
    teaseToast.textContent = msg;
    teaseToast.classList.remove('hidden');

    // Update reaction bubble
    const bubbleMsg = bubbleReactions[(escapeCount - 1) % bubbleReactions.length];
    if (reactionBubble) {
      reactionBubble.textContent = bubbleMsg;
    }

    // Grow the YES button to make it more appealing
    const yesScale = Math.min(1 + escapeCount * 0.09, 1.6);
    btnYes.style.transform = `scale(${yesScale})`;
    if (escapeCount >= 3) {
      btnYes.querySelector('.btn-text').textContent = 'Sì! Sposiam... cioè CENA! 🥰';
    }

    // Calculate smart evasive coordinates within safe viewport margins
    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 50;

    const pad = 24;
    const maxX = Math.max(pad, window.innerWidth - btnWidth - pad);
    const maxY = Math.max(pad, window.innerHeight - btnHeight - pad);

    let newX, newY;
    let attempts = 0;
    do {
      newX = Math.floor(Math.random() * (maxX - pad)) + pad;
      newY = Math.floor(Math.random() * (maxY - pad)) + pad;
      attempts++;
    } while (attempts < 12 && Math.hypot(newX - btnRect.left, newY - btnRect.top) < 140);

    // Switch button to fixed positioning after first dodge
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.zIndex = '9999';

    // Slight playful rotation and bounce
    const rot = (Math.random() * 20 - 10).toFixed(1);
    btnNo.style.transform = `rotate(${rot}deg) scale(0.95)`;
  }

  // Trigger ONLY when she actually clicks / taps the "No" button
  btnNo.addEventListener('click', moveNoButton);

  /* ---------------------------------------------------------
     YES Button Click -> Celebration & Stage 2
     --------------------------------------------------------- */
  btnYes.addEventListener('click', () => {
    playSuccessSound();

    // Grand confetti explosion
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 60,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 60,
          origin: { x: 1 }
        });
      }, 250);
    }

    // Hide stage 1 and display stage 2 smoothly
    stageInvitation.classList.add('hidden');
    stageDetails.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clean up runaway button if it was floating
    btnNo.style.display = 'none';
  });

  /* ---------------------------------------------------------
     Stage 2: Availability and Food Selections
     --------------------------------------------------------- */
  // Time chips
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const timeVal = chip.dataset.time;
      if (timeVal === 'custom') {
        customTimeWrapper.classList.remove('hidden');
        selectedTime = customTimeInput.value || '20:15';
      } else {
        customTimeWrapper.classList.add('hidden');
        selectedTime = timeVal;
      }
    });
  });

  customTimeInput.addEventListener('input', (e) => {
    if (e.target.value) {
      selectedTime = e.target.value;
    }
  });

  // Food / Vibe Cards
  vibeCards.forEach(card => {
    card.addEventListener('click', () => {
      vibeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedFood = radio.value;
      }
    });
  });

  // Ride options
  toggleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      toggleOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedRide = radio.value;
      }
    });
  });

  /* ---------------------------------------------------------
     Confirmation & Ticket Generation
     --------------------------------------------------------- */
  btnConfirm.addEventListener('click', () => {
    btnConfirm.disabled = true;
    btnConfirm.style.opacity = '0.85';
    btnConfirm.innerHTML = '<span>Registrazione appuntamento... 🥰</span>';

    playSuccessSound();

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    const notesVal = specialNotes.value.trim();

    // Populate ticket
    tTime.textContent = `Ore ${selectedTime}`;
    tFood.textContent = selectedFood;
    tRide.textContent = selectedRide;

    if (notesVal) {
      tNotes.textContent = `"${notesVal}"`;
      tNotesRow.style.display = 'flex';
    } else {
      tNotesRow.style.display = 'none';
    }

    const responsePayload = {
      _subject: "❤️ Sofi ha accettato il tuo invito a cena per Sabato! 🥂",
      _template: "table",
      _captcha: "false",
      "Invitata": "Sofi ❤️",
      "Orario_Scelto": `Ore ${selectedTime}`,
      "Cena_Preferita": selectedFood,
      "Passaggio": selectedRide,
      "Desiderio_Speciale_o_Note": notesVal || "Nessuna nota speciale",
      "Data_Invio": new Date().toLocaleString('it-IT')
    };

    // Save locally in browser
    try {
      localStorage.setItem('sofi_date_response', JSON.stringify(responsePayload));
    } catch (e) {}

    // Send to local python server if running (writes to file on Stefano's machine!)
    fetch("/api/save_response", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responsePayload)
    }).catch(() => {});

    // Also dispatch to FormSubmit token endpoint in background
    fetch("https://formsubmit.co/ajax/6195ab01e3a438f520cfc007f9be37bb", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(responsePayload)
    }).catch(() => {});

    // Transition to Stage 3 after short celebration delay
    setTimeout(() => {
      stageDetails.classList.add('hidden');
      stageTicket.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  });

  /* ---------------------------------------------------------
     Floating Ambient Hearts & Sparkles Canvas
     --------------------------------------------------------- */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 40;
      this.size = Math.random() * 14 + 10; // heart size
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.isHeart = Math.random() > 0.4; // heart or sparkle
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rot += this.rotSpeed;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        ctx.fillStyle = '#ff7597';
        // Draw heart shape
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.5, s * 0.6, 0, s * 1.6);
        ctx.bezierCurveTo(s * 1.5, s * 0.6, s, -s * 0.6, 0, s * 0.3);
        ctx.fill();
      } else {
        // Sparkling star
        ctx.fillStyle = '#ffeaa7';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Populate particles
  const particleCount = window.innerWidth < 600 ? 25 : 45;
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // initial spread
    particles.push(p);
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
});
