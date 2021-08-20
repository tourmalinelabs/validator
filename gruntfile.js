'use strict';

const del = require('del');

module.exports = function (grunt) {
  grunt.initConfig({
    nodeunit: {
      all: ['./build/validator.unit.js'],
    },
    ts: {
      default: {
        tsconfig: './tsconfig.json',
        src: ['./src/**/*.ts', '!node_modules/**'],
        outDir: './build',
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.json', '!node_modules/**'],
            dest: './build',
          },
        ],
      },
    },
    watch: {
      scripts: {
        files: ['**/*'],
        tasks: ['nodeunit'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('clean-build', function () {
    const done = this.async();
    del(['build/**/*']).then(() => done());
  });

  grunt.registerTask('build', ['clean-build', 'copy', 'ts']);
  grunt.registerTask('test', ['build', 'nodeunit']);
};
