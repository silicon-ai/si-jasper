
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
