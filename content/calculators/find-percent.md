---
title: "N1 is what percent of N2 Calculator"
date: 2025-02-13
---

<p><code>Number1</code> is what percent of <code>Number2</code>:</p>

<form id="bmi-form">
  <label for="num1">Number 1:</label>
  <input type="number" id="num1" required>
  <label for="num2">Number 2:</label>
  <input type="number" id="num2" required>
  <button type="button" onclick="calculateBMI()">Calculate</button>
</form>

<p id="bmi-result"></p>

<script>
  function calculateBMI() {
    var numOne = document.getElementById('num1').value;
    var numTwo = document.getElementById('num2').value;
    if (numOne && numTwo) {
      var percent = (numOne / numTwo) * 100;
      document.getElementById('bmi-result').innerText = percent.toFixed(0) + '%';
    }
  }
</script>

<style>
  code {
    font-size: inherit;
    background-color: #eee;
    padding: 2px 4px;
    border-radius: 3px;
  }
</style>