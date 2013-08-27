var test = require('tape');
var Condition = require('./');
var level = require('level');
var db = level(__dirname + '/db');

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

