/*
* ============================================================================
* GLOBAL STATE & VARIABLES
* ============================================================================
*/ 

// WebGL Context
var gl;
var shaderProgram;

// Geometry Data Arrays
var vertices = [];
var vertex_normals = [];
var vertex_colors = [];

// WebGL Buffers
var pyramidVertexPositionBuffer;
var pyramidVertexNormalBuffer;
var pyramidVertexColorBuffer;
var axisVertexPositionBuffer;
var axisVertexColorBuffer;
var axisVertexNormalBuffer;
var gridVertexPositionBuffer;
var gridVertexColorBuffer;
var gridVertexNormalBuffer;

// Camera System (Orbit Controls)
var camera_target = vec3.fromValues(0.0, 0.0, 0.0);
var camera_distance = 15.0; // Initial distance for default zoom level
var camera_azimuth = 0.5;
var camera_elevation = 0.6;
var camera_position = vec3.create();
var camera_up = vec3.fromValues(0.0, 1.0, 0.0);

// Transformation Matrices
var projection_matrix = mat4.create();
var view_matrix = mat4.create();
var model_view_matrix = mat4.create();
var normal_matrix = mat3.create();

// Input State
var camera_keys = [0, 0, 0, 0]; // [W, S, A, D]
var is_mouse_dragging = false;
var last_mouse_x = 0;
var last_mouse_y = 0;

// Subdivision Control
var subdivisions = 0;
var subdivision_debounce_timer = null;
var is_generating = false;

// Display Controls
var show_coordinates = true;
var show_grid = true;

// Pyramid Base Geometry Constants
var PYRAMID_SIZE = 3.0;
var PYRAMID_STRETCH_X = 1.0;
var PYRAMID_STRETCH_Y = 1.0;
var PYRAMID_STRETCH_Z = 1.0;

// Function to update pyramid points based on current parameters
function update_pyramid_points() {
  // Base size - used as reference for all dimensions
  var base_size = PYRAMID_SIZE;
  
  // Y coordinates - only affected by PYRAMID_STRETCH_Y
  var top_y = base_size * PYRAMID_STRETCH_Y;
  var base_y = -1 * base_size / 3.0 * PYRAMID_STRETCH_Y;
  
  // X coordinates - only affected by PYRAMID_STRETCH_X
  var a = 0;
  var c = base_size * Math.sqrt(2) * 2.0 / 3.0 * PYRAMID_STRETCH_X;
  var e = -1 * base_size * Math.sqrt(2) / 3.0 * PYRAMID_STRETCH_X;
  
  // Z coordinates - only affected by PYRAMID_STRETCH_Z
  var f = base_size * Math.sqrt(2) / Math.sqrt(3) * PYRAMID_STRETCH_Z;
  var g = -1 * f;

  // Top point (apex) - only Y is stretched
  point_one = [a, top_y, a];
  // Base points - each coordinate independently stretched
  point_two = [c, base_y, a];      // X stretched, Y stretched, Z=0
  point_three = [e, base_y, f];    // X stretched, Y stretched, Z stretched
  point_four = [e, base_y, g];      // X stretched, Y stretched, Z stretched (negative)
}

var point_one = [0, 0, 0];
var point_two = [0, 0, 0];
var point_three = [0, 0, 0];
var point_four = [0, 0, 0];
update_pyramid_points();

var color_one = [1.0, 0.0, 0.0];
var color_two = [0.0, 1.0, 0.0];
var color_three = [0.0, 0.0, 1.0];
var color_four = [1.0, 1.0, 1.0];

