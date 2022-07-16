import {SiElement, state, camelCase} from './si-element.js'

const config = {}
self[state] = config

export class SiConfig extends SiElement {
  static get is() { return 'si-config' }
  static get properties() {
    return {}
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'id') return
    config[camelCase(name)] = newVal
  }
}

SiConfig.define()