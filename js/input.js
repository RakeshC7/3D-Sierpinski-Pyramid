/*
* ============================================================================
* INPUT HANDLERS
* ============================================================================
*/

/**
 * Handle keyboard key press events
 */
window.onkeydown = function (event) {
  switch (event.keyCode) {
    case 87: // W
      camera_keys[0] = 1;
      break;
    case 83: // S
      camera_keys[1] = 1;
      break;
    case 65: // A
      camera_keys[2] = 1;
      break;
    case 68: // D
      camera_keys[3] = 1;
      break;
    default:
      break;
  }
};

/**
 * Handle keyboard key release events
 */
window.onkeyup = function (event) {
  switch (event.keyCode) {
    case 87: // W
      camera_keys[0] = 0;
      break;
    case 83: // S
      camera_keys[1] = 0;
      break;
    case 65: // A
      camera_keys[2] = 0;
      break;
    case 68: // D
      camera_keys[3] = 0;
      break;
    case 48: // 0
      subdivisions = 0;
      if (window.update_subdivision_slider) update_subdivision_slider();
      generate_pyramids();
      break;
    case 49: // 1
      subdivisions = 1;
      if (window.update_subdivision_slider) update_subdivision_slider();
      generate_pyramids();
      break;
    case 50: // 2
      subdivisions = 2;
      if (window.update_subdivision_slider) update_subdivision_slider();
      generate_pyramids();
      break;
    case 51: // 3
      subdivisions = 3;
      if (window.update_subdivision_slider) update_subdivision_slider();
      generate_pyramids();
      break;
    case 52: // 4
      subdivisions = 4;
      if (window.update_subdivision_slider) update_subdivision_slider();
      generate_pyramids();
      break;
    case 53: // 5
      subdivisions = 5;
      if (window.update_subdivision_slider) update_subdivision_slider();
      generate_pyramids();
      break;
    default:
      break;
  }
};

/**
 * Handle mouse drag for orbit controls
 */
function mouse_drag_move(event) {
  if (!is_mouse_dragging) return;

  var deltaX = event.clientX - last_mouse_x;
  var deltaY = event.clientY - last_mouse_y;

  last_mouse_x = event.clientX;
  last_mouse_y = event.clientY;

  camera_azimuth -= deltaX * 0.01;
  camera_elevation += deltaY * 0.01;

  var max_elevation = Math.PI / 2 - 0.1;
  var min_elevation = -Math.PI / 2 + 0.1;
  if (camera_elevation > max_elevation) camera_elevation = max_elevation;
  if (camera_elevation < min_elevation) camera_elevation = min_elevation;

  update_camera_orbit();
}

/**
 * Handle mouse button down
 */
function mouse_drag_start(event) {
  if (event.button === 0) {
    is_mouse_dragging = true;
    last_mouse_x = event.clientX;
    last_mouse_y = event.clientY;
    canvas.style.cursor = 'grabbing';
  }
}

/**
 * Handle mouse button up
 */
function mouse_drag_end(event) {
  if (event.button === 0) {
    is_mouse_dragging = false;
    canvas.style.cursor = 'default';
  }
}

