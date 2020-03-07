import {SiElement, html, css} from '../core/si-element.js'

import {layoutStyles} from './si-styles.js'

class SiToolbar extends SiElement {
  static get is() { return 'si-toolbar' }

  static get properties() {
    return {

    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 55px;
        box-sizing: border-box;
        background-color: var(--primary-dark-background);
        color: var(--primary-dark-foreground);
        padding: 10px;
      }

      ${layoutStyles}
    `
  }

  render() {
    return html`
      <div class="layout horizontal">
        <slot name="title"></slot>
        <slot></slot>
      </div>
    `
  }
}

SiToolbar.define()
