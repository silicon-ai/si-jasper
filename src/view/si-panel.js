import {SiElement, html} from '../core/si-element.js'

import {SiFlexBox} from './si-flexbox.js'
import {shadowStyles} from './si-styles.js'

export class SiPanel extends SiFlexBox {
  static get is() { return 'si-panel' }

  render() {
    return html`
      <style>
        :host {
          box-sizing: border-box;
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          flex-direction: column;
          border-radius: 3px;
        }

        #header, #content, #footer {
        }

        #header, #footer: {
          display: none;
        }

        #header ::slotted(:not(:empty)) {
          display: static;
          border-bottom: 1px solid #DDE;
          padding: 10px;
        }

        #footer ::slotted(:not(:empty)) {
          display: static;
          border-top: 1px solid #DDE;
          padding: 10px;
        }

        #content {
          position: relative;
          padding: 10px;
        }
      </style>

      <div id="header"><slot name="header"></slot></div>
      <div id="content" flex><slot></slot></div>
      <div id="footer"><slot name="footer"></slot></div>

      ${super.render()}
      ${shadowStyles}
    `
  }
}
SiPanel.define()
