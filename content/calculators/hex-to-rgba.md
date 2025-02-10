---
title: "Hex to RGBA Calculator"
date: 2025-02-09
---

<p>Convert a hex color to RGBA or RGBA to hex below:</p>

<form id="color-form">
  <label for="hex">Hex:</label>
  <input type="text" id="hex" required>
  <label for="rgba">RGBA:</label>
  <input type="text" id="rgba" required>
</form>

<div id="color-preview" style="width: 50px; height: 50px; border: 1px solid #000;"></div>

<p id="color-result"></p>

<script>
function hexToRgba(hex) {
  // Remove the leading '#' if present
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b, and a values
  let r, g, b, a = 1;

  if (hex.length === 3) {
    // Handle shorthand hex notation (e.g., #abc)
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Handle standard hex notation (e.g., #aabbcc)
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (hex.length === 8) {
    // Handle hex notation with alpha (e.g., #aabbccdd)
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = parseInt(hex.substring(6, 8), 16) / 255;
  } else {
    throw new Error('Invalid hex color format');
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function rgbaToHex(rgba) {
  const parts = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/);
  if (!parts) {
    throw new Error('Invalid RGBA color format');
  }

  const r = parseInt(parts[1]).toString(16).padStart(2, '0');
  const g = parseInt(parts[2]).toString(16).padStart(2, '0');
  const b = parseInt(parts[3]).toString(16).padStart(2, '0');
  const a = parts[4] ? Math.round(parseFloat(parts[4]) * 255).toString(16).padStart(2, '0') : '';

  return `#${r}${g}${b}${a}`;
}

function updateColorPreview(color) {
  document.getElementById('color-preview').style.backgroundColor = color;
}

document.getElementById('hex').addEventListener('input', function() {
  const hex = document.getElementById('hex').value;
  try {
    const rgba = hexToRgba(hex);
    document.getElementById('rgba').value = rgba;
    updateColorPreview(rgba);
  } catch (error) {
    document.getElementById('rgba').value = 'Invalid hex color format';
    updateColorPreview('transparent');
  }
});

document.getElementById('rgba').addEventListener('input', function() {
  const rgba = document.getElementById('rgba').value;
  try {
    const hex = rgbaToHex(rgba);
    document.getElementById('hex').value = hex;
    updateColorPreview(rgba);
  } catch (error) {
    document.getElementById('hex').value = 'Invalid RGBA color format';
    updateColorPreview('transparent');
  }
});
</script>