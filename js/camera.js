/*
* ============================================================================
* CAMERA SYSTEM
* ============================================================================
*/

/**
 * Update camera position based on orbit angles (spherical coordinates)
 */
function update_camera_orbit() {
  var cos_elev = Math.cos(camera_elevation);
  camera_position[0] = camera_target[0] + camera_distance * cos_elev * Math.sin(camera_azimuth);
  camera_position[1] = camera_target[1] + camera_distance * Math.sin(camera_elevation);
  camera_position[2] = camera_target[2] + camera_distance * cos_elev * Math.cos(camera_azimuth);
}

/**
 * Set up camera view matrix
 */
function setup_camera() {
  mat4.lookAt(view_matrix, camera_position, camera_target, camera_up);
}

/**
 * Update camera based on keyboard input
 */
function update_camera() {
  var zoom_speed = 0.5;
  var rotation_speed = 0.03;

  if (camera_keys[0]) {
    camera_distance = Math.max(3.0, camera_distance - zoom_speed);
    update_camera_orbit();
  }
  if (camera_keys[1]) {
    camera_distance = Math.min(30.0, camera_distance + zoom_speed);
    update_camera_orbit();
  }
  if (camera_keys[2]) {
    camera_azimuth -= rotation_speed;
    update_camera_orbit();
  }
  if (camera_keys[3]) {
    camera_azimuth += rotation_speed;
    update_camera_orbit();
  }
}

