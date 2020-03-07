import {SiElement, html, css} from '../core/si-element.js'

class SiPages extends SiElement {
  static get is() { return 'si-pages' }

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

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }

      ::slotted(:not(.si-page-selected)) {
        display: none !important;
      }
    `
  }

  render(props) {
    return html`
      <slot></slot>
    `
  }
}

SiPages.define()
