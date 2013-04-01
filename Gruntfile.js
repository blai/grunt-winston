'use strict';

var winston = require('winston');

module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		nodeunit: {
			tests: ['test/*_test.js']
		},

		winston: {
			defaultLogger: {},
			defineOnCustom: {
				options: {
					defineLogger: function (logger) {
						Object.prototype.myLog = logger;
					}
				}
			},
			loggerHook: {
				options: {
					defineLogger: function (logger) {
						global.loggerHook = logger;
					},
					hooks: function (logger) {
						logger.setLevels({
                            verbose: 1,
                            info: 2,
                            warn: 3,
                            debug: 4,
                            error: 5,
                            foo: 6,
                            bar: 7
                        });
					}
				}
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('default', ['jshint', 'winston', 'nodeunit']);
};
