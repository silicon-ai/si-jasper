import {SiElement, html, css} from '../core/si-element.js'

class SiFlexBox extends SiElement {
  static get is() { return 'si-flexbox' }

  static get styles() {
    return css`
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
    `
  }
}

SiFlexBox.define()


class SiHBox extends SiFlexBox {
  static get is() { return 'si-hbox' }

  static get styles() {
    return css`
      :host {
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
      }
      ${super.styles}
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiHBox.define()


class SiVBox extends SiFlexBox {
  static get is() { return 'si-vbox' }

  static get styles() {
    return css`
      :host {
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      }
      ${super.styles}
    `
  }
  render() {
    return html`
      <slot></slot>
    `
  }
}

SiVBox.define()

export {SiFlexBox, SiVBox, SiHBox}
