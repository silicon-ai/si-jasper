
const debounce = Symbol('debounce')

const SiAsync = {
  _thenYield: [],
  _yieldThen: [],
  _scheduled: false,

  schedule() {
    if (this._scheduled) return
    requestAnimationFrame(() => {
      this._scheduled = false

      const thenYield = this._thenYield
      this._thenYield = []
      thenYield.forEach(_ => _())

      setTimeout(() => {
        const yieldThen = this._yieldThen
        this._yieldThen = []
        yieldThen.forEach(_ => _())
      })
    })
    this._scheduled = true
  },

  get thenYield() {
    this.schedule()
    return new Promise(_ => this._thenYield.push(_))
  },

  get yieldThen() {
    this.schedule()
    return new Promise(_ => this._yieldThen.push(_))
  },

  debounce(context, timeout) {
    if (context[debounce]) {
      clearTimeout(context[debounce])
    }
    return new Promise((resolve, reject) => {
      context[debounce] = setTimeout(resolve, timeout)
    })
  }
}

export { SiAsync }
