
# level-condition

Get notified when a condition is triggered inside a LevelDB.

[![build status](https://secure.travis-ci.org/juliangruber/level-condition.png)](http://travis-ci.org/juliangruber/level-condition)

## Example

Get notified when key `a` has value `"foo"` and key `b` has value `"bar"`.

```js
var Condition = require('level-condition');
var level = require('level');
var db = level(__dirname + '/db');

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
db.put('a', 'foo'); // success
```

## API

### Condition(db)

Create a new condition instance that watches `db`.

### Condition#keys(...)

Start watching given keys.

### Condition#check(fn)

Register a check function that gets called with all values and
is expected to return a boolean value.

If you don't provide one, a function that checks for all values'
truthyness.

### Condition#success(fn)

Register a success function that gets called with all values when
the check was successful.

If you don't pass callback, a thunk/continuable is returned.

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install level-condition
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
