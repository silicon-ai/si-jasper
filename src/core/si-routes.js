import {SiElement, html, css} from './si-element.js'
import {SiAsync} from './si-async.js'

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

    await SiAsync.yieldThen
    this._matchRoutes(window.location.hash.substring(1))
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
        route.dispatchEvent(new CustomEvent('route', {
          bubbles: true,
          detail: detail
        }))
        this.dispatchEvent(new CustomEvent("route-changed", {
          bubbles: true,
          detail: detail
        }))
        break
      }
    }
  }

  static get styles() {
    return css`
      :host { display: none }
    `
  }

  render() {
    return html`
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
        let key = pathFrag.substring(1)
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
