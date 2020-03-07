import {SiElement, html, css} from '../core/si-element.js'

export class SiItem extends SiElement {
  static get is() { return 'si-item' }
  static get properties() {
    return {

    }
  }
  ready() {
    super.ready()
  }
  static get styles() {
    return css`
      :host {
        padding: 4px;
        display: block;
        line-height: 28px;
      }
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiItem.define()
