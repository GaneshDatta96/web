(function () {
  var taskbarClock = document.getElementById("taskbar-clock");
  var winampTimer = document.getElementById("winamp-timer");
  var seconds = 18;

  function updateClock() {
    var now = new Date();
    taskbarClock.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function updateTimer() {
    var mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    var secs = String(seconds % 60).padStart(2, "0");
    winampTimer.textContent = mins + ":" + secs;
    seconds += 1;
  }

  updateClock();
  updateTimer();
  window.setInterval(updateClock, 1000);
  window.setInterval(updateTimer, 1000);

  document.querySelectorAll("[data-close]").forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-close");
      var target = document.getElementById(id);
      if (target) {
        target.style.display = "none";
      }
    });
  });
}());
