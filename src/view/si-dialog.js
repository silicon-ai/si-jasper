import {SiElement, html, css} from '../core/si-element.js'

import {shadowStyles, layoutStyles} from './si-styles.js'

class SiDialog extends SiElement {
  static get is() { return 'si-dialog' }
  static get properties() {
    return {
      backdrop: Boolean,
      modal: Boolean,
      data: Object
    }
  }

  ready() {
    this.setAttribute('tabindex', '0')
    this.addEventListener('keydown', this._onKeyDown.bind(this))

    let actions = ['cancel', 'accept']
    for (const action of actions) {
      let actionButton = this.querySelector(`[${action}]`)
      if (actionButton) {
        actionButton.addEventListener('click', (ev) => { this.close(action) })
      }
    }
  }

  open(data) {
    this.data = data
    const cX = window.innerWidth / 2
    const cY = window.innerHeight / 2

    this.style.visibility = 'hidden'
    this.style.display = 'block'

    const w = this.offsetWidth
    const h = this.offsetHeight

    this.style.top = `${cY - (h / 2)}px`
    this.style.left = `${cX - (w / 2)}px`

    this.setAttribute('open', '')
    this.style.visibility = 'visible'

    this.focus()
  }

  close(reason) {
    if (this.modal && reason === null) return
    this.style.display = 'none'
    this.dispatchEvent(
      new CustomEvent('confirm', {
        bubbles: true,
        detail: reason
      })
    )
  }

  _onKeyDown(ev) {
    if (ev.key == 'Escape') {
      return this.close(null)
    }
  }

  static get styles() {
    return css`
      :host {
        display: none;
        position: absolute;
        outline: none;
      }

      :host([open]) {
        display: inline-block;
      }

      #backdrop {
        display: none;
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: black;
        opacity: 0.5;
        /*background-color: rgba(0, 0, 0, 0.5);*/
        z-index: 99;
      }

      :host([open][backdrop]) #backdrop {
        display: block;
      }

      #header, #content, #footer {
        padding: 0px;
      }

      #container {
        z-index: 100;
        position: relative;
        height: 100%;
        background: inherit;
        border-radius: inherit;
      }

      ${shadowStyles}
      ${layoutStyles}
    `
  }

  render() {
    return html`
      <div id="backdrop" @mousedown=${(ev) => this.close(null)}></div>

      <div id="container" class="layout vertical shadow-elevation-6">
        <div id="header"><slot name="header"></slot></div>
        <div id="content" class="flex"><slot></slot></div>
        <div id="footer"><slot name="footer"></slot></div>
      </div>
    `
  }
}

SiDialog.define()
