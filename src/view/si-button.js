import {SiElement, html, css} from '../core/si-element.js'

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

  static get styles() {
    return [shadowStyles, css`
      :host {
        border-radius: var(--corner-radius, 3px);
        background: white;
        transition: all 0.3s ease-in-out;
        text-align: center;
        cursor: pointer;
        height: 32px;
        text-transform: uppercase;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      button {
        width: 100%;
        display: flex;
        align-items: inherit;
        justify-content: inherit;
        gap: inherit;
        background: inherit;
        color: inherit;
        border-radius: inherit;
        font-weight: inherit;
        text-transform: inherit;
        text-align: inherit;
        font-size: inherit;
        height: inherit;
        line-height: inherit;
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
    `]
  }

  render() {
    return html`
      <button><slot></slot></button>
    `
  }
}

SiButton.define()
