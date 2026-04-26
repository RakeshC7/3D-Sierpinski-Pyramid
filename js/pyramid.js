/*
* ============================================================================
* PYRAMID GEOMETRY GENERATION
* ============================================================================
*/

/**
 * Create a triangle face and add to vertex buffers
 * @param {Array<number>} p1 - First vertex position
 * @param {Array<number>} p2 - Second vertex position
 * @param {Array<number>} p3 - Third vertex position
 * @param {Array<number>} c1 - First vertex color
 * @param {Array<number>} c2 - Second vertex color
 * @param {Array<number>} c3 - Third vertex color
 * @param {boolean} smooth - Enable smooth shading
 * @returns {vec3} Face normal vector
 */
function triangle(p1, p2, p3, c1, c2, c3, smooth) {
  vertices.push(p1[0], p1[1], p1[2]);
  vertices.push(p2[0], p2[1], p2[2]);
  vertices.push(p3[0], p3[1], p3[2]);

  vertex_colors.push(c1[0], c1[1], c1[2], 1.0);
  vertex_colors.push(c2[0], c2[1], c2[2], 1.0);
  vertex_colors.push(c3[0], c3[1], c3[2], 1.0);

  var face_normal_vec = face_normal(p1, p2, p3);

  vertex_normals.push(face_normal_vec[0], face_normal_vec[1], face_normal_vec[2]);
  vertex_normals.push(face_normal_vec[0], face_normal_vec[1], face_normal_vec[2]);
  vertex_normals.push(face_normal_vec[0], face_normal_vec[1], face_normal_vec[2]);

  return face_normal_vec;
}

/**
 * Create a tetrahedron from four corner points
 * @param {Array<number>} p1 - First corner
 * @param {Array<number>} p2 - Second corner
 * @param {Array<number>} p3 - Third corner
 * @param {Array<number>} p4 - Fourth corner
 * @param {Array<number>} c1 - First corner color
 * @param {Array<number>} c2 - Second corner color
 * @param {Array<number>} c3 - Third corner color
 * @param {Array<number>} c4 - Fourth corner color
 * @param {boolean} smooth - Enable smooth shading
 */
function tetrahedron(p1, p2, p3, p4, c1, c2, c3, c4, smooth) {
  var fN1 = triangle(p1, p2, p3, c1, c2, c3, smooth);
  var fN2 = triangle(p1, p4, p2, c1, c4, c2, smooth);
  var fN3 = triangle(p1, p3, p4, c1, c3, c4, smooth);
  var fN4 = triangle(p2, p4, p3, c2, c4, c3, smooth);

  if (smooth === true) {
    weighted_vertex_normal(p3, fN1, fN3, fN4);
    weighted_vertex_normal(p2, fN1, fN4, fN2);
    weighted_vertex_normal(p1, fN1, fN2, fN3);
    weighted_vertex_normal(p4, fN2, fN4, fN3);
  }
}

/**
 * Recursively subdivide tetrahedron to create Sierpinski pattern
 * @param {Array<number>} p1 - First corner
 * @param {Array<number>} p2 - Second corner
 * @param {Array<number>} p3 - Third corner
 * @param {Array<number>} p4 - Fourth corner
 * @param {Array<number>} c1 - First corner color
 * @param {Array<number>} c2 - Second corner color
 * @param {Array<number>} c3 - Third corner color
 * @param {Array<number>} c4 - Fourth corner color
 * @param {number} depth - Remaining subdivision depth
 * @param {boolean} smooth - Enable smooth shading
 */
function subdivide(p1, p2, p3, p4, c1, c2, c3, c4, depth, smooth) {
  if (depth === 0) {
    tetrahedron(p1, p2, p3, p4, c1, c2, c3, c4, smooth);
    return;
  }

  var p1_p2 = midpoint(p1, p2);
  var p1_p3 = midpoint(p1, p3);
  var p1_p4 = midpoint(p1, p4);
  var p2_p3 = midpoint(p2, p3);
  var p2_p4 = midpoint(p2, p4);
  var p3_p4 = midpoint(p3, p4);

  var c1_c2 = [(c1[0] + c2[0]) / 2.0, (c1[1] + c2[1]) / 2.0, (c1[2] + c2[2]) / 2.0];
  var c1_c3 = [(c1[0] + c3[0]) / 2.0, (c1[1] + c3[1]) / 2.0, (c1[2] + c3[2]) / 2.0];
  var c1_c4 = [(c1[0] + c4[0]) / 2.0, (c1[1] + c4[1]) / 2.0, (c1[2] + c4[2]) / 2.0];
  var c2_c3 = [(c2[0] + c3[0]) / 2.0, (c2[1] + c3[1]) / 2.0, (c2[2] + c3[2]) / 2.0];
  var c2_c4 = [(c2[0] + c4[0]) / 2.0, (c2[1] + c4[1]) / 2.0, (c2[2] + c4[2]) / 2.0];
  var c3_c4 = [(c3[0] + c4[0]) / 2.0, (c3[1] + c4[1]) / 2.0, (c3[2] + c4[2]) / 2.0];

  subdivide(p1, p1_p2, p1_p3, p1_p4, c1, c1_c2, c1_c3, c1_c4, depth - 1, smooth);
  subdivide(p1_p2, p2, p2_p3, p2_p4, c1_c2, c2, c2_c3, c2_c4, depth - 1, smooth);
  subdivide(p1_p3, p2_p3, p3, p3_p4, c1_c3, c2_c3, c3, c3_c4, depth - 1, smooth);
  subdivide(p1_p4, p2_p4, p3_p4, p4, c1_c4, c2_c4, c3_c4, c4, depth - 1, smooth);
}

/**
 * Generate pyramid geometry and create WebGL buffers
 */
function generate_pyramids() {
  if (is_generating) {
    return;
  }

  var safe_subdivisions = Math.min(subdivisions, 5);
  if (subdivisions > 5) {
    console.warn("Subdivision level capped at 5. Higher values may cause performance issues.");
  }

  is_generating = true;

  try {
    var loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
    }

    requestAnimationFrame(function() {
      vertices = [];
      vertex_normals = [];
      vertex_colors = [];

      subdivide(
        point_one, point_two, point_three, point_four,
        color_one, color_two, color_three, color_four,
        safe_subdivisions,
        true
      );

      if (pyramidVertexPositionBuffer) {
        gl.deleteBuffer(pyramidVertexPositionBuffer);
      }
      if (pyramidVertexNormalBuffer) {
        gl.deleteBuffer(pyramidVertexNormalBuffer);
      }
      if (pyramidVertexColorBuffer) {
        gl.deleteBuffer(pyramidVertexColorBuffer);
      }

      pyramidVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      pyramidVertexPositionBuffer.itemSize = 3;
      pyramidVertexPositionBuffer.numItems = vertices.length / 3;

      pyramidVertexNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_normals), gl.STATIC_DRAW);
      pyramidVertexNormalBuffer.itemSize = 3;
      pyramidVertexNormalBuffer.numItems = vertex_normals.length / 3;

      // Apply color transformations if any effects are active
      var final_colors = vertex_colors;
      if (typeof apply_color_transformations === 'function') {
        final_colors = apply_color_transformations(vertex_colors);
      }

      pyramidVertexColorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(final_colors), gl.STATIC_DRAW);
      pyramidVertexColorBuffer.itemSize = 4;
      pyramidVertexColorBuffer.numItems = final_colors.length / 4;

      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }

      is_generating = false;
      console.log("Pyramid generated with " + safe_subdivisions + " subdivisions (" + vertices.length / 3 + " vertices)");
    });
  } catch (error) {
    console.error("Error generating pyramids:", error);
    is_generating = false;
    var loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
  }
}

