# grunt-winston [![Build Status](https://secure.travis-ci.org/blai/grunt-winston.png?branch=master)](http://travis-ci.org/blai/grunt-winston)

> Setup a [Winston](https://github.com/flatiron/winston) logger for grunt runtime.
> Winston is "a multi-transport async logging library for node.js."


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-winston --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-winston');
```


## Winston task

### winston

Configure one or more winston logger, the minimal config would be:

```javascript
grunt.initConfig({
  winston: {
    default_option: {}
  }
});

grunt.loadNpmTasks('grunt-winston');

grunt.registerTask('default', ['winston']);
```


## Options

### config (optional)
##### Type: `Object`
##### Default: `null`
Your `config` hash will be passed in directly when calling the `winston.Logger` constructor. Typical options would be `transports` (https://github.com/flatiron/winston/blob/master/docs/transports.md) and `levels` (https://github.com/flatiron/winston#logging-levels). Read the docs on https://github.com/flatiron/winston for more details

#### example
```javascript
grunt.initConfig({
  winston: {
    logger: {
      options: {
        config: {
          transports: {
            'File': { filename: 'path/to/all-logs.log' },
            'Console': {
              handleExceptions: true,
              json: true
            }
          },
          levels: {
            foo: 0,
            bar: 1,
            baz: 2,
            foobar: 3
          }
        }
      }
    }
  }
});
```
Noted: for transport, this plugin takes a hash of configurations for different transport setups, with the keys being the name of one of the default transports provided by winston. (e.g. if you want to use winston.transports.File, the key would be 'File'). If you want to use custom transports (e.g. 'winston-loggly'), you would have to do it in the 'hooks' as described below.

### Hooks (optional)
##### Type: `Function|Array`
##### Default: `null`
Winston provide a set of APIs for finer-grain controll over the logger instance. grunt-winston provide `hooks` for your convenience to add such kind of controlls. You may provide a function (or an array of functions), with each takes a single parameter `logger` that represents the instance of logger for the current grunt task.

#### example
```javascript
grunt.initConfig({
  winston: {
    myLogger: {
      options: {
        hooks: function (logger) {
          //
          // Handle errors
          //
          logger.on('error', function (err) { /* Do Something */ });

          //
          // Or just suppress them.
          //
          logger.emitErrs = false;
        }
      }
    }
  }
});
```

or
```javascript
grunt.initConfig({
  winston: {
    myLogger: {
      options: {
        hooks: [
          function (logger) {
            logger.on('logging', function (transport, level, msg, meta) {
              // [msg] and [meta] have now been logged at [level] to [transport]
            });
          },
          function (logger) {
            logger.addColors({
              foo: 'blue',
              bar: 'green',
              baz: 'yellow',
              foobar: 'red'
            });
          }
        ]
      }
    }
  }
});
```

### defineLogger (optional)
##### Type: `function`
It would not be useful if you define a logger and not use it anywhere, so the idea of this `defineLogger` is for you to set the logger to the context of your own. Usually in a grunt runtime, it maybe useful to set the logger on the `global` object so from any module you may just do `logger.log()` as if the logger is defined locally. (For this matter, `defineLogger` is by default setting `logger` to `global` object, so you don't have to set this yourself).

#### example
```javascript
grunt.initConfig({
  winston: {
    myLogger: {
      options: {
        // default setup of grunt-winston
        defineLogger: function (logger) {
          global.logger = logger;
        }
      }
    }
  }
});
```
A less common use case would be place the logger directly on `Object.prototype` (much like how [should.js](https://github.com/visionmedia/should.js/) is done). Please be warned that when you do so, you actually DID extended the Object.prototype and in many cases this is something to avoid. But if it does fit your case, doing so allows you call `logger.log` and any object, without having to set the property. (e.g. `myClass.logger.log(...)`). You can do it like so:
```javascript
grunt.initConfig({
  winston: {
    myLogger: {
      options: {
        // default setup of grunt-winston
        defineLogger: function (logger) {
          Object.prototype.logger = logger;
        }
      }
    }
  }
});
```
It is totally optionaly to call your logger `logger`, feel free to provide your own `defineLogger` function to name it your way.


## License
Copyright (c) 2013 Brian Lai
Licensed under the MIT license.

## Release History
 * 2013-04-26 `v0.2.0` fixed transport config bug
 * 2013-03-28 `v0.1.0` first draft.

