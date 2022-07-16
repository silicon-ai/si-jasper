import {SiElement, html, css} from '../core/si-element.js'
import {shadowStyles} from './si-styles.js'

class SiToast extends SiElement {
  static get is() { return 'si-toast' }
  static get properties() {
    return {
      text: String
    }
  }

  open() {
    if (this.hasAttribute('opened')) this.close()
    this.setAttribute('opened','')
  }

  close() {
    if (this._timeout) {
      window.clearTimeout(this._timeout)
      this._timeout = null
    }
    this.removeAttribute('opened')
    window.setTimeout(() => this.text = "", 300)
  }

  flash() {
    if (this._timeout) {
      window.clearTimeout(this._timeout)
      this._timeout = null
    }
    this.open()
    this._timeout = window.setTimeout(() => {
      this.close()
    }, 3000)
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        box-sizing: border-box;
        position: fixed;
        bottom: -100px;
        left: 0px;
        z-index: 9;
        padding: 0px 24px;
        line-height: 64px;
        color: var(--primary-dark-foreground, white);
        background-color: var(--primary-dark-background, #666);
        opacity: 0;
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        margin: 12px;
        text-align: center;
        min-height: 64px;
        min-width: 200px;
        box-shadow: var(--shadow-elevation-2);
      }
      :host([opened]) {
        opacity: 1;
        transform: translateY(-100px);
      }
      ${shadowStyles}
    `
  }

  render() {
    return html`
      ${this.text}
    `
  }
}

SiToast.define()
