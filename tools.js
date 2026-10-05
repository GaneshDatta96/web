(function () {
  function band(n) {
    if (n <= 6) return "0–6. Decision Cost may be modest in this lane. Watch a week. Try another lane.";
    if (n <= 12) return "7–12. The judgment load in this lane is material. List your top 8 recurring decisions. Mark each Automate, Assist, or Keep Human.";
    return "13–20. This lane is spending a lot of judgment. The next step is a Decision Cost Audit and one measured change.";
  }

  function hoursBack(rows) {
    return rows.reduce(function (sum, row) {
      return sum + (row.off ? row.hours : 0);
    }, 0);
  }

  if (band(0).indexOf("0–6") !== 0 || band(6).indexOf("0–6") !== 0 || band(7).indexOf("7–12") !== 0 || band(12).indexOf("7–12") !== 0 || band(13).indexOf("13–20") !== 0 || band(20).indexOf("13–20") !== 0) {
    throw new Error("score bands");
  }
  if (hoursBack([{ hours: 2, off: true }, { hours: 3, off: false }]) !== 2) {
    throw new Error("hours");
  }

  var labels = ["0 rarely", "1 sometimes", "2 often"];
  document.querySelectorAll("[data-q]").forEach(function (row, index) {
    var box = row.querySelector(".choices");
    labels.forEach(function (label, value) {
      var item = document.createElement("label");
      item.innerHTML = "<input type=\"radio\" name=\"q" + index + "\" value=\"" + value + "\"> " + label;
      box.appendChild(item);
    });
  });

  var scoreOut = document.querySelector("[data-score-out]");
  document.getElementById("score").addEventListener("change", function () {
    var picks = document.querySelectorAll("#score input:checked");
    if (picks.length < 10) {
      scoreOut.textContent = picks.length + " of 10 answered.";
      return;
    }
    var total = 0;
    picks.forEach(function (input) { total += Number(input.value); });
    scoreOut.textContent = total + " / 20. " + band(total);
  });

  var hourOut = document.querySelector("[data-hour-out]");
  function readHours() {
    var rows = [];
    var week = 0;
    document.querySelectorAll(".hour-row").forEach(function (row) {
      var hours = Number(row.querySelector("[data-hour]").value) || 0;
      var off = row.querySelector("[data-off]").checked;
      week += hours;
      rows.push({ hours: hours, off: off });
    });
    var back = hoursBack(rows);
    var rate = Number(document.querySelector("[data-rate]").value) || 0;
    var text = week + " hours a week on these four. " + back + " of those hours leave your list. That is " + (back * 4) + " hours in four weeks.";
    if (rate > 0) text += " At the rate you typed, those hours are " + Math.round(back * 4 * rate) + ".";
    hourOut.textContent = text;
  }
  document.getElementById("hours").addEventListener("input", readHours);
  readHours();
})();
