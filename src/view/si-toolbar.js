import {SiElement, html} from '../core/si-element.js'

import {layoutStyles} from './si-styles.js'

export class SiToolbar extends SiElement {
  static get is() { return 'si-toolbar' }

  static get properties() {
    return {

    }
  }

  attached() {
    super.attached()
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          height: 55px;
          box-sizing: border-box;
          background-color: var(--primary-dark-background);
          color: var(--primary-dark-foreground);
          padding: 10px;
        }
      </style>

      ${layoutStyles}

      <div class="layout horizontal">
        <slot name="title"></slot>
        <slot></slot>
      </div>
    `
  }
}

SiToolbar.define()
