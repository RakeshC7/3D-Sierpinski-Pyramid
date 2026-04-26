/*
* ============================================================================
* MAIN ENTRY POINT
* ============================================================================
*/

(function() {
  'use strict';

  // List of modules to load in dependency order
  var modules = [
    'js/canvas.js',
    'js/globals.js',
    'js/webgl-init.js',
    'js/shaders.js',
    'js/geometry-utils.js',
    'js/pyramid.js',
    'js/coordinate-system.js',
    'js/camera.js',
    'js/input.js',
    'js/visual-effects.js',
    'js/rendering.js',
    'js/app.js'
  ];

  /**
   * Load a single script file
   * @param {string} src - Path to the script file
   * @returns {Promise} Promise that resolves when script is loaded
   */
  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = false; // Load synchronously to maintain order
      script.onload = function() {
        resolve();
      };
      script.onerror = function() {
        reject(new Error('Failed to load script: ' + src));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Load all modules sequentially
   */
  function loadModules() {
    var promise = Promise.resolve();
    
    modules.forEach(function(module) {
      promise = promise.then(function() {
        return loadScript(module);
      });
    });

    promise.catch(function(error) {
      console.error('Error loading modules:', error);
    });
  }

  // Start loading modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadModules);
  } else {
    // DOM is already ready
    loadModules();
  }
})();

