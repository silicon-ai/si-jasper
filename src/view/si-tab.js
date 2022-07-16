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
        cursor: pointer;
        transition: inherit;
        user-select: none;
      }

      :host(:focus) {
        outline: none;
      }
    `
  }

  ready() {
    super.ready()
    this.setAttribute('tabindex', '-1')
    this.setAttribute('role', 'tab')
    this.addEventListener('click', (ev) => {
      this.dispatchEvent(
        new CustomEvent('tab-click', {
          compose: true,
          bubbles: true,
          cancelable: true
        })
      )
    })
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiTab.define()
