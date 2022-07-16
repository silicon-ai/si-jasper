import {SiElement, html, css} from '../core/si-element.js'

import './si-icon.js'
import './si-icons.js'
import './si-flexbox.js'

class SiRadioButton extends SiElement {
  static get is() { return 'si-radio-button' }

  static get properties() {
    return {
      value: String,
      name: String,
      checked: Boolean,
      readonly: Boolean
    }
  }

  ready() {
    this.addEventListener('click', this._onClick.bind(this))
  }

  _onClick(ev) {
    ev.stopPropagation()
    this.checked = true
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: ev.target.checked }
    }))
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        box-sizing: border-box;
        position: relative;
      }

      si-icon {
        color: var(--primary-checkbox-color, inherit);
      }
    `
  }

  render() {
    console.log('render:', this.name, this.checked)
    return html`
      <si-icon .icon="${this.checked ? "icons:radio-button-checked" : "icons:radio-button-unchecked"}"></si-icon>
      <input
        id="input"
        type="hidden"
        name=${this.name}
        .value=${this.value}
        ?checked=${this.checked}
        ?readonly=${this.readonly}
      />
      <slot flex name="suffix"></slot>
    `
  }
}

SiRadioButton.define()
