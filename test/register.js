var test = require('tape');

import dic from '../';

test('register', function(t) {
  t.plan(1);
  var c = new dic();
  c.register('a', function() { return 'foo'; });
  t.equal(c.resolve('a'), 'foo');
});

test('dependency', function(t) {
  t.plan(2);
  var c = new dic();
  c.register('a', ['b'], function(b) {
    t.equal(b, 'bar');
    return 'foo';
  });
  c.register('b', function() { return 'bar'; })
  t.equal(c.resolve('a'), 'foo');
});
