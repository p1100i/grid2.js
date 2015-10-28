module.exports = function(grunt) {
  var banner = [
    '/**',
    ' * @license',
    ' * <%= pkg.name %> - v<%= pkg.version %>',
    ' * Copyright (c) 2015 p1100i',
    ' * <%= pkg.repository.url %>',
    ' *',
    ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
    ' *',
    ' * <%= pkg.name %> is licensed under the <%= pkg.license %> License.',
    ' * <%= pkg.licenseUrl %>',
    ' */',
    ''
  ].join('\n');

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        browser     : true,
        curly       : true,
        eqeqeq      : true,
        eqnull      : true,
        indent      : 2,
        latedef     : true,
        maxlen      : 150,
        newcap      : true,
        node        : true,
        noempty     : true,
        nonew       : true,
        mocha       : true,
        quotmark    : 'single',
        undef       : true,
        unused      : true,
        trailing    : true
      },
      app:  ['src/*.js', 'test/**/*.js', 'index/main.js']
    },

    browserify: {
      '<%= pkg.name %>.js': ['browserify.js']
    },

    uglify: {
      browserified : {
        options: {
          banner: banner,
          beautify: {
            width: 100,
            beautify: true
          }
        },
        files: {
          '<%= pkg.name %>.js':
          ['<%= pkg.name %>.js'],
        }
      },
      build: {
        options: {
          banner: banner
        },
        files: {
          '<%= pkg.name %>.min.js':
          ['<%= pkg.name %>.js'],
        }
      },
    },

    simplemocha : {
      all: { src : ['test/spec/**/*.js'] },
      options : {
        reporter: 'spec',
        slow: 200,
        timeout: 100
      }
    },

    watch : {
      scripts : {
        files : ['test/**/*.js', 'src/*.js', 'index/main.js'],
        tasks : ['test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('test', [
    'simplemocha',
    'jshint'
  ]);

  grunt.registerTask('build', [
    'browserify',
    'uglify:browserified',
    'uglify:build'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'simplemocha',
    'browserify',
    'uglify:browserified',
    'uglify:build'
  ]);
};
