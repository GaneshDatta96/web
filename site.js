(function () {
  var clock = document.getElementById("taskbar-clock");
  if (clock) {
    var tick = function () {
      clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    };
    tick();
    window.setInterval(tick, 10000);
  }

  fetch("media/latest-reel.json")
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) {
      if (!data || !data.permalink) return;
      document.querySelectorAll("[data-latest-reel]").forEach(function (link) {
        link.href = data.permalink;
      });
    })
    .catch(function () {});

  var reels = document.querySelector("[data-reels]");
  if (reels) {
    var row = reels.querySelector(".reel-row");
    var clips = row.querySelectorAll("video");
    var reelReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var reelLocked = false;
    function reelStep() {
      var card = row.querySelector("figure");
      var step = card ? card.getBoundingClientRect().width + 16 : 256;
      var max = row.scrollWidth - row.clientWidth;
      var left = row.scrollLeft >= max - 4 ? 0 : Math.min(max, row.scrollLeft + step);
      row.scrollTo({ left: left, behavior: reelReduce ? "auto" : "smooth" });
    }
    function setSound(button, muted) {
      button.classList.toggle("is-muted", muted);
      button.setAttribute("aria-pressed", muted ? "false" : "true");
      button.setAttribute("aria-label", muted ? "Unmute" : "Mute");
    }
    function muteClip(clip) {
      clip.muted = true;
      var button = clip.closest("figure").querySelector("[data-reel-sound]");
      if (button) setSound(button, true);
    }
    function syncClip(clip, visible) {
      if (reelReduce || !visible) {
        clip.pause();
        if (!visible) muteClip(clip);
        return;
      }
      clip.play().catch(function () {});
    }
    reels.querySelectorAll("[data-reel-sound]").forEach(function (button) {
      button.addEventListener("click", function () {
        var clip = button.closest("figure").querySelector("video");
        var turnOn = clip.muted;
        clips.forEach(muteClip);
        if (!turnOn) return;
        clip.muted = false;
        setSound(button, false);
        clip.play().catch(function () {});
      });
    });
    if ("IntersectionObserver" in window) {
      var watcher = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          syncClip(entry.target, entry.isIntersecting && entry.intersectionRatio >= 0.55);
        });
      }, { threshold: [0, 0.55, 1] });
      clips.forEach(function (clip) { watcher.observe(clip); });
    }
    reels.querySelector("[data-reel-prev]").addEventListener("click", function (event) {
      if (event.isTrusted) reelLocked = true;
      var card = row.querySelector("figure");
      var step = card ? card.getBoundingClientRect().width + 16 : 256;
      row.scrollTo({ left: Math.max(0, row.scrollLeft - step), behavior: "smooth" });
    });
    reels.querySelector("[data-reel-next]").addEventListener("click", function (event) {
      if (event.isTrusted) reelLocked = true;
      reelStep();
    });
    if (!reelReduce) {
      var reelTimer = window.setInterval(function () {
        if (!reelLocked) reelStep();
      }, 7000);
      reels.addEventListener("pointerenter", function () { window.clearInterval(reelTimer); reelTimer = null; });
      reels.addEventListener("pointerleave", function () {
        if (reelLocked || reelTimer) return;
        reelTimer = window.setInterval(function () {
          if (!reelLocked) reelStep();
        }, 7000);
      });
    }
  }

  var home = document.querySelector("[data-home]");
  if (!home) return;

  document.querySelectorAll("[data-switch]").forEach(function (group) {
    var buttons = group.querySelectorAll("[data-key]");
    var panes = group.querySelectorAll("[data-pane]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var key = button.getAttribute("data-key");
        buttons.forEach(function (item) {
          var on = item === button;
          item.classList.toggle("is-on", on);
          item.setAttribute("aria-selected", on ? "true" : "false");
        });
        panes.forEach(function (pane) {
          pane.hidden = pane.getAttribute("data-pane") !== key;
        });
      });
    });
  });

  var bar = document.querySelector("[data-progress]");
  if (bar) {
    var onScroll = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var hero = document.querySelector(".hero");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reel = document.querySelector(".hero-portrait video");
  var sound = document.querySelector("[data-sound]");
  if (reel) {
    if (reduce) {
      reel.removeAttribute("autoplay");
      reel.pause();
    }
    if (sound) {
      sound.addEventListener("click", function () {
        reel.muted = !reel.muted;
        if (reel.paused) reel.play();
        sound.classList.toggle("is-muted", reel.muted);
        sound.setAttribute("aria-pressed", reel.muted ? "false" : "true");
        sound.setAttribute("aria-label", reel.muted ? "Unmute" : "Mute");
      });
    }
  }
  if (hero && !reduce) {
    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + "%");
      hero.style.setProperty("--my", ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + "%");
    });
  }

  var stepMs = 4000;
  var stagger = 0;

  function arm(group, tick) {
    if (reduce) return;
    var timer = null;
    var locked = false;
    function start() {
      if (locked || timer) return;
      timer = window.setInterval(tick, stepMs);
      group.classList.add("is-cycling");
    }
    function pause() {
      if (timer) window.clearInterval(timer);
      timer = null;
      group.classList.remove("is-cycling");
    }
    group.addEventListener("pointerenter", pause);
    group.addEventListener("pointerleave", function () {
      if (!locked) start();
    });
    group.addEventListener("focusin", pause);
    group.addEventListener("focusout", function (event) {
      if (!locked && !group.contains(event.relatedTarget)) start();
    });
    group.addEventListener("click", function (event) {
      if (event.isTrusted) {
        locked = true;
        pause();
      }
    });
    window.setTimeout(start, stagger);
    stagger += 650;
  }

  document.querySelectorAll("[data-switch][data-evolve]").forEach(function (group) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-key]"));
    if (buttons.length < 2) return;
    arm(group, function () {
      var current = 0;
      buttons.forEach(function (button, index) {
        if (button.classList.contains("is-on")) current = index;
      });
      buttons[(current + 1) % buttons.length].click();
    });
  });

  document.querySelectorAll("[data-cycle]").forEach(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll("[data-step]"));
    if (items.length < 2) return;
    var index = 0;
    items.forEach(function (item, itemIndex) {
      if (item.classList.contains("is-live")) index = itemIndex;
      if (item.tagName !== "A") {
        item.tabIndex = 0;
        item.setAttribute("role", "button");
      }
    });
    function show(next) {
      index = next;
      items.forEach(function (item, itemIndex) {
        var on = itemIndex === next;
        item.classList.toggle("is-live", on);
        if (item.getAttribute("role") === "button") item.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    items.forEach(function (item, itemIndex) {
      item.addEventListener("click", function () { show(itemIndex); });
      if (item.tagName !== "A") {
        item.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          show(itemIndex);
        });
      }
    });
    group.style.setProperty("--evolve", stepMs + "ms");
    arm(group, function () {
      show((index + 1) % items.length);
    });
  });

  var leakConsole = document.querySelector(".console");
  if (leakConsole) {
    var syncNodes = function () {
      var active = leakConsole.querySelector("[data-key].is-on");
      var key = active ? active.getAttribute("data-key") : "";
      leakConsole.querySelectorAll("[data-node]").forEach(function (node) {
        node.classList.toggle("is-hot", node.getAttribute("data-node") === key);
      });
    };
    leakConsole.addEventListener("click", syncNodes);
    syncNodes();
  }
})();
