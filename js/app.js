/*
* ============================================================================
* APPLICATION INITIALIZATION & UI CONTROLS
* ============================================================================
*/

/**
 * Initialize the application
 */
function init() {
  // Step 1: Create canvas
  var canvas = create_canvas();
  if (!canvas) {
    console.error("Failed to create canvas");
    return;
  }

  // Step 2: Initialize WebGL
  initGL(canvas);
  if (!gl) {
    console.error("Failed to initialize WebGL");
    return;
  }

  // Step 3: Initialize shaders
  if (!initShaders()) {
    console.error("Failed to initialize shaders");
    return;
  }

  // Step 4: Generate geometry
  generate_pyramids();
  generate_axes();
  generate_grid();

  // Step 5: Initialize camera position
  if (typeof update_camera_orbit === 'function') {
    update_camera_orbit();
  }

  // Step 6: Setup UI controls
  setup_subdivision_controls();
  setup_visual_effects_controls();

  // Step 7: Setup camera controls
  setup_camera_controls();

  // Step 8: Start rendering loop
  render();
}

/**
 * Set up subdivision slider control
 */
function setup_subdivision_controls() {
  var slider = document.getElementById("subdivision-slider");
  var valueDisplay = document.getElementById("subdivision-value");
  
  if (slider && valueDisplay) {
    slider.addEventListener("input", function(e) {
      var newValue = parseInt(e.target.value);
      valueDisplay.textContent = newValue;
      
      // Debounce to avoid too many regenerations
      if (subdivision_debounce_timer) {
        clearTimeout(subdivision_debounce_timer);
      }
      
      subdivision_debounce_timer = setTimeout(function() {
        subdivisions = newValue;
        generate_pyramids();
      }, 150);
    });
  }

  // Pyramid size slider
  var sizeSlider = document.getElementById("pyramid-size-slider");
  var sizeValue = document.getElementById("pyramid-size-value");
  if (sizeSlider && sizeValue) {
    sizeSlider.addEventListener("input", function(e) {
      var newValue = parseFloat(e.target.value);
      sizeValue.textContent = newValue.toFixed(1);
      PYRAMID_SIZE = newValue;
      update_pyramid_points();
      generate_pyramids();
    });
  }

  // Pyramid stretch X slider
  var stretchXSlider = document.getElementById("pyramid-stretch-x-slider");
  var stretchXValue = document.getElementById("pyramid-stretch-x-value");
  if (stretchXSlider && stretchXValue) {
    stretchXSlider.addEventListener("input", function(e) {
      var newValue = parseFloat(e.target.value);
      stretchXValue.textContent = newValue.toFixed(1);
      PYRAMID_STRETCH_X = newValue;
      update_pyramid_points();
      generate_pyramids();
    });
  }

  // Pyramid stretch Y slider
  var stretchYSlider = document.getElementById("pyramid-stretch-y-slider");
  var stretchYValue = document.getElementById("pyramid-stretch-y-value");
  if (stretchYSlider && stretchYValue) {
    stretchYSlider.addEventListener("input", function(e) {
      var newValue = parseFloat(e.target.value);
      stretchYValue.textContent = newValue.toFixed(1);
      PYRAMID_STRETCH_Y = newValue;
      update_pyramid_points();
      generate_pyramids();
    });
  }

  // Pyramid stretch Z slider
  var stretchZSlider = document.getElementById("pyramid-stretch-z-slider");
  var stretchZValue = document.getElementById("pyramid-stretch-z-value");
  if (stretchZSlider && stretchZValue) {
    stretchZSlider.addEventListener("input", function(e) {
      var newValue = parseFloat(e.target.value);
      stretchZValue.textContent = newValue.toFixed(1);
      PYRAMID_STRETCH_Z = newValue;
      update_pyramid_points();
      generate_pyramids();
    });
  }
}

/**
 * Set up visual effects UI controls
 */
function setup_visual_effects_controls() {
  // Coordinates checkbox
  var coordinatesCheckbox = document.getElementById("coordinates-checkbox");
  if (coordinatesCheckbox) {
    coordinatesCheckbox.addEventListener("change", function(e) {
      show_coordinates = e.target.checked;
      console.log("Coordinates: " + (show_coordinates ? "enabled" : "disabled"));
    });
  }

  // Grid checkbox
  var gridCheckbox = document.getElementById("grid-checkbox");
  if (gridCheckbox) {
    gridCheckbox.addEventListener("change", function(e) {
      show_grid = e.target.checked;
      console.log("Grid: " + (show_grid ? "enabled" : "disabled"));
    });
  }
}

/**
 * Set up camera controls UI
 */
function setup_camera_controls() {
  // Toggle panel functionality
  var mainToggle = document.getElementById("main-controls-toggle");
  var mainContent = document.getElementById("main-controls-content");

  if (mainToggle && mainContent) {
    mainToggle.addEventListener("click", function() {
      toggle_panel(mainContent, mainToggle);
    });
  }

  // Setup mouse drag controls (always active, no toggle needed)
  if (canvas) {
    canvas.addEventListener("mousedown", mouse_drag_start, false);
    canvas.addEventListener("mousemove", mouse_drag_move, false);
    canvas.addEventListener("mouseup", mouse_drag_end, false);
    canvas.addEventListener("mouseleave", mouse_drag_end, false);
  }
}

/**
 * Toggle panel expand/collapse
 */
function toggle_panel(content, header) {
  if (content && header) {
    content.classList.toggle("collapsed");
    header.classList.toggle("collapsed");
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
