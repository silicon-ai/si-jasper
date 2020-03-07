import {SiElement, html, css} from '../core/si-element.js'

import '../view/si-icon.js'
import '../view/si-icons.js'

class SiCheckbox extends SiElement {
  static get is() { return 'si-checkbox' }

  static get properties() {
    return {
      value: String,
      checked: Boolean
    }
  }

  _onInputChange(ev) {
    console.log('checkbox::_onInputChange', ev.target.checked)
    this.checked = ev.target.checked
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: ev.target.checked }
    }))
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        height: 24px;
        box-sizing: border-box;
        position: relative;
      }

      input {
        opacity: 0;
        position: absolute;
        z-index: 1;
        margin: 0;
        top: 0px;
        left: 0px;
        width: 24px;
        height: 24px;
      }

      si-icon {
        color: var(--check-box-checked-color, #667);
      }
    `
  }

  render() {
    return html`
      <si-icon .icon="${this.checked ? "icons:check-box" : "icons:check-box-outline-blank"}"></si-icon>
      <input .value=${this.value} @change=${this._onInputChange.bind(this)} type="checkbox" ?checked=${this.checked}></input>
      <slot></slot>
    `
  }
}

SiCheckbox.define()
