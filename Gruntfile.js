module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
     concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'public/javascripts/blot.js',
          'public/javascripts/centerIn.js',
          'public/javascripts/ColorUtils.js',
          'public/javascripts/very.js'
        ],
        dest: 'public/javascripts/very.max.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      },
      build: {
        src: 'public/javascripts/very.max.js',
        dest: 'public/javascripts/very.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');    
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('production', ['concat', 'uglify']);
};
