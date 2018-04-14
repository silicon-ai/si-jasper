import {SiElement, html} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

import './si-location.js'

class SiRoutes extends SiElement {
  static get is() { return 'si-routes' }

  static get properties() {
    return {
    }
  }

  async ready() {
    super.ready()

    this.shadowRoot.addEventListener('location-changed', (ev) => {
      this._matchRoutes(ev.detail)
    })

    await SiAsync.afterRender
    this._matchRoutes(window.location.hash.substr(1))
  }

  get routes() {
    return Array.from(this.querySelectorAll('si-route'))
  }

  get location() {
    return this.shadowRoot.querySelector('si-location')
  }

  _matchRoutes(hash) {
    console.log('_matchRoutes', hash)
    for (const route of this.routes) {
      const detail = route.match(hash)
      if (detail) {
        this.dispatchEvent(new CustomEvent("route-changed", {
          bubbles: true,
          detail: detail
        }))
        break
      }
    }
  }

  render() {
    return html`
      <style>
      :host { display: none }
      </style>
      <si-location></si-location>
      <slot></slot>
    `
  }
}

SiRoutes.define()


class SiRoute extends SiElement {
  static get is() { return 'si-route' }

  static get properties() {
    return {
      path: String
    }
  }

  ready() {
    super.ready()
  }

  match(hash) {
    let pathFrags = this.path.split('/')
    let hashFrags = hash.split('/')

    if (pathFrags.length !== hashFrags.length) return

    let detail = {
      path: hash,
      params: { }
    }

    for (let i = 0; i < pathFrags.length; i++) {
      let pathFrag = pathFrags[i]
      let hashFrag = hashFrags[i]
      if (pathFrag[0] == ':') {
        let key = pathFrag.substr(1)
        detail.params[key] = hashFrag
      }
      else if (pathFrag !== hashFrag) {
        return
      }
    }

    return detail
  }

  render() {
    return html``
  }
}

SiRoute.define()

export { SiRoutes, SiRoute }
