import {SiElement, html} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

const input = Symbol('input')

export class SiInput extends SiElement {
  static get is() { return 'si-input' }
  static get properties() {
    return {
      type: String,
      value: String,
      placeholder: String,
      readonly: Boolean,
      min: Number,
      max: Number,
      step: Number,
      pattern: String,
      autocomplete: String,
      autocapitalize: String,
      autocorrect: String
    }
  }

  ready() {
    super.ready()
    const eventTypes = ['input', 'change']
    eventTypes.forEach((eventType) => {
      this[input].addEventListener(eventType, this._updateHandler.bind(this))
    })
  }

  get [input]() {
    return this.shadowRoot.getElementById('input')
  }

  focus() {
    this[input].focus()
  }

  blur() {
    this[input].blur()
  }

  clear() {
    this.value = ""
    this[input].value = ""
  }

  _updateHandler(ev) {
    let value = this[input].value
    if (this.type == "number") value = Number(value)
    this[SiElement.state].value = value
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent(ev.type, {
      bubbles: true,
      detail: value
    }))
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          border-bottom: 1px solid transparent;
          transition: border 0.3s ease-in-out;
          margin: 5px;
        }

        #container {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #CCD;
        }

        #input {
          display: block;
          box-sizing: border-box;
          border: none;
          outline: none;
          width: 100%;
          height: 24px;
          font-size: 14px;
          cursor: inherit;
          color: inherit;
          background: inherit;
        }

        :host(:focus-within), #container:focus-within {
          outline: none;
          border-bottom: 1px solid #667;
        }
      </style>
      <div id="container">
        <slot name="prefix"></slot>
        <input id="input"
          type$=${this.type}
          value=${this.value}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          readonly?=${this.readonly}
          pattern=${this.pattern}
          autocomplete=${this.autocomplete}
          autocorrect=${this.autocorrect}
          autocapitalize=${this.autocapitalize}
          placeholder=${this.placeholder}>
        </input>
        <slot name="suffix"></slot>
      </div>
    `
  }
}

SiInput.define()
