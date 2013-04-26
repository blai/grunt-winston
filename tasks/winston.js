'use strict';

var _ = require('lodash');
var util = require('util');
var winston = require('winston');

module.exports = function(grunt) {
    grunt.registerMultiTask('winston', 'Setup a winston logger.', function() {
        var options = this.options();

        var config = options.config || {};
        var transports = config.transports;

        config = _.omit(config, 'transports');

        var logger = new winston.Logger(config);
        if (!transports) {
            transports = [new winston.transports.Console()];
        } else {
            _.each(transports, function(options, type) {
                if ('undefined' === winston.transports[type]) {
                    grunt.log.error('Cannot instantiate non-default transport: ' + type);  
                } else {
                    logger.add(winston.transports[type], options);
                }
            });
        }

        var hooks = options.hooks ? _.flatten([options.hooks], true) : [];
        var defineLogger = options.defineLogger || function (logger) {
            global.logger = logger;
        };

        if ('function' !==  typeof defineLogger) {
            grunt.fatal('defineLogger must be a function');
        }

        defineLogger(logger);

        hooks.forEach(function(hook) {
            hook.call(logger, logger);
        });
    });
};
