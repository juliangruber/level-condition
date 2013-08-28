
/**
 * Module dependencies.
 */

var liveStream = require('level-live-stream');

/**
 * Expose `Condition`.
 */

module.exports = Condition;

/**
 * Condition.
 *
 * @param {LevelUp} db
 */

function Condition(db) {
  var self = this;
  if (!(self instanceof Condition)) return new Condition(db);

  self.db = db;
  self._keys = [];
  self._check = function() {
    var values = [].slice.call(arguments);
    return values.length == self._keys.length
      && values.every(truthy());
  };
}

/**
 * Start watching keys.
 *
 * @param {Object...} keys
 * @return {Condition}
 * @api public
 */

Condition.prototype.keys = function(keys) {
  keys = [].slice.call(arguments);
  this._keys = this._keys.concat(keys);
  return this;
};

/**
 * Register check function.
 *
 * @param {Function} fn
 * @return {Condition}
 * @api public
 */

Condition.prototype.check = function(fn) {
  this._check = fn;
  return this;
};

/**
 * Register success function and start watching keys.
 *
 * @param {Function} fn
 * @api public
 */

Condition.prototype.success = function(fn) {
  if (!fn) {
    var self = this;
    return function(done) {
      self.success(function() {
        var args = [].slice.call(arguments);
        args.unshift(null);
        done.apply(null, args);
      });
    }
  }

  var values = [];
  var streams = [];
  var db = this.db;
  var check = this._check;
  var keys = this._keys;

  keys.forEach(function(key, i) {
    var live = liveStream(db, { start: key, end: key });
    streams.push(live);
    live.on('data', function(change) {
      values[i] = change.value;
      if (check.apply(null, values)) {
        streams.forEach(call('destroy'));
        fn.apply(null, values);
      }
    });
  }); 
};

/**
 * Functional helpers.
 */

function call(method) {
  return function(obj) {
    obj[method]();
  }
}

function truthy() {
  return function(value) {
    return !! value;
  }
}

