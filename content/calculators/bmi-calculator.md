---
title: "BMI Calculator"
date: 2025-02-08
---

<p>Calculate your Body Mass Index (BMI) below:</p>

<form id="bmi-form">
  <label for="weight">Weight (kg):</label>
  <input type="number" id="weight" required>
  <label for="height">Height (m):</label>
  <input type="number" id="height" required>
  <button type="button" onclick="calculateBMI()">Calculate</button>
</form>

<p id="bmi-result"></p>

<script>
  function calculateBMI() {
    var weight = document.getElementById('weight').value;
    var height = document.getElementById('height').value;
    if (weight && height) {
      var bmi = weight / (height * height);
      document.getElementById('bmi-result').innerText = "Your BMI is " + bmi.toFixed(2);
    }
  }
</script>