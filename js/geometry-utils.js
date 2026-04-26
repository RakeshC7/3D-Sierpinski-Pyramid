/*
* ============================================================================
* GEOMETRY UTILITIES
* ============================================================================
*/

/**
 * Calculate midpoint between two 3D points
 * @param {Array<number>} p1 - First point [x, y, z]
 * @param {Array<number>} p2 - Second point [x, y, z]
 * @returns {Array<number>} Midpoint [x, y, z]
 */
function midpoint(p1, p2) {
  return [
    (p1[0] + p2[0]) / 2.0,
    (p1[1] + p2[1]) / 2.0,
    (p1[2] + p2[2]) / 2.0
  ];
}

/**
 * Calculate face normal vector for a triangle
 * @param {Array<number>} p1 - First vertex
 * @param {Array<number>} p2 - Second vertex
 * @param {Array<number>} p3 - Third vertex
 * @returns {vec3} Normalized face normal vector
 */
function face_normal(p1, p2, p3) {
  var v1 = vec3.create();
  var v2 = vec3.create();
  var normal = vec3.create();

  vec3.subtract(v1, p2, p1);
  vec3.subtract(v2, p3, p1);
  vec3.cross(normal, v1, v2);
  vec3.normalize(normal, normal);

  return normal;
}

/**
 * Add weighted normal to vertex for smooth shading
 * @param {Array<number>} vertex - Vertex position
 * @param {vec3} fN1 - First face normal
 * @param {vec3} fN2 - Second face normal
 * @param {vec3} fN3 - Third face normal
 */
function weighted_vertex_normal(vertex, fN1, fN2, fN3) {
  var index = -1;
  for (var i = 0; i < vertices.length; i += 3) {
    if (Math.abs(vertices[i] - vertex[0]) < 0.001 &&
        Math.abs(vertices[i + 1] - vertex[1]) < 0.001 &&
        Math.abs(vertices[i + 2] - vertex[2]) < 0.001) {
      index = i / 3;
      break;
    }
  }

  if (index >= 0) {
    var avg_normal = vec3.create();
    vec3.add(avg_normal, fN1, fN2);
    vec3.add(avg_normal, avg_normal, fN3);
    vec3.normalize(avg_normal, avg_normal);

    var normal_index = index * 3;
    var current_normal = vec3.fromValues(
      vertex_normals[normal_index],
      vertex_normals[normal_index + 1],
      vertex_normals[normal_index + 2]
    );
    vec3.add(current_normal, current_normal, avg_normal);
    vec3.normalize(current_normal, current_normal);

    vertex_normals[normal_index] = current_normal[0];
    vertex_normals[normal_index + 1] = current_normal[1];
    vertex_normals[normal_index + 2] = current_normal[2];
  }
}

