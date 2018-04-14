import {SiElement, html} from '../core/si-element.js'
import {layoutStyles} from './si-styles.js'

class SiFlexBox extends SiElement {
  static get is() { return 'si-flexbox' }

  render() {
    return html`
      <style>
        :host {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }
        ::slotted([stretch]), [stretch] {
          align-self: stretch;
        }
        ::slotted([flex]), [flex] {
          flex: 1;
        }
        ::slotted([flex-2]), [flex-2] {
          flex: 2;
        }
        ::slotted([flex-3]), [flex-3] {
          flex: 3;
        }
        ::slotted([flex-4]), [flex-4] {
          flex: 4;
        }
        ::slotted([flex-5]), [flex-5] {
          flex: 5;
        }
        ::slotted([flex-6]), [flex-6] {
          flex: 6;
        }
      </style>
    `
  }
}

SiFlexBox.define()


class SiHBox extends SiFlexBox {
  static get is() { return 'si-hbox' }

  render() {
    return html`
      <style>
        :host {
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
        }
      </style>
      ${super.render()}
      <slot></slot>
    `
  }
}

SiHBox.define()


class SiVBox extends SiFlexBox {
  static get is() { return 'si-vbox' }

  render() {
    return html`
      <style>
        :host {
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          flex-direction: column;
        }
      </style>
      ${super.render()}
      <slot></slot>
    `
  }
}

SiVBox.define()

export {SiFlexBox, SiVBox, SiHBox}
