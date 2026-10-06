const checkButton = document.getElementById("check-button");
const result = document.getElementById("result");

checkButton.addEventListener("click", function () {
  const boxes = document.querySelectorAll("input[type=checkbox]");
  let count = 0;

  for (const box of boxes) {
    if (box.checked) {
      count = count + 1;
    }
  }

  if (count > 0) {
    result.textContent = "You noticed " + count + " sign(s) that are linked to PCOS. Please talk to a doctor. Many other conditions can cause these signs, so only a doctor can tell.";
  } else {
    result.textContent = "You ticked nothing. If you notice any change that is not normal for you, talk to a doctor.";
  }
});
const saveButton = document.getElementById("save-button");
const dateInput = document.getElementById("period-date");
const cyclesList = document.getElementById("cycles");

let periods = JSON.parse(localStorage.getItem("periods") || "[]");

saveButton.addEventListener("click", function () {
  if (dateInput.value === "") {
    return;
  }
 if (periods.includes(dateInput.value)) {
  summary.textContent = "That date is already saved.";
  return;
}
 periods.push(dateInput.value);
  periods.sort();
localStorage.setItem("periods", JSON.stringify(periods));
  showPeriods();
  showSummary();
});

function showPeriods() {
  cyclesList.innerHTML = "";
  for (const date of periods) {
    const item = document.createElement("li");
    item.textContent = date;
    cyclesList.appendChild(item);
  }
}
const summary = document.getElementById("cycle-summary");

function showSummary() {
  if (periods.length < 2) {
    summary.textContent = "Add at least 2 dates to see your cycle length.";
    return;
  }

  const gaps = [];
  let total = 0;

  for (let i = 1; i < periods.length; i++) {
    const earlier = new Date(periods[i - 1]);
    const later = new Date(periods[i]);
    const days = Math.round((later - earlier) / (1000 * 60 * 60 * 24));
    gaps.push(days);
    total = total + days;
  }

  const average = Math.round(total / gaps.length);
  let outside = 0;
  for (const gap of gaps) {
    if (gap < 21 || gap > 35) {
      outside = outside + 1;
    }
  }

  let message = "Days between periods: " + gaps.join(", ") + ". Average: " + average + " days. ";

  if (outside > 0) {
    message = message + outside + " of " + gaps.length + " cycles were outside the usual 21 to 35 day range. Irregular cycles can be one sign of PCOS, and they have other causes too. Please consider talking to a doctor.";
  } else {
    message = message + "All your cycles are within the usual 21 to 35 day range. This is not a diagnosis. If you have other concerns, talk to a doctor.";
  }

  summary.textContent = message;
}
const waterButton = document.getElementById("water-button");
const waterInterval = document.getElementById("water-interval");
const waterStatus = document.getElementById("water-status");

let waterTimer = null;

waterButton.addEventListener("click", function () {
  if (waterTimer !== null) {
    clearInterval(waterTimer);
  }

  const minutes = Number(waterInterval.value);

  waterStatus.textContent =
    "Water reminder started. You will be reminded every " +
    minutes +
    " minutes.";

  waterTimer = setInterval(function () {
    notify("💧 Time for a water break!");
  }, minutes * 60 * 1000);
});
const medicineButton = document.getElementById("medicine-button");
const medicineName = document.getElementById("medicine-name");
const medicineTime = document.getElementById("medicine-time");
const medicineStatus = document.getElementById("medicine-status");
let medicineTimer = null;

medicineButton.addEventListener("click", function () {
  const name = medicineName.value.trim();
  const time = medicineTime.value;

  if (name === "" || time === "") {
    medicineStatus.textContent =
      "Please enter the medicine name and reminder time.";
    return;
  }

  medicineStatus.textContent =
    "Reminder set for " + name + " at " + time + ".";

  const now = new Date();
  const target = new Date();

  const parts = time.split(":");
  target.setHours(Number(parts[0]));
  target.setMinutes(Number(parts[1]));
  target.setSeconds(0);
  target.setMilliseconds(0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  medicineTimer = setTimeout(function () {
    notify("💊 Medicine reminder: " + name);
  }, delay);
});
const bmiButton = document.getElementById("bmi-button");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const bmiResult = document.getElementById("bmi-result");

bmiButton.addEventListener("click", function () {
  const height = Number(heightInput.value);
  const weight = Number(weightInput.value);

  if (height <= 0 || weight <= 0) {
    bmiResult.textContent =
      "Please enter a valid height and weight.";
    return;
  }

  const heightInMetres = height / 100;
  const bmi = weight / (heightInMetres * heightInMetres);

  bmiResult.textContent =
    "Your estimated BMI is " +
    bmi.toFixed(1) +
    ". This number is only a general screening measure and is not a diagnosis.";
});


// ===============================
// STOP WATER REMINDER
// ===============================

document
  .getElementById("stop-water-button")
  .addEventListener("click", function () {

    if (waterTimer !== null) {
      clearInterval(waterTimer);
      waterTimer = null;
    }

    document.getElementById("water-status").textContent =
      "Water reminder is currently off.";

    document.getElementById("water-button").textContent =
      "Start Water Reminder";
  });



// ===============================
// STOP MEDICINE REMINDER
// ===============================

document
  .getElementById("stop-medicine-button")
  .addEventListener("click", function () {

    if (medicineTimer !== null) {
      clearTimeout(medicineTimer);
      medicineTimer = null;
    }

    document.getElementById("medicine-status").textContent =
      "Medicine reminder is currently off.";
  });
showPeriods();
showSummary();

document.getElementById("clear-dates-button").addEventListener("click", function () {
  periods = [];
  localStorage.removeItem("periods");
  showPeriods();
  showSummary();
});

function notify(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message);
  } else {
    alert(message);
  }
}

function askPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

document.getElementById("water-button").addEventListener("click", askPermission);
document.getElementById("medicine-button").addEventListener("click", askPermission);