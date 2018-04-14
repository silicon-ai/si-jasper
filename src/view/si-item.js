import {SiElement, html} from '../core/si-element.js'

export class SiItem extends SiElement {
  static get is() { return 'si-item' }
  static get properties() {
    return {

    }
  }
  ready() {
    super.ready()
  }
  render() {
    return html`
      <style>
      :host {
        padding: 4px;
        display: block;
        line-height: 28px;
      }
      </style>
      <slot></slot>
    `
  }
}

SiItem.define()
