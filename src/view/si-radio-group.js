import {SiElement, html, css} from '../core/si-element.js'

class SiRadioGroup extends SiElement {
  static get is() { return 'si-radio-group' }
  static get properties() {
    return {
      selected: String
    }
  }
  static get styles() {
    return css``
  }

  ready() {
    this.buttons.forEach((btn) => {
      btn.addEventListener("change", this._buttonChangeHandler.bind(this))
    })
    if (this.selected) {
      const selected = this.querySelector(`si-radio-button[name="${this.selected}"]`)
      selected.checked = true
    }
  }

  get buttons() {
    return this.querySelectorAll('si-radio-button')
  }

  _buttonChangeHandler(ev) {
    const target = ev.target
    this.buttons.forEach((btn, i) => {
      if (btn != target) {
        btn.checked = false
      }
      else {
        btn.checked = true
      }
    })
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiRadioGroup.define()