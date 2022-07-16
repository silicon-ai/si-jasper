
if (!Array.prototype.flatMap) {
  const concat = function concat(x, y) {
    return x.concat(y)
  }

  Object.defineProperty(Array.prototype, 'flatMap', {
    value: function flatMap(f) {
      return this.map(f).reduce(concat, [])
    },
    enumerable: false
  })
}

if (!Array.prototype.zip) {
  Object.defineProperty(Array.prototype, 'zip', {
    value: function zip(that) {
      return this.map((v, i) => [v, that[i]])
    },
    enumerable: false
  })
}

if (!Array.prototype.groupBy) {
  Object.defineProperty(Array.prototype, 'groupBy', {
    value: function groupBy(k) {
      let key = k
      if (typeof key != 'function') key = (v) => v[k]
      return this.reduce((acc, v) => {
        return (acc[key(v)] = acc[key(v)] || []).push(v)
      }, {})
    },
    enumberable: false
  })
}

if (!Array.prototype.fold) {
  Object.defineProperty(Array.prototype, 'fold', {
    value: function fold(a, f) {
      return this.reduce(f, a)
    }
  })
}

if (!Array.prototype.take) {
  Object.defineProperty(Array.prototype, 'take', {
    value: function take(n) {
      return this.slice(0, n)
    }
  })
}

if (!Array.prototype.drop) {
  Object.defineProperty(Array.prototype, 'drop', {
    value: function drop(n) {
      return this.slice(n)
    }
  })
}

if (!Array.prototype.dropRight) {
  Object.defineProperty(Array.prototype, 'dropRight', {
    value: function dropRight(n) {
      return this.slice(0, this.length - n)
    }
  })
}

if (!Array.prototype.last) {
  Object.defineProperty(Array.prototype, 'last', {
    value: function last(n) {
      return this[this.length - 1]
    }
  })
}

if (!Array.prototype.first) {
  Object.defineProperty(Array.prototype, 'first', {
    value: function first(n) {
      return this[0]
    }
  })
}