import {SiElement, html, css} from '../core/si-element.js'
import { SiAsync } from '../core/si-async.js'

import './si-icon.js'

import {shadowStyles, rgbaToGrayScale} from './si-styles.js'

class SiIconButton extends SiElement {
  static get is() { return 'si-icon-button' }
  static get properties() {
    return {
      icon: String,
      inverse: {
        type: Boolean,
        value() {
          return this._computeInverse()
        }
      },
      size: {
        type: Number,
        value() {
          return 24
        }
      }
    }
  }

  async ready() {
    super.ready()
    await SiAsync.yieldThen
    if (this.inverse) this.setAttribute('inverse', '')
  }

  _computeInverse() {
    const computedStyle = window.getComputedStyle(this, null)
    let fg = rgbaToGrayScale(computedStyle['color'])
    let bg = rgbaToGrayScale(computedStyle['background-color'])
    return fg > bg
  }

  static get styles() {
    return [shadowStyles, css`
      :host {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        height: 32px;
        width: 32px;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        background: inherit;
        color: var(--primary-icon-color, inherit);
        transition-duration: 0.3s;
        transition-timing-function: ease-in-out;
        transition-property: filter;
        cursor: pointer;
      }

      si-icon {
        background: inherit;
        color: inherit;
        width: 24px;
        height: 24px;
      }

      :host([raised]) {
        box-shadow: var(--shadow-elevation-1);
      }

      :host([inverse]:hover) {
        filter: contrast(80%) brightness(130%);
      }

      :host(:hover) {
        filter: brightness(90%);
      }
    `]
  }

  render() {
    return html`
      <si-icon style="width: ${this.size}px; height: ${this.size}px" .icon=${this.icon} .size=${this.size}></si-icon>
    `
  }
}

SiIconButton.define()
