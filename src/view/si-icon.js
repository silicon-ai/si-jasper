import {SiElement, html, css} from '../core/si-element.js'

import {SiIconSet} from './si-iconset.js'

class SiIcon extends SiElement {
  static get is() { return 'si-icon' }

  static get properties() {
    return {
      icon: String,
      size: {
        type: Number,
        value() {
          return 24
        }
      }
    }
  }

  ready() {
    super.ready()
    this.style.width = this.size + 'px'
    this.style.height = this.size + 'px'
  }

  cloneIcon() {
    let [prefix, icon] = this.icon.split(':')
    const iconSet = SiIconSet.registry[prefix]
    if (!iconSet) {
      throw new Error(`icon set '${prefix}' not loaded`)
    }
    return SiIconSet.registry[prefix].cloneIcon(icon)
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
        position: relative;
        vertical-align: middle;
        fill: currentColor;
        stroke: none;
      }

      svg {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    `
  }

  render() {
    return html`
      ${this.cloneIcon()}
    `
  }
}

SiIcon.define()
