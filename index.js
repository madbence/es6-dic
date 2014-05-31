function depends(a, b, list, path = []) {
  if(!list[a]) return;
  path = path.concat([a]);
  var dep = list[a];
  if(dep.dependencies.indexOf(b) !== -1) return path.concat([b]);
  return dep.dependencies
    .reduce((found, dep) => found ? found : depends(dep, b, list, path), null);
}

class Container {
  constructor(parent) {
    this.parent = parent;
    this.factories = {};
  }
  register(name, dependencies, factory) {
    if(typeof dependencies == 'function') {
      factory = dependencies;
      dependencies = [];
    }
    this.factories[name] = {
      dependencies: dependencies,
      factory: factory
    };
    var path;
    if(path = depends(name, name, this.factories)) {
      throw new Error(name + ' depends on itself! (' + path.join('->') +')');
    }
  }
  resolve(name) {
    if(!this.factories[name] && !this.parent) {
      throw new Error('Dependency ' + name + ' not found!');
    } else if(this.parent) {
      return this.parent.resolve(name);
    }
    return this.factories[name].instance
      ? this.factories[name].instance
      : this.factories[name].instance = this.create(name);
  }
  create(name) {
    return this.factories[name].factory.apply(
      null,
      this.factories[name].dependencies.map(dep => this.resolve(dep))
    );
  }
}

export default Container;
