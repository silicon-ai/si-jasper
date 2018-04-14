import {SiElement, html} from '../core/si-element.js'

export class SiTab extends SiElement {
  static get is() { return 'si-tab' }

  render() {
    return html`
      <style>
        :host {
          display: inline-block;
          padding: 5px;
          text-transform: uppercase;
          font-size: 13px;
          box-sizing: border-box;
          text-align: center;
          cursor: default;
          transition: inherit;
        }

        :host(:focus) {
          outline: none;
        }
      </style>
      <slot></slot>
    `
  }
}

SiTab.define()
