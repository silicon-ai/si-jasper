import {SiElement, html, css} from '../core/si-element.js'

class SiPages extends SiElement {
  static get is() { return 'si-pages' }

  set selected(index) {
    if (index === undefined) return
    this._selected = index
    for (const child of this.children) {
      child.classList.remove('si-page-selected')
    }
    if (index === -1) return
    this.children[index].classList.add('si-page-selected')
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

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiPages.define()
