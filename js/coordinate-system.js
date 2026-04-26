/*
* ============================================================================
* COORDINATE SYSTEM (AXES & GRID)
* ============================================================================
*/

/**
 * Generate coordinate axes geometry (X, Y, Z)
 */
function generate_axes() {
  var axis_length = 6.0;

  var axis_vertices = [
    -axis_length, 0.0, 0.0,
    axis_length, 0.0, 0.0,
    0.0, -axis_length, 0.0,
    0.0, axis_length, 0.0,
    0.0, 0.0, -axis_length,
    0.0, 0.0, axis_length
  ];

  var axis_colors = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0
  ];

  var axis_normals = [
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0
  ];

  axisVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_vertices), gl.STATIC_DRAW);
  axisVertexPositionBuffer.itemSize = 3;
  axisVertexPositionBuffer.numItems = axis_vertices.length / 3;

  axisVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_colors), gl.STATIC_DRAW);
  axisVertexColorBuffer.itemSize = 4;
  axisVertexColorBuffer.numItems = axis_colors.length / 4;

  axisVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_normals), gl.STATIC_DRAW);
  axisVertexNormalBuffer.itemSize = 3;
  axisVertexNormalBuffer.numItems = axis_normals.length / 3;
}

/**
 * Generate grid plane geometry on XZ plane
 */
function generate_grid() {
  var grid_size = 10.0;
  var grid_spacing = 1.0;
  var grid_vertices = [];
  var grid_colors = [];
  var grid_normals = [];

  var grid_color = [0.5, 0.5, 0.5, 0.6];
  var normal = [0.0, 1.0, 0.0];

  for (var z = -grid_size; z <= grid_size; z += grid_spacing) {
    grid_vertices.push(-grid_size, 0.0, z);
    grid_vertices.push(grid_size, 0.0, z);
    grid_colors.push(grid_color[0], grid_color[1], grid_color[2], grid_color[3]);
    grid_colors.push(grid_color[0], grid_color[1], grid_color[2], grid_color[3]);
    grid_normals.push(normal[0], normal[1], normal[2]);
    grid_normals.push(normal[0], normal[1], normal[2]);
  }

  for (var x = -grid_size; x <= grid_size; x += grid_spacing) {
    grid_vertices.push(x, 0.0, -grid_size);
    grid_vertices.push(x, 0.0, grid_size);
    grid_colors.push(grid_color[0], grid_color[1], grid_color[2], grid_color[3]);
    grid_colors.push(grid_color[0], grid_color[1], grid_color[2], grid_color[3]);
    grid_normals.push(normal[0], normal[1], normal[2]);
    grid_normals.push(normal[0], normal[1], normal[2]);
  }

  gridVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid_vertices), gl.STATIC_DRAW);
  gridVertexPositionBuffer.itemSize = 3;
  gridVertexPositionBuffer.numItems = grid_vertices.length / 3;

  gridVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid_colors), gl.STATIC_DRAW);
  gridVertexColorBuffer.itemSize = 4;
  gridVertexColorBuffer.numItems = grid_colors.length / 4;

  gridVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid_normals), gl.STATIC_DRAW);
  gridVertexNormalBuffer.itemSize = 3;
  gridVertexNormalBuffer.numItems = grid_normals.length / 3;
}

/**
 * Update axis label positions on screen based on 3D positions
 */
function update_axis_labels() {
  var x_label = document.getElementById('axis-label-x');
  var y_label = document.getElementById('axis-label-y');
  var z_label = document.getElementById('axis-label-z');

  if (!x_label || !y_label || !z_label) return;
  
  // Hide all labels if coordinates are disabled
  if (!show_coordinates) {
    x_label.style.display = 'none';
    y_label.style.display = 'none';
    z_label.style.display = 'none';
    return;
  }

  // Position labels exactly at the end of each axis (matching axis_length from generate_axes)
  var axis_length = 6.0; // Must match the axis_length in generate_axes()
  var label_offset = 0.3; // Small offset to position label slightly beyond axis end for visibility

  // X-axis: positive X direction (right)
  var x_pos_3d = vec3.fromValues(axis_length + label_offset, 0.0, 0.0);
  // Y-axis: positive Y direction (up)
  var y_pos_3d = vec3.fromValues(0.0, axis_length + label_offset, 0.0);
  // Z-axis: positive Z direction (forward)
  var z_pos_3d = vec3.fromValues(0.0, 0.0, axis_length + label_offset);

  var x_clip = vec4.create();
  var y_clip = vec4.create();
  var z_clip = vec4.create();

  vec4.transformMat4(x_clip, vec4.fromValues(x_pos_3d[0], x_pos_3d[1], x_pos_3d[2], 1.0), model_view_matrix);
  vec4.transformMat4(x_clip, x_clip, projection_matrix);

  vec4.transformMat4(y_clip, vec4.fromValues(y_pos_3d[0], y_pos_3d[1], y_pos_3d[2], 1.0), model_view_matrix);
  vec4.transformMat4(y_clip, y_clip, projection_matrix);

  vec4.transformMat4(z_clip, vec4.fromValues(z_pos_3d[0], z_pos_3d[1], z_pos_3d[2], 1.0), model_view_matrix);
  vec4.transformMat4(z_clip, z_clip, projection_matrix);

  // Get actual canvas element for viewport dimensions
  var canvasElement = document.getElementById("webgl_canvas");
  var viewportWidth = canvasElement ? canvasElement.clientWidth : gl.viewportWidth;
  var viewportHeight = canvasElement ? canvasElement.clientHeight : gl.viewportHeight;

  // Convert clip coordinates to screen pixels
  // X-axis label
  if (x_clip[3] > 0) {
    var x_ndc = x_clip[0] / x_clip[3];
    var y_ndc = x_clip[1] / x_clip[3];
    var x_pixel = (x_ndc + 1) * 0.5 * viewportWidth;
    var y_pixel = (1 - y_ndc) * 0.5 * viewportHeight;
    x_label.style.left = x_pixel + 'px';
    x_label.style.top = y_pixel + 'px';
    x_label.style.display = 'block';
  } else {
    x_label.style.display = 'none';
  }

  // Y-axis label
  if (y_clip[3] > 0) {
    var x_ndc = y_clip[0] / y_clip[3];
    var y_ndc = y_clip[1] / y_clip[3];
    var x_pixel = (x_ndc + 1) * 0.5 * viewportWidth;
    var y_pixel = (1 - y_ndc) * 0.5 * viewportHeight;
    y_label.style.left = x_pixel + 'px';
    y_label.style.top = y_pixel + 'px';
    y_label.style.display = 'block';
  } else {
    y_label.style.display = 'none';
  }

  // Z-axis label
  if (z_clip[3] > 0) {
    var x_ndc = z_clip[0] / z_clip[3];
    var y_ndc = z_clip[1] / z_clip[3];
    var x_pixel = (x_ndc + 1) * 0.5 * viewportWidth;
    var y_pixel = (1 - y_ndc) * 0.5 * viewportHeight;
    z_label.style.left = x_pixel + 'px';
    z_label.style.top = y_pixel + 'px';
    z_label.style.display = 'block';
  } else {
    z_label.style.display = 'none';
  }
}


