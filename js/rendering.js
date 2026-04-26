/*
* ============================================================================
* RENDERING
* ============================================================================
*/

/**
 * Main rendering loop - draws one frame
 */
function render() {
  update_camera();
  setup_camera();

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(
    projection_matrix,
    Math.PI / 4,
    gl.viewportWidth / gl.viewportHeight,
    0.1,
    100.0
  );

  mat4.copy(model_view_matrix, view_matrix);
  mat3.normalFromMat4(normal_matrix, model_view_matrix);

  gl.useProgram(shaderProgram);

  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projection_matrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, model_view_matrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normal_matrix);

  var light_position_vector = vec3.fromValues(-4.2, 1.0, 0.0);
  vec3.transformMat4(light_position_vector, light_position_vector, view_matrix);

  gl.uniform3f(shaderProgram.ambientColorUniform, 0.7, 0.7, 0.7);
  gl.uniform3f(
    shaderProgram.pointLightLocationUniform,
    light_position_vector[0],
    light_position_vector[1],
    light_position_vector[2]
  );
  gl.uniform3f(shaderProgram.pointLightColorUniform, 1.0, 1.0, 1.0);

  // Draw pyramid
  if (pyramidVertexPositionBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      pyramidVertexPositionBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexNormalBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute,
      pyramidVertexNormalBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    // Apply color transformations if any effects are active
    var final_colors = vertex_colors;
    if (typeof apply_color_transformations === 'function' && vertices.length > 0) {
      final_colors = apply_color_transformations(vertex_colors);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(final_colors), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.vertexColorAttribute,
      pyramidVertexColorBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);
  }

  // Draw grid (if enabled)
  if (show_grid && gridVertexPositionBuffer) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexPositionBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      gridVertexPositionBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexNormalBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute,
      gridVertexNormalBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexColorBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexColorAttribute,
      gridVertexColorBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.lineWidth(1.0);
    gl.drawArrays(gl.LINES, 0, gridVertexPositionBuffer.numItems);
    gl.disable(gl.BLEND);
  }

  // Draw axes (if enabled)
  if (show_coordinates && axisVertexPositionBuffer) {
    gl.uniform3f(shaderProgram.ambientColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(shaderProgram.pointLightLocationUniform, 0.0, 0.0, 0.0);
    gl.uniform3f(shaderProgram.pointLightColorUniform, 0.0, 0.0, 0.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexPositionBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      axisVertexPositionBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexNormalBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute,
      axisVertexNormalBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexColorBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexColorAttribute,
      axisVertexColorBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.lineWidth(10.0);
    gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);

    var light_position_vector = vec3.fromValues(-4.2, 1.0, 0.0);
    vec3.transformMat4(light_position_vector, light_position_vector, view_matrix);
    gl.uniform3f(shaderProgram.ambientColorUniform, 0.7, 0.7, 0.7);
    gl.uniform3f(
      shaderProgram.pointLightLocationUniform,
      light_position_vector[0],
      light_position_vector[1],
      light_position_vector[2]
    );
    gl.uniform3f(shaderProgram.pointLightColorUniform, 1.0, 1.0, 1.0);
  }

  update_axis_labels();
  requestAnimationFrame(render);
}

