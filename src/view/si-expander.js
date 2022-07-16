import {SiElement, html, css} from '../core/si-element.js'

import './si-flexbox.js'

class SiExpander extends SiElement {
  static get is() { return 'si-expander' }
  static get properties() {
    return {
      opened: Boolean
    }
  }

  ready() {
    super.ready()
  }

  _toggle(ev) {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened')
    }
    else {
      this.setAttribute('opened', '')
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        line-height: 24px;
        position: relative;
      }

      #body {
        overflow: hidden;
        height: 0px;
        line-height: 24px;
        width: 100%;
      }

      :host([opened]) #body {
        height: auto;
        width: 100%;
      }
    `
  }

  render() {
    return html`
      <div @click=${this._toggle.bind(this)}><slot name="head"></slot></div>
      <div id="body"><slot></slot></div>
    `
  }
}

SiExpander.define()
