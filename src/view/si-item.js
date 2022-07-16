import {SiElement, html, css} from '../core/si-element.js'

export class SiItem extends SiElement {
  static get is() { return 'si-item' }
  static get properties() {
    return {
      data: Object,
      selected: Boolean
    }
  }

  constructor() {
    super()
    this.selected = false
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
        color: var(--primary-color, #000);
        background-color: inherit;
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
