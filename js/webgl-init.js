/*
* ============================================================================
* WEBGL INITIALIZATION
* ============================================================================
*/

/**
 * Initialize WebGL context and configure rendering settings
 * @param {HTMLCanvasElement} canvas - The canvas element to initialize
 */
function initGL(canvas) {
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (error) {
    window.location.assign("http://get.webgl.org/");
  }
  if (!gl) {
    window.location.assign("http://get.webgl.org/");
  }
}

