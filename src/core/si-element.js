import {render as nativeRender, html, svg} from 'lit-html/lit-html.js'
import {render as shadyRender} from 'lit-html/lib/shady-render.js'

if (window.ShadyCSS) {
  var render = (tmpl, host) => shadyRender(tmpl, host.shadowRoot, host.constructor.is)
}
else {
  var render = (tmpl, host) => nativeRender(tmpl, host.shadowRoot)
}


const state = Symbol('state')
const dollar = Symbol('$')
const nagle = Symbol('nagle')
const connected = Symbol('connected')


class SiElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this[state] = {}
  }

  static get state() { return state }

  static define(name) {
    const traits = this.traits || []

    traits.forEach((trait) => {
      Object.keys(trait).forEach((key) => {
        this.prototype[key] = trait[key]
      })
    })

    const properties = this.properties || {}

    this.observedAttributes = []

    Object.keys(properties).forEach((key) => {
      let property = properties[key]

      const descriptor = { }

      if (typeof property !== 'object') {
        property = {'type': properties[key]}
      }

      descriptor.set = defineSetter(this.prototype, key, property)
      descriptor.get = defineGetter(this.prototype, key, property)

      Object.defineProperty(this.prototype, key, descriptor)
      this.observedAttributes.push(dashCase(key))
    })

    customElements.define(name || this.is, this)
  }

  requestUpdate() {
    if (!this[connected]) return
    this.flushState()
  }

  flushState() {
    const result = this.render(this[state])
    if (result) render(result, this)
  }

  insertStyles() {
    let styles = this.constructor.styles
    if (styles) {
      if (!Array.isArray(styles)) styles = [styles]
      styles.forEach((s) => {
        const style = document.createElement('style')
        style.textContent = s
        this.shadowRoot.appendChild(style)
      })
    }
  }

  connectedCallback() {
    this[connected] = true
    this.attached()
    this.flushState()
    this.insertStyles()
    this.ready()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.constructor.observedAttributes.includes(name)) {
      this[camelCase(name)] = newVal
    }
  }

  get $() {
    if (!this[dollar]) {
      const wkey = {}
      const wmap = new WeakMap([[wkey, this]])
      this[dollar] = new Proxy(wmap, {
        get(target, key) {
          return target.get(wkey).shadowRoot.getElementById(key)
        }
      })
    }
    return this[dollar]
  }

  attached() { }

  ready() { }

  render() { }
}


const track = Symbol('track')

class SiTrackState {

  bind(target) {
    this._target = target
    this._trackMoveHandler = this._trackUpdate.bind(this)
    this._trackStopHandler = this._onMouseUp.bind(this)
    target.addEventListener('mousedown', this._onMouseDown.bind(this))
  }

  notify(ev) {
    this._target.dispatchEvent(ev)
  }

  _onMouseDown(ev) {
    this._trackStart(ev)
    ev.preventDefault()
  }

  _onMouseUp(ev) {
    this._trackEnd(ev)
  }

  _trackStart(ev) {
    if (this._isTracking) return
    this._isTracking = true
    this._X = ev.x
    this._Y = ev.y
    document.addEventListener('mousemove', this._trackMoveHandler)
    document.addEventListener('mouseup', this._trackStopHandler)
    this.notify(
      new CustomEvent('track', {
        detail: {
          x: ev.x,
          y: ev.y,
          dx: 0,
          dy: 0,
          state: 'start'
        }
      })
    )
  }

  _trackEnd(ev) {
    if (!this._isTracking) return
    this._isTracking = false
    document.removeEventListener('mousemove', this._trackMoveHandler)
    document.removeEventListener('mouseup', this._trackStopHandler)
    this.notify(
      new CustomEvent('track', {
        detail: {
          x: ev.x,
          y: ev.y,
          dx: ev.x - this._X,
          dy: ev.y - this._Y,
          state: 'end'
        }
      })
    )
  }

  _trackUpdate(ev) {
    this.notify(
      new CustomEvent('track', {
        detail: {
          x: ev.x,
          y: ev.y,
          dx: ev.x - this._X,
          dy: ev.y - this._Y,
          state: 'track'
        }
      })
    )
  }
}

class SiTrackableElement extends SiElement {
  constructor() {
    super()
    this[track] = new SiTrackState()
  }

  ready() {
    super.ready()
    this[track].bind(this)
  }
}

function defineGetter(prototype, key, property) {
  if (typeof property.value !== undefined) {
    if (typeof property.value === 'function') {
      return function get() {
        if (this[state][key] === undefined || this[state][key] === null) {
          return property.value.call(this)
        }
        return this[state][key]
      }
    }
    else {
      return function get() {
        if (this[state][key] === undefined || this[state][key] === null) {
          return property.value
        }
        return this[state][key]
      }
    }
  }
  return function get() {
    return this[state][key]
  }
}


function defineSetter(prototype, key, property) {
  if (property.observer) {
    let observer
    if (typeof property.observer === 'string') {
      observer = prototype[property.observer]
      if (typeof observer !== 'function') {
        console.warn(`observer function '${property.observer}' not found`)
        observer = () => {}
      }
    } else if (typeof property.observer === 'function') {
      observer = property.observer
    } else {
      console.warn(`invalid observer type '${typeof property.observer}'`)
      observer = () => {}
    }

    return function set(val) {
      if (property.type === Boolean && val === '') val = true
      if (this[state][key] === val) return
      let old = this[state][key]
      this[state][key] = val
      observer.call(this, val, old)
      this.requestUpdate()
    }
  }

  return function set(val) {
    if (property.type === Boolean && val === '') val = true
    if (this[state][key] === val) return
    this[state][key] = val
    this.requestUpdate()
  }
}


function dashCase(s) {
  return s.replace(/([A-Z])/g, _ => `-${_[0].toLowerCase()}`)
}

function camelCase(s) {
  return s.replace(/-([a-z])/g, _ => _[1].toUpperCase())
}

function css(strings, ...values) {
  return values.reduce((acc, v, idx) => acc + String(v) + strings[idx + 1], strings[0])
}

export { SiElement, SiTrackableElement, render, html, svg, css, state, camelCase, dashCase }
