# Dependency Injection Container for ES6

## Install

```
$ npm install es6-dic
```

## Usage

```js
import Container from 'es6-dic';

var c = new Container();

c.register('a', ['b'], b => b + 'a');
c.register('b', () => 'b');

console.log(c.resolve('a')) // 'ba';
```

## API

### .register(name, [dependencies,] factory)

Register `name` with optional `dependencies`.
`factory` is used to create instance,
the arguments are the specified dependencies.

Dependency order **is** important.

### .resolve(name)

Get instance for `name`.

## Notes

### "But how can I run this?!"

Well, I use it with
[browserify](https://github.com/substack/node-browserify) &
[es6ify](https://github.com/thlorenz/es6ify).
It *should* work with [traceur](https://github.com/google/traceur-compiler),
but afaik module import/export is not compatible with node.

### "But I *need* circular dependencies!!4"

Well, register the container itself as a dependency,
and resolve the needed module in runtime!

```js
var c = new Container();

c.register('inject', () => c);

c.register('beep', ['boop'], function(boop) {
  return function() {
    console.log('beep');
    setTimeout(boop, 1000);
  };
});

c.register('boop', ['inject'], inject => {
  var beep;
  return function() {
    beep = beep || inject.resolve('beep');
    console.log('boop');
    setTimeout(beep, 1000);
  };
});

c.resolve('beep')();
```

### "But I need multiple instances, not singletons!"

Well, then don't return instance in the `factory`!

```js
c.register('Bar', () => {
  // return new Bar();
  // instead of returning an instance, return a constructor!
  return Bar;
});

c.register('foo', ['Bar'], (Bar) => {
  var instance = new Bar();
});
```

A more complex example:

```js
class Bar {
  constructor(...stuff) {
    this.stuff = stuff;
  }
  foo() {
    console.log(...this.stuff)
  }
}

c.register('Bar', ['a', 'b'], (a, b) => Bar.bind(null, a, b));

c.register('a', () => 1);
c.register('b', () => 2);

c.register('c', ['Bar'], Bar => {
  var b = new Bar(3);
  b.foo();
});

c.resolve('c'); // 1, 2, 3 \o/ yay!
```

### "Tests?!"

Eeerrr, run them with browserify :S, not very node-friendy.
If you have a better solution, please create an issue!

## License

MIT
