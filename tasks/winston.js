'use strict';

var _ = require('lodash');
var winston = require('winston');

module.exports = function(grunt) {
  grunt.registerMultiTask('winston', 'Setup a winston logger.', function() {
    var options = this.options();

    var config = options.config || {};
    if (!config.transports || !config.transports.length) {
			config.transports = [new winston.transports.Console()];
    }

    var hooks = options.hooks ? _.flatten([options.hooks], true) : [];
    var defineLogger = options.defineLogger || function (logger) {
			global.logger = logger;
    };

    if ('function' !==  typeof defineLogger) {
			grunt.fatal('defineLogger must be a function');
    }

    var logger = new winston.Logger(config);

    defineLogger(logger);

    hooks.forEach(function(hook) {
      hook.call(logger, logger);
    });
  });
};
