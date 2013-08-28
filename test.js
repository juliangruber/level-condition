var test = require('tape');
var Condition = require('./');
var levelup = require('levelup');
var leveldown = require('leveldown');
var db = levelup(__dirname + '/db', { db: function(l) {
  return new leveldown(l);
}});

test('condition', function(t) {
  t.plan(6);

  db.del('a');
  db.del('b');

  Condition(db)
    .keys('a', 'b')
    .check(function(a, b) {
      return a == 'foo' && b == 'bar';
    })
    .success(function(a, b) {
      t.equal(a, 'foo');
      t.equal(b, 'bar');

      db.get('a', function(err, valueA) {
        t.error(err);
        t.equal(valueA, 'foo');
      });

      db.get('b', function(err, valueB) {
        t.error(err);
        t.equal(valueB, 'bar');
      });
    });

  db.put('a', 'foo')
  db.del('a');
  db.put('b', 'bar');
  db.put('a', 'foo');
});

test('default check', function(t) {
  t.plan(6);

  db.del('a');
  db.del('b');

  Condition(db)
    .keys('a', 'b')
    .success(function(a, b) {
      t.equal(a, 'foo');
      t.equal(b, 'bar');

      db.get('a', function(err, valueA) {
        t.error(err);
        t.equal(valueA, 'foo');
      });

      db.get('b', function(err, valueB) {
        t.error(err);
        t.equal(valueB, 'bar');
      });
    });

  db.put('a', 'foo')
  db.del('a');
  db.put('b', 'bar');
  db.put('a', 'foo');
});

test('thunk', function(t) {
  t.plan(7);

  db.del('a');
  db.del('b');

  Condition(db)
    .keys('a', 'b')
    .check(function(a, b) {
      return a == 'foo' && b == 'bar';
    })
    .success()(function(err, a, b) {
      t.error(err);
      t.equal(a, 'foo');
      t.equal(b, 'bar');

      db.get('a', function(err, valueA) {
        t.error(err);
        t.equal(valueA, 'foo');
      });

      db.get('b', function(err, valueB) {
        t.error(err);
        t.equal(valueB, 'bar');
      });
    });

  db.put('a', 'foo')
  db.del('a');
  db.put('b', 'bar');
  db.put('a', 'foo');
});
