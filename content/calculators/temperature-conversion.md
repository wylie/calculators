---
title: "Temperature Conversions"
date: 2025-02-09
---

<p>If you know a temperature in celsius, farenheit, or kelvin, show what the other values would be.</p>

<form id="bmi-form">
  <label for="celsius">Celsius:</label>
  <input type="number" id="celsius" required>
  <label for="farenheit">Farenheit:</label>
  <input type="number" id="farenheit" required>
  <label for="kelvin">Kelvin:</label>
  <input type="number" id="kelvin" required>
</form>

<script>
  const celsius = document.getElementById('celsius');
  const farenheit = document.getElementById('farenheit');
  const kelvin = document.getElementById('kelvin');
  celsius.addEventListener('input', function(){
    const celsiusValue = parseFloat(celsius.value);
    farenheit.value = ((celsiusValue * 9/5) + 32).toFixed(2);
    kelvin.value = (celsiusValue + 273.15).toFixed(2);
  });
  farenheit.addEventListener('input', function(){
    const farenheitValue = parseFloat(farenheit.value);
    celsius.value = ((farenheitValue - 32) * 5/9).toFixed(2);
    kelvin.value = (((farenheitValue - 32) * 5/9) + 273.15).toFixed(2);
  });
  kelvin.addEventListener('input', function(){
    const kelvinValue = parseFloat(kelvin.value);
    celsius.value = (kelvinValue - 273.15).toFixed(2);
    farenheit.value = ((celsius.value * 9/5) + 32).toFixed(2);
  });
</script>