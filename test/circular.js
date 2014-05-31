var test = require('tape');

import dic from '../';

test('circular', function(t) {
  t.plan(1);
  var c = new dic();
  t.throws(function() {
    c.register('a', ['b'], function() {});
    c.register('b', ['a'], function() {});
  });
});

test('complex circular', function(t) {
  t.plan(1);
  var c = new dic();
  t.throws(function() {
    c.register('a', ['b'], function() {});
    c.register('b', ['c'], function() {});
    c.register('c', ['a'], function() {});
  });
});
