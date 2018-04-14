import {SiElement, html} from '../core/si-element.js'

import './si-icon.js'

import {shadowStyles, rgbaToGrayScale} from '../view/si-styles.js'

export class SiIconButton extends SiElement {
  static get is() { return 'si-icon-button' }
  static get properties() {
    return {
      icon: String,
      inverse: {
        type: Boolean,
        value() {
          return this._computeInverse()
        }
      }
    }
  }

  ready() {
    super.ready()
    if (this.inverse) this.setAttribute('inverse', '')
  }

  _computeInverse() {
    const computedStyle = window.getComputedStyle(this, null)
    let fg = rgbaToGrayScale(computedStyle['color'])
    let bg = rgbaToGrayScale(computedStyle['background-color'])
    return fg > bg
  }

  render() {
    return html`
      ${shadowStyles}
      <style>
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
          color: inherit;
          transition: all 0.3s ease-in-out;
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
      </style>
      <si-icon icon$=${this.icon}></si-icon>
    `
  }
}
SiIconButton.define()
