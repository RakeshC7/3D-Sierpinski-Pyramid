/*
* ============================================================================
* CANVAS SETUP
* ============================================================================
*/

/**
 * Resize canvas to match display size with proper pixel ratio
 * @param {HTMLCanvasElement} canvas - The canvas element to resize
 */
function resize_canvas(canvas) {
  var dpr = window.devicePixelRatio || 1;
  var displayWidth = window.innerWidth;
  var displayHeight = window.innerHeight;
  
  // Set actual canvas size in pixels (scaled by devicePixelRatio for crisp rendering)
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  
  // Set CSS size to display size (so canvas appears at correct size on screen)
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';
  
  // Update WebGL viewport if context exists
  if (gl && gl.viewportWidth !== undefined) {
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  }
}

/**
 * Create and return the WebGL canvas element
 */
function create_canvas() {
  // Check if canvas already exists
  var canvas = document.getElementById("webgl_canvas");
  if (canvas) {
    resize_canvas(canvas);
    return canvas;
  }
  
  // Create new canvas if it doesn't exist
  canvas = document.createElement("canvas");
  canvas.id = "webgl_canvas";
  resize_canvas(canvas);
  document.body.appendChild(canvas);
  
  // Handle window resize
  window.addEventListener("resize", function() {
    resize_canvas(canvas);
  });
  
  return canvas;
}

// Create canvas immediately when module loads
var canvas = create_canvas();

