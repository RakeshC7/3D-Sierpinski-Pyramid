/*
* ============================================================================
* VISUAL EFFECTS & COLOR CONTROLS
* ============================================================================
*/

// Color transformation parameters
var hue_shift = 0.0;
var saturation = 1.0;
var contrast = 1.0;
var invert_colors = false;
var color_override = null; // [r, g, b] or null

/**
 * Convert RGB to HSV
 */
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s, v];
}

/**
 * Convert HSV to RGB
 */
function hsvToRgb(h, s, v) {
  h /= 360;
  var r, g, b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Apply color transformations to vertex colors
 */
function apply_color_transformations(colors) {
  var transformed = [];
  for (var i = 0; i < colors.length; i += 4) {
    var r = colors[i];
    var g = colors[i + 1];
    var b = colors[i + 2];
    var a = colors[i + 3];

    // Convert to HSV for hue/saturation adjustments (before color override)
    var rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    
    // Apply hue shift
    hsv[0] = (hsv[0] + hue_shift) % 360;
    
    // Apply saturation
    hsv[1] = Math.max(0, Math.min(1, hsv[1] * saturation));
    
    // Convert back to RGB
    rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);
    r = rgb[0] / 255.0;
    g = rgb[1] / 255.0;
    b = rgb[2] / 255.0;

    // Apply color override if set (after hue/saturation)
    if (color_override) {
      r = color_override[0] / 255.0;
      g = color_override[1] / 255.0;
      b = color_override[2] / 255.0;
    }

    // Apply contrast
    r = ((r - 0.5) * contrast) + 0.5;
    g = ((g - 0.5) * contrast) + 0.5;
    b = ((b - 0.5) * contrast) + 0.5;

    // Apply invert
    if (invert_colors) {
      r = 1.0 - r;
      g = 1.0 - g;
      b = 1.0 - b;
    }

    // Clamp values
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    b = Math.max(0, Math.min(1, b));

    transformed.push(r, g, b, a);
  }
  return transformed;
}
