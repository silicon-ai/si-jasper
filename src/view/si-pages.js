import {SiElement, html} from '../core/si-element.js'

export class SiPages extends SiElement {
  static get is() { return 'si-pages' }

  ready() {
    super.ready()
  }

  set selected(index) {
    if (index === undefined) return
    for (const child of this.children) {
      child.classList.remove('si-page-selected')
    }
    this.children[index].classList.add('si-page-selected')
    this._selected = index
  }

  get selected() {
    return this._selected
  }

  render(props) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        ::slotted(:not(.si-page-selected)) {
          display: none !important;
        }
      </style>
      <slot></slot>
    `
  }
}

SiPages.define()
