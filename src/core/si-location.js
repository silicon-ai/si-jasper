import {SiElement, html} from '../core/si-element.js'

export class SiLocation extends SiElement {
  static get is() { return "si-location" }

  static properties() {
    return {
      hash: String
    }
  }

  ready() {
    super.ready()
    window.addEventListener('hashchange', this._hashChanged.bind(this))
    this._hashChanged()
  }

  render() {
    return html``
  }

  _hashChanged() {
    this.hash = this._parseHash(window.location.hash)
    this.dispatchEvent(new CustomEvent("location-changed", {
      bubbles: true,
      detail: this.hash
    }))
  }

  _parseHash(hash) {
    return window.decodeURIComponent(hash.substr(1))
  }
}

SiLocation.define()
