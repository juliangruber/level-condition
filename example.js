var Condition = require('./');
var level = require('level');
var db = level(__dirname + '/db');

db.del('a');
db.del('b');

Condition(db)
  .keys('a', 'b')
  .check(function(a, b) {
    return a == 'foo' && b == 'bar';
  })
  .success(function(a, b) {
    console.log('a: %s, b: %s', a, b);
  });

db.put('a', 'foo')
db.del('a');
db.put('b', 'bar');
db.put('a', 'foo');

