import {SiElement, html, css} from '../core/si-element.js'

class SiTab extends SiElement {
  static get is() { return 'si-tab' }

  static get styles() {
    return css`
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
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiTab.define()
