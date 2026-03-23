(function () {
  var taskbarClock = document.getElementById("taskbar-clock");
  var petMessage = document.getElementById("pet-message");
  var petStatus = document.getElementById("pet-status");
  var petTrick = document.getElementById("pet-trick");
  var petGlyph = document.getElementById("pet-glyph");
  var petFace = document.getElementById("pet-face");
  var petWindow = document.getElementById("pet-window");
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
  var iconLinks = Array.prototype.slice.call(document.querySelectorAll(".icon-link"));
  var closeQuips = [
    "Nope. Not allowed. This desktop has attachment issues.",
    "Cute try. We do not close revenue infrastructure here.",
    "Negative. That X is decorative management theater.",
    "No closing windows. You can minimize your feelings instead."
  ];
  var playlist = [
    {
      title: "Operator Loop 01",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      title: "Operator Loop 02",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      title: "Operator Loop 03",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ];
  var trackIndex = 0;
  var petFaces = {
    idle: " /\\_/\\\\\n( o.o )\n > ^ <",
    blink: " /\\_/\\\\\n( -.- )\n > ^ <",
    smug: " /\\_/\\\\\n( -_~ )\n > ^ <",
    hype: " /\\_/\\\\\n( 0.0 )\n / ^ \\\\",
    dance1: " /\\_/\\\\\n( ^.^ )\n / > \\\\",
    dance2: " /\\_/\\\\\n( ^o^ )\n \\\\ < /",
    dance3: " /\\_/\\\\\n( ^_^ )\n / < \\\\",
    magic: " /\\_/\\\\\n( *.* )\n /|_|\\\\",
    rabbit: " (\\_/)\n (o.o)\n />*<",
    laugh: " /\\_/\\\\\n( xD )\n > ^ <",
    dizzy: " /\\_/\\\\\n( @.@ )\n > ^ <"
  };
  var petMode = "idle";
  var petState = "idle";
  var petDanceTimer = 0;
  var petResetTimer = 0;
  var petPhaseTimer = 0;
  var petJokes = [
    "I audited the vibes. They were untagged, unassigned, and somehow in production.",
    "Your bottleneck and your calendar are in a committed relationship.",
    "I am not saying the workflow is haunted. I am saying it knows your password.",
    "Every manual follow-up is just a CRM asking for help in lowercase.",
    "I pulled a rabbit out of the funnel. It was qualified and still ghosted."
  ];

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

  function setPetFace(mode) {
    petMode = mode;
    if (petGlyph && petFaces[mode]) {
      petGlyph.textContent = petFaces[mode];
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
  }

  function clearPetEffects() {
    if (!petWindow) {
      return;
    }

    petWindow.classList.remove("pet-shell--dancing", "pet-shell--magic", "pet-shell--laughing", "pet-shell--vanish");
  }

  function finishPetRoutine(face, message, status, trick, state) {
    clearPetTimers();
    clearPetEffects();
    setPetTrick(trick || "stage // top hat armed");
    setPetMood(face || "idle", message, status, state);
  }

  function schedulePetFinish(delay, face, message, status, trick, state) {
    if (petResetTimer) {
      window.clearTimeout(petResetTimer);
    }

    petResetTimer = window.setTimeout(function () {
      finishPetRoutine(face, message, status, trick, state);
    }, delay);
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

    petDanceTimer = window.setInterval(function () {
      frameIndex = (frameIndex + 1) % frames.length;
      setPetFace(frames[frameIndex]);
    }, 160);

    schedulePetFinish(
      2400,
      "smug",
      "Show's over. I accept applause, snacks, and zero feedback forms.",
      "smug // encore denied",
      "stage // glitter still in RAM",
      "smug"
    );
  }

  function runMagicRoutine(trigger) {
    var routine;

    if (trigger === "menu") {
      routine = {
        intro: "I just pulled a whole Start menu out of one grey rectangle. Respect the craft.",
        status: "magic // menu-from-hat routine",
        trick: "trick // start menu from hat",
        revealFace: "smug",
        finish: "Menu safely returned to the hat. Warranty voided."
      };
    } else if (trigger === "calendar") {
      routine = {
        intro: "Behold. I have conjured a booking calendar and at least one timezone concern.",
        status: "magic // calendar materialized",
        trick: "trick // calendar from thin air",
        revealFace: "rabbit",
        finish: "The calendar has been stabilized. The rabbit refuses to do scheduling."
      };
    } else if (trigger === "audit") {
      routine = {
        intro: "Quick magic scan. I found three bottlenecks and one suspicious dependence on vibes.",
        status: "magic // bottleneck scan firing",
        trick: "trick // x-ray audit goggles",
        revealFace: "hype",
        finish: "Scan complete. Bad news: the bottleneck was not imaginary."
      };
    } else if (trigger === "about") {
      routine = {
        intro: "Performed a de-pixelation ritual. Biography restored. Identity mostly intact.",
        status: "magic // profile reveal spell",
        trick: "trick // de-pixelation ritual",
        revealFace: "rabbit",
        finish: "Profile loaded. Mystique preserved just enough."
      };
    } else if (trigger === "results") {
      routine = {
        intro: "Crystal ball says the result of fixing the system is still less chaos.",
        status: "magic // prediction engine online",
        trick: "trick // bottleneck of spades",
        revealFace: "smug",
        finish: "Prophecy complete. Shockingly, infrastructure still wins."
      };
    } else {
      routine = {
        intro: "Initiating low-budget miracle. Please lower your expectations to match the theatrics.",
        status: "magic // smoke and mirrors running",
        trick: "trick // smoke, mirrors, and confidence",
        revealFace: "rabbit",
        finish: "Magic complete. Nobody ask how the rabbit got into the CRM."
      };
    }

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
      "smug",
      routine.finish,
      "smug // miracle billed separately",
      "stage // top hat reloaded",
      "smug"
    );
  }

  function tellPetJoke() {
    var joke = petJokes[Math.floor(Math.random() * petJokes.length)];

    clearPetTimers();
    clearPetEffects();

    if (petWindow) {
      petWindow.classList.add("pet-shell--laughing");
    }

    setPetTrick("joke // enterprise-approved nonsense");
    setPetMood("laugh", joke, "laugh // professionalism suspended", "laugh");

    schedulePetFinish(
      2400,
      "smug",
      "Comedy routine complete. Please return to structured chaos.",
      "smug // bit exhausted",
      "stage // one bad joke remaining",
      "smug"
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
      runDanceRoutine("Winamp popped on. Tiny nightclub mode is now in effect.", "dance // visualizer approved", "routine // winamp-certified shuffle");
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
      return;
    }

    if (action === "close") {
      pulseDeniedClose(windowElement);
      setPetMood("smug", closeQuips[Math.floor(Math.random() * closeQuips.length)], "smug // close denied");
    }
  }

  function handlePetAction(action) {
    if (action === "poke") {
      setPetMood("smug", "Alright, alright. I am awake. Keep your hands to yourself.", "smug // poked by user");
      setPetTrick("stage // boundaries enabled");
      return;
    }

    if (action === "dance") {
      runDanceRoutine("Tiny dance routine loaded. This is what peak software looks like.", "dance // running tiny routine", "routine // emergency shimmy");
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
      setPetTrick("help // stage directions loaded");
      setPetMood("hype", "Use maximize to pop windows out. Close is fake. Winamp is real. Start opens a menu. Magic is, regrettably, available.", "help // user guidance mode");
      return;
    }

    finishPetRoutine("idle", "pet.exe is running normally.", "idle // watching the desktop", "stage // top hat armed", "idle");
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
    var horizontalFactor = Math.min(16, currentY * 0.018);
    var verticalFactor = Math.min(14, currentY * 0.016);

    iconLinks.forEach(function (link, index) {
      var direction = index % 2 === 0 ? 1 : -1;
      var xOffset = horizontalFactor * (0.72 + index * 0.12) * direction;
      var yOffset = verticalFactor + Math.sin(currentY * 0.014 + index * 0.65) * 4;
      link.style.setProperty("--slide-x", xOffset.toFixed(1) + "px");
      link.style.setProperty("--slide-y", yOffset.toFixed(1) + "px");
    });
  }

  updateClock();
  syncIconRail();
  setPetTrick("stage // top hat armed");
  setPetMood("idle", "pet.exe online. Click my face if you want a response.", "idle // watching the desktop", "idle");
  window.setInterval(updateClock, 1000);
  window.addEventListener("scroll", syncIconRail, { passive: true });

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
      if (petState === "idle") {
        handlePetAction("poke");
      } else if (petState === "smug") {
        handlePetAction("dance");
      } else if (petState === "dance") {
        handlePetAction("magic");
      } else if (petState === "magic") {
        handlePetAction("joke");
      } else {
        handlePetAction("help");
      }
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
