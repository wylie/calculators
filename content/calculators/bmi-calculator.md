---
title: "BMI Calculator"
date: 2025-02-08
---

<p>Calculate your Body Mass Index (BMI) below:</p>

<form id="bmi-form">
  <label for="weight">Weight:</label>
  <input type="number" id="weight" required>
  <select id="weight-unit">
    <option value="lbs">lbs</option>
    <option value="kg">kg</option>
  </select>
  <label for="height">Height:</label>
  <input type="number" id="height" required>
  <select id="height-unit">
    <option value="ft">ft</option>
    <option value="m">m</option>
  </select>
  <button type="button" onclick="calculateBMI()">Calculate</button>
</form>

<p id="bmi-result"></p>

<script>
  function calculateBMI() {
    var weight = document.getElementById('weight').value;
    var height = document.getElementById('height').value;
    var weightUnit = document.getElementById('weight-unit').value;
    var heightUnit = document.getElementById('height-unit').value;

    if (weight && height) {
      if (weightUnit === 'lbs') {
        weight = weight * 0.453592; // convert lbs to kg
      }
      if (heightUnit === 'ft') {
        height = height * 0.3048; // convert ft to m
      }
      var bmi = weight / (height * height);
      document.getElementById('bmi-result').innerText = "Your BMI is " + bmi.toFixed(2);
    }
  }
</script>