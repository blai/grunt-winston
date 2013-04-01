'use strict';

var fs = require('fs');
var path = require('path');
var grunt = require('grunt');
var stream = require('stream');

function hookStdout (callback) {
  var old_write = process.stdout.write;

  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(process.stdout, arguments);
      callback(string, encoding, fd);
    };
  })(process.stdout.write);

  return function() {
    process.stdout.write = old_write;
  };
}

exports.defaultLogger = function(test){
  test.expect(2);
  test.ok(logger !== undefined, 'logger is undefined');

  var stdout = [];
  var unhookStdout = hookStdout(function (string, endcoding, fd) {
    stdout.push(string);
  });

	logger.info('defaultLogger');
  test.ok(stdout[stdout.length-1] === 'info: defaultLogger\n', 'log message incorrect: ' + stdout[stdout.length-1]);

  unhookStdout();
  test.done();
};

exports.defineOnCustom = function(test) {
	test.expect(2);
	var object = {};
	test.ok(object.myLog !== undefined, 'Object.prototype.myLog is undefined');

  var stdout = [];
  var unhookStdout = hookStdout(function (string, endcoding, fd) {
    stdout.push(string);
  });

	object.myLog.info('defineOnCustom');
  test.ok(stdout[stdout.length-1] === 'info: defineOnCustom\n', 'log message incorrect: ' + stdout[stdout.length-1]);

  unhookStdout();
  test.done();
};

exports.loggerHook = function(test) {
	test.expect(3);
	var object = {};
	test.ok(loggerHook !== undefined, 'loggerHook is undefined');

  var stdout = [];
  var unhookStdout = hookStdout(function (string, endcoding, fd) {
    stdout.push(string);
  });

	loggerHook.foo('loggerHook');
  test.ok(stdout[stdout.length-1] === 'foo: loggerHook\n', 'log message incorrect: ' + stdout[stdout.length-1]);
	loggerHook.bar('loggerHook');
  test.ok(stdout[stdout.length-1] === 'bar: loggerHook\n', 'log message incorrect: ' + stdout[stdout.length-1]);

  unhookStdout();
  test.done();
};
