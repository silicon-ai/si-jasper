import {SiElement, html} from '../core/si-element.js'

import {shadowStyles, rgbaToGrayScale} from './si-styles.js'

export class SiButton extends SiElement {
  static get is() { return 'si-button' }
  static get properties() {
    return {
      raised: Boolean,
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
          display: inline-block;
          border-radius: 3px;
          background: white;
          transition: all 0.3s ease-in-out;
          text-align: center;
          position: relative;
          cursor: pointer;
          height: 32px;
        }

        button {
          background: inherit;
          color: inherit;
          border-radius: inherit;
          text-transform: uppercase;
          text-align: center;
          display: inline-block;
          font-size: 13px;
          height: 32px;
          line-height: 32px;
          border: none;
          cursor: pointer;
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

        button:focus {
          outline: none;
        }
      </style>
      <button><slot></slot></button>
    `
  }
}

SiButton.define()
