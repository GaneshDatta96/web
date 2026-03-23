(function () {
  var taskbarClock = document.getElementById("taskbar-clock");
  var petMessage = document.getElementById("pet-message");
  var petStatus = document.getElementById("pet-status");
  var petTrick = document.getElementById("pet-trick");
  var petGlyph = document.getElementById("pet-glyph");
  var petFace = document.getElementById("pet-face");
  var petWindow = document.getElementById("pet-window");
  var companion = document.querySelector(".companion");
  var petBall = document.querySelector(".pet-ball");
  var petRunner = null;
  var petRunnerGlyph = null;
  var desktopBall = null;
  var audio = document.getElementById("winamp-audio");
  var winampWindow = document.getElementById("winamp-window");
  var winampStatus = document.getElementById("winamp-status");
  var winampTimer = document.getElementById("winamp-timer");
  var winampTrack = document.getElementById("winamp-track");
  var volumeInput = document.getElementById("winamp-volume");
  var playButton = document.getElementById("winamp-play");
  var pauseButton = document.getElementById("winamp-pause");
  var nextButton = document.getElementById("winamp-next");
  var startButton = document.getElementById("start-btn");
  var startMenu = document.getElementById("start-menu");
  var iconRail = document.querySelector(".icon-rail");
  var iconLinks = Array.prototype.slice.call(document.querySelectorAll(".icon-link"));
  var railTargets = iconLinks.map(function (link) {
    var href = link.getAttribute("href");
    var target = href && href.charAt(0) === "#" ? document.getElementById(href.slice(1)) : null;

    if (!target) {
      return null;
    }

    return { link: link, target: target };
  }).filter(function (item) {
    return item;
  });
  var closeQuips = [
    "Nope. Not allowed. This desktop has attachment issues.",
    "Cute try. We do not close revenue infrastructure here.",
    "Negative. That X is decorative management theater.",
    "No closing windows. You can minimize your feelings instead."
  ];
  var playlist = [
    {
      title: "Maggie Lofi // Warm Boot",
      url: "audio/maggie_lofi_01.wav"
    },
    {
      title: "Maggie Lofi // Night Audit",
      url: "audio/maggie_lofi_02.wav"
    },
    {
      title: "Maggie Lofi // Calendar Drift",
      url: "audio/maggie_lofi_03.wav"
    }
  ];
  var trackIndex = 0;
  var petMagicLibrary = {
    menu: [
      {
        intro: "Maggie just pulled a whole Start menu out of one grey rectangle. Very advanced dog work.",
        status: "magic // menu-from-paw routine",
        trick: "maggie // menu from paw",
        revealFace: "smug",
        finish: "Menu safely returned to the paw. No one ask where she was storing it."
      },
      {
        intro: "Maggie opened the Start menu like it owed her a treat.",
        status: "magic // menu heist active",
        trick: "maggie // unauthorized menu retrieval",
        revealFace: "hype",
        finish: "The menu has been re-holstered. Maggie demands compensation in snacks."
      }
    ],
    calendar: [
      {
        intro: "Maggie conjured a booking calendar and immediately judged your timezone setup.",
        status: "magic // calendar materialized",
        trick: "maggie // calendar from thin air",
        revealFace: "smug",
        finish: "Calendar stabilized. Maggie still distrusts daylight savings."
      },
      {
        intro: "There. Maggie pulled a calendar out of the air like a well-trained revenue wizard.",
        status: "magic // booking spell running",
        trick: "maggie // scheduling sorcery",
        revealFace: "hype",
        finish: "The booking portal is open. Maggie is now extremely pleased with herself."
      }
    ],
    audit: [
      {
        intro: "Maggie sniffed the workflow and found three bottlenecks plus one loose process in the couch cushions.",
        status: "magic // bottleneck sniff test",
        trick: "maggie // forensic sniff mode",
        revealFace: "dizzy",
        finish: "Sniff test complete. The bottleneck was, in fact, not house-trained."
      },
      {
        intro: "Audit routine loaded. Maggie is now doing that suspiciously competent labrador inspection thing.",
        status: "magic // systems scent trail active",
        trick: "maggie // x-ray nose online",
        revealFace: "smug",
        finish: "Inspection complete. Maggie found drag, chaos, and one missing follow-up."
      }
    ],
    about: [
      {
        intro: "Maggie performed a de-pixelation ritual. Biography restored. Mystique partially retained.",
        status: "magic // profile reveal spell",
        trick: "maggie // de-pixelation ritual",
        revealFace: "hype",
        finish: "Profile loaded. Maggie says the lore is now canon."
      },
      {
        intro: "Maggie opened the profile with all the seriousness of a dog who just found your best shoes.",
        status: "magic // identity reveal in progress",
        trick: "maggie // biography unredacted",
        revealFace: "smug",
        finish: "About page unlocked. Maggie expects dramatic reading rights."
      }
    ],
    results: [
      {
        intro: "Maggie's crystal tennis ball predicts less chaos and more throughput.",
        status: "magic // prediction engine online",
        trick: "maggie // crystal tennis ball",
        revealFace: "smug",
        finish: "Forecast complete. Maggie remains annoyingly correct."
      },
      {
        intro: "Prediction routine loaded. Maggie says fixing the system still beats hoping harder.",
        status: "magic // prophecy with pawprint",
        trick: "maggie // bottleneck of spades",
        revealFace: "hype",
        finish: "Prophecy filed. Maggie would like this marked as 'told you so'."
      }
    ],
    default: [
      {
        intro: "Maggie is attempting a low-budget miracle. Please keep your expectations fluffy and manageable.",
        status: "magic // smoke and pawprints",
        trick: "maggie // hat, paw, miracle",
        revealFace: "smug",
        finish: "Magic complete. Maggie now believes she is legally a wizard."
      },
      {
        intro: "Maggie has initiated one of her tricks again. Nobody authorized this and yet here we are.",
        status: "magic // household sorcery detected",
        trick: "maggie // chaos with presentation",
        revealFace: "hype",
        finish: "Trick finished. Maggie would like applause and one unguarded sandwich."
      }
    ]
  };
  var petMode = "idle";
  var petState = "idle";
  var petDanceTimer = 0;
  var petResetTimer = 0;
  var petPhaseTimer = 0;
  var petIdleTimer = 0;
  var petTravelTimer = 0;
  var petTravelAnimation = null;
  var petBallAnimation = null;
  var petJokes = [
    "Maggie audited the vibes. They were untagged, unassigned, and somehow in production.",
    "Your bottleneck and your calendar are in a committed relationship. Maggie can smell it.",
    "Maggie is not saying the workflow is haunted. She is saying it knows your password.",
    "Every manual follow-up is just a CRM asking for help in lowercase while Maggie sighs nearby.",
    "Maggie found a qualified lead, a missing process, and half a tennis ball under the same couch."
  ];
  var petBoops = [
    {
      face: "smug",
      message: "Maggie accepts the boop. Maggie is also judging the boop.",
      status: "smug // snoot contacted",
      trick: "maggie // snoot booped"
    },
    {
      face: "hype",
      message: "That boop activated immediate labrador optimism. She is now emotionally overqualified.",
      status: "smug // morale spike detected",
      trick: "maggie // morale-boost boop"
    },
    {
      face: "blink",
      message: "You booped the snoot. Maggie has logged this as a legally binding friendship event.",
      status: "smug // boop treaty ratified",
      trick: "maggie // diplomatic snoot"
    }
  ];
  var petFetchLibrary = [
    {
      intro: "Maggie spotted a tennis ball and briefly resigned from all white-collar responsibility.",
      status: "fetch // target acquired",
      trick: "maggie // ballistic tennis ball",
      finish: "Ball recovered. Dignity was not, but that was never part of the brief."
    },
    {
      intro: "Fetch routine engaged. Maggie is now doing executive retrieval at unsafe velocity.",
      status: "fetch // zoomies with payload",
      trick: "maggie // retrieval specialist",
      finish: "Object returned. Maggie expects praise disproportionate to the assignment."
    },
    {
      intro: "Maggie launched after the ball like the CRM just said something disrespectful.",
      status: "fetch // paws at terminal speed",
      trick: "maggie // intercept and return",
      finish: "Fetch complete. Maggie remains extremely pleased with her own range."
    }
  ];
  var petIdleBehaviors = [
    {
      face: "blink",
      message: "Maggie heard the word 'funnel' and did one slow blink of professional concern.",
      status: "idle // vocabulary review underway",
      trick: "maggie // ambient supervision"
    },
    {
      face: "smug",
      message: "Maggie has appointed herself head of hallway security and process compliance.",
      status: "idle // perimeter secured",
      trick: "maggie // patrol loop stable"
    },
    {
      face: "hype",
      message: "Maggie detected an unscheduled opening on the calendar and got suspiciously alert.",
      status: "idle // ears up for opportunity",
      trick: "maggie // schedule sentry mode"
    },
    {
      face: "nap",
      message: "Maggie is power-napping with one eye open. The workflow is still being judged.",
      status: "idle // tactical loaf mode",
      trick: "maggie // sleep but listening"
    }
  ];

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function setPetMessage(text) {
    if (petMessage) {
      petMessage.textContent = text;
    }
  }

  function setPetTrick(text) {
    if (petTrick) {
      petTrick.textContent = text;
    }
  }

  function setPetStatus(text) {
    if (petStatus) {
      petStatus.textContent = text;
    }
  }

  function setPetState(state) {
    petState = state;
    if (petWindow) {
      petWindow.setAttribute("data-pet-state", state);
    }
  }

  function ensurePetOverlays() {
    if (!document.body) {
      return;
    }

    if (!petRunner && petGlyph) {
      petRunner = document.createElement("div");
      petRunner.className = "pet-runner";
      petRunner.setAttribute("data-face", petMode);
      petRunnerGlyph = petGlyph.cloneNode(true);
      petRunnerGlyph.removeAttribute("id");
      petRunner.appendChild(petRunnerGlyph);
      document.body.appendChild(petRunner);
    }

    if (!desktopBall) {
      desktopBall = document.createElement("div");
      desktopBall.className = "desktop-ball";
      document.body.appendChild(desktopBall);
    }
  }

  function setPetFace(mode) {
    petMode = mode;
    if (petFace) {
      petFace.setAttribute("data-face", mode);
    }
    if (petGlyph) {
      petGlyph.setAttribute("data-face", mode);
    }
    if (petRunner) {
      petRunner.setAttribute("data-face", mode);
    }
    if (petRunnerGlyph) {
      petRunnerGlyph.setAttribute("data-face", mode);
    }
  }

  function setPetMood(mode, message, status, state) {
    setPetFace(mode);
    setPetState(state || mode);
    if (message) {
      setPetMessage(message);
    }
    if (status) {
      setPetStatus(status);
    }
  }

  function clearPetTimers() {
    if (petDanceTimer) {
      window.clearInterval(petDanceTimer);
      petDanceTimer = 0;
    }
    if (petResetTimer) {
      window.clearTimeout(petResetTimer);
      petResetTimer = 0;
    }
    if (petPhaseTimer) {
      window.clearTimeout(petPhaseTimer);
      petPhaseTimer = 0;
    }
    if (petIdleTimer) {
      window.clearTimeout(petIdleTimer);
      petIdleTimer = 0;
    }
    if (petTravelTimer) {
      window.clearTimeout(petTravelTimer);
      petTravelTimer = 0;
    }
  }

  function getPetHomeRect() {
    return petFace ? petFace.getBoundingClientRect() : null;
  }

  function getBallHomeRect() {
    return petBall ? petBall.getBoundingClientRect() : null;
  }

  function showRunnerAtHome() {
    var rect = getPetHomeRect();
    var runnerScale = 1.14;
    var runnerWidth;
    var runnerHeight;

    ensurePetOverlays();
    if (!petRunner || !rect) {
      return null;
    }

    runnerWidth = rect.width * runnerScale;
    runnerHeight = rect.height * runnerScale;
    petRunner.style.left = (rect.left - (runnerWidth - rect.width) / 2).toFixed(1) + "px";
    petRunner.style.top = (rect.top - (runnerHeight - rect.height) * 0.74).toFixed(1) + "px";
    petRunner.style.width = runnerWidth.toFixed(1) + "px";
    petRunner.style.height = runnerHeight.toFixed(1) + "px";
    petRunner.classList.add("pet-runner--visible");

    if (petFace) {
      petFace.classList.add("pet-face--ghost");
    }

    return rect;
  }

  function setRunnerMoving(active) {
    if (petRunner) {
      petRunner.classList.toggle("pet-runner--moving", !!active);
    }
  }

  function showDesktopBall() {
    var rect = getBallHomeRect();

    ensurePetOverlays();
    if (!desktopBall || !rect) {
      return null;
    }

    desktopBall.style.left = rect.left.toFixed(1) + "px";
    desktopBall.style.top = rect.top.toFixed(1) + "px";
    desktopBall.classList.add("desktop-ball--visible");

    if (petBall) {
      petBall.style.opacity = "0.14";
    }

    return rect;
  }

  function clearPetTravel() {
    if (petTravelAnimation) {
      petTravelAnimation.cancel();
      petTravelAnimation = null;
    }
    if (petBallAnimation) {
      petBallAnimation.cancel();
      petBallAnimation = null;
    }
    if (companion) {
      companion.style.transform = "";
    }
    if (petBall) {
      petBall.style.transform = "";
      petBall.style.opacity = "";
    }
    if (petFace) {
      petFace.classList.remove("pet-face--ghost");
    }
    if (petRunner) {
      petRunner.classList.remove("pet-runner--visible");
      petRunner.classList.remove("pet-runner--moving");
      petRunner.style.transform = "";
    }
    if (desktopBall) {
      desktopBall.classList.remove("desktop-ball--visible");
      desktopBall.style.transform = "";
    }
  }

  function isFloatingCompanion() {
    return companion && window.getComputedStyle(companion).position === "fixed";
  }

  function runCompanionTrip(keyframes, duration) {
    if (!isFloatingCompanion()) {
      return;
    }

    showRunnerAtHome();
    if (!petRunner || typeof petRunner.animate !== "function") {
      return;
    }
    setRunnerMoving(true);

    if (petTravelAnimation) {
      petTravelAnimation.cancel();
      petTravelAnimation = null;
    }
    petTravelAnimation = petRunner.animate(keyframes, {
      duration: duration,
      easing: "cubic-bezier(0.22, 0.8, 0.2, 1)",
      fill: "none"
    });
    petTravelAnimation.onfinish = function () {
      if (petRunner) {
        petRunner.style.transform = "";
        petRunner.classList.remove("pet-runner--visible");
        petRunner.classList.remove("pet-runner--moving");
      }
      if (petFace) {
        petFace.classList.remove("pet-face--ghost");
      }
      petTravelAnimation = null;
    };
    petTravelAnimation.oncancel = function () {
      if (petRunner) {
        petRunner.style.transform = "";
        petRunner.classList.remove("pet-runner--visible");
        petRunner.classList.remove("pet-runner--moving");
      }
      if (petFace) {
        petFace.classList.remove("pet-face--ghost");
      }
      petTravelAnimation = null;
    };
  }

  function runFetchAcrossDesktop() {
    var homeRect;
    var ballRect;
    var targetX;
    var targetY;
    var zones;
    var zone;
    var dx;
    var dy;
    var ballDx;
    var ballDy;

    if (!petBall || !isFloatingCompanion()) {
      return;
    }

    homeRect = showRunnerAtHome();
    ballRect = showDesktopBall();
    if (!homeRect || !ballRect || !desktopBall || typeof desktopBall.animate !== "function") {
      return;
    }

    clearPetTravel();
    showRunnerAtHome();
    ballRect = showDesktopBall();
    zones = [
      { x0: 70, x1: window.innerWidth * 0.42, y0: getTopOffset() + 40, y1: window.innerHeight * 0.42 },
      { x0: window.innerWidth * 0.58, x1: window.innerWidth - 90, y0: getTopOffset() + 40, y1: window.innerHeight * 0.42 },
      { x0: 70, x1: window.innerWidth * 0.42, y0: window.innerHeight * 0.5, y1: window.innerHeight - 150 },
      { x0: window.innerWidth * 0.58, x1: window.innerWidth - 90, y0: window.innerHeight * 0.5, y1: window.innerHeight - 150 }
    ];
    zone = pickRandom(zones);
    targetX = zone.x0 + Math.random() * Math.max(40, zone.x1 - zone.x0);
    targetY = zone.y0 + Math.random() * Math.max(40, zone.y1 - zone.y0);

    dx = targetX - (homeRect.left + homeRect.width * 0.44);
    dy = targetY - (homeRect.top + homeRect.height * 0.52);
    ballDx = targetX - ballRect.left;
    ballDy = targetY - ballRect.top;

    petBallAnimation = desktopBall.animate([
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1, offset: 0 },
      { transform: "translate3d(" + (ballDx * 0.58).toFixed(1) + "px, " + (ballDy * 0.3 - 80).toFixed(1) + "px, 0) scale(1.06)", opacity: 1, offset: 0.32 },
      { transform: "translate3d(" + ballDx.toFixed(1) + "px, " + ballDy.toFixed(1) + "px, 0) scale(0.98)", opacity: 1, offset: 0.5 },
      { transform: "translate3d(" + ballDx.toFixed(1) + "px, " + ballDy.toFixed(1) + "px, 0) scale(0.94)", opacity: 1, offset: 0.64 },
      { transform: "translate3d(" + (ballDx * 0.36).toFixed(1) + "px, " + (ballDy * 0.22 - 24).toFixed(1) + "px, 0) scale(0.9)", opacity: 0, offset: 0.86 },
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1, offset: 1 }
    ], {
      duration: 3800,
      easing: "cubic-bezier(0.16, 0.84, 0.22, 1)",
      fill: "none"
    });
    petBallAnimation.onfinish = function () {
      if (desktopBall) {
        desktopBall.style.transform = "";
        desktopBall.classList.remove("desktop-ball--visible");
      }
      if (petBall) {
        petBall.style.opacity = "";
      }
      petBallAnimation = null;
    };
    petBallAnimation.oncancel = function () {
      if (desktopBall) {
        desktopBall.style.transform = "";
        desktopBall.classList.remove("desktop-ball--visible");
      }
      if (petBall) {
        petBall.style.opacity = "";
      }
      petBallAnimation = null;
    };

    petTravelTimer = window.setTimeout(function () {
      runCompanionTrip([
        { transform: "translate3d(0, 0, 0) rotate(0deg)", offset: 0 },
        { transform: "translate3d(" + (dx * 0.14).toFixed(1) + "px, " + (dy * 0.06).toFixed(1) + "px, 0) rotate(-3deg)", offset: 0.14 },
        { transform: "translate3d(" + (dx * 0.36).toFixed(1) + "px, " + (dy * 0.18 - 10).toFixed(1) + "px, 0) rotate(-5deg)", offset: 0.3 },
        { transform: "translate3d(" + (dx * 0.7).toFixed(1) + "px, " + (dy * 0.5).toFixed(1) + "px, 0) rotate(4deg)", offset: 0.5 },
        { transform: "translate3d(" + dx.toFixed(1) + "px, " + dy.toFixed(1) + "px, 0) rotate(2deg)", offset: 0.62 },
        { transform: "translate3d(" + dx.toFixed(1) + "px, " + dy.toFixed(1) + "px, 0) rotate(1deg)", offset: 0.72 },
        { transform: "translate3d(" + (dx * 0.58).toFixed(1) + "px, " + (dy * 0.26 - 12).toFixed(1) + "px, 0) rotate(-2deg)", offset: 0.88 },
        { transform: "translate3d(0, 0, 0) rotate(0deg)", offset: 1 }
      ], 3600);
      petTravelTimer = 0;
    }, 340);
  }

  function runDesktopZoomies() {
    var rect;
    var margin = 18;
    var topGuard;
    var destinations;
    var target;
    var dx;
    var dy;

    if (!isFloatingCompanion()) {
      return;
    }

    rect = showRunnerAtHome();
    if (!rect) {
      return;
    }

    topGuard = getTopOffset() + 18;
    destinations = [
      { x: margin, y: Math.max(topGuard, 24) },
      { x: Math.max(margin, window.innerWidth - rect.width - margin), y: Math.max(topGuard, 34) },
      { x: margin, y: Math.max(topGuard + 30, window.innerHeight - rect.height - 112) },
      { x: Math.max(margin, window.innerWidth - rect.width - margin), y: Math.max(topGuard + 30, window.innerHeight - rect.height - 112) }
    ];
    target = pickRandom(destinations);
    dx = target.x - rect.left;
    dy = target.y - rect.top;

    runCompanionTrip([
      { transform: "translate3d(0, 0, 0) rotate(0deg)", offset: 0 },
      { transform: "translate3d(" + (dx * 0.12).toFixed(1) + "px, " + (dy * 0.05).toFixed(1) + "px, 0) rotate(-3deg)", offset: 0.14 },
      { transform: "translate3d(" + (dx * 0.34).toFixed(1) + "px, " + (dy * 0.16 - 10).toFixed(1) + "px, 0) rotate(-5deg)", offset: 0.28 },
      { transform: "translate3d(" + (dx * 0.68).toFixed(1) + "px, " + (dy * 0.42).toFixed(1) + "px, 0) rotate(4deg)", offset: 0.5 },
      { transform: "translate3d(" + dx.toFixed(1) + "px, " + dy.toFixed(1) + "px, 0) rotate(-2deg)", offset: 0.64 },
      { transform: "translate3d(" + (dx * 0.52).toFixed(1) + "px, " + (dy * 0.26 - 12).toFixed(1) + "px, 0) rotate(2deg)", offset: 0.86 },
      { transform: "translate3d(0, 0, 0) rotate(0deg)", offset: 1 }
    ], 4000);
  }

  function clearPetEffects() {
    if (!petWindow) {
      clearPetTravel();
      return;
    }

    clearPetTravel();
    petWindow.classList.remove("pet-shell--dancing", "pet-shell--magic", "pet-shell--laughing", "pet-shell--vanish", "pet-shell--fetch");
  }

  function finishPetRoutine(face, message, status, trick, state) {
    clearPetTimers();
    clearPetEffects();
    setPetTrick(trick || "maggie // tennis ball armed");
    setPetMood(face || "idle", message, status, state);
    scheduleIdleMischief();
  }

  function schedulePetFinish(delay, face, message, status, trick, state) {
    if (petResetTimer) {
      window.clearTimeout(petResetTimer);
    }

    petResetTimer = window.setTimeout(function () {
      finishPetRoutine(face, message, status, trick, state);
    }, delay);
  }

  function scheduleIdleMischief() {
    petIdleTimer = window.setTimeout(function () {
      var idleBeat;

      if (document.hidden || petState !== "idle") {
        scheduleIdleMischief();
        return;
      }

      idleBeat = pickRandom(petIdleBehaviors);
      clearPetEffects();
      setPetTrick(idleBeat.trick);
      setPetMood(idleBeat.face, idleBeat.message, idleBeat.status, "idle");

      petPhaseTimer = window.setTimeout(function () {
        setPetFace("idle");
        setPetStatus("idle // Maggie is patrolling the desktop");
      }, 1600);

      scheduleIdleMischief();
    }, 9000 + Math.random() * 7000);
  }

  function runDanceRoutine(message, status, trick) {
    var frames = ["dance1", "dance2", "dance3", "dance2"];
    var frameIndex = 0;

    clearPetTimers();
    clearPetEffects();

    if (petWindow) {
      petWindow.classList.add("pet-shell--dancing");
    }

    setPetTrick(trick || "routine // shoulder shuffle loaded");
    setPetMood("dance1", message || "Desk rave initiated. Nobody cleared this with HR.", status || "dance // floor tiles under review", "dance");
    runDesktopZoomies();

    petDanceTimer = window.setInterval(function () {
      frameIndex = (frameIndex + 1) % frames.length;
      setPetFace(frames[frameIndex]);
    }, 160);

    schedulePetFinish(
      2900,
      "idle",
      "Zoomies complete. Maggie is back on patrol and pretending that counted as operational work.",
      "idle // post-zoomies recovery",
      "maggie // glitter still in fur",
      "idle"
    );
  }

  function runFetchRoutine() {
    var routine = pickRandom(petFetchLibrary);
    var frames = ["hype", "fetch1", "fetch2", "fetch1"];
    var frameIndex = 0;

    clearPetTimers();
    clearPetEffects();

    if (petWindow) {
      petWindow.classList.add("pet-shell--fetch");
    }

    setPetTrick(routine.trick);
    setPetMood("hype", routine.intro, routine.status, "fetch");
    runFetchAcrossDesktop();

    petDanceTimer = window.setInterval(function () {
      frameIndex = (frameIndex + 1) % frames.length;
      setPetFace(frames[frameIndex]);
    }, 160);

    schedulePetFinish(
      2800,
      "idle",
      routine.finish,
      "idle // ball returned, ego intact",
      "maggie // tennis ball rearmed",
      "idle"
    );
  }

  function runMagicRoutine(trigger) {
    var routines = petMagicLibrary[trigger] || petMagicLibrary.default;
    var routine = pickRandom(routines);

    clearPetTimers();
    clearPetEffects();

    if (petWindow) {
      petWindow.classList.add("pet-shell--magic", "pet-shell--vanish");
    }

    setPetTrick(routine.trick);
    setPetMood("magic", routine.intro, routine.status, "magic");

    petPhaseTimer = window.setTimeout(function () {
      setPetFace(routine.revealFace);
    }, 360);

    schedulePetFinish(
      2100,
      "idle",
      routine.finish,
      "idle // miracle billed separately",
      "maggie // top hat reloaded",
      "idle"
    );
  }

  function tellPetJoke() {
    var joke = pickRandom(petJokes);

    clearPetTimers();
    clearPetEffects();

    if (petWindow) {
      petWindow.classList.add("pet-shell--laughing");
    }

    setPetTrick("joke // enterprise-approved nonsense");
    setPetMood("laugh", joke, "laugh // professionalism suspended", "laugh");

    schedulePetFinish(
      5200,
      "idle",
      "Comedy routine complete. Maggie is now pleased with herself for all the wrong reasons.",
      "idle // joke quota reset",
      "maggie // one bad joke remaining",
      "idle"
    );
  }

  function setStartMenu(open) {
    if (!startButton || !startMenu) {
      return;
    }

    startMenu.hidden = !open;
    startButton.setAttribute("aria-expanded", open ? "true" : "false");
    startButton.classList.toggle("start-btn--active", open);
  }

  function updateClock() {
    if (!taskbarClock) {
      return;
    }

    var now = new Date();
    taskbarClock.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatTime(totalSeconds) {
    if (!isFinite(totalSeconds) || totalSeconds < 0) {
      return "00:00";
    }

    var minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    var seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
    return minutes + ":" + seconds;
  }

  function syncTimer() {
    if (winampTimer && audio) {
      winampTimer.textContent = formatTime(audio.currentTime);
    }
  }

  function syncTrackMeta(prefix) {
    var track = playlist[trackIndex];

    if (winampStatus) {
      winampStatus.textContent = prefix + " - " + track.title;
    }

    if (winampTrack) {
      winampTrack.textContent = track.title + " // systems.fm";
    }
  }

  function loadTrack(index) {
    if (!audio) {
      return;
    }

    trackIndex = (index + playlist.length) % playlist.length;
    audio.src = playlist[trackIndex].url;
    audio.load();
    syncTimer();
    syncTrackMeta("READY");
  }

  function playCurrentTrack() {
    if (!audio) {
      return;
    }

    if (!audio.src) {
      loadTrack(trackIndex);
    }

    audio.play().then(function () {
      if (winampWindow) {
        winampWindow.classList.add("winamp--playing");
      }
      syncTrackMeta("PLAYING");
      runDanceRoutine("Winamp popped on. Maggie has interpreted this as permission for premium zoomies.", "dance // visualizer approved", "maggie // winamp-certified zoomies");
    }).catch(function () {
      if (winampWindow) {
        winampWindow.classList.remove("winamp--playing");
      }
      syncTrackMeta("PLAY ERROR");
      setPetMood("smug", "Browser blocked autoplay. Hit play again and it should cave.", "smug // browser drama detected");
    });
  }

  function pauseCurrentTrack() {
    if (!audio) {
      return;
    }

    audio.pause();
    if (winampWindow) {
      winampWindow.classList.remove("winamp--playing");
    }
    syncTrackMeta("PAUSED");
    setPetMood("blink", "Paused. The desktop is pretending to be quiet.", "idle // no beat to dance to");
  }

  function nextTrack() {
    loadTrack(trackIndex + 1);
    playCurrentTrack();
    setPetStatus("hype // skipping tracks");
  }

  function openWindow(windowElement) {
    if (!windowElement) {
      return;
    }

    windowElement.classList.remove("window--closed", "window--minimized");
  }

  function pulseDeniedClose(windowElement) {
    windowElement.classList.remove("window--deny-close");
    void windowElement.offsetWidth;
    windowElement.classList.add("window--deny-close");
    window.setTimeout(function () {
      windowElement.classList.remove("window--deny-close");
    }, 240);
  }

  function handleWindowAction(button) {
    var action = button.getAttribute("data-window-action");
    var windowElement = button.closest(".window, .winamp");

    if (!windowElement) {
      return;
    }

    if (action === "minimize") {
      windowElement.classList.toggle("window--minimized");
      windowElement.classList.remove("window--closed");
      setPetMood(
        windowElement.classList.contains("window--minimized") ? "blink" : "idle",
        windowElement.classList.contains("window--minimized")
          ? "Minimized. Not gone. Just sulking in the taskbar."
          : "Restored. Back in business.",
        windowElement.classList.contains("window--minimized")
          ? "blink // compressed but operational"
          : "idle // back on desktop"
      );
      return;
    }

    if (action === "maximize") {
      windowElement.classList.remove("window--closed", "window--minimized");
      windowElement.classList.toggle("window--maximized");
      setPetMood(
        windowElement.classList.contains("window--maximized") ? "hype" : "idle",
        windowElement.classList.contains("window--maximized")
          ? "There. It popped out like a real window."
          : "Dropped it back into the desktop.",
        windowElement.classList.contains("window--maximized")
          ? "hype // popped into overlay mode"
          : "idle // docked again"
      );
      schedulePetFinish(
        1800,
        "idle",
        "Maggie has finished supervising the window chrome.",
        "idle // Maggie is patrolling the desktop",
        "maggie // chrome inspection complete",
        "idle"
      );
      return;
    }

    if (action === "close") {
      if (windowElement.classList.contains("window--maximized")) {
        windowElement.classList.remove("window--maximized", "window--closed");
        windowElement.classList.add("window--minimized");
        setPetMood("blink", "Popup parked. Close now behaves like minimize when a window is popped out.", "blink // popup tucked away");
        setPetTrick("maggie // popup folded into taskbar");
        schedulePetFinish(
          1800,
          "idle",
          "Overlay dismissed. Maggie returned it to the desktop politely enough.",
          "idle // Maggie is patrolling the desktop",
          "maggie // popup parking complete",
          "idle"
        );
        return;
      }

      pulseDeniedClose(windowElement);
      setPetMood("smug", pickRandom(closeQuips), "smug // close denied");
      setPetTrick("maggie // guarding the X button");
      schedulePetFinish(
        2200,
        "idle",
        "Window still here. Maggie considers that a win.",
        "idle // window lockdown restored",
        "maggie // decorative X neutralized",
        "idle"
      );
    }
  }

  function handlePetAction(action) {
    if (action === "poke") {
      var boop = pickRandom(petBoops);

      setPetMood(boop.face, boop.message, boop.status, "smug");
      setPetTrick(boop.trick);
      schedulePetFinish(
        1800,
        "idle",
        "Boop sequence archived. Maggie has resumed desktop patrol.",
        "idle // nose print fading",
        "maggie // tennis ball armed",
        "idle"
      );
      return;
    }

    if (action === "dance") {
      runDanceRoutine("Maggie has activated zoomies. This is now a canine performance issue.", "dance // zoomies in progress", "maggie // emergency zoomies");
      return;
    }

    if (action === "fetch") {
      runFetchRoutine();
      return;
    }

    if (action === "magic") {
      runMagicRoutine();
      return;
    }

    if (action === "joke") {
      tellPetJoke();
      return;
    }

    if (action === "help") {
      setPetTrick("maggie // stage directions loaded");
      setPetMood("hype", "Use maximize to pop windows out. Close is fake. Winamp is real. Start opens a menu. Maggie does tricks whenever she feels theatrically relevant.", "help // Maggie guidance mode");
      schedulePetFinish(
        3200,
        "idle",
        "Help desk closed. Maggie is back to emotional support and soft surveillance.",
        "idle // Maggie is patrolling the desktop",
        "maggie // help file chewed but readable",
        "idle"
      );
      return;
    }

    finishPetRoutine("idle", "Maggie.exe is running normally.", "idle // Maggie is patrolling the desktop", "maggie // tennis ball armed", "idle");
  }

  function triggerPetFromControl(triggerElement) {
    var text;

    if (!petWindow || !triggerElement || triggerElement.closest("#pet-window")) {
      return;
    }

    text = (triggerElement.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

    if (triggerElement.id === "start-btn" || text.indexOf("start") !== -1) {
      runMagicRoutine("menu");
      return;
    }

    if (text.indexOf("book") !== -1 || text.indexOf("calendar") !== -1 || text.indexOf("session") !== -1) {
      runMagicRoutine("calendar");
      return;
    }

    if (text.indexOf("audit") !== -1 || text.indexOf("tools") !== -1 || text.indexOf("install") !== -1) {
      runMagicRoutine("audit");
      return;
    }

    if (text.indexOf("about") !== -1 || text.indexOf("profile") !== -1) {
      runMagicRoutine("about");
      return;
    }

    if (text.indexOf("results") !== -1) {
      runMagicRoutine("results");
    }
  }

  function syncIconRail() {
    var currentY = window.scrollY || window.pageYOffset || 0;
    var horizontalFactor = Math.min(6, currentY * 0.006);
    var verticalFactor = Math.min(42, currentY * 0.05);
    var activeIndex = 0;
    var scanLine = currentY + window.innerHeight * 0.34;

    if (iconRail) {
      iconRail.style.setProperty("--rail-drift", Math.min(72, currentY * 0.09).toFixed(1) + "px");
    }

    iconLinks.forEach(function (link, index) {
      var direction = index % 2 === 0 ? 1 : -1;
      var xOffset = horizontalFactor * (0.4 + index * 0.05) * direction;
      var yOffset = verticalFactor + index * 6.5 + Math.sin(currentY * 0.014 + index * 0.8) * 5.4;
      link.style.setProperty("--slide-x", xOffset.toFixed(1) + "px");
      link.style.setProperty("--slide-y", yOffset.toFixed(1) + "px");
    });

    railTargets.forEach(function (item, index) {
      var sectionTop = item.target.getBoundingClientRect().top + currentY;

      if (sectionTop <= scanLine) {
        activeIndex = index;
      }
    });

    railTargets.forEach(function (item, index) {
      item.link.classList.toggle("icon-link--active", index === activeIndex);
    });
  }

  function getTopOffset() {
    var value = window.getComputedStyle(document.documentElement).getPropertyValue("--top-offset");
    var offset = parseFloat(value);

    return isFinite(offset) ? offset : 0;
  }

  function alignHashTarget() {
    var hash = window.location.hash;
    var target;
    var top;

    if (!hash || hash.length < 2) {
      return;
    }

    target = document.getElementById(decodeURIComponent(hash.slice(1)));

    if (!target) {
      return;
    }

    top = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) - getTopOffset() - 18;
    window.scrollTo(0, Math.max(0, top));
  }

  updateClock();
  syncIconRail();
  setPetTrick("maggie // tennis ball armed");
  setPetMood("idle", "Maggie.exe online. Click my face if you want a response.", "idle // Maggie is patrolling the desktop", "idle");
  scheduleIdleMischief();
  window.setTimeout(alignHashTarget, 80);
  window.setInterval(updateClock, 1000);
  window.addEventListener("scroll", syncIconRail, { passive: true });
  window.addEventListener("hashchange", function () {
    window.setTimeout(alignHashTarget, 20);
  });

  if (audio && volumeInput) {
    audio.volume = Number(volumeInput.value);
    loadTrack(0);

    playButton.addEventListener("click", playCurrentTrack);
    pauseButton.addEventListener("click", pauseCurrentTrack);
    nextButton.addEventListener("click", nextTrack);
    volumeInput.addEventListener("input", function () {
      audio.volume = Number(volumeInput.value);
    });

    audio.addEventListener("timeupdate", syncTimer);
    audio.addEventListener("ended", nextTrack);
    audio.addEventListener("error", function () {
      if (winampWindow) {
        winampWindow.classList.remove("winamp--playing");
      }
      syncTrackMeta("PLAY ERROR");
      setPetMood("smug", "That track failed. Hit next and I will route around it.", "smug // stream failure");
    });
  }

  document.querySelectorAll("[data-close]").forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-close");
      var target = document.getElementById(id);
      if (target) {
        target.style.display = "none";
        setPetMood("idle", "Dialog closed. One less fake emergency.", "idle // cleared a nuisance");
      }
    });
  });

  document.querySelectorAll("[data-window-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      handleWindowAction(button);
    });
  });

  document.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      var explicitWindowId = link.getAttribute("data-open-window");
      var targetId = explicitWindowId || link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      if (target.classList.contains("window") || target.classList.contains("winamp")) {
        openWindow(target);
      } else {
        var parentWindow = target.closest(".window, .winamp");
        if (parentWindow) {
          openWindow(parentWindow);
        }
      }
    });
  });

  if (petFace) {
    petFace.addEventListener("click", function () {
      var surprisePool = ["poke", "dance", "fetch", "magic", "joke"];

      if (petState === "magic") {
        surprisePool = ["fetch", "dance", "joke"];
      } else if (petState === "dance" || petState === "fetch") {
        surprisePool = ["magic", "joke", "poke"];
      } else if (petState === "smug") {
        surprisePool = ["dance", "fetch", "magic"];
      }

      handlePetAction(pickRandom(surprisePool));
    });
  }

  document.querySelectorAll("[data-pet-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      handlePetAction(button.getAttribute("data-pet-action"));
    });
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest(".start-btn, .start-item, .cta-primary, .cta-secondary, .launch-link, .icon-link, .status-tile, .task-btn");

    if (trigger) {
      triggerPetFromControl(trigger);
    }
  });

  if (startButton && startMenu) {
    startButton.addEventListener("click", function (event) {
      event.stopPropagation();
      setStartMenu(startMenu.hidden);
    });

    startMenu.addEventListener("click", function (event) {
      event.stopPropagation();
      if (event.target.closest("a")) {
        setStartMenu(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!startMenu.hidden && !startMenu.contains(event.target) && event.target !== startButton) {
        setStartMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setStartMenu(false);
      }
    });
  }
}());
