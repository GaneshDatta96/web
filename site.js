(function () {
  var taskbarClock = document.getElementById("taskbar-clock");
  var petMessage = document.getElementById("pet-message");
  var audio = document.getElementById("winamp-audio");
  var winampStatus = document.getElementById("winamp-status");
  var winampTimer = document.getElementById("winamp-timer");
  var volumeInput = document.getElementById("winamp-volume");
  var playButton = document.getElementById("winamp-play");
  var pauseButton = document.getElementById("winamp-pause");
  var nextButton = document.getElementById("winamp-next");
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

  function setPetMessage(text) {
    if (petMessage) {
      petMessage.textContent = text;
    }
  }

  function updateClock() {
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
    winampTimer.textContent = formatTime(audio.currentTime);
  }

  function syncStatus(prefix) {
    var track = playlist[trackIndex];
    winampStatus.textContent = prefix + " - " + track.title;
  }

  function loadTrack(index) {
    trackIndex = (index + playlist.length) % playlist.length;
    audio.src = playlist[trackIndex].url;
    audio.load();
    syncTimer();
    syncStatus("READY");
  }

  function playCurrentTrack() {
    if (!audio.src) {
      loadTrack(trackIndex);
    }

    audio.play().then(function () {
      syncStatus("PLAYING");
      setPetMessage("Winamp is live. Sound should be coming through now.");
    }).catch(function () {
      syncStatus("PLAY ERROR");
      setPetMessage("The browser blocked audio. Hit play again.");
    });
  }

  function pauseCurrentTrack() {
    audio.pause();
    syncStatus("PAUSED");
    setPetMessage("Paused. The desktop is quiet again.");
  }

  function nextTrack() {
    loadTrack(trackIndex + 1);
    playCurrentTrack();
    setPetMessage("Skipping to the next loop.");
  }

  function openWindow(windowElement) {
    windowElement.classList.remove("window--closed", "window--minimized");
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
      setPetMessage(windowElement.classList.contains("window--minimized")
        ? "Window minimized. Use the taskbar or section links to bring it back."
        : "Window restored.");
      return;
    }

    if (action === "maximize") {
      windowElement.classList.remove("window--closed", "window--minimized");
      windowElement.classList.toggle("window--maximized");
      setPetMessage(windowElement.classList.contains("window--maximized")
        ? "Maximized. More room, same system."
        : "Back to normal size.");
      return;
    }

    if (action === "close") {
      windowElement.classList.remove("window--maximized", "window--minimized");
      windowElement.classList.add("window--closed");
      setPetMessage("Window closed. Reopen it from the taskbar or by jumping to that section.");
    }
  }

  updateClock();
  window.setInterval(updateClock, 1000);

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
    syncStatus("PLAY ERROR");
    setPetMessage("That track failed to load. Hit next and I will swap it.");
  });

  document.querySelectorAll("[data-close]").forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-close");
      var target = document.getElementById(id);
      if (target) {
        target.style.display = "none";
        setPetMessage("Dialog closed. One less bottleneck on screen.");
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
}());
