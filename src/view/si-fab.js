import {SiElement, html, css} from '../core/si-element.js'
import {shadowStyles, rgbaToGrayScale} from './si-styles.js'

import './si-icon.js'

class SiFab extends SiElement {
  static get is() { return 'si-fab' }
  static get properties() {
    return {
      icon: String,
      inverse: {
        type: Boolean,
        value() {return this._computeInverse() }
      }
    }
  }

  ready() {
    super.ready()
    if (this.inverse) this.setAttribute('inverse', '')
  }

  _computeInverse() {
    const computedStyle = window.getComputedStyle(this, null)
    const fg = rgbaToGrayScale(computedStyle['color'])
    const bg = rgbaToGrayScale(computedStyle['background-color'])
    return fg > bg
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        position: absolute;
        border-radius: 50%;
        padding: 16px;
        width: 24px;
        height: 24px;
        margin: 8px;
        box-shadow: var(--shadow-elevation-2);
        transition: all 0.3s ease-in-out;
        cursor: pointer;
      }

      :host([inverse]:hover) {
        filter: contrast(80%) brightness(130%);
      }

      :host(:hover) {
        filter: brightness(90%);
      }
      ${shadowStyles}
    `
  }

  render() {
    return html`
      <si-icon .icon="${this.icon}"></si-icon>
    `
  }
}

SiFab.define()
