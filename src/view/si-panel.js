import {html, css} from '../core/si-element.js'

import {SiFlexBox} from './si-flexbox.js'
import {shadowStyles} from './si-styles.js'

class SiPanel extends SiFlexBox {
  static get is() { return 'si-panel' }

  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
        border-radius: 3px;
        align-self: stretch;
      }

      ::slotted(*) {
        padding: 10px;
      }

      #header, #footer: {
        display: none;
      }

      #header ::slotted(:not(:empty)) {
        display: static;
        border-bottom: 1px solid var(--border-color);
        padding: 10px;
        border-radius: 3px 3px 0px 0px;
      }

      #footer ::slotted(:not(:empty)) {
        display: static;
        border-top: 1px solid var(--border-color);
        padding: 10px;
        border-radius: 0px 0px 3px 3px;
      }

      ${super.styles}
      ${shadowStyles}
    `
  }

  render() {
    return html`
      <div id="header"><slot name="header"></slot></div>
      <slot></slot>
      <div id="footer"><slot name="footer"></slot></div>
    `
  }
}
SiPanel.define()
