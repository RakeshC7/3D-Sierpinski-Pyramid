/*
* ============================================================================
* SHADER MANAGEMENT
* ============================================================================
*/

/**
 * Load and compile shader from HTML script tag
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {string} id - ID of the script tag containing shader code
 * @returns {WebGLShader|null} Compiled shader or null on error
 */
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

/**
 * Initialize shader program and set up attribute/uniform locations
 */
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  if (!fragmentShader || !vertexShader) {
    console.error("Failed to load shaders");
    return false;
  }

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders.");
    console.error(gl.getProgramInfoLog(shaderProgram));
    return false;
  }

  gl.useProgram(shaderProgram);

  // Attribute Locations
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexColor"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexNormal"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  // Uniform Locations
  shaderProgram.pMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uPMatrix"
  );
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix"
  );
  shaderProgram.nMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uNMatrix"
  );
  shaderProgram.ambientColorUniform = gl.getUniformLocation(
    shaderProgram,
    "uAmbientColor"
  );
  shaderProgram.pointLightLocationUniform = gl.getUniformLocation(
    shaderProgram,
    "uPointLightLocation"
  );
  shaderProgram.pointLightColorUniform = gl.getUniformLocation(
    shaderProgram,
    "uPointLightColor"
  );

  return true;
}

