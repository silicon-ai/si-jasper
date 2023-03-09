import {SiElement, html, css} from '../core/si-element.js'

const input = Symbol('input')

class SiInput extends SiElement {
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

  constructor() {
    super()
    this.type = "text"
    this.min = ""
    this.max = ""
    this.step = ""
    //this.pattern = null this sucks a bit
    this.placeholder = ""
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

  static get styles() {
    return css`
      :host {
        display: flex;
        transition: border 0.3s ease-in-out;
        flex-direction: row;
        align-items: center;
        height: 40px;
        box-sizing: content-box;
      }

      #input {
        box-sizing: border-box;
        display: block;
        border-radius: inherit;
        border: none;
        outline: none;
        height: inherit;
        font-size: inherit;
        cursor: inherit;
        color: inherit;
        background: inherit;
        flex: 1;
        margin: 0px 8px;
        min-width: 1px;
      }

      ::-webkit-calendar-picker-indicator {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23bbbbbb" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
      }

      :host(:focus-within) {
        outline: none;
      }
    `
  }

  render() {
    return html`
      <slot name="prefix"></slot>
      <input id="input"
        .type=${this.type}
        .value=${this.value || ""}
        min=${this.min}
        max=${this.max}
        step=${this.step}
        ?readonly=${this.readonly}
        autocomplete=${this.autocomplete}
        autocorrect=${this.autocorrect}
        autocapitalize=${this.autocapitalize}
        placeholder=${this.placeholder} />
      <slot name="suffix"></slot>
    `
  }
}

SiInput.define()
